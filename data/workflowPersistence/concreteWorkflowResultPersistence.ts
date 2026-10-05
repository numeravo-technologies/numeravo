import type { CalculationResult } from "../calculationResult";
import {
  concreteProjectToWorkflowContext,
  workflowContextToConcreteProject,
} from "../workflowAdapters/concreteProjectWorkflowAdapter";
import { setWorkflowResult } from "../workflowContext";
import { createWorkflowResult } from "../workflowResult";
import { loadProjectSession, saveProjectSession } from "../projectSession";

const PROJECT_RECIPE_ID = "concrete-slab-equipment-pad";

export function saveConcreteWorkflowResult({
  stepId,
  result,
  updatedAt,
}: {
  stepId: string;
  result: CalculationResult;
  updatedAt: string;
}): boolean {
  const project = loadProjectSession(PROJECT_RECIPE_ID);

  if (!project) {
    return false;
  }

  const workflow = concreteProjectToWorkflowContext(project);

  const workflowResult = createWorkflowResult({
    stepId,
    result,
    updatedAt,
  });

  const updatedWorkflow = setWorkflowResult(workflow, workflowResult);

  saveProjectSession(
    workflowContextToConcreteProject(updatedWorkflow, project.unitSystem),
  );

  return true;
}
