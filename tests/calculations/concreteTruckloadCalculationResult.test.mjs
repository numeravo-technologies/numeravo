import test from "node:test";
import assert from "node:assert/strict";

import { buildConcreteTruckloadCalculationResult } from "../../data/concreteTruckloadCalculationResult.ts";

const results = {
  baseYards: 8,
  yardsWithWaste: 8.8,
  orderYards: 9,
  truckloads: 1,
  isShortLoad: false,
  concreteMaterialCost: 1440,
  deliveryCost: 150,
  shortLoadCost: 0,
  totalCost: 1675,
  costPerYard: 1675 / 9,
  totalWeight: 36450,
  unusedTruckCapacity: 1,
};

function buildResult(overrides = {}) {
  return buildConcreteTruckloadCalculationResult({
    inputMode: "Known cubic yards",
    projectType: "Slab / pad",
    knownYards: 8,
    length: 20,
    width: 20,
    thicknessInches: 4,
    wastePercent: 10,
    truckCapacityYards: 10,
    minimumDeliveryYards: 3,
    roundToNearestYard: 0.25,
    concretePricePerYard: 160,
    deliveryFeePerTruck: 150,
    shortLoadFee: 125,
    fuelSurcharge: 35,
    environmentalFee: 20,
    waitingTimeFee: 30,
    concreteWeightPerYard: 4050,
    results,
    ...overrides,
  });
}

test("builds the truckload calculation identity and input summary", () => {
  const result = buildResult();

  assert.equal(result.calculatorId, "concrete-truckload-calculator");
  assert.equal(result.calculatorTitle, "Concrete Truckload Calculator");

  assert.deepEqual(
    result.inputSummary.map((field) => field.key),
    [
      "inputMode",
      "projectType",
      "knownYards",
      "length",
      "width",
      "thicknessInches",
      "wastePercent",
      "truckCapacityYards",
      "minimumDeliveryYards",
      "roundToNearestYard",
      "concretePricePerYard",
      "deliveryFeePerTruck",
      "shortLoadFee",
      "fuelSurcharge",
      "environmentalFee",
      "waitingTimeFee",
      "concreteWeightPerYard",
    ],
  );
});

test("preserves native truckload quantities and metrics", () => {
  const result = buildResult();

  assert.deepEqual(
    result.metrics.map((metric) => metric.key),
    [
      "baseYards",
      "yardsWithWaste",
      "orderYards",
      "truckloads",
      "unusedTruckCapacity",
      "totalWeight",
      "costPerYard",
    ],
  );

  assert.equal(
    result.metrics.find((metric) => metric.key === "orderYards")?.value,
    9,
  );
  assert.equal(
    result.metrics.find((metric) => metric.key === "truckloads")?.value,
    1,
  );
});

test("preserves concrete material and detailed delivery costs", () => {
  const result = buildResult();

  assert.deepEqual(
    result.costs?.map((cost) => cost.key),
    [
      "concreteMaterialCost",
      "deliveryCost",
      "shortLoadCost",
      "fuelSurcharge",
      "environmentalFee",
      "waitingTimeFee",
      "nativeTotalCost",
    ],
  );

  assert.equal(
    result.costs?.find((cost) => cost.key === "concreteMaterialCost")?.amount,
    1440,
  );
  assert.equal(
    result.costs?.find((cost) => cost.key === "nativeTotalCost")?.amount,
    1675,
  );
});

test("excludes concrete material from the project aggregate contribution", () => {
  const result = buildResult();

  assert.equal(result.totalCost, 235);
  assert.notEqual(result.totalCost, results.totalCost);

  assert.ok(
    result.notes?.includes(
      "Project total contribution includes delivery and delivery-specific fees only. Concrete material cost is tracked separately by the project's Concrete scope.",
    ),
  );
});

test("preserves short-load state without double counting the entered fee", () => {
  const shortLoadResults = {
    ...results,
    isShortLoad: true,
    shortLoadCost: 125,
    totalCost: 1800,
    costPerYard: 1800 / 9,
  };

  const result = buildResult({
    results: shortLoadResults,
  });

  assert.equal(result.totalCost, 360);

  assert.ok(
    result.notes?.includes(
      "This order is below the entered minimum delivery quantity and includes the calculated short-load fee.",
    ),
  );
});

test("does not contribute concrete material when all delivery-specific costs are zero", () => {
  const zeroDeliveryResults = {
    ...results,
    deliveryCost: 0,
    shortLoadCost: 0,
    totalCost: results.concreteMaterialCost,
    costPerYard: results.concreteMaterialCost / results.orderYards,
  };

  const result = buildResult({
    fuelSurcharge: 0,
    environmentalFee: 0,
    waitingTimeFee: 0,
    results: zeroDeliveryResults,
  });

  assert.equal(result.totalCost, 0);
  assert.equal(
    result.costs?.find((cost) => cost.key === "concreteMaterialCost")?.amount,
    1440,
  );
});
