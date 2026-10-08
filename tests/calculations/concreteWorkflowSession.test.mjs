import assert from "node:assert/strict";
import test from "node:test";

import { createProjectContext } from "../../data/projectContext.ts";
import {
  loadProjectSession,
  saveProjectSession,
} from "../../data/projectSession.ts";
import {
  loadConcreteWorkflowSession,
  saveConcreteWorkflowSession,
} from "../../data/workflowPersistence/concreteWorkflowSession.ts";

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

test("workflow session save returns true after successful storage write", () => {
  const storage = installSessionStorage();

  const workflow = {
    definitionId: "construction.concrete-slab-equipment-pad",
    name: "Successful workflow save",
    inputs: { length: 30 },
    selectedStepIds: ["concrete"],
    results: {},
  };

  const saved = saveConcreteWorkflowSession({
    workflow,
    unitSystem: "imperial",
  });

  assert.equal(saved, true);
  assert.equal(
    JSON.parse(
      storage.get("numeravo:project:concrete-slab-equipment-pad"),
    ).projectName,
    workflow.name,
  );
});

test("workflow session save returns false when storage write fails", () => {
  const storage = installSessionStorage();

  const workflow = {
    definitionId: "construction.concrete-slab-equipment-pad",
    name: "Original workflow",
    inputs: { length: 30 },
    selectedStepIds: ["concrete"],
    results: {},
  };

  assert.equal(
    saveConcreteWorkflowSession({
      workflow,
      unitSystem: "imperial",
    }),
    true,
  );

  const key = "numeravo:project:concrete-slab-equipment-pad";
  const originalStoredValue = storage.get(key);

  globalThis.window.sessionStorage.setItem = () => {
    throw new Error("Storage write unavailable");
  };

  const saved = saveConcreteWorkflowSession({
    workflow: {
      ...workflow,
      name: "Unsaved workflow update",
    },
    unitSystem: "metric",
  });

  assert.equal(saved, false);
  assert.equal(storage.get(key), originalStoredValue);

  const restored = loadConcreteWorkflowSession();

  assert.ok(restored);
  assert.equal(restored.workflow.name, "Original workflow");
  assert.equal(restored.unitSystem, "imperial");
});

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
        inputSummary: [
          { key: "length", label: "Length", value: 40, unit: "ft" },
          { key: "width", label: "Width", value: 60, unit: "ft" },
          { key: "thickness", label: "Thickness", value: 6, unit: "in" },
          { key: "wastePercent", label: "Waste", value: 10, unit: "%" },
        ],
        metrics: [
          {
            key: "volumeWithWaste",
            label: "Volume With Waste",
            value: 48.88888888888889,
            unit: "yd³",
          },
        ],
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


test("saves a new workflow session using the legacy storage key", () => {
  const storage = installSessionStorage();

  const workflow = {
    definitionId: "construction.concrete-slab-equipment-pad",
    name: "New equipment pad",
    inputs: {
      length: 30,
      width: 40,
      thickness: 6,
      wastePercent: 5,
    },
    selectedStepIds: ["concrete", "labor"],
    results: {},
  };

  saveConcreteWorkflowSession({
    workflow,
    unitSystem: "imperial",
  });

  const key = "numeravo:project:concrete-slab-equipment-pad";

  assert.equal(storage.has(key), true);

  const stored = JSON.parse(storage.get(key));

  assert.equal(stored.recipeId, recipeId);
  assert.equal(stored.projectName, workflow.name);
  assert.deepEqual(stored.selectedScopeIds, workflow.selectedStepIds);
  assert.deepEqual(stored.scopeResults, {});
});

test("restores workflow state after saving", () => {
  installSessionStorage();

  const workflow = {
    definitionId: "construction.concrete-slab-equipment-pad",
    name: "Round trip project",
    inputs: {
      length: 25,
      width: 35,
      thickness: 8,
      wastePercent: 7,
    },
    selectedStepIds: ["concrete", "base"],
    results: {},
  };

  saveConcreteWorkflowSession({
    workflow,
    unitSystem: "metric",
  });

  const restored = loadConcreteWorkflowSession();

  assert.ok(restored);
  assert.equal(restored.unitSystem, "metric");
  assert.deepEqual(restored.workflow, workflow);
});

test("preserves newer stored results during workspace saves", () => {
  installSessionStorage();

  const project = createProjectContext(recipeId);

  project.projectName = "Original";
  project.scopeResults = {
    concrete: {
      scopeId: "concrete",
      calculatorId: "concrete-calculator",
      calculatorTitle: "Concrete Calculator",
      result: {
        calculatorId: "concrete-calculator",
        calculatorTitle: "Concrete Calculator",
        inputSummary: [],
        metrics: [],
        totalCost: 9000,
      },
      updatedAt: "2026-10-07T12:00:00.000Z",
    },
  };

  saveProjectSession(project);

  const workflow = {
    definitionId: "construction.concrete-slab-equipment-pad",
    name: "Updated workspace",
    inputs: { length: 50 },
    selectedStepIds: ["concrete"],
    results: {
      concrete: {
        stepId: "concrete",
        calculatorId: "concrete-calculator",
        calculatorTitle: "Concrete Calculator",
        result: {
          calculatorId: "concrete-calculator",
          calculatorTitle: "Concrete Calculator",
          inputSummary: [],
          metrics: [],
          totalCost: 1000,
        },
        updatedAt: "2026-10-06T12:00:00.000Z",
      },
    },
  };

  saveConcreteWorkflowSession({
    workflow,
    unitSystem: "imperial",
  });

  const restored = loadProjectSession(recipeId);

  assert.equal(restored.projectName, "Updated workspace");
  assert.equal(restored.scopeResults.concrete.result.totalCost, 9000);
  assert.equal(
    restored.scopeResults.concrete.updatedAt,
    "2026-10-07T12:00:00.000Z",
  );
});

test("persists workflow unit-system changes", () => {
  installSessionStorage();

  const workflow = {
    definitionId: "construction.concrete-slab-equipment-pad",
    name: "Units project",
    inputs: { length: 20 },
    selectedStepIds: [],
    results: {},
  };

  saveConcreteWorkflowSession({
    workflow,
    unitSystem: "imperial",
  });

  saveConcreteWorkflowSession({
    workflow,
    unitSystem: "metric",
  });

  assert.equal(loadConcreteWorkflowSession().unitSystem, "metric");
});

test("does not mutate the supplied workflow state", () => {
  installSessionStorage();

  const workflow = {
    definitionId: "construction.concrete-slab-equipment-pad",
    name: "Immutable project",
    inputs: { length: 15, width: 20 },
    selectedStepIds: ["concrete"],
    results: {},
  };

  const snapshot = structuredClone(workflow);

  saveConcreteWorkflowSession({
    workflow,
    unitSystem: "imperial",
  });

  assert.deepEqual(workflow, snapshot);
});
