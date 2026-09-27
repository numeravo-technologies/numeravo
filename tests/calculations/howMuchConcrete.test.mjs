import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  calculateCircularConcreteBaseVolume,
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

function legacyHowMuchConcreteResults({
  projectType,
  lengthFeet = 0,
  widthFeet = 0,
  thicknessInches = 0,
  heightFeet = 0,
  diameterInches = 0,
  depthInches = 0,
  knownCubicFeet = 0,
  knownCubicYards = 0,
  wastePercent = 10,
  concretePricePerYard = 160,
  truckCapacityYards = 10,
  bagSize = 80,
}) {
  let cubicFeet = 0;

  if (
    projectType === "Slab / patio / driveway" ||
    projectType === "Footing / trench"
  ) {
    cubicFeet = lengthFeet * widthFeet * (thicknessInches / 12);
  }

  if (projectType === "Wall") {
    cubicFeet = lengthFeet * heightFeet * (thicknessInches / 12);
  }

  if (projectType === "Round pier / post hole") {
    const radiusFeet = diameterInches / 12 / 2;
    const depthFeet = depthInches / 12;
    cubicFeet = Math.PI * radiusFeet * radiusFeet * depthFeet;
  }

  if (projectType === "Known cubic feet") {
    cubicFeet = knownCubicFeet;
  }

  if (projectType === "Known cubic yards") {
    cubicFeet = knownCubicYards * 27;
  }

  const cubicYards = cubicFeet / 27;
  const cubicYardsWithWaste = cubicYards * (1 + wastePercent / 100);
  const materialCost = cubicYardsWithWaste * concretePricePerYard;
  const truckLoads =
    truckCapacityYards > 0 ? cubicYardsWithWaste / truckCapacityYards : 0;

  const fortyPoundBags = Math.ceil(cubicFeet / 0.30);
  const sixtyPoundBags = Math.ceil(cubicFeet / 0.45);
  const eightyPoundBags = Math.ceil(cubicFeet / 0.60);

  const selectedBagYield =
    bagSize === 40 ? 0.30 : bagSize === 60 ? 0.45 : 0.60;
  const selectedBagCount = Math.ceil(
    (cubicFeet * (1 + wastePercent / 100)) / selectedBagYield,
  );

  const estimatedWeight = cubicYardsWithWaste * 4050;

  return {
    cubicFeet,
    cubicYards,
    cubicYardsWithWaste,
    materialCost,
    truckLoads,
    fortyPoundBags,
    sixtyPoundBags,
    eightyPoundBags,
    selectedBagCount,
    estimatedWeight,
  };
}

function canUseCanonicalHowMuchConcreteValue(value) {
  return !Number.isNaN(value) && value >= 0;
}

function refactoredHowMuchConcreteResults({
  projectType,
  lengthFeet = 0,
  widthFeet = 0,
  thicknessInches = 0,
  heightFeet = 0,
  diameterInches = 0,
  depthInches = 0,
  knownCubicFeet = 0,
  knownCubicYards = 0,
  wastePercent = 10,
  concretePricePerYard = 160,
  truckCapacityYards = 10,
  bagSize = 80,
}) {
  let cubicFeet = 0;

  if (
    projectType === "Slab / patio / driveway" ||
    projectType === "Footing / trench"
  ) {
    if (
      canUseCanonicalHowMuchConcreteValue(lengthFeet) &&
      canUseCanonicalHowMuchConcreteValue(widthFeet) &&
      canUseCanonicalHowMuchConcreteValue(thicknessInches)
    ) {
      cubicFeet = calculateRectangularConcreteBaseVolume({
        length: lengthFeet,
        width: widthFeet,
        height: thicknessInches / 12,
      });
    } else {
      cubicFeet = lengthFeet * widthFeet * (thicknessInches / 12);
    }
  }

  if (projectType === "Wall") {
    if (
      canUseCanonicalHowMuchConcreteValue(lengthFeet) &&
      canUseCanonicalHowMuchConcreteValue(heightFeet) &&
      canUseCanonicalHowMuchConcreteValue(thicknessInches)
    ) {
      cubicFeet = calculateRectangularConcreteBaseVolume({
        length: lengthFeet,
        width: heightFeet,
        height: thicknessInches / 12,
      });
    } else {
      cubicFeet = lengthFeet * heightFeet * (thicknessInches / 12);
    }
  }

  if (projectType === "Round pier / post hole") {
    if (
      canUseCanonicalHowMuchConcreteValue(diameterInches) &&
      canUseCanonicalHowMuchConcreteValue(depthInches)
    ) {
      cubicFeet = calculateCircularConcreteBaseVolume({
        diameter: diameterInches / 12,
        height: depthInches / 12,
      });
    } else {
      const radiusFeet = diameterInches / 12 / 2;
      const depthFeet = depthInches / 12;
      cubicFeet = Math.PI * radiusFeet * radiusFeet * depthFeet;
    }
  }

  if (projectType === "Known cubic feet") {
    cubicFeet = knownCubicFeet;
  }

  if (projectType === "Known cubic yards") {
    cubicFeet = knownCubicYards * 27;
  }

  const physicalVolume = canUseCanonicalHowMuchConcreteValue(cubicFeet)
    ? calculateConcretePhysicalVolume({
        baseVolume: cubicFeet,
        unitSystem: "imperial",
        wastePercent: 0,
      })
    : null;

  const cubicYards = physicalVolume
    ? physicalVolume.baseCubicYards
    : cubicFeet / 27;
  const cubicYardsWithWaste = cubicYards * (1 + wastePercent / 100);
  const materialCost = cubicYardsWithWaste * concretePricePerYard;
  const truckLoads =
    truckCapacityYards > 0 ? cubicYardsWithWaste / truckCapacityYards : 0;

  const fortyPoundBags = Math.ceil(cubicFeet / 0.30);
  const sixtyPoundBags = Math.ceil(cubicFeet / 0.45);
  const eightyPoundBags = Math.ceil(cubicFeet / 0.60);

  const selectedBagYield =
    bagSize === 40 ? 0.30 : bagSize === 60 ? 0.45 : 0.60;
  const selectedBagCount = Math.ceil(
    (cubicFeet * (1 + wastePercent / 100)) / selectedBagYield,
  );

  const estimatedWeight = cubicYardsWithWaste * 4050;

  return {
    cubicFeet,
    cubicYards,
    cubicYardsWithWaste,
    materialCost,
    truckLoads,
    fortyPoundBags,
    sixtyPoundBags,
    eightyPoundBags,
    selectedBagCount,
    estimatedWeight,
  };
}

function assertParity(input) {
  const legacy = legacyHowMuchConcreteResults(input);
  const refactored = refactoredHowMuchConcreteResults(input);

  for (const key of Object.keys(legacy)) {
    assertSameNumber(refactored[key], legacy[key], key);
  }

  return refactored;
}

const defaults = {
  projectType: "Slab / patio / driveway",
  lengthFeet: 12,
  widthFeet: 12,
  thicknessInches: 4,
  wastePercent: 10,
  concretePricePerYard: 160,
  truckCapacityYards: 10,
  bagSize: 80,
};

test("How Much Concrete default route values preserve current outputs", () => {
  const result = assertParity(defaults);

  assert.equal(result.cubicFeet, 48);
  close(result.cubicYards, 1.7777777777777777);
  close(result.cubicYardsWithWaste, 1.9555555555555557);
  close(result.materialCost, 312.8888888888889);
  close(result.truckLoads, 0.19555555555555557);
  assert.equal(result.fortyPoundBags, 160);
  assert.equal(result.sixtyPoundBags, 107);
  assert.equal(result.eightyPoundBags, 80);
  assert.equal(result.selectedBagCount, 89);
  close(result.estimatedWeight, 7920.000000000001);
});

test("How Much Concrete preserves slab footing wall and round-pier geometry", () => {
  const cases = [
    {
      projectType: "Slab / patio / driveway",
      lengthFeet: 12,
      widthFeet: 12,
      thicknessInches: 4,
    },
    {
      projectType: "Footing / trench",
      lengthFeet: 40,
      widthFeet: 1.5,
      thicknessInches: 12,
    },
    {
      projectType: "Wall",
      lengthFeet: 20,
      heightFeet: 4,
      thicknessInches: 8,
    },
    {
      projectType: "Round pier / post hole",
      diameterInches: 12,
      depthInches: 36,
    },
  ];

  for (const input of cases) {
    assertParity({
      ...input,
      wastePercent: 10,
      concretePricePerYard: 160,
      truckCapacityYards: 10,
      bagSize: 80,
    });
  }
});

test("How Much Concrete preserves known cubic feet and known cubic yards modes", () => {
  const knownFeet = assertParity({
    projectType: "Known cubic feet",
    knownCubicFeet: 54,
    wastePercent: 10,
    concretePricePerYard: 160,
    truckCapacityYards: 10,
    bagSize: 60,
  });

  assert.equal(knownFeet.cubicFeet, 54);
  assert.equal(knownFeet.cubicYards, 2);
  close(knownFeet.cubicYardsWithWaste, 2.2);

  const knownYards = assertParity({
    projectType: "Known cubic yards",
    knownCubicYards: 2,
    wastePercent: 10,
    concretePricePerYard: 160,
    truckCapacityYards: 10,
    bagSize: 40,
  });

  assert.equal(knownYards.cubicFeet, 54);
  assert.equal(knownYards.cubicYards, 2);
  close(knownYards.cubicYardsWithWaste, 2.2);
});

test("How Much Concrete waste 0 5 and default 10 percent preserve current semantics", () => {
  for (const wastePercent of [0, 5, 10]) {
    const result = assertParity({ ...defaults, wastePercent });
    close(
      result.cubicYardsWithWaste,
      result.cubicYards * (1 + wastePercent / 100),
    );
  }
});

test("How Much Concrete zero fractional dimensions and fractional thickness preserve parity", () => {
  const zero = assertParity({
    ...defaults,
    lengthFeet: 0,
  });
  assert.equal(zero.cubicFeet, 0);
  assert.equal(zero.cubicYardsWithWaste, 0);

  const fractional = assertParity({
    ...defaults,
    lengthFeet: 13.75,
    widthFeet: 9.5,
    thicknessInches: 5.25,
    wastePercent: 7.5,
    concretePricePerYard: 187.5,
    truckCapacityYards: 9.25,
  });

  assert.ok(fractional.cubicFeet > 0);
  assert.ok(fractional.cubicYardsWithWaste > 0);
});

test("How Much Concrete preserves current negative and invalid input behavior", () => {
  const negativeGeometry = assertParity({
    ...defaults,
    lengthFeet: -12,
  });
  assert.ok(negativeGeometry.cubicFeet < 0);
  assert.ok(negativeGeometry.cubicYardsWithWaste < 0);

  const negativeWaste = assertParity({
    ...defaults,
    wastePercent: -10,
  });
  close(negativeWaste.cubicYardsWithWaste, 1.6);

  const invalidGeometry = assertParity({
    ...defaults,
    lengthFeet: Number.NaN,
  });
  assert.ok(Number.isNaN(invalidGeometry.cubicFeet));
  assert.ok(Number.isNaN(invalidGeometry.cubicYardsWithWaste));

  const invalidWaste = assertParity({
    ...defaults,
    wastePercent: Number.NaN,
  });
  assert.ok(Number.isNaN(invalidWaste.cubicYardsWithWaste));
  assert.ok(Number.isNaN(invalidWaste.selectedBagCount));

  const negativeTruckCapacity = assertParity({
    ...defaults,
    truckCapacityYards: -10,
  });
  assert.equal(negativeTruckCapacity.truckLoads, 0);
});

test("How Much Concrete preserves bag yields and selected bag count with waste", () => {
  const result = assertParity(defaults);

  assert.equal(result.fortyPoundBags, Math.ceil(result.cubicFeet / 0.30));
  assert.equal(result.sixtyPoundBags, Math.ceil(result.cubicFeet / 0.45));
  assert.equal(result.eightyPoundBags, Math.ceil(result.cubicFeet / 0.60));

  for (const [bagSize, bagYield] of [
    [40, 0.30],
    [60, 0.45],
    [80, 0.60],
  ]) {
    const selected = assertParity({ ...defaults, bagSize });
    assert.equal(
      selected.selectedBagCount,
      Math.ceil(
        (selected.cubicFeet * (1 + defaults.wastePercent / 100)) / bagYield,
      ),
    );
  }
});

test("How Much Concrete keeps fractional truckloads material cost and weight local", () => {
  const result = assertParity({
    ...defaults,
    concretePricePerYard: 215.75,
    truckCapacityYards: 8.5,
  });

  close(result.truckLoads, result.cubicYardsWithWaste / 8.5);
  assert.notEqual(result.truckLoads, Math.ceil(result.truckLoads));
  close(result.materialCost, result.cubicYardsWithWaste * 215.75);
  close(result.estimatedWeight, result.cubicYardsWithWaste * 4050);
});

test("How Much Concrete source reuses canonical physical primitives without canonical order or project behavior", () => {
  const source = readFileSync(
    new URL(
      "../../app/construction/how-much-concrete-do-i-need/HowMuchConcreteClient.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /calculateRectangularConcreteBaseVolume/);
  assert.match(source, /calculateCircularConcreteBaseVolume/);
  assert.match(source, /calculateConcretePhysicalVolume/);
  assert.doesNotMatch(source, /calculateConcreteOrder/);
  assert.doesNotMatch(source, /fromProject/);
  assert.doesNotMatch(source, /setProjectScopeResult/);
  assert.doesNotMatch(source, /saveProjectSession/);
  assert.match(
    source,
    /const cubicYardsWithWaste = cubicYards \* \(1 \+ wastePercent \/ 100\);/,
  );
  assert.match(
    source,
    /truckCapacityYards > 0 \? cubicYardsWithWaste \/ truckCapacityYards : 0/,
  );
  assert.match(source, /Math\.ceil\(cubicFeet \/ 0\.30\)/);
  assert.match(source, /Math\.ceil\(cubicFeet \/ 0\.45\)/);
  assert.match(source, /Math\.ceil\(cubicFeet \/ 0\.60\)/);
  assert.match(source, /cubicYardsWithWaste \* concretePricePerYard/);
  assert.match(source, /cubicYardsWithWaste \* 4050/);
});

test("How Much Concrete source preserves exact modes defaults selected-bag behavior and visible formatting", () => {
  const source = readFileSync(
    new URL(
      "../../app/construction/how-much-concrete-do-i-need/HowMuchConcreteClient.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  for (const mode of [
    "Slab / patio / driveway",
    "Footing / trench",
    "Wall",
    "Round pier / post hole",
    "Known cubic feet",
    "Known cubic yards",
  ]) {
    assert.ok(source.includes(mode), `missing preserved mode: ${mode}`);
  }

  assert.match(source, /useState\(12\)/);
  assert.match(source, /useState\(4\)/);
  assert.match(source, /useState\(10\)/);
  assert.match(source, /useState\(160\)/);
  assert.match(source, /useState\(80\)/);
  assert.match(source, /bagSize === 40 \? 0\.30 : bagSize === 60 \? 0\.45 : 0\.60/);
  assert.match(source, /maximumFractionDigits: digits/);
  assert.match(source, /minimumFractionDigits: digits/);
  assert.match(source, /maximumFractionDigits: 0/);

  for (const field of [
    "Cubic feet:",
    "Cubic yards before waste:",
    "Waste allowance:",
    "Order amount with waste:",
    "Estimated concrete material cost:",
    "Approx. truckloads:",
    "40 lb bags:",
    "60 lb bags:",
    "80 lb bags:",
    "bag count with waste:",
    "Estimated concrete weight:",
  ]) {
    assert.ok(source.includes(field), `missing preserved Copy Results field: ${field}`);
  }
});
