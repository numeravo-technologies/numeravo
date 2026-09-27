import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateImperialGravel,
  calculateMetricGravel,
} from "../../lib/calculations/gravel.ts";

test("40x60 area at 4 inches with 10 percent waste preserves imperial gravel math", () => {
  const result = calculateImperialGravel({
    lengthFeet: 40,
    widthFeet: 60,
    depthInches: 4,
    wastePercent: 10,
    tonsPerCubicYard: 1.4,
    pricePerTon: 45,
  });

  assert.ok(
    Math.abs(result.cubicFeet - 800) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.cubicYards -
        29.62962962962963,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.volumeWithWaste -
        32.592592592592595,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.estimatedWeight -
        45.62962962962963,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.estimatedCost -
        2053.3333333333335,
    ) < 1e-9,
  );

  assert.equal(result.smallTruckLoads, 10);
  assert.equal(result.standardTruckLoads, 5);
  assert.equal(result.largeTruckLoads, 4);
});

test("imperial calculation without waste preserves base volume", () => {
  const result = calculateImperialGravel({
    lengthFeet: 20,
    widthFeet: 10,
    depthInches: 4,
    wastePercent: 0,
    tonsPerCubicYard: 1.4,
    pricePerTon: 45,
  });

  assert.ok(
    Math.abs(
      result.cubicYards -
        result.volumeWithWaste,
    ) < 1e-12,
  );
});

test("metric gravel calculation preserves current conversion behavior", () => {
  const result = calculateMetricGravel({
    lengthMeters: 10,
    widthMeters: 5,
    depthCentimeters: 10,
    wastePercent: 10,
    tonnesPerCubicMeter: 1.7,
    pricePerTonne: 45,
  });

  assert.equal(result.cubicMeters, 5);
  assert.ok(
    Math.abs(result.volumeWithWaste - 5.5) <
      1e-12,
  );
  assert.ok(
    Math.abs(result.estimatedWeight - 9.35) <
      1e-12,
  );
  assert.ok(
    Math.abs(result.estimatedCost - 420.75) <
      1e-12,
  );

  assert.equal(result.smallTruckLoads, 2);
  assert.equal(result.standardTruckLoads, 1);
  assert.equal(result.largeTruckLoads, 1);
});

test("zero volume produces zero truck loads", () => {
  const result = calculateImperialGravel({
    lengthFeet: 0,
    widthFeet: 60,
    depthInches: 4,
    wastePercent: 10,
    tonsPerCubicYard: 1.4,
    pricePerTon: 45,
  });

  assert.equal(result.estimatedWeight, 0);
  assert.equal(result.estimatedCost, 0);
  assert.equal(result.smallTruckLoads, 0);
  assert.equal(result.standardTruckLoads, 0);
  assert.equal(result.largeTruckLoads, 0);
});

test("negative and invalid numeric values are clamped to zero", () => {
  const result = calculateImperialGravel({
    lengthFeet: -40,
    widthFeet: Number.NaN,
    depthInches: -4,
    wastePercent: -10,
    tonsPerCubicYard: -1.4,
    pricePerTon: -45,
  });

  assert.equal(result.cubicFeet, 0);
  assert.equal(result.cubicYards, 0);
  assert.equal(result.volumeWithWaste, 0);
  assert.equal(result.estimatedWeight, 0);
  assert.equal(result.estimatedCost, 0);
});

test("truck load counts round up using existing 5 10 and 15 ton capacities", () => {
  const result = calculateImperialGravel({
    lengthFeet: 10,
    widthFeet: 10,
    depthInches: 12,
    wastePercent: 0,
    tonsPerCubicYard: 1.4,
    pricePerTon: 0,
  });

  assert.equal(result.smallTruckLoads, 2);
  assert.equal(result.standardTruckLoads, 1);
  assert.equal(result.largeTruckLoads, 1);
});

function legacyHowMuchGravel({
  lengthFeet,
  widthFeet,
  depthInches,
  wastePercent,
  tonsPerCubicYard,
  pricePerTon,
}) {
  const squareFeet = lengthFeet * widthFeet;
  const depthFeet = depthInches / 12;
  const cubicFeet = squareFeet * depthFeet;
  const cubicYards = cubicFeet / 27;
  const cubicYardsWithWaste = cubicYards * (1 + wastePercent / 100);
  const estimatedTons = cubicYardsWithWaste * tonsPerCubicYard;
  const materialCost = estimatedTons * pricePerTon;

  return {
    squareFeet,
    cubicFeet,
    cubicYards,
    cubicYardsWithWaste,
    estimatedTons,
    materialCost,
    smallTruckLoads:
      estimatedTons > 0 ? Math.ceil(estimatedTons / 5) : 0,
    standardTruckLoads:
      estimatedTons > 0 ? Math.ceil(estimatedTons / 10) : 0,
    largeTruckLoads:
      estimatedTons > 0 ? Math.ceil(estimatedTons / 15) : 0,
  };
}

function assertClose(actual, expected, epsilon = 1e-10) {
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `expected ${actual} to be within ${epsilon} of ${expected}`,
  );
}

function assertHowMuchGravelParity(input) {
  const legacy = legacyHowMuchGravel(input);
  const shared = calculateImperialGravel(input);

  assertClose(shared.cubicFeet, legacy.cubicFeet);
  assertClose(shared.cubicYards, legacy.cubicYards);
  assertClose(shared.volumeWithWaste, legacy.cubicYardsWithWaste);
  assertClose(shared.estimatedWeight, legacy.estimatedTons);
  assertClose(shared.estimatedCost, legacy.materialCost);
  assert.equal(shared.smallTruckLoads, legacy.smallTruckLoads);
  assert.equal(shared.standardTruckLoads, legacy.standardTruckLoads);
  assert.equal(shared.largeTruckLoads, legacy.largeTruckLoads);
}

const howMuchGravelDefaults = {
  lengthFeet: 20,
  widthFeet: 10,
  depthInches: 4,
  wastePercent: 10,
  tonsPerCubicYard: 1.4,
  pricePerTon: 45,
};

test("How Much Gravel defaults match the canonical shared engine", () => {
  const result = calculateImperialGravel(howMuchGravelDefaults);

  assert.equal(20 * 10, 200);
  assertClose(result.cubicFeet, 66.66666666666666);
  assertClose(result.cubicYards, 2.4691358024691357);
  assertClose(result.volumeWithWaste, 2.7160493827160495);
  assertClose(result.estimatedWeight, 3.802469135802469);
  assertClose(result.estimatedCost, 171.1111111111111);
  assert.equal(result.smallTruckLoads, 1);
  assert.equal(result.standardTruckLoads, 1);
  assert.equal(result.largeTruckLoads, 1);
  assertHowMuchGravelParity(howMuchGravelDefaults);
});

test("How Much Gravel valid-input parity covers waste, fractional dimensions, density, and price", () => {
  for (const wastePercent of [0, 5, 10, 15]) {
    assertHowMuchGravelParity({
      ...howMuchGravelDefaults,
      wastePercent,
    });
  }

  assertHowMuchGravelParity({
    ...howMuchGravelDefaults,
    lengthFeet: 12.75,
    widthFeet: 7.25,
    depthInches: 3.5,
  });
  assertHowMuchGravelParity({
    ...howMuchGravelDefaults,
    tonsPerCubicYard: 1.63,
  });
  assertHowMuchGravelParity({
    ...howMuchGravelDefaults,
    pricePerTon: 73.25,
  });
});

test("How Much Gravel zero values preserve expected output behavior", () => {
  const zeroDimension = calculateImperialGravel({
    ...howMuchGravelDefaults,
    lengthFeet: 0,
  });
  assert.equal(zeroDimension.cubicFeet, 0);
  assert.equal(zeroDimension.estimatedWeight, 0);
  assert.equal(zeroDimension.estimatedCost, 0);
  assert.equal(zeroDimension.smallTruckLoads, 0);

  const zeroDensity = calculateImperialGravel({
    ...howMuchGravelDefaults,
    tonsPerCubicYard: 0,
  });
  assert.ok(zeroDensity.volumeWithWaste > 0);
  assert.equal(zeroDensity.estimatedWeight, 0);
  assert.equal(zeroDensity.estimatedCost, 0);

  const zeroPrice = calculateImperialGravel({
    ...howMuchGravelDefaults,
    pricePerTon: 0,
  });
  assert.ok(zeroPrice.estimatedWeight > 0);
  assert.equal(zeroPrice.estimatedCost, 0);
});

test("How Much Gravel conversion adopts canonical negative and invalid clamping", () => {
  const result = calculateImperialGravel({
    lengthFeet: -20,
    widthFeet: Number.NaN,
    depthInches: -4,
    wastePercent: -10,
    tonsPerCubicYard: -1.4,
    pricePerTon: -45,
  });

  assert.equal(result.cubicFeet, 0);
  assert.equal(result.cubicYards, 0);
  assert.equal(result.volumeWithWaste, 0);
  assert.equal(result.estimatedWeight, 0);
  assert.equal(result.estimatedCost, 0);
  assert.equal(result.smallTruckLoads, 0);
  assert.equal(result.standardTruckLoads, 0);
  assert.equal(result.largeTruckLoads, 0);
});

test("How Much Gravel truckload boundaries preserve Math.ceil behavior", () => {
  const cases = [
    [4.99, 1, 1, 1],
    [5, 1, 1, 1],
    [5.01, 2, 1, 1],
    [9.99, 2, 1, 1],
    [10, 2, 1, 1],
    [10.01, 3, 2, 1],
    [14.99, 3, 2, 1],
    [15, 3, 2, 1],
    [15.01, 4, 2, 2],
  ];

  for (const [tons, small, standard, large] of cases) {
    const result = calculateImperialGravel({
      lengthFeet: tons * 27,
      widthFeet: 1,
      depthInches: 12,
      wastePercent: 0,
      tonsPerCubicYard: 1,
      pricePerTon: 0,
    });

    assertClose(result.estimatedWeight, tons, 1e-9);
    assert.equal(result.smallTruckLoads, small);
    assert.equal(result.standardTruckLoads, standard);
    assert.equal(result.largeTruckLoads, large);
  }
});
