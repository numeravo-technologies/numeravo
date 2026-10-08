import test from "node:test";
import assert from "node:assert/strict";

import {
  loadProjectSession,
  saveProjectSession,
} from "../../data/projectSession.ts";

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

test("successful project session write returns true", () => {
  const store = installSessionStorage();

  const project = {
    recipeId,
    projectName: "Write success",
    unitSystem: "imperial",
    inputs: {},
    selectedScopeIds: [],
    scopeResults: {},
  };

  assert.equal(saveProjectSession(project), true);
  assert.equal(JSON.parse(store.get(storageKey)).projectName, "Write success");
});

test("project session write returns false without browser storage", () => {
  const previousWindow = globalThis.window;

  try {
    delete globalThis.window;

    const project = {
      recipeId,
      projectName: "Unavailable browser",
      unitSystem: "imperial",
      inputs: {},
      selectedScopeIds: [],
      scopeResults: {},
    };

    assert.equal(saveProjectSession(project), false);
  } finally {
    globalThis.window = previousWindow;
  }
});

test("project session write returns false when storage throws and preserves data", () => {
  const store = installSessionStorage();

  const project = {
    recipeId,
    projectName: "Original project",
    unitSystem: "imperial",
    inputs: {},
    selectedScopeIds: [],
    scopeResults: {},
  };

  assert.equal(saveProjectSession(project), true);

  const originalStoredValue = store.get(storageKey);

  globalThis.window.sessionStorage.setItem = () => {
    throw new Error("Storage write unavailable");
  };

  assert.equal(
    saveProjectSession({
      ...project,
      projectName: "Unsaved update",
    }),
    false,
  );

  assert.equal(store.get(storageKey), originalStoredValue);
  assert.equal(loadProjectSession(recipeId).projectName, "Original project");
});

test("older stored project without scopeResults restores with empty scopeResults", () => {
  const store = installSessionStorage();

  store.set(
    storageKey,
    JSON.stringify({
      recipeId,
      projectName: "Legacy project",
      unitSystem: "imperial",
      inputs: {
        length: 40,
        width: 60,
        thickness: 6,
        wastePercent: 10,
      },
      selectedScopeIds: ["concrete"],
    }),
  );

  const project = loadProjectSession(recipeId);

  assert.ok(project);
  assert.equal(project.projectName, "Legacy project");
  assert.deepEqual(project.scopeResults, {});
});

test("valid scope results survive session save and restore", () => {
  installSessionStorage();

  const project = {
    recipeId,
    projectName: "North equipment pad",
    unitSystem: "imperial",
    inputs: {
      length: 40,
      width: 60,
      thickness: 6,
      wastePercent: 10,
    },
    selectedScopeIds: ["concrete"],
    scopeResults: {
      concrete: {
        scopeId: "concrete",
        calculatorId: "concrete-calculator",
        calculatorTitle: "Concrete Calculator",
        result: {
          calculatorId: "concrete-calculator",
          calculatorTitle: "Concrete Calculator",
          inputSummary: [],
          metrics: [
            {
              key: "recommendedOrder",
              label: "Recommended Order",
              value: 49,
              unit: "yd³",
            },
          ],
          totalCost: 7350,
        },
        updatedAt: "2026-09-20T04:30:00.000Z",
      },
    },
  };

  saveProjectSession(project);

  const restored = loadProjectSession(recipeId);

  assert.ok(restored);
  assert.equal(
    restored.scopeResults.concrete.result.totalCost,
    7350,
  );
});

test("invalid stored scope results are discarded", () => {
  const store = installSessionStorage();

  store.set(
    storageKey,
    JSON.stringify({
      recipeId,
      projectName: "Invalid result project",
      unitSystem: "imperial",
      inputs: {},
      selectedScopeIds: [],
      scopeResults: {
        concrete: {
          scopeId: "concrete",
        },
      },
    }),
  );

  const project = loadProjectSession(recipeId);

  assert.ok(project);
  assert.deepEqual(project.scopeResults, {});
});
