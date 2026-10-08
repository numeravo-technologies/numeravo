import type { ProjectUnitSystem } from "../projectContext";
import { loadProjectSession, saveProjectSession } from "../projectSession";
import {
  concreteProjectToWorkflowContext,
  workflowContextToConcreteProject,
} from "../workflowAdapters/concreteProjectWorkflowAdapter";
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


export function saveConcreteWorkflowSession({
  workflow,
  unitSystem,
}: ConcreteWorkflowSession): boolean {
  const existing = loadProjectSession(PROJECT_RECIPE_ID);

  const project = workflowContextToConcreteProject(
    workflow,
    unitSystem,
  );

  if (existing) {
    project.scopeResults = {
      ...project.scopeResults,
      ...existing.scopeResults,
    };
  }

  return saveProjectSession(project);
}
