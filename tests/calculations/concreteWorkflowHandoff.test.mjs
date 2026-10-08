import test from "node:test";
import assert from "node:assert/strict";

import {
  getConcreteWorkflowCalculatorHref,
} from "../../data/workflowHandoff/concreteWorkflowHandoff.ts";

import {
  createWorkflowContext,
} from "../../data/workflowContext.ts";

const workflow = {
  ...createWorkflowContext(
    "construction.concrete-slab-equipment-pad",
  ),
  inputs: {
    length: 40,
    width: 60,
    thickness: 6,
    wastePercent: 10,
  },
};

const cases = [
  ["concrete-calculator", "length=40&width=60&thickness=6&waste=10"],
  ["gravel-calculator", "length=40&width=60&waste=10"],
  ["rebar-spacing-for-concrete-slab", "length=40&width=60"],
  ["concrete-formwork-calculator", "length=40&width=60&waste=10"],
  ["concrete-truckload-calculator", "length=40&width=60&thickness=6&waste=10"],
  ["concrete-pump-truck-cost-calculator", "yards=48.88888888888889"],
  ["concrete-labor-cost-calculator", "length=40&width=60&thickness=6"],
  ["concrete-finishing-cost-calculator", "length=40&width=60"],
  ["concrete-saw-cut-calculator", "length=40&width=60&thickness=6"],
];

function href(calculatorId, context = workflow) {
  return getConcreteWorkflowCalculatorHref(
    {
      calculatorId,
      calculatorHref: `/construction/${calculatorId}`,
    },
    context,
  );
}

for (const [calculatorId, expectedParams] of cases) {
  test(`${calculatorId} preserves legacy handoff URL`, () => {
    assert.equal(
      href(calculatorId),
      `/construction/${calculatorId}?fromProject=concrete-slab-equipment-pad&${expectedParams}`,
    );
  });
}

test("unsupported calculator returns unchanged URL", () => {
  assert.equal(
    href("unsupported-calculator"),
    "/construction/unsupported-calculator",
  );
});

test("missing thickness omits derived pump yards", () => {
  const context = {
    ...workflow,
    inputs: { length: 40, width: 60 },
  };

  assert.equal(
    href("concrete-pump-truck-cost-calculator", context),
    "/construction/concrete-pump-truck-cost-calculator?fromProject=concrete-slab-equipment-pad",
  );
});

test("negative dimensions omit derived pump yards", () => {
  const context = {
    ...workflow,
    inputs: { ...workflow.inputs, length: -1 },
  };

  assert.equal(
    href("concrete-pump-truck-cost-calculator", context),
    "/construction/concrete-pump-truck-cost-calculator?fromProject=concrete-slab-equipment-pad",
  );
});

test("non-numeric dimensions omit derived pump yards", () => {
  const context = {
    ...workflow,
    inputs: { ...workflow.inputs, length: "40" },
  };

  assert.equal(
    href("concrete-pump-truck-cost-calculator", context),
    "/construction/concrete-pump-truck-cost-calculator?fromProject=concrete-slab-equipment-pad",
  );
});

test("zero dimensions preserve zero-yard handoff", () => {
  const context = {
    ...workflow,
    inputs: { ...workflow.inputs, length: 0 },
  };

  assert.equal(
    href("concrete-pump-truck-cost-calculator", context),
    "/construction/concrete-pump-truck-cost-calculator?fromProject=concrete-slab-equipment-pad&yards=0",
  );
});
