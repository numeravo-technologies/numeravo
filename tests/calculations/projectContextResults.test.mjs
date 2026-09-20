import test from "node:test";
import assert from "node:assert/strict";

import {
  createProjectContext,
  setProjectScopeResult,
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

test("setProjectScopeResult stores a result by scope id", () => {
  const project = createProjectContext(
    "concrete-slab-equipment-pad",
  );

  const updated = setProjectScopeResult(
    project,
    scopeResult,
  );

  assert.deepEqual(
    updated.scopeResults.concrete,
    scopeResult,
  );
});

test("setProjectScopeResult preserves existing project state", () => {
  const project = {
    ...createProjectContext(
      "concrete-slab-equipment-pad",
    ),
    projectName: "North equipment pad",
    selectedScopeIds: ["concrete"],
  };

  const updated = setProjectScopeResult(
    project,
    scopeResult,
  );

  assert.equal(
    updated.projectName,
    "North equipment pad",
  );

  assert.deepEqual(
    updated.selectedScopeIds,
    ["concrete"],
  );
});
