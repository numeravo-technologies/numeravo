import assert from "node:assert/strict";
import test from "node:test";

import {
  loadProjectSession,
  saveProjectSession,
} from "../../data/projectSession.ts";
import { saveConcreteWorkflowResult } from "../../data/workflowPersistence/concreteWorkflowResultPersistence.ts";

const recipeId = "concrete-slab-equipment-pad";
const storageKey = `numeravo:project:${recipeId}`;

function installSessionStorage() {
  const store = new Map();

  globalThis.window = {
    sessionStorage: {
      getItem(key) {
        return store.has(key) ? store.get(key) : null;
      },
      setItem(key, value) {
        store.set(key, String(value));
      },
      removeItem(key) {
        store.delete(key);
      },
      clear() {
        store.clear();
      },
    },
  };

  return store;
}

function makeCalculationResult(totalCost = 7350) {
  return {
    calculatorId: "concrete-calculator",
    calculatorTitle: "Concrete Calculator",
    inputSummary: [
      {
        key: "length",
        label: "Length",
        value: 40,
        unit: "ft",
      },
    ],
    metrics: [
      {
        key: "recommendedOrder",
        label: "Recommended Order",
        value: 49,
        unit: "yd³",
      },
    ],
    totalCost,
  };
}

function makeProject() {
  return {
    recipeId,
    projectName: "North equipment pad",
    unitSystem: "metric",
    inputs: {
      length: 40,
      width: 60,
      thickness: 6,
      wastePercent: 10,
    },
    selectedScopeIds: ["concrete", "labor"],
    scopeResults: {
      labor: {
        scopeId: "labor",
        calculatorId: "concrete-labor-cost-calculator",
        calculatorTitle: "Concrete Labor Cost Calculator",
        result: {
          calculatorId: "concrete-labor-cost-calculator",
          calculatorTitle: "Concrete Labor Cost Calculator",
          inputSummary: [],
          metrics: [],
          totalCost: 1200,
        },
        updatedAt: "2026-10-04T00:00:00.000Z",
      },
    },
  };
}

test("returns false when workflow result storage write fails", () => {
  const store = installSessionStorage();

  const original = makeProject();

  assert.equal(saveProjectSession(original), true);

  const originalStoredValue = store.get(storageKey);

  globalThis.window.sessionStorage.setItem = () => {
    throw new Error("Storage write unavailable");
  };

  const saved = saveConcreteWorkflowResult({
    stepId: "concrete",
    result: makeCalculationResult(8100),
    updatedAt: "2026-10-07T18:00:00.000Z",
  });

  assert.equal(saved, false);
  assert.equal(store.get(storageKey), originalStoredValue);

  const restored = loadProjectSession(recipeId);

  assert.ok(restored);
  assert.equal(restored.projectName, original.projectName);
  assert.deepEqual(restored.scopeResults, original.scopeResults);
  assert.equal(restored.scopeResults.concrete, undefined);
});

test("returns false and does not create a project when no session exists", () => {
  const store = installSessionStorage();

  const saved = saveConcreteWorkflowResult({
    stepId: "concrete",
    result: makeCalculationResult(),
    updatedAt: "2026-10-05T00:00:00.000Z",
  });

  assert.equal(saved, false);
  assert.equal(store.has(storageKey), false);
});

test("persists a workflow result through the legacy project session boundary", () => {
  installSessionStorage();

  const original = makeProject();
  saveProjectSession(original);

  const calculationResult = makeCalculationResult();

  const saved = saveConcreteWorkflowResult({
    stepId: "concrete",
    result: calculationResult,
    updatedAt: "2026-10-05T00:00:00.000Z",
  });

  assert.equal(saved, true);

  const restored = loadProjectSession(recipeId);

  assert.ok(restored);
  assert.equal(restored.projectName, original.projectName);
  assert.equal(restored.unitSystem, "metric");
  assert.deepEqual(restored.inputs, original.inputs);
  assert.deepEqual(restored.selectedScopeIds, original.selectedScopeIds);

  assert.equal(restored.scopeResults.concrete.scopeId, "concrete");
  assert.deepEqual(restored.scopeResults.concrete.result, calculationResult);
  assert.equal(
    restored.scopeResults.concrete.updatedAt,
    "2026-10-05T00:00:00.000Z",
  );

  assert.deepEqual(restored.scopeResults.labor, original.scopeResults.labor);
});

test("replaces the result for one workflow step without losing project state", () => {
  installSessionStorage();

  const original = makeProject();

  original.scopeResults.concrete = {
    scopeId: "concrete",
    calculatorId: "concrete-calculator",
    calculatorTitle: "Concrete Calculator",
    result: makeCalculationResult(7000),
    updatedAt: "2026-10-04T00:00:00.000Z",
  };

  saveProjectSession(original);

  const replacement = makeCalculationResult(8100);

  const saved = saveConcreteWorkflowResult({
    stepId: "concrete",
    result: replacement,
    updatedAt: "2026-10-05T01:00:00.000Z",
  });

  assert.equal(saved, true);

  const restored = loadProjectSession(recipeId);

  assert.ok(restored);

  assert.equal(restored.scopeResults.concrete.result.totalCost, 8100);
  assert.equal(
    restored.scopeResults.concrete.updatedAt,
    "2026-10-05T01:00:00.000Z",
  );

  assert.deepEqual(restored.scopeResults.labor, original.scopeResults.labor);
  assert.equal(restored.projectName, original.projectName);
  assert.equal(restored.unitSystem, original.unitSystem);
  assert.deepEqual(restored.inputs, original.inputs);
  assert.deepEqual(restored.selectedScopeIds, original.selectedScopeIds);
});
