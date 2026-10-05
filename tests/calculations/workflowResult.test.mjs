import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkflowResult,
  isWorkflowResult,
} from "../../data/workflowResult.ts";

const calculationResult = {
  calculatorId: "concrete-calculator",
  calculatorTitle: "Concrete Calculator",
  inputSummary: [
    {
      key: "length",
      label: "Length",
      value: 20,
      unit: "ft",
    },
  ],
  metrics: [
    {
      key: "volume",
      label: "Concrete",
      value: 5,
      unit: "yd³",
    },
  ],
  costs: [
    {
      key: "material",
      label: "Material",
      amount: 750,
    },
  ],
  totalCost: 750,
  notes: ["Test result"],
};

test("createWorkflowResult preserves the calculation result", () => {
  const workflowResult = createWorkflowResult({
    stepId: "concrete",
    result: calculationResult,
    updatedAt: "2026-10-05T00:00:00.000Z",
  });

  assert.equal(workflowResult.stepId, "concrete");
  assert.equal(
    workflowResult.calculatorId,
    "concrete-calculator",
  );
  assert.equal(
    workflowResult.calculatorTitle,
    "Concrete Calculator",
  );
  assert.equal(workflowResult.result, calculationResult);
  assert.equal(
    workflowResult.updatedAt,
    "2026-10-05T00:00:00.000Z",
  );
});

test("isWorkflowResult accepts a valid workflow result", () => {
  const workflowResult = createWorkflowResult({
    stepId: "concrete",
    result: calculationResult,
    updatedAt: "2026-10-05T00:00:00.000Z",
  });

  assert.equal(isWorkflowResult(workflowResult), true);
});

test("isWorkflowResult rejects malformed calculation results", () => {
  assert.equal(
    isWorkflowResult({
      stepId: "concrete",
      calculatorId: "concrete-calculator",
      calculatorTitle: "Concrete Calculator",
      updatedAt: "2026-10-05T00:00:00.000Z",
      result: {
        calculatorId: "concrete-calculator",
        calculatorTitle: "Concrete Calculator",
      },
    }),
    false,
  );
});

test("isWorkflowResult rejects mismatched calculator identity", () => {
  assert.equal(
    isWorkflowResult({
      stepId: "concrete",
      calculatorId: "gravel-calculator",
      calculatorTitle: "Gravel Calculator",
      updatedAt: "2026-10-05T00:00:00.000Z",
      result: calculationResult,
    }),
    false,
  );
});
