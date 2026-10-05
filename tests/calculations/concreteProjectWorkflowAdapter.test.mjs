import assert from "node:assert/strict";
import test from "node:test";

import {
  concreteProjectToWorkflowContext,
  projectScopeResultToWorkflowResult,
  workflowContextToConcreteProject,
  workflowResultToProjectScopeResult,
} from "../../data/workflowAdapters/concreteProjectWorkflowAdapter.ts";

const calculationResult = {
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
      key: "recommendedOrder",
      label: "Recommended Order",
      value: 49,
      unit: "yd³",
    },
  ],
  totalCost: 7350,
};

const projectScopeResult = {
  scopeId: "concrete",
  calculatorId: "concrete-calculator",
  calculatorTitle: "Concrete Calculator",
  result: calculationResult,
  updatedAt: "2026-10-05T00:00:00.000Z",
};

function makeProject() {
  return {
    recipeId: "concrete-slab-equipment-pad",
    projectName: "North equipment pad",
    unitSystem: "metric",
    inputs: {
      length: 40,
      width: 60,
      thickness: 6,
      wastePercent: 10,
    },
    selectedScopeIds: ["concrete", "labor"],
    scopeResults: {
      concrete: projectScopeResult,
    },
  };
}

test("maps a project scope result to a workflow result", () => {
  const workflowResult =
    projectScopeResultToWorkflowResult(projectScopeResult);

  assert.deepEqual(workflowResult, {
    stepId: "concrete",
    calculatorId: "concrete-calculator",
    calculatorTitle: "Concrete Calculator",
    result: calculationResult,
    updatedAt: "2026-10-05T00:00:00.000Z",
  });
});

test("maps a workflow result back to a project scope result", () => {
  const workflowResult =
    projectScopeResultToWorkflowResult(projectScopeResult);

  assert.deepEqual(
    workflowResultToProjectScopeResult(workflowResult),
    projectScopeResult,
  );
});

test("maps Concrete project state to universal workflow state", () => {
  const project = makeProject();
  const workflow =
    concreteProjectToWorkflowContext(project);

  assert.equal(
    workflow.definitionId,
    "construction.concrete-slab-equipment-pad",
  );
  assert.equal(workflow.name, "North equipment pad");

  assert.deepEqual(workflow.inputs, {
    length: 40,
    width: 60,
    thickness: 6,
    wastePercent: 10,
  });

  assert.deepEqual(
    workflow.selectedStepIds,
    ["concrete", "labor"],
  );

  assert.equal(
    workflow.results.concrete.stepId,
    "concrete",
  );

  assert.equal(
    workflow.results.concrete.result,
    calculationResult,
  );
});

test("maps universal workflow state back to Concrete project state", () => {
  const workflow =
    concreteProjectToWorkflowContext(makeProject());

  const project =
    workflowContextToConcreteProject(
      workflow,
      "metric",
    );

  assert.equal(
    project.recipeId,
    "concrete-slab-equipment-pad",
  );
  assert.equal(project.projectName, "North equipment pad");
  assert.equal(project.unitSystem, "metric");

  assert.deepEqual(project.inputs, {
    length: 40,
    width: 60,
    thickness: 6,
    wastePercent: 10,
  });

  assert.deepEqual(
    project.selectedScopeIds,
    ["concrete", "labor"],
  );

  assert.deepEqual(
    project.scopeResults.concrete,
    projectScopeResult,
  );
});

test("Concrete project round trip preserves production state", () => {
  const original = makeProject();

  const restored =
    workflowContextToConcreteProject(
      concreteProjectToWorkflowContext(original),
      original.unitSystem,
    );

  assert.deepEqual(restored, original);
});

test("workflow to project defaults unit system to imperial", () => {
  const workflow =
    concreteProjectToWorkflowContext(makeProject());

  const project =
    workflowContextToConcreteProject(workflow);

  assert.equal(project.unitSystem, "imperial");
});

test("adapter conversion does not mutate project state", () => {
  const project = makeProject();

  const originalInputs = { ...project.inputs };
  const originalSelected = [...project.selectedScopeIds];
  const originalResults = { ...project.scopeResults };

  const workflow =
    concreteProjectToWorkflowContext(project);

  workflow.inputs.length = 100;
  workflow.selectedStepIds.push("base");
  workflow.results = {};

  assert.deepEqual(project.inputs, originalInputs);
  assert.deepEqual(
    project.selectedScopeIds,
    originalSelected,
  );
  assert.deepEqual(
    project.scopeResults,
    originalResults,
  );
});
