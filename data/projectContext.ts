import type {
  ProjectInputKey,
  ProjectRecipeId,
} from "@/data/projectRecipes";

export type ProjectUnitSystem = "imperial" | "metric";

export type ProjectInputValues = Partial<
  Record<ProjectInputKey, number>
>;

export type ProjectContext = {
  recipeId: ProjectRecipeId;
  projectName: string;
  unitSystem: ProjectUnitSystem;
  inputs: ProjectInputValues;
  selectedScopeIds: string[];
};

export function createProjectContext(
  recipeId: ProjectRecipeId,
): ProjectContext {
  return {
    recipeId,
    projectName: "",
    unitSystem: "imperial",
    inputs: {},
    selectedScopeIds: [],
  };
}

export function isScopeComponentSelected(
  project: ProjectContext,
  componentId: string,
) {
  return project.selectedScopeIds.includes(componentId);
}

export function toggleScopeComponent(
  project: ProjectContext,
  componentId: string,
): ProjectContext {
  const isSelected = project.selectedScopeIds.includes(componentId);

  return {
    ...project,
    selectedScopeIds: isSelected
      ? project.selectedScopeIds.filter((id) => id !== componentId)
      : [...project.selectedScopeIds, componentId],
  };
}

export function setProjectInput(
  project: ProjectContext,
  key: ProjectInputKey,
  value: number,
): ProjectContext {
  return {
    ...project,
    inputs: {
      ...project.inputs,
      [key]: value,
    },
  };
}
