import test from "node:test";
import assert from "node:assert/strict";

import { buildFormworkCalculationResult } from "../../data/formworkCalculationResult.ts";

const results = {
  perimeter: 80,
  baseFormLinearFeet: 80,
  wasteLinearFeet: 8,
  totalFormLinearFeet: 88,
  boardCount: 8,
  stakeCount: 31,
  braceCount: 14,
  boardCostTotal: 76,
  stakeCostTotal: 69.75,
  braceCostTotal: 49,
  fastenerCost: 10,
  formOilCost: 7.04,
  materialCost: 211.79,
  laborCost: 325,
  totalCost: 536.79,
  costPerLinearFoot: 536.79 / 88,
  laborCostPerLinearFoot: 325 / 88,
  notes: [
    "Stake spacing is within a common planning range for many flatwork forms.",
    "Labor is the largest cost driver in this estimate.",
  ],
};

function buildResult() {
  return buildFormworkCalculationResult({
    presetType: "Slab",
    length: 20,
    width: 20,
    formRuns: 1,
    extraFormRuns: 0,
    boardLength: 12,
    boardCost: 9.5,
    stakeSpacing: 3,
    stakeCost: 2.25,
    braceSpacing: 6,
    braceCost: 3.5,
    fastenerCostPerBoard: 1.25,
    formOilCostPerFoot: 0.08,
    wastePercent: 10,
    laborHours: 5,
    laborRate: 65,
    results,
  });
}

test("builds the formwork calculation identity and input summary", () => {
  const result = buildResult();

  assert.equal(result.calculatorId, "concrete-formwork-calculator");
  assert.equal(result.calculatorTitle, "Concrete Formwork Calculator");

  assert.deepEqual(
    result.inputSummary.map((field) => field.key),
    [
      "presetType",
      "length",
      "width",
      "formRuns",
      "extraFormRuns",
      "boardLength",
      "boardCost",
      "stakeSpacing",
      "stakeCost",
      "braceSpacing",
      "braceCost",
      "fastenerCostPerBoard",
      "formOilCostPerFoot",
      "wastePercent",
      "laborHours",
      "laborRate",
    ],
  );
});

test("preserves native formwork quantities and metrics", () => {
  const result = buildResult();

  assert.deepEqual(
    result.metrics.map((metric) => metric.key),
    [
      "perimeter",
      "baseFormLinearFeet",
      "wasteLinearFeet",
      "totalFormLinearFeet",
      "boardCount",
      "stakeCount",
      "braceCount",
      "costPerLinearFoot",
      "laborCostPerLinearFoot",
    ],
  );

  assert.equal(
    result.metrics.find((metric) => metric.key === "totalFormLinearFeet")
      ?.value,
    88,
  );
  assert.equal(
    result.metrics.find((metric) => metric.key === "boardCount")?.value,
    8,
  );
});

test("preserves material and formwork labor cost detail", () => {
  const result = buildResult();

  assert.deepEqual(
    result.costs?.map((cost) => cost.key),
    [
      "boardCost",
      "stakeCost",
      "braceCost",
      "fastenerCost",
      "formOilCost",
      "materialCost",
      "laborCost",
    ],
  );

  assert.equal(
    result.costs?.find((cost) => cost.key === "materialCost")?.amount,
    211.79,
  );
  assert.equal(
    result.costs?.find((cost) => cost.key === "laborCost")?.amount,
    325,
  );
});

test("uses material cost only for the project aggregate contribution", () => {
  const result = buildResult();

  assert.equal(result.totalCost, 211.79);
  assert.notEqual(result.totalCost, results.totalCost);

  assert.ok(
    result.notes?.includes(
      "Project total contribution uses formwork material cost only. Labor is tracked separately by the project's Labor scope.",
    ),
  );
});

test("preserves native planning notes", () => {
  const result = buildResult();

  assert.ok(
    result.notes?.includes(
      "Stake spacing is within a common planning range for many flatwork forms.",
    ),
  );
  assert.ok(
    result.notes?.includes(
      "Labor is the largest cost driver in this estimate.",
    ),
  );
});
