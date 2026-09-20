import test from "node:test";
import assert from "node:assert/strict";

import {
  createProjectScopeResult,
  isProjectScopeResult,
} from "../../data/projectScopeResult.ts";

const calculationResult = {
  calculatorId: "concrete-calculator",
  calculatorTitle: "Concrete Calculator",
  inputSummary: [
    {
      key: "projectType",
      label: "Project Type",
      value: "Slab / Pad",
    },
  ],
  metrics: [
    {
      key: "recommendedOrder",
      label: "Recommended Order",
      value: 49,
      unit: "yd³",
    },
  ],
  costs: [
    {
      key: "materialCost",
      label: "Estimated Material Cost",
      amount: 7350,
    },
  ],
  totalCost: 7350,
};

test("creates a project scope result from a calculation result", () => {
  const scopeResult = createProjectScopeResult({
    scopeId: "concrete",
    result: calculationResult,
    updatedAt: "2026-09-20T04:30:00.000Z",
  });

  assert.equal(scopeResult.scopeId, "concrete");
  assert.equal(
    scopeResult.calculatorId,
    "concrete-calculator",
  );
  assert.equal(
    scopeResult.calculatorTitle,
    "Concrete Calculator",
  );
  assert.equal(scopeResult.result.totalCost, 7350);
  assert.equal(
    scopeResult.updatedAt,
    "2026-09-20T04:30:00.000Z",
  );
});

test("accepts a valid project scope result", () => {
  const scopeResult = createProjectScopeResult({
    scopeId: "concrete",
    result: calculationResult,
    updatedAt: "2026-09-20T04:30:00.000Z",
  });

  assert.equal(
    isProjectScopeResult(scopeResult),
    true,
  );
});

test("rejects a project scope result without scope identity", () => {
  assert.equal(
    isProjectScopeResult({
      calculatorId: "concrete-calculator",
      calculatorTitle: "Concrete Calculator",
      result: calculationResult,
      updatedAt: "2026-09-20T04:30:00.000Z",
    }),
    false,
  );
});

test("rejects a project scope result without calculation data", () => {
  assert.equal(
    isProjectScopeResult({
      scopeId: "concrete",
      calculatorId: "concrete-calculator",
      calculatorTitle: "Concrete Calculator",
      updatedAt: "2026-09-20T04:30:00.000Z",
    }),
    false,
  );
});

test("rejects malformed nested calculation result", () => {
  assert.equal(
    isProjectScopeResult({
      scopeId: "concrete",
      calculatorId: "concrete-calculator",
      calculatorTitle: "Concrete Calculator",
      result: {
        calculatorId: "concrete-calculator",
      },
      updatedAt: "2026-09-20T04:30:00.000Z",
    }),
    false,
  );
});
