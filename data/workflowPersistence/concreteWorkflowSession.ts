import type { ProjectUnitSystem } from "../projectContext";
import { loadProjectSession } from "../projectSession";
import { concreteProjectToWorkflowContext } from "../workflowAdapters/concreteProjectWorkflowAdapter";
import type { WorkflowContext } from "../workflowContext";

const PROJECT_RECIPE_ID = "concrete-slab-equipment-pad";

export type ConcreteWorkflowSession = {
  workflow: WorkflowContext;
  unitSystem: ProjectUnitSystem;
};

export function loadConcreteWorkflowSession(): ConcreteWorkflowSession | null {
  const project = loadProjectSession(PROJECT_RECIPE_ID);

  if (!project) {
    return null;
  }

  return {
    workflow: concreteProjectToWorkflowContext(project),
    unitSystem: project.unitSystem,
  };
}
