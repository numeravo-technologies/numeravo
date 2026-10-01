import test from "node:test";
import assert from "node:assert/strict";

import { calculateRebarSpacing } from "../../lib/calculations/rebarSpacing.ts";

import { buildRebarSpacingCalculationResult } from "../../data/rebarSpacingCalculationResult.ts";

const input = {
  slabLengthFeet: 20,
  slabWidthFeet: 20,
  spacingInches: 18,
  edgeClearanceInches: 3,
  rebarSize: "#4",
  stockLengthFeet: 20,
  lapLengthInches: 24,
  wastePercent: 10,
  weightPerFoot: 0.668,
  pricePerFoot: 0.85,
};

function buildResult() {
  const results = calculateRebarSpacing({
    slabLengthFeet: input.slabLengthFeet,
    slabWidthFeet: input.slabWidthFeet,
    spacingInches: input.spacingInches,
    edgeClearanceInches: input.edgeClearanceInches,
    stockLengthFeet: input.stockLengthFeet,
    lapLengthInches: input.lapLengthInches,
    wastePercent: input.wastePercent,
    weightPerFoot: input.weightPerFoot,
    pricePerFoot: input.pricePerFoot,
  });

  return buildRebarSpacingCalculationResult({
    slabLengthFeet: input.slabLengthFeet,
    slabWidthFeet: input.slabWidthFeet,
    spacingInches: input.spacingInches,
    edgeClearanceInches: input.edgeClearanceInches,
    rebarSize: input.rebarSize,
    stockLengthFeet: input.stockLengthFeet,
    lapLengthInches: input.lapLengthInches,
    wastePercent: input.wastePercent,
    pricePerFoot: input.pricePerFoot,
    results,
  });
}

test("builds the reinforcement calculation identity and inputs", () => {
  const result = buildResult();

  assert.equal(result.calculatorId, "rebar-spacing-for-concrete-slab");

  assert.equal(result.calculatorTitle, "Rebar Spacing for Concrete Slab");

  assert.deepEqual(
    result.inputSummary.map(({ key }) => key),
    [
      "slabLengthFeet",
      "slabWidthFeet",
      "spacingInches",
      "edgeClearanceInches",
      "rebarSize",
      "stockLengthFeet",
      "lapLengthInches",
      "wastePercent",
      "pricePerFoot",
    ],
  );
});

test("preserves the canonical reinforcement quantities", () => {
  const result = buildResult();

  const metrics = Object.fromEntries(
    result.metrics.map(({ key, value }) => [key, value]),
  );

  assert.equal(metrics.slabArea, 400);
  assert.equal(metrics.totalGridBars, 28);
  assert.equal(metrics.totalPurchasedFeet, 620);
  assert.ok(Math.abs(metrics.totalWeight - 414.16) < 1e-12);
});

test("uses material cost as the reinforcement scope total", () => {
  const result = buildResult();

  assert.equal(result.totalCost, 527);

  assert.deepEqual(result.costs, [
    {
      key: "materialCost",
      label: "Estimated Material Cost",
      amount: 527,
    },
  ]);
});

test("preserves detailed reinforcement metrics for the project workspace", () => {
  const result = buildResult();

  const metricKeys = result.metrics.map(({ key }) => key);

  assert.deepEqual(metricKeys, [
    "slabArea",
    "usableLengthFeet",
    "usableWidthFeet",
    "barsRunningLength",
    "barsRunningWidth",
    "totalGridBars",
    "baseLinearFeet",
    "lapAllowanceFeet",
    "wasteFeet",
    "totalLinearFeet",
    "stockBars",
    "totalPurchasedFeet",
    "totalWeight",
    "costPerSquareFoot",
  ]);
});
