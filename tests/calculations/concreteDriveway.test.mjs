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

function legacyConcreteDrivewayResults({
  length = 40,
  width = 16,
  thicknessInches = 5,
  wastePercent = 10,
  concretePricePerYard = 160,
  deliveryFee = 150,
  shortLoadFee = 0,
  baseDepthInches = 4,
  baseTonsPerCubicYard = 1.4,
  basePricePerTon = 45,
  reinforcementType = "Rebar grid",
  reinforcementCostPerSqFt = 1.25,
  laborCostPerSqFt = 7,
  prepCostPerSqFt = 2.5,
  finishCostPerSqFt = 1.5,
}) {
  const area = length * width;
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

  const reinforcementCost =
    reinforcementType === "None" ? 0 : area * reinforcementCostPerSqFt;
  const prepCost = area * prepCostPerSqFt;
  const laborCost = area * laborCostPerSqFt;
  const finishCost = area * finishCostPerSqFt;

  const totalCost =
    concreteMaterialCost +
    deliveryFee +
    shortLoadFee +
    baseCost +
    reinforcementCost +
    prepCost +
    laborCost +
    finishCost;
  const costPerSqFt = area > 0 ? totalCost / area : 0;

  return {
    area,
    concreteCubicFeet,
    concreteCubicYards,
    concreteCubicYardsWithWaste,
    concreteMaterialCost,
    baseCubicFeet,
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

function canUseCanonicalConcreteDrivewayValue(value) {
  return !Number.isNaN(value) && value >= 0;
}

function refactoredConcreteDrivewayResults(input) {
  const {
    length = 40,
    width = 16,
    thicknessInches = 5,
    wastePercent = 10,
    concretePricePerYard = 160,
    deliveryFee = 150,
    shortLoadFee = 0,
    baseDepthInches = 4,
    baseTonsPerCubicYard = 1.4,
    basePricePerTon = 45,
    reinforcementType = "Rebar grid",
    reinforcementCostPerSqFt = 1.25,
    laborCostPerSqFt = 7,
    prepCostPerSqFt = 2.5,
    finishCostPerSqFt = 1.5,
  } = input;

  const area = length * width;
  const concreteCubicFeet =
    canUseCanonicalConcreteDrivewayValue(length) &&
    canUseCanonicalConcreteDrivewayValue(width) &&
    canUseCanonicalConcreteDrivewayValue(thicknessInches)
      ? calculateRectangularConcreteBaseVolume({
          length,
          width,
          height: thicknessInches / 12,
        })
      : area * (thicknessInches / 12);

  const concretePhysicalVolume = canUseCanonicalConcreteDrivewayValue(
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

  const reinforcementCost =
    reinforcementType === "None" ? 0 : area * reinforcementCostPerSqFt;
  const prepCost = area * prepCostPerSqFt;
  const laborCost = area * laborCostPerSqFt;
  const finishCost = area * finishCostPerSqFt;

  const totalCost =
    concreteMaterialCost +
    deliveryFee +
    shortLoadFee +
    baseCost +
    reinforcementCost +
    prepCost +
    laborCost +
    finishCost;
  const costPerSqFt = area > 0 ? totalCost / area : 0;

  return {
    area,
    concreteCubicFeet,
    concreteCubicYards,
    concreteCubicYardsWithWaste,
    concreteMaterialCost,
    baseCubicFeet,
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

function assertParity(input) {
  const legacy = legacyConcreteDrivewayResults(input);
  const refactored = refactoredConcreteDrivewayResults(input);
  for (const key of Object.keys(legacy)) {
    assertSameNumber(refactored[key], legacy[key], key);
  }
  return refactored;
}

const defaults = {
  length: 40,
  width: 16,
  thicknessInches: 5,
  wastePercent: 10,
  concretePricePerYard: 160,
  deliveryFee: 150,
  shortLoadFee: 0,
  baseDepthInches: 4,
  baseTonsPerCubicYard: 1.4,
  basePricePerTon: 45,
  reinforcementType: "Rebar grid",
  reinforcementCostPerSqFt: 1.25,
  laborCostPerSqFt: 7,
  prepCostPerSqFt: 2.5,
  finishCostPerSqFt: 1.5,
};

test("Concrete Driveway default inputs preserve quantity every cost component total and cost per square foot", () => {
  const result = assertParity(defaults);
  assert.equal(result.area, 640);
  close(result.concreteCubicFeet, 266.6666666666667);
  close(result.concreteCubicYards, 9.876543209876544);
  close(result.concreteCubicYardsWithWaste, 10.8641975308642);
  close(result.concreteMaterialCost, 1738.271604938272);
  close(result.baseCubicFeet, 213.33333333333334);
  close(result.baseCubicYards, 7.901234567901235);
  close(result.baseTons, 11.061728395061728);
  close(result.baseCost, 497.77777777777777);
  assert.equal(result.reinforcementCost, 800);
  assert.equal(result.prepCost, 1600);
  assert.equal(result.laborCost, 4480);
  assert.equal(result.finishCost, 960);
  close(result.totalCost, 10226.04938271605);
  close(result.costPerSqFt, 15.978202160493828);
});

test("Concrete Driveway preserves waste fractional geometry and zero geometry semantics", () => {
  for (const wastePercent of [0, 10, 17.5]) {
    const result = assertParity({ ...defaults, wastePercent });
    close(
      result.concreteCubicYardsWithWaste,
      result.concreteCubicYards * (1 + wastePercent / 100),
    );
  }

  assertParity({
    ...defaults,
    length: 57.25,
    width: 13.75,
    thicknessInches: 5.5,
    wastePercent: 7.5,
    concretePricePerYard: 187.5,
  });

  for (const key of ["length", "width", "thicknessInches"]) {
    const result = assertParity({ ...defaults, [key]: 0 });
    assert.equal(result.concreteCubicFeet, 0);
  }
});

test("Concrete Driveway preserves negative and NaN geometry instead of canonical clamping", () => {
  for (const [key, value] of [
    ["length", -40],
    ["width", -16],
    ["thicknessInches", -5],
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

test("Concrete Driveway preserves negative and NaN waste behavior", () => {
  const negativeWaste = assertParity({ ...defaults, wastePercent: -10 });
  close(
    negativeWaste.concreteCubicYardsWithWaste,
    negativeWaste.concreteCubicYards * 0.9,
  );

  const invalidWaste = assertParity({ ...defaults, wastePercent: Number.NaN });
  assert.ok(Number.isNaN(invalidWaste.concreteCubicYardsWithWaste));
  assert.ok(Number.isNaN(invalidWaste.totalCost));
});

test("Concrete Driveway preserves reinforcement selection and downstream cost inputs", () => {
  const none = assertParity({ ...defaults, reinforcementType: "None" });
  assert.equal(none.reinforcementCost, 0);

  for (const reinforcementType of ["Wire mesh", "Rebar grid", "Fiber reinforcement"]) {
    const result = assertParity({ ...defaults, reinforcementType });
    assert.equal(result.reinforcementCost, 800);
  }

  assertParity({
    ...defaults,
    concretePricePerYard: 215.75,
    deliveryFee: 225,
    shortLoadFee: 125,
    baseDepthInches: 6.5,
    baseTonsPerCubicYard: 1.55,
    basePricePerTon: 62.25,
    reinforcementCostPerSqFt: 1.85,
    prepCostPerSqFt: 3.25,
    laborCostPerSqFt: 8.5,
    finishCostPerSqFt: 2.1,
  });

  for (const [key, value] of [
    ["concretePricePerYard", -160],
    ["deliveryFee", -150],
    ["shortLoadFee", -75],
    ["baseDepthInches", -4],
    ["baseTonsPerCubicYard", -1.4],
    ["basePricePerTon", -45],
    ["reinforcementCostPerSqFt", -1.25],
    ["prepCostPerSqFt", -2.5],
    ["laborCostPerSqFt", -7],
    ["finishCostPerSqFt", -1.5],
  ]) {
    assertParity({ ...defaults, [key]: value });
  }
});

test("Concrete Driveway preserves NaN downstream cost-input behavior", () => {
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
    const result = assertParity({ ...defaults, [key]: Number.NaN });
    assert.ok(Number.isNaN(result.totalCost));
  }
});

test("Concrete Driveway source reuses canonical physical primitives while keeping waste base reinforcement and cost policy local", () => {
  const source = readFileSync(
    new URL(
      "../../app/construction/concrete-driveway-calculator/ConcreteDrivewayCalculatorClient.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /calculateRectangularConcreteBaseVolume/);
  assert.match(source, /calculateConcretePhysicalVolume/);
  assert.match(source, /canUseCanonicalConcreteDrivewayValue/);
  assert.doesNotMatch(source, /calculateConcreteOrder/);
  assert.match(source, /concreteCubicYards \* \(1 \+ wastePercent \/ 100\)/);
  assert.match(source, /concreteCubicYardsWithWaste \* concretePricePerYard/);
  assert.match(source, /const baseCubicFeet = area \* \(baseDepthInches \/ 12\);/);
  assert.match(source, /const baseCubicYards = baseCubicFeet \/ 27;/);
  assert.match(source, /reinforcementType === "None" \? 0 : area \* reinforcementCostPerSqFt/);
  assert.match(source, /const costPerSqFt = area > 0 \? totalCost \/ area : 0;/);

  for (const token of ["fromProject", "URLSearchParams", "setProjectScopeResult", "saveProjectSession"]) {
    assert.ok(!source.includes(token), `unexpected project orchestration in client: ${token}`);
  }
});

test("Concrete Driveway source preserves defaults presets reinforcement options formatting labels and Copy Results fields", () => {
  const source = readFileSync(
    new URL(
      "../../app/construction/concrete-driveway-calculator/ConcreteDrivewayCalculatorClient.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  for (const exact of [
    "const [length, setLength] = useState(40);",
    "const [width, setWidth] = useState(16);",
    "const [thicknessInches, setThicknessInches] = useState(5);",
    "const [wastePercent, setWastePercent] = useState(10);",
    "const [concretePricePerYard, setConcretePricePerYard] = useState(160);",
    "const [deliveryFee, setDeliveryFee] = useState(150);",
    "const [shortLoadFee, setShortLoadFee] = useState(0);",
    "const [baseDepthInches, setBaseDepthInches] = useState(4);",
    "const [baseTonsPerCubicYard, setBaseTonsPerCubicYard] = useState(1.4);",
    "const [basePricePerTon, setBasePricePerTon] = useState(45);",
    'useState<ReinforcementType>("Rebar grid");',
    "const [reinforcementCostPerSqFt, setReinforcementCostPerSqFt] = useState(1.25);",
    "const [laborCostPerSqFt, setLaborCostPerSqFt] = useState(7);",
    "const [prepCostPerSqFt, setPrepCostPerSqFt] = useState(2.5);",
    "const [finishCostPerSqFt, setFinishCostPerSqFt] = useState(1.5);",
    "maximumFractionDigits: digits",
    "minimumFractionDigits: digits",
    "maximumFractionDigits: 0",
  ]) {
    assert.ok(source.includes(exact), `missing preserved source fragment: ${exact}`);
  }

  for (const presetFragment of [
    'if (type === "Single car") {\n      setLength(30);\n      setWidth(12);\n      setThicknessInches(4);\n      setBaseDepthInches(4);',
    'if (type === "Two car") {\n      setLength(40);\n      setWidth(20);\n      setThicknessInches(5);\n      setBaseDepthInches(4);',
    'if (type === "Long driveway") {\n      setLength(80);\n      setWidth(12);\n      setThicknessInches(5);\n      setBaseDepthInches(6);',
  ]) {
    assert.ok(source.includes(presetFragment), `missing preserved preset values: ${presetFragment.split("\n")[0]}`);
  }

  for (const field of [
    "None", "Wire mesh", "Rebar grid", "Fiber reinforcement",
    "Length:", "Width:", "Area:", "Thickness:",
    "Concrete yards with waste:", "Concrete material cost:",
    "Base depth:", "Base tons:", "Base cost:",
    "Reinforcement:", "Reinforcement cost:", "Prep cost:",
    "Labor cost:", "Finish cost:", "Delivery:", "Short-load fee:",
    "Estimated total:", "Cost per square foot:",
    "Driveway area", "Concrete cubic yards", "Concrete yards with waste",
    "Concrete material", "Base cubic yards", "Base tons", "Base material",
    "Reinforcement", "Prep", "Labor", "Finish", "Delivery + fees",
  ]) {
    assert.ok(source.includes(field), `missing preserved field or label: ${field}`);
  }
});
