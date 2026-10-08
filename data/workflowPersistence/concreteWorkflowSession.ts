import type { ProjectUnitSystem } from "../projectContext";
import { inspectProjectSession, loadProjectSession, saveProjectSession } from "../projectSession";
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


export function inspectConcreteWorkflowSession(): {
  status: "missing" | "readable" | "error";
  session: ConcreteWorkflowSession | null;
} {
  const { status, project } =
    inspectProjectSession(PROJECT_RECIPE_ID);

  if (status !== "readable" || !project) {
    return {
      status: status === "readable" ? "error" : status,
      session: null,
    };
  }

  try {
    return {
      status: "readable",
      session: {
        workflow: concreteProjectToWorkflowContext(project),
        unitSystem: project.unitSystem,
      },
    };
  } catch {
    return { status: "error", session: null };
  }
}

export function saveConcreteWorkflowSession({
  workflow,
  unitSystem,
}: ConcreteWorkflowSession): boolean {
  const { status, project: existing } =
    inspectProjectSession(PROJECT_RECIPE_ID);

  if (status === "error") {
    return false;
  }

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
