import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkflowContext,
  isWorkflowStepSelected,
  setWorkflowInput,
  setWorkflowResult,
  toggleWorkflowStep,
} from "../../data/workflowContext.ts";
import {
  createWorkflowResult,
} from "../../data/workflowResult.ts";

function makeResult(stepId, totalCost) {
  return createWorkflowResult({
    stepId,
    updatedAt: "2026-10-05T00:00:00.000Z",
    result: {
      calculatorId: `${stepId}-calculator`,
      calculatorTitle: `${stepId} calculator`,
      inputSummary: [],
      metrics: [],
      totalCost,
    },
  });
}

test("createWorkflowContext creates an empty workflow", () => {
  const workflow = createWorkflowContext(
    "construction.concrete-slab-equipment-pad",
  );

  assert.deepEqual(workflow, {
    definitionId:
      "construction.concrete-slab-equipment-pad",
    name: "",
    inputs: {},
    selectedStepIds: [],
    results: {},
  });
});

test("setWorkflowInput replaces one input and preserves state", () => {
  const workflow = {
    ...createWorkflowContext("test.workflow"),
    name: "Test",
    inputs: {
      length: 20,
      enabled: true,
    },
    selectedStepIds: ["concrete"],
  };

  const updated = setWorkflowInput(
    workflow,
    "length",
    30,
  );

  assert.equal(updated.inputs.length, 30);
  assert.equal(updated.inputs.enabled, true);
  assert.equal(updated.name, "Test");
  assert.deepEqual(
    updated.selectedStepIds,
    ["concrete"],
  );
});

test("toggleWorkflowStep selects and deselects a step", () => {
  const workflow = createWorkflowContext(
    "test.workflow",
  );

  const selected = toggleWorkflowStep(
    workflow,
    "concrete",
  );

  assert.equal(
    isWorkflowStepSelected(selected, "concrete"),
    true,
  );

  const deselected = toggleWorkflowStep(
    selected,
    "concrete",
  );

  assert.equal(
    isWorkflowStepSelected(deselected, "concrete"),
    false,
  );
});

test("setWorkflowResult stores results by step id", () => {
  const workflow = createWorkflowContext(
    "test.workflow",
  );

  const result = makeResult("concrete", 750);
  const updated = setWorkflowResult(
    workflow,
    result,
  );

  assert.equal(updated.results.concrete, result);
});

test("setWorkflowResult replaces one step without losing others", () => {
  const workflow = createWorkflowContext(
    "test.workflow",
  );

  const withConcrete = setWorkflowResult(
    workflow,
    makeResult("concrete", 750),
  );

  const withLabor = setWorkflowResult(
    withConcrete,
    makeResult("labor", 500),
  );

  const updated = setWorkflowResult(
    withLabor,
    makeResult("concrete", 900),
  );

  assert.equal(
    updated.results.concrete.result.totalCost,
    900,
  );
  assert.equal(
    updated.results.labor.result.totalCost,
    500,
  );
  assert.equal(
    Object.keys(updated.results).length,
    2,
  );
});
