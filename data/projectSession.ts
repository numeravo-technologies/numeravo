import {
  createProjectContext,
  type ProjectContext,
} from "./projectContext";
import {
  isProjectScopeResult,
  type ProjectScopeResult,
} from "./projectScopeResult";
import type { ProjectRecipeId } from "./projectRecipes";

const PROJECT_SESSION_PREFIX = "numeravo:project:";

function normalizeScopeResults(
  value: unknown,
): Record<string, ProjectScopeResult> {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      ([key, scopeResult]) =>
        typeof key === "string" &&
        isProjectScopeResult(scopeResult),
    ),
  );
}

function getProjectSessionKey(recipeId: ProjectRecipeId) {
  return `${PROJECT_SESSION_PREFIX}${recipeId}`;
}

export function saveProjectSession(project: ProjectContext): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.sessionStorage.setItem(
      getProjectSessionKey(project.recipeId),
      JSON.stringify(project),
    );
    return true;
  } catch {
    return false;
  }
}

function readProjectSession(
  recipeId: ProjectRecipeId,
): {
  status: "missing" | "readable" | "error";
  project: ProjectContext | null;
} {
  if (typeof window === "undefined") {
    return { status: "error", project: null };
  }

  try {
    const stored = window.sessionStorage.getItem(
      getProjectSessionKey(recipeId),
    );

    if (stored === null) {
      return { status: "missing", project: null };
    }

    if (!stored) {
      return { status: "error", project: null };
    }

    const parsed = JSON.parse(stored) as Partial<ProjectContext>;

    if (parsed.recipeId !== recipeId) {
      return { status: "error", project: null };
    }

    const fallback = createProjectContext(recipeId);

    return {
      status: "readable",
      project: {
        ...fallback,
        ...parsed,
        recipeId,
        projectName:
          typeof parsed.projectName === "string"
            ? parsed.projectName
            : fallback.projectName,
        unitSystem:
          parsed.unitSystem === "metric" ? "metric" : "imperial",
        inputs:
          parsed.inputs &&
          typeof parsed.inputs === "object"
            ? parsed.inputs
            : {},
        selectedScopeIds: Array.isArray(parsed.selectedScopeIds)
          ? parsed.selectedScopeIds.filter(
              (id): id is string => typeof id === "string",
            )
          : [],
        scopeResults: normalizeScopeResults(parsed.scopeResults),
      },
    };
  } catch {
    return { status: "error", project: null };
  }
}

export function inspectProjectSession(
  recipeId: ProjectRecipeId,
): {
  status: "missing" | "readable" | "error";
  project: ProjectContext | null;
} {
  return readProjectSession(recipeId);
}

export function loadProjectSession(
  recipeId: ProjectRecipeId,
): ProjectContext | null {
  return readProjectSession(recipeId).project;
}
