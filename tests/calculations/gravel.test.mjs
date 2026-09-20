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
