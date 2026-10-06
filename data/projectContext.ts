import { calculateImperialConcreteVolume } from "../lib/calculations/concreteVolume";
import type { ProjectScopeResult } from "./projectScopeResult";
import type {
  ProjectInputKey,
  ProjectRecipeId,
} from "./projectRecipes";

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
  scopeResults: Record<string, ProjectScopeResult>;
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
    scopeResults: {},
  };
}

export function getProjectConcreteYards(
  project: ProjectContext,
): number | null {
  const length = project.inputs.length;
  const width = project.inputs.width;
  const thickness = project.inputs.thickness;

  if (
    length === undefined ||
    width === undefined ||
    thickness === undefined
  ) {
    return null;
  }

  if (
    !Number.isFinite(length) ||
    !Number.isFinite(width) ||
    !Number.isFinite(thickness) ||
    length < 0 ||
    width < 0 ||
    thickness < 0
  ) {
    return null;
  }

  const result = calculateImperialConcreteVolume({
    lengthFeet: length,
    widthFeet: width,
    thicknessInches: thickness,
    wastePercent: project.inputs.wastePercent ?? 0,
  });

  return result.volumeWithWaste;
}
