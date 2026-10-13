import {
  CONCRETE_WORKFLOW_SCOPE_CALCULATORS,
  type ConcreteWorkflowStepId,
  type ProjectInputKey,
} from "./workflowResultProvenance";

export type WorkflowFreshnessDependency = {
  stepId: ConcreteWorkflowStepId;
  calculatorId: string;
  projectInputKeys: readonly ProjectInputKey[];
  verification:
    | "direct"
    | "derived-volume"
    | "mode-sensitive";
};

const dependencies: {
  [Step in ConcreteWorkflowStepId]:
    WorkflowFreshnessDependency;
} = {
  concrete: {
    stepId: "concrete",
    calculatorId: "concrete-calculator",
    projectInputKeys: [
      "length",
      "width",
      "thickness",
      "wastePercent",
    ],
    verification: "direct",
  },
  base: {
    stepId: "base",
    calculatorId: "gravel-calculator",
    projectInputKeys: [
      "length",
      "width",
      "wastePercent",
    ],
    verification: "direct",
  },
  reinforcement: {
    stepId: "reinforcement",
    calculatorId: "rebar-spacing-for-concrete-slab",
    projectInputKeys: ["length", "width"],
    verification: "direct",
  },
  formwork: {
    stepId: "formwork",
    calculatorId: "concrete-formwork-calculator",
    projectInputKeys: [
      "length",
      "width",
      "wastePercent",
    ],
    verification: "direct",
  },
  delivery: {
    stepId: "delivery",
    calculatorId: "concrete-truckload-calculator",
    projectInputKeys: [
      "length",
      "width",
      "thickness",
      "wastePercent",
    ],
    verification: "mode-sensitive",
  },
  pumping: {
    stepId: "pumping",
    calculatorId: "concrete-pump-truck-cost-calculator",
    projectInputKeys: [
      "length",
      "width",
      "thickness",
      "wastePercent",
    ],
    verification: "derived-volume",
  },
  labor: {
    stepId: "labor",
    calculatorId: "concrete-labor-cost-calculator",
    projectInputKeys: [
      "length",
      "width",
      "thickness",
    ],
    verification: "direct",
  },
  finishing: {
    stepId: "finishing",
    calculatorId: "concrete-finishing-cost-calculator",
    projectInputKeys: ["length", "width"],
    verification: "direct",
  },
  joints: {
    stepId: "joints",
    calculatorId: "concrete-saw-cut-calculator",
    projectInputKeys: [
      "length",
      "width",
      "thickness",
    ],
    verification: "direct",
  },
};

export function getWorkflowFreshnessDependency(
  stepId: string,
): WorkflowFreshnessDependency | null {
  if (
    !Object.prototype.hasOwnProperty.call(
      dependencies,
      stepId,
    )
  ) {
    return null;
  }

  const dependency =
    dependencies[stepId as ConcreteWorkflowStepId];

  if (
    dependency.calculatorId !==
    CONCRETE_WORKFLOW_SCOPE_CALCULATORS[
      dependency.stepId
    ]
  ) {
    return null;
  }

  return {
    ...dependency,
    projectInputKeys: [...dependency.projectInputKeys],
  };
}

export function getAllWorkflowFreshnessDependencies():
  WorkflowFreshnessDependency[] {
  return Object.keys(dependencies).map((stepId) => {
    const dependency =
      getWorkflowFreshnessDependency(stepId);

    if (dependency === null) {
      throw new Error(
        `Invalid workflow dependency: ${stepId}`,
      );
    }

    return dependency;
  });
}
