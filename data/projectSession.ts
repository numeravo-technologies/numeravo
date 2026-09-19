import {
  createProjectContext,
  type ProjectContext,
} from "@/data/projectContext";
import type { ProjectRecipeId } from "@/data/projectRecipes";

const PROJECT_SESSION_PREFIX = "numeravo:project:";

function getProjectSessionKey(recipeId: ProjectRecipeId) {
  return `${PROJECT_SESSION_PREFIX}${recipeId}`;
}

export function saveProjectSession(project: ProjectContext) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    getProjectSessionKey(project.recipeId),
    JSON.stringify(project),
  );
}

export function loadProjectSession(
  recipeId: ProjectRecipeId,
): ProjectContext | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.sessionStorage.getItem(
    getProjectSessionKey(recipeId),
  );

  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<ProjectContext>;

    if (parsed.recipeId !== recipeId) {
      return null;
    }

    const fallback = createProjectContext(recipeId);

    return {
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
    };
  } catch {
    return null;
  }
}
