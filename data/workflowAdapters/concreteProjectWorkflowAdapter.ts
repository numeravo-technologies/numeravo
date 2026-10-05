import type {
  ProjectContext,
  ProjectUnitSystem,
} from "../projectContext";
import type { ProjectScopeResult } from "../projectScopeResult";
import type { WorkflowContext } from "../workflowContext";
import type { WorkflowResult } from "../workflowResult";

const PROJECT_RECIPE_ID = "concrete-slab-equipment-pad";
const WORKFLOW_DEFINITION_ID =
  "construction.concrete-slab-equipment-pad";

export function projectScopeResultToWorkflowResult(
  scopeResult: ProjectScopeResult,
): WorkflowResult {
  return {
    stepId: scopeResult.scopeId,
    calculatorId: scopeResult.calculatorId,
    calculatorTitle: scopeResult.calculatorTitle,
    result: scopeResult.result,
    updatedAt: scopeResult.updatedAt,
  };
}

export function workflowResultToProjectScopeResult(
  workflowResult: WorkflowResult,
): ProjectScopeResult {
  return {
    scopeId: workflowResult.stepId,
    calculatorId: workflowResult.calculatorId,
    calculatorTitle: workflowResult.calculatorTitle,
    result: workflowResult.result,
    updatedAt: workflowResult.updatedAt,
  };
}

export function concreteProjectToWorkflowContext(
  project: ProjectContext,
): WorkflowContext {
  const results = Object.fromEntries(
    Object.entries(project.scopeResults).map(
      ([scopeId, scopeResult]) => [
        scopeId,
        projectScopeResultToWorkflowResult(scopeResult),
      ],
    ),
  );

  return {
    definitionId: WORKFLOW_DEFINITION_ID,
    name: project.projectName,
    inputs: { ...project.inputs },
    selectedStepIds: [...project.selectedScopeIds],
    results,
  };
}

export function workflowContextToConcreteProject(
  workflow: WorkflowContext,
  unitSystem: ProjectUnitSystem = "imperial",
): ProjectContext {
  const scopeResults = Object.fromEntries(
    Object.entries(workflow.results).map(
      ([stepId, workflowResult]) => [
        stepId,
        workflowResultToProjectScopeResult(workflowResult),
      ],
    ),
  );

  return {
    recipeId: PROJECT_RECIPE_ID,
    projectName: workflow.name,
    unitSystem,
    inputs: {
      length: numberInput(workflow.inputs.length),
      width: numberInput(workflow.inputs.width),
      thickness: numberInput(workflow.inputs.thickness),
      wastePercent: numberInput(
        workflow.inputs.wastePercent,
      ),
    },
    selectedScopeIds: [...workflow.selectedStepIds],
    scopeResults,
  };
}

function numberInput(
  value: WorkflowContext["inputs"][string],
): number | undefined {
  return typeof value === "number" ? value : undefined;
}
