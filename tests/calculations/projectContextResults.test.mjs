import test from "node:test";
import assert from "node:assert/strict";

import {
  createProjectContext,
} from "../../data/projectContext.ts";

const calculationResult = {
  calculatorId: "concrete-calculator",
  calculatorTitle: "Concrete Calculator",
  inputSummary: [],
  metrics: [
    {
      key: "recommendedOrder",
      label: "Recommended Order",
      value: 49,
      unit: "yd³",
    },
  ],
  totalCost: 7350,
};

const scopeResult = {
  scopeId: "concrete",
  calculatorId: "concrete-calculator",
  calculatorTitle: "Concrete Calculator",
  result: calculationResult,
  updatedAt: "2026-09-20T04:30:00.000Z",
};

test("new project context starts with empty scope results", () => {
  const project = createProjectContext(
    "concrete-slab-equipment-pad",
  );

  assert.deepEqual(project.scopeResults, {});
});
