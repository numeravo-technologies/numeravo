import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import ts from "typescript";

function loadConcreteVolumeModule() {
  const sourcePath = new URL(
    "../../lib/calculations/concreteVolume.ts",
    import.meta.url,
  );
  const source = fs.readFileSync(sourcePath, "utf8");

  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;

  const encoded = Buffer.from(transpiled).toString("base64");
  return import(`data:text/javascript;base64,${encoded}`);
}

const {
  calculateCircularConcreteBaseVolume,
  calculateConcretePhysicalVolume,
  calculateLShapedConcreteBaseVolume,
  calculateRectangularConcreteBaseVolume,
} = await loadConcreteVolumeModule();

function close(actual, expected, tolerance = 1e-10) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  );
}

function assertSameNumber(actual, expected) {
  if (Number.isNaN(expected)) {
    assert.ok(Number.isNaN(actual), `expected NaN but received ${actual}`);
    return;
  }

  close(actual, expected);
}

function legacyConcretePatioResults(input) {
  let area = 0;
  let perimeter = 0;

  if (input.shape === "Rectangle") {
    area = input.length * input.width;
    perimeter = 2 * (input.length + input.width);
  }

  if (input.shape === "Circle") {
    const radius = input.circleDiameter / 2;
    area = Math.PI * radius * radius;
    perimeter = Math.PI * input.circleDiameter;
  }

  if (input.shape === "L-shape") {
    area =
      input.sectionALength * input.sectionAWidth +
      input.sectionBLength * input.sectionBWidth;

    perimeter =
      2 * (input.sectionALength + input.sectionAWidth) +
      2 * (input.sectionBLength + input.sectionBWidth);
  }

  const concreteCubicFeet = area * (input.thicknessInches / 12);
  const concreteCubicYards = concreteCubicFeet / 27;
  const concreteCubicYardsWithWaste =
    concreteCubicYards * (1 + input.wastePercent / 100);

  const concreteMaterialCost =
    concreteCubicYardsWithWaste * input.concretePricePerYard;

  const baseCubicFeet = area * (input.baseDepthInches / 12);
  const baseCubicYards = baseCubicFeet / 27;
  const baseTons = baseCubicYards * input.baseTonsPerCubicYard;
  const baseCost = baseTons * input.basePricePerTon;

  const reinforcementCost = area * input.reinforcementCostPerSqFt;
  const prepCost = area * input.prepCostPerSqFt;
  const laborCost = area * input.laborCostPerSqFt;
  const finishCost = area * input.finishCostPerSqFt;

  const totalCost =
    concreteMaterialCost +
    input.deliveryFee +
    input.shortLoadFee +
    baseCost +
    reinforcementCost +
    prepCost +
    laborCost +
    finishCost;

  const costPerSqFt = area > 0 ? totalCost / area : 0;

  return {
    area,
    perimeter,
    concreteCubicFeet,
    concreteCubicYards,
    concreteCubicYardsWithWaste,
    concreteMaterialCost,
    baseCubicYards,
    baseTons,
    baseCost,
    reinforcementCost,
    prepCost,
    laborCost,
    finishCost,
    totalCost,
    costPerSqFt,
  };
}

function canUseCanonicalConcretePatioValue(value) {
  return !Number.isNaN(value) && value >= 0;
}

function refactoredConcretePatioResults(input) {
  let area = 0;
  let perimeter = 0;

  if (input.shape === "Rectangle") {
    area = input.length * input.width;
    perimeter = 2 * (input.length + input.width);
  }

  if (input.shape === "Circle") {
    const radius = input.circleDiameter / 2;
    area = Math.PI * radius * radius;
    perimeter = Math.PI * input.circleDiameter;
  }

  if (input.shape === "L-shape") {
    area =
      input.sectionALength * input.sectionAWidth +
      input.sectionBLength * input.sectionBWidth;

    perimeter =
      2 * (input.sectionALength + input.sectionAWidth) +
      2 * (input.sectionBLength + input.sectionBWidth);
  }

  let concreteCubicFeet;

  if (
    input.shape === "Rectangle" &&
    canUseCanonicalConcretePatioValue(input.length) &&
    canUseCanonicalConcretePatioValue(input.width) &&
    canUseCanonicalConcretePatioValue(input.thicknessInches)
  ) {
    concreteCubicFeet = calculateRectangularConcreteBaseVolume({
      length: input.length,
      width: input.width,
      height: input.thicknessInches / 12,
    });
  } else if (
    input.shape === "Circle" &&
    canUseCanonicalConcretePatioValue(input.circleDiameter) &&
    canUseCanonicalConcretePatioValue(input.thicknessInches)
  ) {
    concreteCubicFeet = calculateCircularConcreteBaseVolume({
      diameter: input.circleDiameter,
      height: input.thicknessInches / 12,
    });
  } else if (
    input.shape === "L-shape" &&
    canUseCanonicalConcretePatioValue(input.sectionALength) &&
    canUseCanonicalConcretePatioValue(input.sectionAWidth) &&
    canUseCanonicalConcretePatioValue(input.sectionBLength) &&
    canUseCanonicalConcretePatioValue(input.sectionBWidth) &&
    canUseCanonicalConcretePatioValue(input.thicknessInches)
  ) {
    concreteCubicFeet = calculateLShapedConcreteBaseVolume({
      lengthOne: input.sectionALength,
      widthOne: input.sectionAWidth,
      lengthTwo: input.sectionBLength,
      widthTwo: input.sectionBWidth,
      height: input.thicknessInches / 12,
    });
  } else {
    concreteCubicFeet = area * (input.thicknessInches / 12);
  }

  const concretePhysicalVolume =
    canUseCanonicalConcretePatioValue(concreteCubicFeet)
      ? calculateConcretePhysicalVolume({
          baseVolume: concreteCubicFeet,
          unitSystem: "imperial",
          wastePercent: 0,
        })
      : null;

  const concreteCubicYards = concretePhysicalVolume
    ? concretePhysicalVolume.baseCubicYards
    : concreteCubicFeet / 27;

  const concreteCubicYardsWithWaste =
    concreteCubicYards * (1 + input.wastePercent / 100);

  const concreteMaterialCost =
    concreteCubicYardsWithWaste * input.concretePricePerYard;

  const baseCubicFeet = area * (input.baseDepthInches / 12);
  const baseCubicYards = baseCubicFeet / 27;
  const baseTons = baseCubicYards * input.baseTonsPerCubicYard;
  const baseCost = baseTons * input.basePricePerTon;

  const reinforcementCost = area * input.reinforcementCostPerSqFt;
  const prepCost = area * input.prepCostPerSqFt;
  const laborCost = area * input.laborCostPerSqFt;
  const finishCost = area * input.finishCostPerSqFt;

  const totalCost =
    concreteMaterialCost +
    input.deliveryFee +
    input.shortLoadFee +
    baseCost +
    reinforcementCost +
    prepCost +
    laborCost +
    finishCost;

  const costPerSqFt = area > 0 ? totalCost / area : 0;

  return {
    area,
    perimeter,
    concreteCubicFeet,
    concreteCubicYards,
    concreteCubicYardsWithWaste,
    concreteMaterialCost,
    baseCubicYards,
    baseTons,
    baseCost,
    reinforcementCost,
    prepCost,
    laborCost,
    finishCost,
    totalCost,
    costPerSqFt,
  };
}

const defaults = {
  shape: "Rectangle",
  length: 20,
  width: 15,
  circleDiameter: 16,
  sectionALength: 20,
  sectionAWidth: 12,
  sectionBLength: 10,
  sectionBWidth: 8,
  thicknessInches: 4,
  wastePercent: 10,
  concretePricePerYard: 160,
  deliveryFee: 125,
  shortLoadFee: 0,
  baseDepthInches: 4,
  baseTonsPerCubicYard: 1.4,
  basePricePerTon: 45,
  reinforcementCostPerSqFt: 0.85,
  prepCostPerSqFt: 2.25,
  laborCostPerSqFt: 6,
  finishCostPerSqFt: 1.25,
};

function assertParity(input) {
  const legacy = legacyConcretePatioResults(input);
  const refactored = refactoredConcretePatioResults(input);

  for (const key of Object.keys(legacy)) {
    assertSameNumber(refactored[key], legacy[key]);
  }
}

test("Concrete Patio default rectangle preserves geometry quantity every cost component total and unit cost", () => {
  const result = legacyConcretePatioResults(defaults);

  close(result.area, 300);
  close(result.perimeter, 70);
  close(result.concreteCubicFeet, 100);
  close(result.concreteCubicYards, 100 / 27);
  close(result.concreteCubicYardsWithWaste, (100 / 27) * 1.1);

  assertParity(defaults);
});

test("Concrete Patio preserves circle geometry and physical volume", () => {
  assertParity({
    ...defaults,
    shape: "Circle",
  });
});

test("Concrete Patio preserves L-shape geometry and existing perimeter semantics", () => {
  const input = {
    ...defaults,
    shape: "L-shape",
  };

  const result = legacyConcretePatioResults(input);

  close(result.area, 320);
  close(result.perimeter, 100);

  assertParity(input);
});

test("Concrete Patio preserves fractional and zero geometry", () => {
  assertParity({
    ...defaults,
    length: 12.75,
    width: 9.25,
    thicknessInches: 5.5,
    wastePercent: 7.25,
  });

  assertParity({
    ...defaults,
    length: 0,
    width: 0,
    thicknessInches: 0,
  });

  assertParity({
    ...defaults,
    shape: "Circle",
    circleDiameter: 0,
  });

  assertParity({
    ...defaults,
    shape: "L-shape",
    sectionALength: 0,
    sectionAWidth: 0,
    sectionBLength: 0,
    sectionBWidth: 0,
  });
});

test("Concrete Patio preserves negative and NaN rectangle geometry instead of canonical clamping", () => {
  assertParity({
    ...defaults,
    length: -20,
  });

  assertParity({
    ...defaults,
    width: Number.NaN,
  });

  assertParity({
    ...defaults,
    thicknessInches: -4,
  });

  assertParity({
    ...defaults,
    thicknessInches: Number.NaN,
  });
});

test("Concrete Patio preserves negative and NaN circle geometry instead of canonical clamping", () => {
  assertParity({
    ...defaults,
    shape: "Circle",
    circleDiameter: -16,
  });

  assertParity({
    ...defaults,
    shape: "Circle",
    circleDiameter: Number.NaN,
  });

  assertParity({
    ...defaults,
    shape: "Circle",
    thicknessInches: Number.NaN,
  });
});

test("Concrete Patio preserves negative and NaN L-shape geometry instead of canonical clamping", () => {
  assertParity({
    ...defaults,
    shape: "L-shape",
    sectionALength: -20,
  });

  assertParity({
    ...defaults,
    shape: "L-shape",
    sectionBWidth: Number.NaN,
  });

  assertParity({
    ...defaults,
    shape: "L-shape",
    thicknessInches: -4,
  });
});

test("Concrete Patio preserves negative and NaN waste behavior", () => {
  assertParity({
    ...defaults,
    wastePercent: -10,
  });

  assertParity({
    ...defaults,
    wastePercent: Number.NaN,
  });
});

test("Concrete Patio preserves downstream cost and finish inputs", () => {
  assertParity({
    ...defaults,
    concretePricePerYard: -160,
    deliveryFee: -125,
    shortLoadFee: -75,
    baseDepthInches: -4,
    baseTonsPerCubicYard: -1.4,
    basePricePerTon: -45,
    reinforcementCostPerSqFt: -0.85,
    prepCostPerSqFt: -2.25,
    laborCostPerSqFt: -6,
    finishCostPerSqFt: -8,
  });

  assertParity({
    ...defaults,
    finishCostPerSqFt: 1.75,
  });

  assertParity({
    ...defaults,
    finishCostPerSqFt: 8,
  });

  assertParity({
    ...defaults,
    finishCostPerSqFt: 5,
  });
});

test("Concrete Patio preserves NaN downstream cost-input behavior", () => {
  for (const key of [
    "concretePricePerYard",
    "deliveryFee",
    "shortLoadFee",
    "baseDepthInches",
    "baseTonsPerCubicYard",
    "basePricePerTon",
    "reinforcementCostPerSqFt",
    "prepCostPerSqFt",
    "laborCostPerSqFt",
    "finishCostPerSqFt",
  ]) {
    assertParity({
      ...defaults,
      [key]: Number.NaN,
    });
  }
});

test("Concrete Patio source reuses all shape-specific canonical physical primitives while keeping shape perimeter waste base and cost policy local", () => {
  const source = fs.readFileSync(
    new URL(
      "../../app/construction/concrete-patio-calculator/ConcretePatioCalculatorClient.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /calculateRectangularConcreteBaseVolume/);
  assert.match(source, /calculateCircularConcreteBaseVolume/);
  assert.match(source, /calculateLShapedConcreteBaseVolume/);
  assert.match(source, /calculateConcretePhysicalVolume/);

  assert.doesNotMatch(source, /calculateConcreteOrder/);

  assert.match(source, /area = length \* width/);
  assert.match(source, /area = Math\.PI \* radius \* radius/);
  assert.match(
    source,
    /area = sectionALength \* sectionAWidth \+ sectionBLength \* sectionBWidth/,
  );

  assert.match(source, /perimeter = 2 \* \(length \+ width\)/);
  assert.match(source, /perimeter = Math\.PI \* circleDiameter/);

  assert.match(
    source,
    /concreteCubicYards \* \(1 \+ wastePercent \/ 100\)/,
  );

  assert.match(source, /const baseCubicFeet = area \* \(baseDepthInches \/ 12\)/);
  assert.match(source, /const reinforcementCost = area \* reinforcementCostPerSqFt/);
  assert.match(source, /const prepCost = area \* prepCostPerSqFt/);
  assert.match(source, /const laborCost = area \* laborCostPerSqFt/);
  assert.match(source, /const finishCost = area \* finishCostPerSqFt/);
});

test("Concrete Patio source preserves defaults finish presets formatting labels and Copy Results fields", () => {
  const source = fs.readFileSync(
    new URL(
      "../../app/construction/concrete-patio-calculator/ConcretePatioCalculatorClient.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  for (const fragment of [
    'useState<PatioShape>("Rectangle")',
    "useState(20)",
    "useState(15)",
    "useState(16)",
    "useState(10)",
    "useState(4)",
    "useState(160)",
    "useState(125)",
    "useState(1.4)",
    "useState(45)",
    "useState(0.85)",
    "useState(2.25)",
    "useState(6)",
    'useState<FinishType>("Broom finish")',
    "if (nextFinish === \"Broom finish\") setFinishCostPerSqFt(1.25)",
    "if (nextFinish === \"Smooth finish\") setFinishCostPerSqFt(1.75)",
    "if (nextFinish === \"Stamped concrete\") setFinishCostPerSqFt(8)",
    "if (nextFinish === \"Stained concrete\") setFinishCostPerSqFt(5)",
    "Concrete Patio Estimate",
    "Shape: ${shape}",
    "Area: ${formatNumber(results.area)} sq ft",
    "Perimeter/forms: ${formatNumber(results.perimeter)} linear ft",
    "Concrete yards with waste: ${formatNumber(results.concreteCubicYardsWithWaste)} yd³",
    "Estimated total: ${formatCurrency(results.totalCost)}",
    "Cost per square foot: ${formatCurrency(results.costPerSqFt)}",
    'label="Patio length"',
    'label="Patio width"',
    'label="Patio diameter"',
    'label="Concrete thickness"',
    'label="Waste / overage"',
    'label="Reinforcement allowance"',
    'label="Finish cost"',
    'label="Patio area"',
    'label="Perimeter / forms"',
    'label="Concrete cubic yards"',
    'label="Concrete yards with waste"',
    'label="Base cubic yards"',
    'label="Base tons"',
    'label="Delivery + fees"',
  ]) {
    assert.ok(source.includes(fragment), `missing preserved source fragment: ${fragment}`);
  }
});
