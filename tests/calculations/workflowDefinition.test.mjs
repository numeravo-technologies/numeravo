import assert from "node:assert/strict";
import test from "node:test";

import {
  validateWorkflowDefinition,
  validateWorkflowDefinitions,
} from "../../data/workflowDefinition.ts";

function makeDefinition(overrides = {}) {
  return {
    id: "construction.test",
    vertical: "construction",
    terminology: "project",
    title: "Test Workflow",
    description: "Test workflow definition.",
    inputs: [
      {
        key: "length",
        label: "Length",
        description: "Project length.",
      },
    ],
    steps: [
      {
        id: "concrete",
        label: "Concrete",
        description: "Calculate concrete.",
        calculatorId: "concrete-calculator",
      },
    ],
    ...overrides,
  };
}

test("valid workflow definition has no issues", () => {
  assert.deepEqual(
    validateWorkflowDefinition(makeDefinition()),
    [],
  );
});

test("duplicate step ids are reported", () => {
  const definition = makeDefinition({
    steps: [
      {
        id: "concrete",
        label: "Concrete",
        description: "First.",
        calculatorId: "concrete-calculator",
      },
      {
        id: "concrete",
        label: "Concrete again",
        description: "Duplicate.",
        calculatorId: "gravel-calculator",
      },
    ],
  });

  const issues =
    validateWorkflowDefinition(definition);

  assert.equal(
    issues.some(
      (issue) =>
        issue.detail ===
        "Duplicate workflow step id: concrete",
    ),
    true,
  );
});

test("missing calculator references are reported", () => {
  const definition = makeDefinition({
    steps: [
      {
        id: "missing",
        label: "Missing",
        description: "Missing calculator.",
        calculatorId:
          "calculator-that-does-not-exist",
      },
    ],
  });

  const issues =
    validateWorkflowDefinition(definition);

  assert.equal(
    issues.some(
      (issue) =>
        issue.detail ===
        "Calculator does not exist: calculator-that-does-not-exist",
    ),
    true,
  );
});

test("duplicate definition ids are reported", () => {
  const definition = makeDefinition();

  const issues = validateWorkflowDefinitions([
    definition,
    {
      ...definition,
      title: "Duplicate Definition",
    },
  ]);

  assert.equal(
    issues.some(
      (issue) =>
        issue.detail ===
        "Duplicate workflow definition id: construction.test",
    ),
    true,
  );
});
