import {
  getProjectConcreteYards,
  type ProjectContext,
} from "./projectContext";

export type ProjectCalculatorHandoffItem = {
  calculatorId: string;
  calculatorHref: string;
};

const supportedCalculatorIds = new Set([
  "concrete-calculator",
  "gravel-calculator",
  "rebar-spacing-for-concrete-slab",
  "concrete-formwork-calculator",
  "concrete-truckload-calculator",
  "concrete-pump-truck-cost-calculator",
  "concrete-labor-cost-calculator",
  "concrete-finishing-cost-calculator",
]);

export function getProjectCalculatorHref(
  item: ProjectCalculatorHandoffItem,
  project: ProjectContext,
) {
  if (!supportedCalculatorIds.has(item.calculatorId)) {
    return item.calculatorHref;
  }

  const params = new URLSearchParams({
    fromProject: project.recipeId,
  });

  const length = project.inputs.length;
  const width = project.inputs.width;
  const thickness = project.inputs.thickness;
  const wastePercent = project.inputs.wastePercent;

  const usesDimensions =
    item.calculatorId !==
    "concrete-pump-truck-cost-calculator";

  if (usesDimensions && length !== undefined) {
    params.set("length", String(length));
  }

  if (usesDimensions && width !== undefined) {
    params.set("width", String(width));
  }

  if (
    (item.calculatorId === "concrete-calculator" ||
      item.calculatorId === "concrete-truckload-calculator" ||
      item.calculatorId === "concrete-labor-cost-calculator") &&
    thickness !== undefined
  ) {
    params.set("thickness", String(thickness));
  }

  if (
    (item.calculatorId === "concrete-calculator" ||
      item.calculatorId === "gravel-calculator" ||
      item.calculatorId === "concrete-formwork-calculator" ||
      item.calculatorId === "concrete-truckload-calculator") &&
    wastePercent !== undefined
  ) {
    params.set("waste", String(wastePercent));
  }

  if (
    item.calculatorId ===
    "concrete-pump-truck-cost-calculator"
  ) {
    const concreteYards =
      getProjectConcreteYards(project);

    if (concreteYards !== null) {
      params.set(
        "yards",
        String(concreteYards),
      );
    }
  }

  return `${item.calculatorHref}?${params.toString()}`;
}
