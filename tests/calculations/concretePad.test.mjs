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

function legacyConcretePadResults({
  length = 10,
  width = 10,
  thicknessInches = 4,
  wastePercent = 10,
  concretePricePerYard = 160,
  deliveryFee = 100,
  shortLoadFee = 0,
  baseDepthInches = 4,
  baseTonsPerCubicYard = 1.4,
  basePricePerTon = 45,
  formCostPerLinearFoot = 1.5,
  reinforcementCostPerSqFt = 0.85,
  prepCostPerSqFt = 2,
  laborCostPerSqFt = 6,
  finishCostPerSqFt = 1.25,
}) {
  const area = length * width;
  const perimeter = 2 * (length + width);

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

  const formCost = perimeter * formCostPerLinearFoot;
  const reinforcementCost = area * reinforcementCostPerSqFt;
  const prepCost = area * prepCostPerSqFt;
  const laborCost = area * laborCostPerSqFt;
  const finishCost = area * finishCostPerSqFt;

  const totalCost =
    concreteMaterialCost +
    deliveryFee +
    shortLoadFee +
    baseCost +
    formCost +
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
    formCost,
    reinforcementCost,
    prepCost,
    laborCost,
    finishCost,
    totalCost,
    costPerSqFt,
  };
}

function canUseCanonicalConcretePadValue(value) {
  return !Number.isNaN(value) && value >= 0;
}

function refactoredConcretePadResults(input) {
  const {
    length = 10,
    width = 10,
    thicknessInches = 4,
    wastePercent = 10,
    concretePricePerYard = 160,
    deliveryFee = 100,
    shortLoadFee = 0,
    baseDepthInches = 4,
    baseTonsPerCubicYard = 1.4,
    basePricePerTon = 45,
    formCostPerLinearFoot = 1.5,
    reinforcementCostPerSqFt = 0.85,
    prepCostPerSqFt = 2,
    laborCostPerSqFt = 6,
    finishCostPerSqFt = 1.25,
  } = input;

  const area = length * width;
  const perimeter = 2 * (length + width);

  const concreteCubicFeet =
    canUseCanonicalConcretePadValue(length) &&
    canUseCanonicalConcretePadValue(width) &&
    canUseCanonicalConcretePadValue(thicknessInches)
      ? calculateRectangularConcreteBaseVolume({
          length,
          width,
          height: thicknessInches / 12,
        })
      : area * (thicknessInches / 12);

  const concretePhysicalVolume = canUseCanonicalConcretePadValue(
    concreteCubicFeet,
  )
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

  const formCost = perimeter * formCostPerLinearFoot;
  const reinforcementCost = area * reinforcementCostPerSqFt;
  const prepCost = area * prepCostPerSqFt;
  const laborCost = area * laborCostPerSqFt;
  const finishCost = area * finishCostPerSqFt;

  const totalCost =
    concreteMaterialCost +
    deliveryFee +
    shortLoadFee +
    baseCost +
    formCost +
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
    formCost,
    reinforcementCost,
    prepCost,
    laborCost,
    finishCost,
    totalCost,
    costPerSqFt,
  };
}

function assertParity(input) {
  const legacy = legacyConcretePadResults(input);
  const refactored = refactoredConcretePadResults(input);

  for (const key of Object.keys(legacy)) {
    assertSameNumber(refactored[key], legacy[key], key);
  }

  return refactored;
}

const defaults = {
  length: 10,
  width: 10,
  thicknessInches: 4,
  wastePercent: 10,
  concretePricePerYard: 160,
  deliveryFee: 100,
  shortLoadFee: 0,
  baseDepthInches: 4,
  baseTonsPerCubicYard: 1.4,
  basePricePerTon: 45,
  formCostPerLinearFoot: 1.5,
  reinforcementCostPerSqFt: 0.85,
  prepCostPerSqFt: 2,
  laborCostPerSqFt: 6,
  finishCostPerSqFt: 1.25,
};

test("Concrete Pad default inputs preserve area concrete quantity every cost component total and cost per square foot", () => {
  const result = assertParity(defaults);

  assert.equal(result.area, 100);
  assert.equal(result.perimeter, 40);
  close(result.concreteCubicFeet, 33.33333333333333);
  close(result.concreteCubicYards, 1.2345679012345678);
  close(result.concreteCubicYardsWithWaste, 1.3580246913580247);
  close(result.concreteMaterialCost, 217.28395061728395);
  close(result.baseCubicYards, 1.2345679012345678);
  close(result.baseTons, 1.728395061728395);
  close(result.baseCost, 77.77777777777777);
  assert.equal(result.formCost, 60);
  assert.equal(result.reinforcementCost, 85);
  assert.equal(result.prepCost, 200);
  assert.equal(result.laborCost, 600);
  assert.equal(result.finishCost, 125);
  close(result.totalCost, 1465.0617283950617);
  close(result.costPerSqFt, 14.650617283950616);
});

test("Concrete Pad preserves zero default and representative non-default waste semantics", () => {
  for (const wastePercent of [0, 10, 17.5]) {
    const result = assertParity({ ...defaults, wastePercent });
    close(
      result.concreteCubicYardsWithWaste,
      result.concreteCubicYards * (1 + wastePercent / 100),
    );
  }
});

test("Concrete Pad fractional dimensions and fractional thickness preserve legacy parity", () => {
  const result = assertParity({
    ...defaults,
    length: 13.75,
    width: 9.5,
    thicknessInches: 5.25,
    wastePercent: 7.5,
    concretePricePerYard: 187.5,
  });

  assert.ok(result.concreteCubicFeet > 0);
  assert.ok(result.totalCost > 0);
});

test("Concrete Pad zero length width and thickness preserve legacy behavior", () => {
  const zeroLength = assertParity({ ...defaults, length: 0 });
  assert.equal(zeroLength.area, 0);
  assert.equal(zeroLength.concreteCubicFeet, 0);
  assert.equal(zeroLength.costPerSqFt, 0);
  assert.equal(zeroLength.totalCost, 130);

  const zeroWidth = assertParity({ ...defaults, width: 0 });
  assert.equal(zeroWidth.area, 0);
  assert.equal(zeroWidth.concreteCubicFeet, 0);
  assert.equal(zeroWidth.costPerSqFt, 0);
  assert.equal(zeroWidth.totalCost, 130);

  const zeroThickness = assertParity({ ...defaults, thicknessInches: 0 });
  assert.equal(zeroThickness.concreteCubicFeet, 0);
  assert.equal(zeroThickness.concreteCubicYards, 0);
  assert.equal(zeroThickness.concreteMaterialCost, 0);
});

test("Concrete Pad preserves current negative geometry behavior instead of canonical clamping", () => {
  const negativeLength = assertParity({ ...defaults, length: -10 });
  assert.ok(negativeLength.area < 0);
  assert.ok(negativeLength.concreteCubicFeet < 0);
  assert.equal(negativeLength.costPerSqFt, 0);

  const negativeWidth = assertParity({ ...defaults, width: -10 });
  assert.ok(negativeWidth.concreteCubicFeet < 0);

  const negativeThickness = assertParity({ ...defaults, thicknessInches: -4 });
  assert.ok(negativeThickness.concreteCubicFeet < 0);
});

test("Concrete Pad preserves NaN geometry and negative or NaN waste behavior", () => {
  for (const key of ["length", "width", "thicknessInches"]) {
    const result = assertParity({ ...defaults, [key]: Number.NaN });
    assert.ok(Number.isNaN(result.concreteCubicFeet));
    assert.ok(Number.isNaN(result.totalCost));
  }

  const negativeWaste = assertParity({ ...defaults, wastePercent: -10 });
  close(
    negativeWaste.concreteCubicYardsWithWaste,
    negativeWaste.concreteCubicYards * 0.9,
  );

  const invalidWaste = assertParity({ ...defaults, wastePercent: Number.NaN });
  assert.ok(Number.isNaN(invalidWaste.concreteCubicYardsWithWaste));
  assert.ok(Number.isNaN(invalidWaste.totalCost));
});

test("Concrete Pad preserves concrete price fixed fees and all route-specific downstream cost inputs", () => {
  const result = assertParity({
    ...defaults,
    concretePricePerYard: 215.75,
    deliveryFee: 175,
    shortLoadFee: 125,
    baseDepthInches: 6.5,
    baseTonsPerCubicYard: 1.55,
    basePricePerTon: 62.25,
    formCostPerLinearFoot: 2.25,
    reinforcementCostPerSqFt: 1.35,
    prepCostPerSqFt: 2.75,
    laborCostPerSqFt: 7.5,
    finishCostPerSqFt: 1.85,
  });

  close(
    result.concreteMaterialCost,
    result.concreteCubicYardsWithWaste * 215.75,
  );
  assert.ok(result.totalCost > result.concreteMaterialCost);
});

test("Concrete Pad preserves zero and negative price and downstream cost-input behavior", () => {
  const zeroPrice = assertParity({ ...defaults, concretePricePerYard: 0 });
  assert.equal(zeroPrice.concreteMaterialCost, 0);

  const negativePrice = assertParity({ ...defaults, concretePricePerYard: -160 });
  assert.ok(negativePrice.concreteMaterialCost < 0);

  for (const [key, value] of [
    ["deliveryFee", -100],
    ["shortLoadFee", -50],
    ["baseDepthInches", -4],
    ["baseTonsPerCubicYard", -1.4],
    ["basePricePerTon", -45],
    ["formCostPerLinearFoot", -1.5],
    ["reinforcementCostPerSqFt", -0.85],
    ["prepCostPerSqFt", -2],
    ["laborCostPerSqFt", -6],
    ["finishCostPerSqFt", -1.25],
  ]) {
    assertParity({ ...defaults, [key]: value });
  }
});

test("Concrete Pad source reuses canonical concrete physical primitives while keeping waste base and cost policy local", () => {
  const source = readFileSync(
    new URL(
      "../../app/construction/concrete-pad-calculator/ConcretePadCalculatorClient.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /calculateRectangularConcreteBaseVolume/);
  assert.match(source, /calculateConcretePhysicalVolume/);
  assert.doesNotMatch(source, /calculateConcreteOrder/);
  assert.match(source, /concreteCubicYards \* \(1 \+ wastePercent \/ 100\)/);
  assert.match(source, /concreteCubicYardsWithWaste \* concretePricePerYard/);
  assert.match(source, /const baseCubicFeet = area \* \(baseDepthInches \/ 12\);/);
  assert.match(source, /const baseCubicYards = baseCubicFeet \/ 27;/);
  assert.match(source, /const costPerSqFt = area > 0 \? totalCost \/ area : 0;/);

  for (const token of [
    "fromProject",
    "URLSearchParams",
    "setProjectScopeResult",
    "saveProjectSession",
  ]) {
    assert.ok(!source.includes(token), `unexpected project orchestration in client: ${token}`);
  }
});

test("Concrete Pad source preserves defaults presets formatting visible result labels and Copy Results fields", () => {
  const source = readFileSync(
    new URL(
      "../../app/construction/concrete-pad-calculator/ConcretePadCalculatorClient.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  for (const preset of [
    "General pad",
    "Shed pad",
    "AC pad",
    "Generator pad",
    "Hot tub pad",
    "Equipment pad",
  ]) {
    assert.ok(source.includes(preset), `missing preset: ${preset}`);
  }

  for (const exact of [
    "const [length, setLength] = useState(10);",
    "const [width, setWidth] = useState(10);",
    "const [thicknessInches, setThicknessInches] = useState(4);",
    "const [wastePercent, setWastePercent] = useState(10);",
    "const [concretePricePerYard, setConcretePricePerYard] = useState(160);",
    "const [deliveryFee, setDeliveryFee] = useState(100);",
    "const [shortLoadFee, setShortLoadFee] = useState(0);",
    "const [baseDepthInches, setBaseDepthInches] = useState(4);",
    "const [baseTonsPerCubicYard, setBaseTonsPerCubicYard] = useState(1.4);",
    "const [basePricePerTon, setBasePricePerTon] = useState(45);",
    "const [formCostPerLinearFoot, setFormCostPerLinearFoot] = useState(1.5);",
    "const [reinforcementCostPerSqFt, setReinforcementCostPerSqFt] = useState(0.85);",
    "const [prepCostPerSqFt, setPrepCostPerSqFt] = useState(2);",
    "const [laborCostPerSqFt, setLaborCostPerSqFt] = useState(6);",
    "const [finishCostPerSqFt, setFinishCostPerSqFt] = useState(1.25);",
    "maximumFractionDigits: digits",
    "minimumFractionDigits: digits",
    "maximumFractionDigits: 0",
  ]) {
    assert.ok(source.includes(exact), `missing preserved source fragment: ${exact}`);
  }

  for (const field of [
    "Area:",
    "Perimeter/forms:",
    "Thickness:",
    "Concrete yards with waste:",
    "Concrete material cost:",
    "Base depth:",
    "Base tons:",
    "Base cost:",
    "Form cost:",
    "Reinforcement cost:",
    "Prep cost:",
    "Labor cost:",
    "Finish cost:",
    "Delivery:",
    "Short-load fee:",
    "Estimated total:",
    "Cost per square foot:",
    "Pad area",
    "Perimeter / forms",
    "Concrete cubic yards",
    "Concrete yards with waste",
    "Concrete material",
    "Base cubic yards",
    "Base tons",
    "Base material",
    "Forms",
    "Reinforcement",
    "Prep",
    "Labor",
    "Finish",
    "Delivery + fees",
  ]) {
    assert.ok(source.includes(field), `missing preserved field or label: ${field}`);
  }

  for (const presetFragment of [
    'if (nextUse === "General pad") {\n      setLength(10);\n      setWidth(10);\n      setThicknessInches(4);\n      setBaseDepthInches(4);',
    'if (nextUse === "Shed pad") {\n      setLength(12);\n      setWidth(16);\n      setThicknessInches(4);\n      setBaseDepthInches(4);',
    'if (nextUse === "AC pad") {\n      setLength(4);\n      setWidth(4);\n      setThicknessInches(4);\n      setBaseDepthInches(3);',
    'if (nextUse === "Generator pad") {\n      setLength(5);\n      setWidth(4);\n      setThicknessInches(4);\n      setBaseDepthInches(4);',
    'if (nextUse === "Hot tub pad") {\n      setLength(8);\n      setWidth(8);\n      setThicknessInches(6);\n      setBaseDepthInches(6);',
    'if (nextUse === "Equipment pad") {\n      setLength(8);\n      setWidth(10);\n      setThicknessInches(6);\n      setBaseDepthInches(6);',
  ]) {
    assert.ok(source.includes(presetFragment), `missing preserved preset values: ${presetFragment.split("\n")[0]}`);
  }
});
