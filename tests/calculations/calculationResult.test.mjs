import test from "node:test";
import assert from "node:assert/strict";

import {
  isCalculationResult,
} from "../../data/calculationResult.ts";

test("valid structured calculation result is accepted", () => {
  const result = {
    calculatorId: "concrete-calculator",
    calculatorTitle: "Concrete Calculator",
    inputSummary: [
      {
        key: "length",
        label: "Length",
        value: 40,
        unit: "ft",
      },
    ],
    metrics: [
      {
        key: "concreteYards",
        label: "Concrete",
        value: 48.89,
        unit: "yd³",
      },
    ],
  };

  assert.equal(
    isCalculationResult(result),
    true,
  );
});

test("result requires calculator identity", () => {
  assert.equal(
    isCalculationResult({
      inputSummary: [],
      metrics: [],
    }),
    false,
  );
});

test("result requires input summary array", () => {
  assert.equal(
    isCalculationResult({
      calculatorId: "concrete-calculator",
      calculatorTitle: "Concrete Calculator",
      metrics: [],
    }),
    false,
  );
});

test("result requires metrics array", () => {
  assert.equal(
    isCalculationResult({
      calculatorId: "concrete-calculator",
      calculatorTitle: "Concrete Calculator",
      inputSummary: [],
    }),
    false,
  );
});

test("finite total cost is accepted", () => {
  assert.equal(
    isCalculationResult({
      calculatorId: "concrete-cost-calculator",
      calculatorTitle: "Concrete Cost Calculator",
      inputSummary: [],
      metrics: [],
      totalCost: 4275.93,
    }),
    true,
  );
});

test("non-finite total cost is rejected", () => {
  assert.equal(
    isCalculationResult({
      calculatorId: "concrete-cost-calculator",
      calculatorTitle: "Concrete Cost Calculator",
      inputSummary: [],
      metrics: [],
      totalCost: Number.NaN,
    }),
    false,
  );
});
