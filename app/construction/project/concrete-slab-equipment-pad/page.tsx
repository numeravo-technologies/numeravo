import { notFound } from "next/navigation";

import CalculatorPageShell from "@/components/calculators/CalculatorPageShell";
import { getCalculatorById } from "@/data/calculators";
import { getProjectRecipeById } from "@/data/projectRecipes";

import ProjectWorkflowClient from "./ProjectWorkflowClient";

export const metadata = {
  title: "Concrete Slab & Equipment Pad Project Planner",
  description:
    "Plan the scope of a concrete slab or equipment pad project across concrete quantity, base, reinforcement, forms, delivery, pumping, labor, finishing, and saw cuts.",
  alternates: {
    canonical:
      "https://numeravo.com/construction/project/concrete-slab-equipment-pad",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ConcreteSlabEquipmentPadProjectPage() {
  const recipe = getProjectRecipeById("concrete-slab-equipment-pad");

  if (!recipe) {
    notFound();
  }

  const scope = recipe.scope
    .map((component) => {
      const calculator = getCalculatorById(component.calculatorId);

      if (!calculator) {
        return null;
      }

      return {
        id: component.id,
        label: component.label,
        description: component.description,
        calculatorId: component.calculatorId,
        calculatorTitle: calculator.title,
        calculatorHref: calculator.href,
      };
    })
    .filter((component) => component !== null);

  return (
    <CalculatorPageShell>
      <ProjectWorkflowClient
        recipeId={recipe.id}
        title={recipe.title}
        description={recipe.description}
        coreInputs={recipe.coreInputs}
        scope={scope}
      />
    </CalculatorPageShell>
  );
}
