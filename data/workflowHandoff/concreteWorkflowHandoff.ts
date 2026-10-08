import type { WorkflowContext } from "../workflowContext";
import { calculateImperialConcreteVolume } from "../../lib/calculations/concreteVolume";

export type ConcreteWorkflowCalculatorHandoffItem = {
  calculatorId: string;
  calculatorHref: string;
};

const PROJECT_RECIPE_ID = "concrete-slab-equipment-pad";

const supportedCalculatorIds = new Set([
  "concrete-calculator",
  "gravel-calculator",
  "rebar-spacing-for-concrete-slab",
  "concrete-formwork-calculator",
  "concrete-truckload-calculator",
  "concrete-pump-truck-cost-calculator",
  "concrete-labor-cost-calculator",
  "concrete-finishing-cost-calculator",
  "concrete-saw-cut-calculator",
]);

function numericInput(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function concreteYards(workflow: WorkflowContext): number | null {
  const length = numericInput(workflow.inputs.length);
  const width = numericInput(workflow.inputs.width);
  const thickness = numericInput(workflow.inputs.thickness);

  if (
    length === undefined ||
    width === undefined ||
    thickness === undefined ||
    length < 0 ||
    width < 0 ||
    thickness < 0
  ) {
    return null;
  }

  const wastePercent =
    numericInput(workflow.inputs.wastePercent) ?? 0;

  return calculateImperialConcreteVolume({
    lengthFeet: length,
    widthFeet: width,
    thicknessInches: thickness,
    wastePercent,
  }).volumeWithWaste;
}

export function getConcreteWorkflowCalculatorHref(
  item: ConcreteWorkflowCalculatorHandoffItem,
  workflow: WorkflowContext,
): string {
  if (!supportedCalculatorIds.has(item.calculatorId)) {
    return item.calculatorHref;
  }

  const params = new URLSearchParams({
    fromProject: PROJECT_RECIPE_ID,
  });

  const length = numericInput(workflow.inputs.length);
  const width = numericInput(workflow.inputs.width);
  const thickness = numericInput(workflow.inputs.thickness);
  const wastePercent = numericInput(workflow.inputs.wastePercent);

  const usesDimensions =
    item.calculatorId !== "concrete-pump-truck-cost-calculator";

  if (usesDimensions && length !== undefined) {
    params.set("length", String(length));
  }

  if (usesDimensions && width !== undefined) {
    params.set("width", String(width));
  }

  if (
    [
      "concrete-calculator",
      "concrete-truckload-calculator",
      "concrete-labor-cost-calculator",
      "concrete-saw-cut-calculator",
    ].includes(item.calculatorId) &&
    thickness !== undefined
  ) {
    params.set("thickness", String(thickness));
  }

  if (
    [
      "concrete-calculator",
      "gravel-calculator",
      "concrete-formwork-calculator",
      "concrete-truckload-calculator",
    ].includes(item.calculatorId) &&
    wastePercent !== undefined
  ) {
    params.set("waste", String(wastePercent));
  }

  if (item.calculatorId === "concrete-pump-truck-cost-calculator") {
    const yards = concreteYards(workflow);

    if (yards !== null) {
      params.set("yards", String(yards));
    }
  }

  return `${item.calculatorHref}?${params.toString()}`;
}
