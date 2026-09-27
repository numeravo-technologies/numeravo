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

function legacyConcreteYardResults({
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
}) {
  let cubicFeet = 0;

  if (projectType === "Slab / flatwork" || projectType === "Footing / trench") {
    cubicFeet = lengthFeet * widthFeet * (thicknessInches / 12);
  }

  if (projectType === "Wall") {
    cubicFeet = lengthFeet * heightFeet * (thicknessInches / 12);
  }

  if (projectType === "Round pier") {
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
  const wasteYards = cubicYards * (wastePercent / 100);
  const orderYards = cubicYards + wasteYards;
  const materialCost = orderYards * concretePricePerYard;
  const truckloads =
    truckCapacityYards > 0 ? orderYards / truckCapacityYards : 0;
  const fortyPoundBags = Math.ceil(orderYards * 90);
  const sixtyPoundBags = Math.ceil(orderYards * 60);
  const eightyPoundBags = Math.ceil(orderYards * 45);
  const estimatedWeight = orderYards * 4050;

  return {
    cubicFeet,
    cubicYards,
    wasteYards,
    orderYards,
    materialCost,
    truckloads,
    fortyPoundBags,
    sixtyPoundBags,
    eightyPoundBags,
    estimatedWeight,
  };
}

function canUseCanonicalConcreteYardValue(value) {
  return !Number.isNaN(value) && value >= 0;
}

function refactoredConcreteYardResults({
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
}) {
  let cubicFeet = 0;

  if (projectType === "Slab / flatwork" || projectType === "Footing / trench") {
    if (
      canUseCanonicalConcreteYardValue(lengthFeet) &&
      canUseCanonicalConcreteYardValue(widthFeet) &&
      canUseCanonicalConcreteYardValue(thicknessInches)
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
      canUseCanonicalConcreteYardValue(lengthFeet) &&
      canUseCanonicalConcreteYardValue(heightFeet) &&
      canUseCanonicalConcreteYardValue(thicknessInches)
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

  if (projectType === "Round pier") {
    if (
      canUseCanonicalConcreteYardValue(diameterInches) &&
      canUseCanonicalConcreteYardValue(depthInches)
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

  const physicalVolume = canUseCanonicalConcreteYardValue(cubicFeet)
    ? calculateConcretePhysicalVolume({
        baseVolume: cubicFeet,
        unitSystem: "imperial",
        wastePercent: 0,
      })
    : null;

  const cubicYards = physicalVolume
    ? physicalVolume.baseCubicYards
    : cubicFeet / 27;
  const wasteYards = cubicYards * (wastePercent / 100);
  const orderYards = cubicYards + wasteYards;
  const materialCost = orderYards * concretePricePerYard;
  const truckloads =
    truckCapacityYards > 0 ? orderYards / truckCapacityYards : 0;
  const fortyPoundBags = Math.ceil(orderYards * 90);
  const sixtyPoundBags = Math.ceil(orderYards * 60);
  const eightyPoundBags = Math.ceil(orderYards * 45);
  const estimatedWeight = orderYards * 4050;

  return {
    cubicFeet,
    cubicYards,
    wasteYards,
    orderYards,
    materialCost,
    truckloads,
    fortyPoundBags,
    sixtyPoundBags,
    eightyPoundBags,
    estimatedWeight,
  };
}

function assertParity(input) {
  const legacy = legacyConcreteYardResults(input);
  const refactored = refactoredConcreteYardResults(input);

  for (const key of Object.keys(legacy)) {
    assertSameNumber(refactored[key], legacy[key], key);
  }

  return refactored;
}

const defaults = {
  projectType: "Slab / flatwork",
  lengthFeet: 12,
  widthFeet: 12,
  thicknessInches: 4,
  wastePercent: 10,
  concretePricePerYard: 160,
  truckCapacityYards: 10,
};

test("Concrete Yard default route values preserve current outputs", () => {
  const result = assertParity(defaults);

  assert.equal(result.cubicFeet, 48);
  close(result.cubicYards, 1.7777777777777777);
  close(result.wasteYards, 0.17777777777777778);
  close(result.orderYards, 1.9555555555555555);
  close(result.materialCost, 312.88888888888886);
  close(result.truckloads, 0.19555555555555554);
  assert.equal(result.fortyPoundBags, 176);
  assert.equal(result.sixtyPoundBags, 118);
  assert.equal(result.eightyPoundBags, 88);
  assert.equal(result.estimatedWeight, 7920);
});

test("Concrete Yard slab footing wall and round-pier geometry preserve legacy parity", () => {
  const cases = [
    {
      projectType: "Slab / flatwork",
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
      projectType: "Round pier",
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
    });
  }
});

test("Concrete Yard known cubic feet and known cubic yards preserve route-specific semantics", () => {
  const knownFeet = assertParity({
    projectType: "Known cubic feet",
    knownCubicFeet: 54,
    wastePercent: 10,
    concretePricePerYard: 160,
    truckCapacityYards: 10,
  });

  assert.equal(knownFeet.cubicFeet, 54);
  assert.equal(knownFeet.cubicYards, 2);
  assert.equal(knownFeet.orderYards, 2.2);

  const knownYards = assertParity({
    projectType: "Known cubic yards",
    knownCubicYards: 2,
    wastePercent: 10,
    concretePricePerYard: 160,
    truckCapacityYards: 10,
  });

  assert.equal(knownYards.cubicFeet, 54);
  assert.equal(knownYards.cubicYards, 2);
  assert.equal(knownYards.orderYards, 2.2);
});

test("Concrete Yard waste 0 5 and default 10 percent preserve legacy parity", () => {
  for (const wastePercent of [0, 5, 10]) {
    const result = assertParity({ ...defaults, wastePercent });
    close(
      result.wasteYards,
      result.cubicYards * (wastePercent / 100),
    );
  }
});

test("Concrete Yard zero and fractional dimensions preserve legacy parity", () => {
  const zero = assertParity({
    ...defaults,
    lengthFeet: 0,
  });
  assert.equal(zero.orderYards, 0);

  const fractional = assertParity({
    ...defaults,
    lengthFeet: 13.75,
    widthFeet: 9.5,
    thicknessInches: 5.25,
    wastePercent: 7.5,
    concretePricePerYard: 187.5,
    truckCapacityYards: 9.25,
  });

  assert.ok(fractional.orderYards > 0);
});

test("Concrete Yard preserves current negative and invalid input behavior instead of canonical clamping", () => {
  const negativeGeometry = assertParity({
    ...defaults,
    lengthFeet: -12,
  });
  assert.ok(negativeGeometry.cubicFeet < 0);
  assert.ok(negativeGeometry.orderYards < 0);

  const negativeWaste = assertParity({
    ...defaults,
    wastePercent: -10,
  });
  close(negativeWaste.orderYards, 1.6);

  const invalidGeometry = assertParity({
    ...defaults,
    lengthFeet: Number.NaN,
  });
  assert.ok(Number.isNaN(invalidGeometry.cubicFeet));
  assert.ok(Number.isNaN(invalidGeometry.orderYards));

  const invalidWaste = assertParity({
    ...defaults,
    wastePercent: Number.NaN,
  });
  assert.ok(Number.isNaN(invalidWaste.wasteYards));
  assert.ok(Number.isNaN(invalidWaste.orderYards));

  const negativeTruckCapacity = assertParity({
    ...defaults,
    truckCapacityYards: -10,
  });
  assert.equal(negativeTruckCapacity.truckloads, 0);
});

test("Concrete Yard keeps weight bags fractional truckloads and material cost local", () => {
  const result = assertParity({
    ...defaults,
    concretePricePerYard: 215.75,
    truckCapacityYards: 8.5,
  });

  close(result.estimatedWeight, result.orderYards * 4050);
  assert.equal(result.fortyPoundBags, Math.ceil(result.orderYards * 90));
  assert.equal(result.sixtyPoundBags, Math.ceil(result.orderYards * 60));
  assert.equal(result.eightyPoundBags, Math.ceil(result.orderYards * 45));
  close(result.truckloads, result.orderYards / 8.5);
  close(result.materialCost, result.orderYards * 215.75);
  assert.notEqual(result.truckloads, Math.ceil(result.truckloads));
});

test("Concrete Yard source uses canonical physical primitives without canonical order policy or project behavior", () => {
  const source = readFileSync(
    new URL(
      "../../app/construction/concrete-yard-calculator/ConcreteYardCalculatorClient.tsx",
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
  assert.match(source, /const wasteYards = cubicYards \* \(wastePercent \/ 100\);/);
  assert.match(source, /const orderYards = cubicYards \+ wasteYards;/);
  assert.match(source, /orderYards \/ truckCapacityYards/);
  assert.match(source, /Math\.ceil\(orderYards \* 90\)/);
  assert.match(source, /Math\.ceil\(orderYards \* 60\)/);
  assert.match(source, /Math\.ceil\(orderYards \* 45\)/);
  assert.match(source, /orderYards \* 4050/);
  assert.match(source, /orderYards \* concretePricePerYard/);
});

test("Concrete Yard source preserves exact modes defaults copy fields and visible formatting policy", () => {
  const source = readFileSync(
    new URL(
      "../../app/construction/concrete-yard-calculator/ConcreteYardCalculatorClient.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  for (const mode of [
    "Slab / flatwork",
    "Footing / trench",
    "Wall",
    "Round pier",
    "Known cubic feet",
    "Known cubic yards",
  ]) {
    assert.match(source, new RegExp(mode.replace("/", "\\/")));
  }

  assert.match(source, /useState\(12\)/);
  assert.match(source, /useState\(4\)/);
  assert.match(source, /useState\(10\)/);
  assert.match(source, /useState\(160\)/);
  assert.match(source, /maximumFractionDigits: digits/);
  assert.match(source, /minimumFractionDigits: digits/);
  assert.match(source, /maximumFractionDigits: 0/);

  for (const field of [
    "Cubic feet:",
    "Concrete yards before waste:",
    "Waste allowance:",
    "Waste yards:",
    "Order yards:",
    "Estimated material cost:",
    "Approx. truckloads:",
    "40 lb bags:",
    "60 lb bags:",
    "80 lb bags:",
    "Estimated concrete weight:",
  ]) {
    assert.ok(source.includes(field), `missing preserved Copy Results field: ${field}`);
  }
});
