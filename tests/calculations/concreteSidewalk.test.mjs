import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  calculateConcretePhysicalVolume,
  calculateRectangularConcreteBaseVolume,
} from "../../lib/calculations/concreteVolume.ts";

function close(actual, expected, tolerance = 1e-12) {
  assert.ok(
    Math.abs(actual - expected) < tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  );
}

function assertSameNumber(actual, expected, label) {
  if (Number.isNaN(expected)) {
    assert.ok(Number.isNaN(actual), `${label} should remain NaN`);
    return;
  }

  if (!Number.isFinite(expected)) {
    assert.equal(actual, expected, label);
    return;
  }

  close(actual, expected);
}

function legacyConcreteSidewalkResults({
  layout = "Straight run",
  length = 40,
  width = 4,
  sectionCount = 4,
  sectionLength = 10,
  sectionWidth = 4,
  thicknessInches = 4,
  wastePercent = 10,
  concretePricePerYard = 160,
  deliveryFee = 125,
  shortLoadFee = 0,
  baseDepthInches = 4,
  baseTonsPerCubicYard = 1.4,
  basePricePerTon = 45,
  formCostPerLinearFoot = 1.5,
  prepCostPerSqFt = 2,
  laborCostPerSqFt = 6,
  finishCostPerSqFt = 1.25,
}) {
  const actualLength =
    layout === "Straight run" ? length : sectionCount * sectionLength;
  const actualWidth = layout === "Straight run" ? width : sectionWidth;

  const area = actualLength * actualWidth;
  const formLinearFeet = actualLength * 2;

  const concreteCubicFeet = area * (thicknessInches / 12);
  const concreteCubicYards = concreteCubicFeet / 27;
  const concreteCubicYardsWithWaste =
    concreteCubicYards * (1 + wastePercent / 100);

  const concreteMaterialCost =
    concreteCubicYardsWithWaste * concretePricePerYard;

  const baseCubicFeet = area * (baseDepthInches / 12);
  const baseCubicYards = baseCubicFeet / 27;
  const baseTons = baseCubicYards * baseTonsPerCubicYard;
  const baseCost = baseTons * basePricePerTon;

  const formCost = formLinearFeet * formCostPerLinearFoot;
  const prepCost = area * prepCostPerSqFt;
  const laborCost = area * laborCostPerSqFt;
  const finishCost = area * finishCostPerSqFt;

  const totalCost =
    concreteMaterialCost +
    deliveryFee +
    shortLoadFee +
    baseCost +
    formCost +
    prepCost +
    laborCost +
    finishCost;

  const costPerSqFt = area > 0 ? totalCost / area : 0;
  const costPerLinearFoot = actualLength > 0 ? totalCost / actualLength : 0;

  return {
    actualLength,
    actualWidth,
    area,
    formLinearFeet,
    concreteCubicFeet,
    concreteCubicYards,
    concreteCubicYardsWithWaste,
    concreteMaterialCost,
    baseCubicYards,
    baseTons,
    baseCost,
    formCost,
    prepCost,
    laborCost,
    finishCost,
    totalCost,
    costPerSqFt,
    costPerLinearFoot,
  };
}

function canUseCanonicalConcreteSidewalkValue(value) {
  return !Number.isNaN(value) && value >= 0;
}

function refactoredConcreteSidewalkResults(input) {
  const {
    layout = "Straight run",
    length = 40,
    width = 4,
    sectionCount = 4,
    sectionLength = 10,
    sectionWidth = 4,
    thicknessInches = 4,
    wastePercent = 10,
    concretePricePerYard = 160,
    deliveryFee = 125,
    shortLoadFee = 0,
    baseDepthInches = 4,
    baseTonsPerCubicYard = 1.4,
    basePricePerTon = 45,
    formCostPerLinearFoot = 1.5,
    prepCostPerSqFt = 2,
    laborCostPerSqFt = 6,
    finishCostPerSqFt = 1.25,
  } = input;

  const actualLength =
    layout === "Straight run" ? length : sectionCount * sectionLength;
  const actualWidth = layout === "Straight run" ? width : sectionWidth;

  const area = actualLength * actualWidth;
  const formLinearFeet = actualLength * 2;

  const concreteCubicFeet =
    canUseCanonicalConcreteSidewalkValue(actualLength) &&
    canUseCanonicalConcreteSidewalkValue(actualWidth) &&
    canUseCanonicalConcreteSidewalkValue(thicknessInches)
      ? calculateRectangularConcreteBaseVolume({
          length: actualLength,
          width: actualWidth,
          height: thicknessInches / 12,
        })
      : area * (thicknessInches / 12);

  const concretePhysicalVolume =
    canUseCanonicalConcreteSidewalkValue(concreteCubicFeet)
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
    concreteCubicYards * (1 + wastePercent / 100);

  const concreteMaterialCost =
    concreteCubicYardsWithWaste * concretePricePerYard;

  const baseCubicFeet = area * (baseDepthInches / 12);
  const baseCubicYards = baseCubicFeet / 27;
  const baseTons = baseCubicYards * baseTonsPerCubicYard;
  const baseCost = baseTons * basePricePerTon;

  const formCost = formLinearFeet * formCostPerLinearFoot;
  const prepCost = area * prepCostPerSqFt;
  const laborCost = area * laborCostPerSqFt;
  const finishCost = area * finishCostPerSqFt;

  const totalCost =
    concreteMaterialCost +
    deliveryFee +
    shortLoadFee +
    baseCost +
    formCost +
    prepCost +
    laborCost +
    finishCost;

  const costPerSqFt = area > 0 ? totalCost / area : 0;
  const costPerLinearFoot = actualLength > 0 ? totalCost / actualLength : 0;

  return {
    actualLength,
    actualWidth,
    area,
    formLinearFeet,
    concreteCubicFeet,
    concreteCubicYards,
    concreteCubicYardsWithWaste,
    concreteMaterialCost,
    baseCubicYards,
    baseTons,
    baseCost,
    formCost,
    prepCost,
    laborCost,
    finishCost,
    totalCost,
    costPerSqFt,
    costPerLinearFoot,
  };
}

function assertParity(input) {
  const legacy = legacyConcreteSidewalkResults(input);
  const refactored = refactoredConcreteSidewalkResults(input);

  for (const key of Object.keys(legacy)) {
    assertSameNumber(refactored[key], legacy[key], key);
  }

  return refactored;
}

const defaults = {
  layout: "Straight run",
  length: 40,
  width: 4,
  sectionCount: 4,
  sectionLength: 10,
  sectionWidth: 4,
  thicknessInches: 4,
  wastePercent: 10,
  concretePricePerYard: 160,
  deliveryFee: 125,
  shortLoadFee: 0,
  baseDepthInches: 4,
  baseTonsPerCubicYard: 1.4,
  basePricePerTon: 45,
  formCostPerLinearFoot: 1.5,
  prepCostPerSqFt: 2,
  laborCostPerSqFt: 6,
  finishCostPerSqFt: 1.25,
};

test("Concrete Sidewalk default straight-run inputs preserve geometry quantity every cost component total and unit costs", () => {
  const result = assertParity(defaults);

  assert.equal(result.actualLength, 40);
  assert.equal(result.actualWidth, 4);
  assert.equal(result.area, 160);
  assert.equal(result.formLinearFeet, 80);
  close(result.concreteCubicFeet, 53.33333333333333);
  close(result.concreteCubicYards, 1.9753086419753085);
  close(result.concreteCubicYardsWithWaste, 2.1728395061728394);
  close(result.concreteMaterialCost, 347.6543209876543);
  close(result.baseCubicYards, 1.9753086419753085);
  close(result.baseTons, 2.765432098765432);
  close(result.baseCost, 124.44444444444443);
  assert.equal(result.formCost, 120);
  assert.equal(result.prepCost, 320);
  assert.equal(result.laborCost, 960);
  assert.equal(result.finishCost, 200);
  close(result.totalCost, 2197.098765432099);
  close(result.costPerSqFt, 13.731867283950618);
  close(result.costPerLinearFoot, 54.927469135802475);
});

test("Concrete Sidewalk preserves multiple-section layout geometry", () => {
  const result = assertParity({
    ...defaults,
    layout: "Multiple sections",
    sectionCount: 5,
    sectionLength: 5,
    sectionWidth: 4,
  });

  assert.equal(result.actualLength, 25);
  assert.equal(result.actualWidth, 4);
  assert.equal(result.area, 100);
  assert.equal(result.formLinearFeet, 50);
});

test("Concrete Sidewalk preserves Front walk Long walkway and Replacement sections preset values", () => {
  const frontWalk = assertParity({
    ...defaults,
    layout: "Straight run",
    length: 30,
    width: 4,
    thicknessInches: 4,
    baseDepthInches: 4,
  });
  assert.equal(frontWalk.area, 120);

  const longWalkway = assertParity({
    ...defaults,
    layout: "Straight run",
    length: 80,
    width: 4,
    thicknessInches: 4,
    baseDepthInches: 4,
  });
  assert.equal(longWalkway.area, 320);

  const replacementSections = assertParity({
    ...defaults,
    layout: "Multiple sections",
    sectionCount: 5,
    sectionLength: 5,
    sectionWidth: 4,
    thicknessInches: 4,
    baseDepthInches: 4,
  });
  assert.equal(replacementSections.area, 100);
});

test("Concrete Sidewalk preserves waste fractional geometry and zero geometry semantics", () => {
  for (const wastePercent of [0, 10, 17.5]) {
    const result = assertParity({ ...defaults, wastePercent });
    close(
      result.concreteCubicYardsWithWaste,
      result.concreteCubicYards * (1 + wastePercent / 100),
    );
  }

  assertParity({
    ...defaults,
    length: 37.25,
    width: 4.75,
    thicknessInches: 5.5,
    wastePercent: 7.5,
    concretePricePerYard: 187.5,
  });

  for (const key of ["length", "width", "thicknessInches"]) {
    const result = assertParity({ ...defaults, [key]: 0 });
    assert.equal(result.concreteCubicFeet, 0);
  }
});

test("Concrete Sidewalk preserves negative and NaN straight-run geometry instead of canonical clamping", () => {
  for (const [key, value] of [
    ["length", -40],
    ["width", -4],
    ["thicknessInches", -4],
  ]) {
    const result = assertParity({ ...defaults, [key]: value });
    assert.ok(result.concreteCubicFeet < 0);
  }

  for (const key of ["length", "width", "thicknessInches"]) {
    const result = assertParity({ ...defaults, [key]: Number.NaN });
    assert.ok(Number.isNaN(result.concreteCubicFeet));
    assert.ok(Number.isNaN(result.totalCost));
  }
});

test("Concrete Sidewalk preserves negative and NaN multiple-section geometry instead of canonical clamping", () => {
  for (const [key, value] of [
    ["sectionCount", -4],
    ["sectionLength", -10],
    ["sectionWidth", -4],
  ]) {
    const result = assertParity({
      ...defaults,
      layout: "Multiple sections",
      [key]: value,
    });
    assert.ok(result.concreteCubicFeet < 0);
  }

  for (const key of ["sectionCount", "sectionLength", "sectionWidth"]) {
    const result = assertParity({
      ...defaults,
      layout: "Multiple sections",
      [key]: Number.NaN,
    });
    assert.ok(Number.isNaN(result.concreteCubicFeet));
    assert.ok(Number.isNaN(result.totalCost));
  }
});

test("Concrete Sidewalk preserves negative and NaN waste behavior", () => {
  const negativeWaste = assertParity({ ...defaults, wastePercent: -10 });
  close(
    negativeWaste.concreteCubicYardsWithWaste,
    negativeWaste.concreteCubicYards * 0.9,
  );

  const invalidWaste = assertParity({
    ...defaults,
    wastePercent: Number.NaN,
  });
  assert.ok(Number.isNaN(invalidWaste.concreteCubicYardsWithWaste));
  assert.ok(Number.isNaN(invalidWaste.totalCost));
});

test("Concrete Sidewalk preserves all downstream cost inputs", () => {
  assertParity({
    ...defaults,
    concretePricePerYard: 215.75,
    deliveryFee: 175,
    shortLoadFee: 125,
    baseDepthInches: 6.5,
    baseTonsPerCubicYard: 1.55,
    basePricePerTon: 62.25,
    formCostPerLinearFoot: 2.25,
    prepCostPerSqFt: 2.75,
    laborCostPerSqFt: 7.5,
    finishCostPerSqFt: 1.85,
  });

  for (const [key, value] of [
    ["concretePricePerYard", -160],
    ["deliveryFee", -125],
    ["shortLoadFee", -50],
    ["baseDepthInches", -4],
    ["baseTonsPerCubicYard", -1.4],
    ["basePricePerTon", -45],
    ["formCostPerLinearFoot", -1.5],
    ["prepCostPerSqFt", -2],
    ["laborCostPerSqFt", -6],
    ["finishCostPerSqFt", -1.25],
  ]) {
    assertParity({ ...defaults, [key]: value });
  }
});

test("Concrete Sidewalk preserves NaN downstream cost-input behavior", () => {
  for (const key of [
    "concretePricePerYard",
    "deliveryFee",
    "shortLoadFee",
    "baseDepthInches",
    "baseTonsPerCubicYard",
    "basePricePerTon",
    "formCostPerLinearFoot",
    "prepCostPerSqFt",
    "laborCostPerSqFt",
    "finishCostPerSqFt",
  ]) {
    const result = assertParity({ ...defaults, [key]: Number.NaN });
    assert.ok(Number.isNaN(result.totalCost));
  }
});

test("Concrete Sidewalk source reuses canonical physical primitives while keeping layout waste base forms and cost policy local", () => {
  const source = readFileSync(
    new URL(
      "../../app/construction/concrete-sidewalk-calculator/ConcreteSidewalkCalculatorClient.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /calculateRectangularConcreteBaseVolume/);
  assert.match(source, /calculateConcretePhysicalVolume/);
  assert.match(source, /canUseCanonicalConcreteSidewalkValue/);
  assert.doesNotMatch(source, /calculateConcreteOrder/);

  assert.match(
    source,
    /layout === "Straight run" \? length : sectionCount \* sectionLength/,
  );
  assert.match(
    source,
    /layout === "Straight run" \? width : sectionWidth/,
  );
  assert.match(
    source,
    /concreteCubicYards \* \(1 \+ wastePercent \/ 100\)/,
  );
  assert.match(
    source,
    /concreteCubicYardsWithWaste \* concretePricePerYard/,
  );
  assert.match(
    source,
    /const baseCubicFeet = area \* \(baseDepthInches \/ 12\);/,
  );
  assert.match(source, /const baseCubicYards = baseCubicFeet \/ 27;/);
  assert.match(
    source,
    /const formCost = formLinearFeet \* formCostPerLinearFoot;/,
  );
  assert.match(
    source,
    /const costPerSqFt = area > 0 \? totalCost \/ area : 0;/,
  );
  assert.match(
    source,
    /const costPerLinearFoot = actualLength > 0 \? totalCost \/ actualLength : 0;/,
  );

  for (const token of [
    "fromProject",
    "URLSearchParams",
    "setProjectScopeResult",
    "saveProjectSession",
  ]) {
    assert.ok(
      !source.includes(token),
      `unexpected project orchestration in client: ${token}`,
    );
  }
});

test("Concrete Sidewalk source preserves defaults presets formatting labels and Copy Results fields", () => {
  const source = readFileSync(
    new URL(
      "../../app/construction/concrete-sidewalk-calculator/ConcreteSidewalkCalculatorClient.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  for (const exact of [
    'useState<SidewalkLayout>("Straight run");',
    "const [length, setLength] = useState(40);",
    "const [width, setWidth] = useState(4);",
    "const [sectionCount, setSectionCount] = useState(4);",
    "const [sectionLength, setSectionLength] = useState(10);",
    "const [sectionWidth, setSectionWidth] = useState(4);",
    "const [thicknessInches, setThicknessInches] = useState(4);",
    "const [wastePercent, setWastePercent] = useState(10);",
    "const [concretePricePerYard, setConcretePricePerYard] = useState(160);",
    "const [deliveryFee, setDeliveryFee] = useState(125);",
    "const [shortLoadFee, setShortLoadFee] = useState(0);",
    "const [baseDepthInches, setBaseDepthInches] = useState(4);",
    "const [baseTonsPerCubicYard, setBaseTonsPerCubicYard] = useState(1.4);",
    "const [basePricePerTon, setBasePricePerTon] = useState(45);",
    "const [formCostPerLinearFoot, setFormCostPerLinearFoot] = useState(1.5);",
    "const [prepCostPerSqFt, setPrepCostPerSqFt] = useState(2);",
    "const [laborCostPerSqFt, setLaborCostPerSqFt] = useState(6);",
    "const [finishCostPerSqFt, setFinishCostPerSqFt] = useState(1.25);",
    "maximumFractionDigits: digits",
    "minimumFractionDigits: digits",
    "maximumFractionDigits: 0",
  ]) {
    assert.ok(
      source.includes(exact),
      `missing preserved source fragment: ${exact}`,
    );
  }

  for (const presetFragment of [
    'if (type === "Front walk") {\n      setLayout("Straight run");\n      setLength(30);\n      setWidth(4);\n      setThicknessInches(4);\n      setBaseDepthInches(4);',
    'if (type === "Long walkway") {\n      setLayout("Straight run");\n      setLength(80);\n      setWidth(4);\n      setThicknessInches(4);\n      setBaseDepthInches(4);',
    'if (type === "Replacement sections") {\n      setLayout("Multiple sections");\n      setSectionCount(5);\n      setSectionLength(5);\n      setSectionWidth(4);\n      setThicknessInches(4);\n      setBaseDepthInches(4);',
  ]) {
    assert.ok(
      source.includes(presetFragment),
      `missing preserved preset values: ${presetFragment.split("\n")[0]}`,
    );
  }

  for (const field of [
    "Layout:",
    "Estimated length:",
    "Width:",
    "Area:",
    "Thickness:",
    "Concrete yards with waste:",
    "Concrete material cost:",
    "Base depth:",
    "Base tons:",
    "Base cost:",
    "Form boards:",
    "Form cost:",
    "Prep cost:",
    "Labor cost:",
    "Finish cost:",
    "Delivery:",
    "Short-load fee:",
    "Estimated total:",
    "Cost per square foot:",
    "Cost per linear foot:",
    "Sidewalk length",
    "Sidewalk width",
    "Sidewalk area",
    "Form boards",
    "Concrete cubic yards",
    "Concrete yards with waste",
    "Concrete material",
    "Base cubic yards",
    "Base tons",
    "Base material",
    "Forms",
    "Prep",
    "Labor",
    "Finish",
    "Delivery + fees",
    "Cost per sq ft",
  ]) {
    assert.ok(
      source.includes(field),
      `missing preserved field or label: ${field}`,
    );
  }
});
