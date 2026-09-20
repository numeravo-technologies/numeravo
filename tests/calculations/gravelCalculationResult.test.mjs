import test from "node:test";
import assert from "node:assert/strict";

import {
  buildGravelCalculationResult,
} from "../../data/gravelCalculationResult.ts";

import {
  isCalculationResult,
} from "../../data/calculationResult.ts";

const results = {
  cubicFeet: 66.6666666667,
  cubicYards: 2.46913580247,
  cubicMeters: 0,
  volumeWithWaste: 2.71604938272,
  estimatedWeight: 3.80246913581,
  estimatedCost: 171.111111111,
  smallTruckLoads: 1,
  standardTruckLoads: 1,
  largeTruckLoads: 1,
};

test("imperial gravel result exposes volume weight truckloads and cost", () => {
  const result = buildGravelCalculationResult({
    material: "Gravel",
    unitSystem: "imperial",
    length: 20,
    width: 10,
    depth: 4,
    wastePercent: 10,
    density: 1.4,
    pricePerWeightUnit: 45,
    results,
  });

  assert.equal(isCalculationResult(result), true);
  assert.equal(result.calculatorId, "gravel-calculator");
  assert.equal(result.totalCost, results.estimatedCost);

  assert.equal(
    result.metrics.some(
      (metric) => metric.key === "cubicYards",
    ),
    true,
  );

  assert.equal(
    result.metrics.some(
      (metric) => metric.key === "standardTruckLoads",
    ),
    true,
  );
});

test("structured gravel result preserves base-specific inputs for restore", () => {
  const result = buildGravelCalculationResult({
    material: "Road Base",
    unitSystem: "imperial",
    length: 40,
    width: 60,
    depth: 6,
    wastePercent: 12,
    density: 1.5,
    pricePerWeightUnit: 58.75,
    results,
  });

  const inputValue = (key) =>
    result.inputSummary.find(
      (input) => input.key === key,
    )?.value;

  assert.equal(inputValue("material"), "Road Base");
  assert.equal(inputValue("depth"), 6);
  assert.equal(inputValue("wastePercent"), 12);
  assert.equal(inputValue("density"), 1.5);
  assert.equal(inputValue("pricePerWeightUnit"), 58.75);
});

test("metric gravel result uses metric volume and weight units", () => {
  const metricResults = {
    ...results,
    cubicFeet: 0,
    cubicYards: 0,
    cubicMeters: 5.4,
    volumeWithWaste: 5.94,
    estimatedWeight: 10.098,
  };

  const result = buildGravelCalculationResult({
    material: "Crushed Stone",
    unitSystem: "metric",
    length: 12,
    width: 8,
    depth: 5,
    wastePercent: 10,
    density: 1.7,
    pricePerWeightUnit: 50,
    results: metricResults,
  });

  assert.equal(
    result.metrics.some(
      (metric) => metric.key === "cubicMeters",
    ),
    true,
  );

  assert.equal(
    result.metrics.some(
      (metric) => metric.key === "cubicYards",
    ),
    false,
  );

  const weight = result.metrics.find(
    (metric) => metric.key === "estimatedWeight",
  );

  assert.equal(weight?.unit, "tonnes");
});
