import test from "node:test";
import assert from "node:assert/strict";

import {
  getProjectCalculatorHref,
} from "../../data/projectHandoff.ts";

import {
  createProjectContext,
  getProjectConcreteYards,
} from "../../data/projectContext.ts";

const project = {
  ...createProjectContext(
    "concrete-slab-equipment-pad",
  ),
  inputs: {
    length: 40,
    width: 60,
    thickness: 6,
    wastePercent: 10,
  },
};

function href(calculatorId, calculatorHref) {
  return getProjectCalculatorHref(
    {
      calculatorId,
      calculatorHref,
    },
    project,
  );
}

test("project concrete volume preserves 40x60x6 with 10 percent waste", () => {
  const yards =
    getProjectConcreteYards(project);

  assert.ok(
    Math.abs(
      yards -
        48.88888888888889,
    ) < 1e-12,
  );
});

test("concrete calculator receives dimensions thickness and waste", () => {
  assert.equal(
    href(
      "concrete-calculator",
      "/construction/concrete-calculator",
    ),
    "/construction/concrete-calculator?fromProject=concrete-slab-equipment-pad&length=40&width=60&thickness=6&waste=10",
  );
});

test("base calculator receives dimensions and waste", () => {
  assert.equal(
    href(
      "gravel-calculator",
      "/construction/gravel-calculator",
    ),
    "/construction/gravel-calculator?fromProject=concrete-slab-equipment-pad&length=40&width=60&waste=10",
  );
});

test("reinforcement calculator receives slab dimensions only", () => {
  assert.equal(
    href(
      "rebar-spacing-for-concrete-slab",
      "/construction/rebar-spacing-for-concrete-slab",
    ),
    "/construction/rebar-spacing-for-concrete-slab?fromProject=concrete-slab-equipment-pad&length=40&width=60",
  );
});

test("formwork calculator receives dimensions and waste", () => {
  assert.equal(
    href(
      "concrete-formwork-calculator",
      "/construction/concrete-formwork-calculator",
    ),
    "/construction/concrete-formwork-calculator?fromProject=concrete-slab-equipment-pad&length=40&width=60&waste=10",
  );
});

test("delivery calculator receives dimensions thickness and waste", () => {
  assert.equal(
    href(
      "concrete-truckload-calculator",
      "/construction/concrete-truckload-calculator",
    ),
    "/construction/concrete-truckload-calculator?fromProject=concrete-slab-equipment-pad&length=40&width=60&thickness=6&waste=10",
  );
});

test("pump calculator receives derived concrete yards only", () => {
  assert.equal(
    href(
      "concrete-pump-truck-cost-calculator",
      "/construction/concrete-pump-truck-cost-calculator",
    ),
    "/construction/concrete-pump-truck-cost-calculator?fromProject=concrete-slab-equipment-pad&yards=48.88888888888889",
  );
});

test("labor calculator receives dimensions and thickness", () => {
  assert.equal(
    href(
      "concrete-labor-cost-calculator",
      "/construction/concrete-labor-cost-calculator",
    ),
    "/construction/concrete-labor-cost-calculator?fromProject=concrete-slab-equipment-pad&length=40&width=60&thickness=6",
  );
});

test("finishing calculator receives slab dimensions only", () => {
  assert.equal(
    href(
      "concrete-finishing-cost-calculator",
      "/construction/concrete-finishing-cost-calculator",
    ),
    "/construction/concrete-finishing-cost-calculator?fromProject=concrete-slab-equipment-pad&length=40&width=60",
  );
});

test("saw cut calculator remains outside project prefill handoff", () => {
  assert.equal(
    href(
      "concrete-saw-cut-calculator",
      "/construction/concrete-saw-cut-calculator",
    ),
    "/construction/concrete-saw-cut-calculator",
  );
});
