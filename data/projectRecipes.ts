import {
  getCalculatorById,
  type CalculatorRecord,
  type ConstructionWorkflowStage,
} from "@/data/calculators";

export type ProjectRecipeId = "concrete-slab-equipment-pad";

export type ProjectInputKey =
  | "length"
  | "width"
  | "thickness"
  | "wastePercent";

export type ProjectRecipeInput = {
  key: ProjectInputKey;
  label: string;
  description: string;
};

export type ProjectScopeComponent = {
  id: string;
  label: string;
  description: string;
  workflowStage: ConstructionWorkflowStage;
  calculatorId: string;
};

export type ProjectRecipeRecord = {
  id: ProjectRecipeId;
  title: string;
  description: string;
  coreInputs: ProjectRecipeInput[];
  scope: ProjectScopeComponent[];
};

export const projectRecipes: ProjectRecipeRecord[] = [
  {
    id: "concrete-slab-equipment-pad",
    title: "Concrete Slab / Equipment Pad",
    description:
      "Plan a slab or equipment pad by carrying the same project dimensions through concrete quantity, base, reinforcement, forms, delivery, placement, labor, finishing, and joint calculations.",
    coreInputs: [
      {
        key: "length",
        label: "Length",
        description: "Overall project length.",
      },
      {
        key: "width",
        label: "Width",
        description: "Overall project width.",
      },
      {
        key: "thickness",
        label: "Thickness",
        description: "Concrete slab thickness.",
      },
      {
        key: "wastePercent",
        label: "Waste",
        description: "Additional material allowance used for project planning.",
      },
    ],
    scope: [
      {
        id: "concrete",
        label: "Concrete quantity",
        description: "Calculate concrete volume and order quantity.",
        workflowStage: "concrete-quantity",
        calculatorId: "concrete-calculator",
      },
      {
        id: "base",
        label: "Base material",
        description: "Estimate gravel or aggregate base material.",
        workflowStage: "base",
        calculatorId: "gravel-calculator",
      },
      {
        id: "reinforcement",
        label: "Reinforcement",
        description: "Estimate slab rebar layout, quantity, weight, and material.",
        workflowStage: "reinforcement",
        calculatorId: "rebar-spacing-for-concrete-slab",
      },
      {
        id: "formwork",
        label: "Formwork",
        description: "Estimate forms, stakes, bracing, fasteners, and formwork cost.",
        workflowStage: "formwork",
        calculatorId: "concrete-formwork-calculator",
      },
      {
        id: "delivery",
        label: "Delivery and truckloads",
        description: "Estimate concrete truckloads and delivery requirements.",
        workflowStage: "delivery",
        calculatorId: "concrete-truckload-calculator",
      },
      {
        id: "pumping",
        label: "Pumping",
        description: "Estimate pump truck cost when pumping is part of the project.",
        workflowStage: "placement",
        calculatorId: "concrete-pump-truck-cost-calculator",
      },
      {
        id: "labor",
        label: "Labor",
        description: "Estimate crew time, production, and labor cost.",
        workflowStage: "labor",
        calculatorId: "concrete-labor-cost-calculator",
      },
      {
        id: "finishing",
        label: "Finishing",
        description: "Estimate concrete finishing labor and project cost.",
        workflowStage: "finishing",
        calculatorId: "concrete-finishing-cost-calculator",
      },
      {
        id: "joints",
        label: "Saw cuts and joints",
        description: "Estimate saw-cut layout, length, depth, and cutting cost.",
        workflowStage: "joints",
        calculatorId: "concrete-saw-cut-calculator",
      },
    ],
  },
];

export function getProjectRecipeById(id: ProjectRecipeId) {
  return projectRecipes.find((recipe) => recipe.id === id);
}

export function getProjectRecipeCalculators(
  id: ProjectRecipeId,
): CalculatorRecord[] {
  const recipe = getProjectRecipeById(id);

  if (!recipe) {
    return [];
  }

  return recipe.scope
    .map((component) => getCalculatorById(component.calculatorId))
    .filter(
      (calculator): calculator is CalculatorRecord =>
        calculator !== undefined,
    );
}

export type ProjectRecipeIssue = {
  recipeId: string;
  componentId?: string;
  detail: string;
};

export function validateProjectRecipes(): ProjectRecipeIssue[] {
  const issues: ProjectRecipeIssue[] = [];

  for (const recipe of projectRecipes) {
    const componentIds = new Set<string>();

    for (const component of recipe.scope) {
      if (componentIds.has(component.id)) {
        issues.push({
          recipeId: recipe.id,
          componentId: component.id,
          detail: `Duplicate scope component id: ${component.id}`,
        });
      }

      componentIds.add(component.id);

      if (!getCalculatorById(component.calculatorId)) {
        issues.push({
          recipeId: recipe.id,
          componentId: component.id,
          detail: `Calculator does not exist: ${component.calculatorId}`,
        });
      }
    }
  }

  return issues;
}
