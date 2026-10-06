import assert from "node:assert/strict";
import test from "node:test";

import { createProjectContext } from "../../data/projectContext.ts";
import {
  loadProjectSession,
  saveProjectSession,
} from "../../data/projectSession.ts";
import { loadConcreteWorkflowSession } from "../../data/workflowPersistence/concreteWorkflowSession.ts";

const recipeId = "concrete-slab-equipment-pad";

function installSessionStorage() {
  const values = new Map();

  globalThis.window = {
    sessionStorage: {
      getItem(key) {
        return values.has(key) ? values.get(key) : null;
      },
      setItem(key, value) {
        values.set(key, String(value));
      },
      removeItem(key) {
        values.delete(key);
      },
      clear() {
        values.clear();
      },
    },
  };

  return values;
}

test("returns null when the concrete project session does not exist", () => {
  installSessionStorage();

  assert.equal(loadConcreteWorkflowSession(), null);
});

test("loads the concrete project session as workflow runtime state", () => {
  installSessionStorage();

  const project = createProjectContext(recipeId);

  project.projectName = "P5B Session QA";
  project.unitSystem = "metric";
  project.inputs = {
    length: 40,
    width: 60,
    thickness: 6,
    wastePercent: 10,
  };
  project.selectedScopeIds = [
    "concrete",
    "base",
    "reinforcement",
  ];
  project.scopeResults = {
    concrete: {
      scopeId: "concrete",
      calculatorId: "concrete-calculator",
      calculatorTitle: "Concrete Calculator",
      result: {
        calculatorId: "concrete-calculator",
        calculatorTitle: "Concrete Calculator",
        inputs: {
          length: 40,
          width: 60,
          thickness: 6,
          wastePercent: 10,
        },
        outputs: {
          volumeWithWaste: 48.88888888888889,
        },
      },
      updatedAt: "2026-10-05T20:00:00.000Z",
    },
  };

  const originalProject = structuredClone(project);

  saveProjectSession(project);

  const session = loadConcreteWorkflowSession();

  assert.ok(session);
  assert.equal(session.unitSystem, "metric");

  assert.equal(
    session.workflow.definitionId,
    "construction.concrete-slab-equipment-pad",
  );
  assert.equal(session.workflow.name, "P5B Session QA");

  assert.deepEqual(session.workflow.inputs, {
    length: 40,
    width: 60,
    thickness: 6,
    wastePercent: 10,
  });

  assert.deepEqual(session.workflow.selectedStepIds, [
    "concrete",
    "base",
    "reinforcement",
  ]);

  assert.equal(
    session.workflow.results.concrete.stepId,
    "concrete",
  );
  assert.equal(
    session.workflow.results.concrete.calculatorId,
    "concrete-calculator",
  );
  assert.equal(
    session.workflow.results.concrete.updatedAt,
    "2026-10-05T20:00:00.000Z",
  );
  assert.deepEqual(
    session.workflow.results.concrete.result,
    project.scopeResults.concrete.result,
  );

  assert.deepEqual(project, originalProject);

  const restoredProject = loadProjectSession(recipeId);
  assert.deepEqual(restoredProject, originalProject);
});

test("inherits legacy project-session normalization before conversion", () => {
  const storage = installSessionStorage();

  storage.set(
    "numeravo:project:concrete-slab-equipment-pad",
    JSON.stringify({
      recipeId,
      projectName: "Normalized Project",
      unitSystem: "unexpected-unit",
      inputs: {
        length: 24,
      },
      selectedScopeIds: [
        "concrete",
        123,
        "labor",
      ],
      scopeResults: {
        invalid: {
          scopeId: "invalid",
        },
      },
    }),
  );

  const session = loadConcreteWorkflowSession();

  assert.ok(session);

  assert.equal(session.unitSystem, "imperial");
  assert.equal(session.workflow.name, "Normalized Project");
  assert.deepEqual(session.workflow.inputs, {
    length: 24,
  });
  assert.deepEqual(session.workflow.selectedStepIds, [
    "concrete",
    "labor",
  ]);
  assert.deepEqual(session.workflow.results, {});
});
