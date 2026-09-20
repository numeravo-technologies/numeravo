import test from "node:test";
import assert from "node:assert/strict";

import {
  buildConcreteCalculationResult,
} from "../../data/concreteCalculationResult.ts";

import {
  isCalculationResult,
} from "../../data/calculationResult.ts";

const results = {
  baseCubicFeet: 1200,
  baseCubicYards: 44.44444444444444,
  baseCubicMeters: 0,
  volumeWithWaste: 48.88888888888889,
  recommendedOrder: 49,
  estimatedCost: 7350,
  truckLoads: 5,
  eightyLbBags: 2228,
  sixtyLbBags: 2929,
  eightyLbPallets: 54,
  sixtyLbPallets: 53,
  formulaLabel: "Length × width × thickness × quantity",
};

test("imperial ready-mix result exposes truck loads", () => {
  const result = buildConcreteCalculationResult({
    projectLabel: "Slab / Pad",
    unitSystem: "imperial",
    orderMode: "readyMix",
    wastePercent: 10,
    results,
  });

  assert.equal(isCalculationResult(result), true);

  assert.equal(
    result.metrics.some(
      (metric) => metric.key === "truckLoads",
    ),
    true,
  );

  assert.equal(
    result.metrics.some(
      (metric) => metric.key === "eightyLbBags",
    ),
    false,
  );

  assert.equal(result.totalCost, 7350);
});

test("imperial bag result exposes bags and pallets instead of truck loads", () => {
  const result = buildConcreteCalculationResult({
    projectLabel: "Slab / Pad",
    unitSystem: "imperial",
    orderMode: "bags",
    wastePercent: 10,
    results,
  });

  assert.equal(
    result.metrics.some(
      (metric) => metric.key === "truckLoads",
    ),
    false,
  );

  assert.equal(
    result.metrics.some(
      (metric) => metric.key === "eightyLbBags",
    ),
    true,
  );

  assert.equal(
    result.metrics.some(
      (metric) => metric.key === "sixtyLbPallets",
    ),
    true,
  );
});

test("metric result uses cubic-meter metrics only", () => {
  const metricResults = {
    ...results,
    baseCubicFeet: 0,
    baseCubicYards: 0,
    baseCubicMeters: 10,
    volumeWithWaste: 11,
    recommendedOrder: 11,
  };

  const result = buildConcreteCalculationResult({
    projectLabel: "Slab / Pad",
    unitSystem: "metric",
    orderMode: "readyMix",
    wastePercent: 10,
    results: metricResults,
  });

  assert.equal(
    result.metrics.some(
      (metric) => metric.key === "baseCubicMeters",
    ),
    true,
  );

  assert.equal(
    result.metrics.some(
      (metric) => metric.key === "baseCubicYards",
    ),
    false,
  );

  assert.equal(
    result.metrics.some(
      (metric) => metric.key === "truckLoads",
    ),
    false,
  );
});

test("producer preserves calculator identity and formula note", () => {
  const result = buildConcreteCalculationResult({
    projectLabel: "Slab / Pad",
    unitSystem: "imperial",
    orderMode: "readyMix",
    wastePercent: 10,
    results,
  });

  assert.equal(
    result.calculatorId,
    "concrete-calculator",
  );

  assert.equal(
    result.calculatorTitle,
    "Concrete Calculator",
  );

  assert.deepEqual(
    result.notes,
    ["Length × width × thickness × quantity"],
  );
});
