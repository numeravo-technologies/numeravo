import assert from "node:assert/strict";
import test from "node:test";

import {
  concreteSlabEquipmentPadWorkflowDefinition,
} from "../../data/workflowDefinitions/concreteSlabEquipmentPad.ts";
import {
  validateWorkflowDefinition,
} from "../../data/workflowDefinition.ts";
import {
  getProjectRecipeById,
} from "../../data/projectRecipes.ts";

test("Concrete workflow definition has the expected identity", () => {
  assert.equal(
    concreteSlabEquipmentPadWorkflowDefinition.id,
    "construction.concrete-slab-equipment-pad",
  );
  assert.equal(
    concreteSlabEquipmentPadWorkflowDefinition.vertical,
    "construction",
  );
  assert.equal(
    concreteSlabEquipmentPadWorkflowDefinition.terminology,
    "project",
  );
  assert.equal(
    concreteSlabEquipmentPadWorkflowDefinition.title,
    "Concrete Slab / Equipment Pad",
  );
});

test("Concrete workflow definition preserves the four shared inputs", () => {
  assert.deepEqual(
    concreteSlabEquipmentPadWorkflowDefinition.inputs.map(
      (input) => input.key,
    ),
    ["length", "width", "thickness", "wastePercent"],
  );
});

test("Concrete workflow definition preserves the nine workflow steps", () => {
  assert.deepEqual(
    concreteSlabEquipmentPadWorkflowDefinition.steps.map(
      (step) => step.id,
    ),
    [
      "concrete",
      "base",
      "reinforcement",
      "formwork",
      "delivery",
      "pumping",
      "labor",
      "finishing",
      "joints",
    ],
  );
});

test("Concrete workflow definition preserves calculator mappings", () => {
  assert.deepEqual(
    concreteSlabEquipmentPadWorkflowDefinition.steps.map(
      ({ id, calculatorId }) => [id, calculatorId],
    ),
    [
      ["concrete", "concrete-calculator"],
      ["base", "gravel-calculator"],
      [
        "reinforcement",
        "rebar-spacing-for-concrete-slab",
      ],
      ["formwork", "concrete-formwork-calculator"],
      ["delivery", "concrete-truckload-calculator"],
      [
        "pumping",
        "concrete-pump-truck-cost-calculator",
      ],
      ["labor", "concrete-labor-cost-calculator"],
      [
        "finishing",
        "concrete-finishing-cost-calculator",
      ],
      ["joints", "concrete-saw-cut-calculator"],
    ],
  );
});

test("Concrete workflow definition passes universal validation", () => {
  assert.deepEqual(
    validateWorkflowDefinition(
      concreteSlabEquipmentPadWorkflowDefinition,
    ),
    [],
  );
});

test("Concrete workflow definition matches the existing Project recipe", () => {
  const recipe = getProjectRecipeById(
    "concrete-slab-equipment-pad",
  );

  assert.ok(recipe);

  assert.equal(
    concreteSlabEquipmentPadWorkflowDefinition.title,
    recipe.title,
  );
  assert.equal(
    concreteSlabEquipmentPadWorkflowDefinition.description,
    recipe.description,
  );

  assert.deepEqual(
    concreteSlabEquipmentPadWorkflowDefinition.inputs,
    recipe.coreInputs,
  );

  assert.deepEqual(
    concreteSlabEquipmentPadWorkflowDefinition.steps,
    recipe.scope.map(
      ({
        id,
        label,
        description,
        calculatorId,
      }) => ({
        id,
        label,
        description,
        calculatorId,
      }),
    ),
  );
});
