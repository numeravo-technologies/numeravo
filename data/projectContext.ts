import type {
  ProjectInputKey,
  ProjectRecipeId,
  ProjectScopeComponent,
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
  component: ProjectScopeComponent,
) {
  return project.selectedScopeIds.includes(component.id);
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
