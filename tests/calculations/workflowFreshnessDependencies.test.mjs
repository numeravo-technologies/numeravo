import assert from "node:assert/strict";
import test from "node:test";

import {
  CONCRETE_WORKFLOW_SCOPE_CALCULATORS,
} from "../../data/workflowResultProvenance.ts";

import {
  getAllWorkflowFreshnessDependencies,
  getWorkflowFreshnessDependency,
} from "../../data/workflowFreshnessDependencies.ts";

const expected = {
  concrete: {
    inputs: ["length", "width", "thickness", "wastePercent"],
    verification: "direct",
  },
  base: {
    inputs: ["length", "width", "wastePercent"],
    verification: "direct",
  },
  reinforcement: {
    inputs: ["length", "width"],
    verification: "direct",
  },
  formwork: {
    inputs: ["length", "width", "wastePercent"],
    verification: "direct",
  },
  delivery: {
    inputs: ["length", "width", "thickness", "wastePercent"],
    verification: "mode-sensitive",
  },
  pumping: {
    inputs: ["length", "width", "thickness", "wastePercent"],
    verification: "derived-volume",
  },
  labor: {
    inputs: ["length", "width", "thickness"],
    verification: "direct",
  },
  finishing: {
    inputs: ["length", "width"],
    verification: "direct",
  },
  joints: {
    inputs: ["length", "width", "thickness"],
    verification: "direct",
  },
};

test("returns exactly nine dependencies", () => {
  const all = getAllWorkflowFreshnessDependencies();

  assert.equal(all.length, 9);
  assert.equal(
    new Set(all.map((item) => item.stepId)).size,
    9,
  );
});

test("all dependencies match workflow calculator IDs", () => {
  for (const dependency of getAllWorkflowFreshnessDependencies()) {
    assert.equal(
      dependency.calculatorId,
      CONCRETE_WORKFLOW_SCOPE_CALCULATORS[dependency.stepId],
      dependency.stepId,
    );
  }
});

test("all nine dependency mappings match the contract", () => {
  for (const [stepId, specification] of Object.entries(expected)) {
    const dependency = getWorkflowFreshnessDependency(stepId);

    assert.ok(dependency, stepId);
    assert.deepEqual(
      dependency.projectInputKeys,
      specification.inputs,
      stepId,
    );
    assert.equal(
      dependency.verification,
      specification.verification,
      stepId,
    );
  }
});

test("rejects unsupported scope IDs", () => {
  for (const stepId of [
    "",
    "unknown",
    "Concrete",
    "__proto__",
    "constructor",
  ]) {
    assert.equal(
      getWorkflowFreshnessDependency(stepId),
      null,
      stepId,
    );
  }
});

test("returns independent dependency arrays", () => {
  const first = getWorkflowFreshnessDependency("concrete");
  assert.ok(first);

  first.projectInputKeys.push("unexpected");

  const second = getWorkflowFreshnessDependency("concrete");
  assert.ok(second);

  assert.deepEqual(
    second.projectInputKeys,
    expected.concrete.inputs,
  );
});

test("all-dependencies result cannot mutate definitions", () => {
  const all = getAllWorkflowFreshnessDependencies();
  const concrete = all.find((item) => item.stepId === "concrete");

  assert.ok(concrete);

  concrete.projectInputKeys.splice(0);

  const fresh = getWorkflowFreshnessDependency("concrete");

  assert.ok(fresh);
  assert.deepEqual(
    fresh.projectInputKeys,
    expected.concrete.inputs,
  );
});

test("verification categories are limited to the approved set", () => {
  const allowed = new Set([
    "direct",
    "derived-volume",
    "mode-sensitive",
  ]);

  for (const dependency of getAllWorkflowFreshnessDependencies()) {
    assert.equal(
      allowed.has(dependency.verification),
      true,
      dependency.stepId,
    );
  }
});

test("pumping and delivery retain special verification modes", () => {
  assert.equal(
    getWorkflowFreshnessDependency("pumping")?.verification,
    "derived-volume",
  );

  assert.equal(
    getWorkflowFreshnessDependency("delivery")?.verification,
    "mode-sensitive",
  );
});
