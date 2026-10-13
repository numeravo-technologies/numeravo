import test from "node:test";
import assert from "node:assert/strict";

import {
  isProjectScopeResult,
} from "../../data/projectScopeResult.ts";

const validProvenance = {
  version: 1,
  workflowDefinitionId:
    "construction.concrete-slab-equipment-pad",
  stepId: "concrete",
  calculatorId: "concrete-calculator",
  unitSystem: "imperial",
  projectInputs: {
    length: 40,
    width: 60,
    thickness: 6,
    wastePercent: 10,
  },
  effectiveInputs: {
    length: 40,
    width: 60,
    thickness: 6,
    wastePercent: 10,
  },
};

const calculationResult = {
  calculatorId: "concrete-calculator",
  calculatorTitle: "Concrete Calculator",
  inputSummary: [
    {
      key: "projectType",
      label: "Project Type",
      value: "Slab / Pad",
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
  costs: [
    {
      key: "materialCost",
      label: "Estimated Material Cost",
      amount: 7350,
    },
  ],
  totalCost: 7350,
};

test("accepts a valid project scope result", () => {
  const scopeResult = {
    scopeId: "concrete",
    calculatorId: calculationResult.calculatorId,
    calculatorTitle: calculationResult.calculatorTitle,
    result: calculationResult,
    updatedAt: "2026-09-20T04:30:00.000Z",
  };

  assert.equal(isProjectScopeResult(scopeResult), true);
});

test("rejects a project scope result without scope identity", () => {
  assert.equal(
    isProjectScopeResult({
      calculatorId: "concrete-calculator",
      calculatorTitle: "Concrete Calculator",
      result: calculationResult,
      updatedAt: "2026-09-20T04:30:00.000Z",
    }),
    false,
  );
});

test("rejects a project scope result without calculation data", () => {
  assert.equal(
    isProjectScopeResult({
      scopeId: "concrete",
      calculatorId: "concrete-calculator",
      calculatorTitle: "Concrete Calculator",
      updatedAt: "2026-09-20T04:30:00.000Z",
    }),
    false,
  );
});

test("rejects malformed nested calculation result", () => {
  assert.equal(
    isProjectScopeResult({
      scopeId: "concrete",
      calculatorId: "concrete-calculator",
      calculatorTitle: "Concrete Calculator",
      result: {
        calculatorId: "concrete-calculator",
      },
      updatedAt: "2026-09-20T04:30:00.000Z",
    }),
    false,
  );
});

test("accepts valid project scope provenance", () => {
  const scopeResult = {
    scopeId: "concrete",
    calculatorId: calculationResult.calculatorId,
    calculatorTitle: calculationResult.calculatorTitle,
    result: calculationResult,
    updatedAt: "2026-09-20T04:30:00.000Z",
    provenance: validProvenance,
  };

  assert.equal(isProjectScopeResult(scopeResult), true);
});

test("rejects malformed project scope provenance", () => {
  const scopeResult = {
    scopeId: "concrete",
    calculatorId: calculationResult.calculatorId,
    calculatorTitle: calculationResult.calculatorTitle,
    result: calculationResult,
    updatedAt: "2026-09-20T04:30:00.000Z",
    provenance: { ...validProvenance, version: 99 },
  };

  assert.equal(isProjectScopeResult(scopeResult), false);
});

test("rejects provenance with mismatched scope identity", () => {
  const scopeResult = {
    scopeId: "base",
    calculatorId: calculationResult.calculatorId,
    calculatorTitle: calculationResult.calculatorTitle,
    result: calculationResult,
    updatedAt: "2026-09-20T04:30:00.000Z",
    provenance: validProvenance,
  };

  assert.equal(isProjectScopeResult(scopeResult), false);
});

test("rejects provenance with mismatched calculator identity", () => {
  const scopeResult = {
    scopeId: "base",
    calculatorId: calculationResult.calculatorId,
    calculatorTitle: calculationResult.calculatorTitle,
    result: calculationResult,
    updatedAt: "2026-09-20T04:30:00.000Z",
    provenance: {
      ...validProvenance,
      stepId: "base",
      calculatorId: "gravel-calculator",
    },
  };

  assert.equal(isProjectScopeResult(scopeResult), false);
});

test("rejects explicitly undefined project scope provenance", () => {
  const scopeResult = {
    scopeId: "concrete",
    calculatorId: calculationResult.calculatorId,
    calculatorTitle: calculationResult.calculatorTitle,
    result: calculationResult,
    updatedAt: "2026-09-20T04:30:00.000Z",
    provenance: undefined,
  };

  assert.equal(isProjectScopeResult(scopeResult), false);
});

test("rejects mismatched nested calculator identity", () => {
  const scopeResult = {
    scopeId: "concrete",
    calculatorId: "gravel-calculator",
    calculatorTitle: calculationResult.calculatorTitle,
    result: calculationResult,
    updatedAt: "2026-09-20T04:30:00.000Z",
  };

  assert.equal(isProjectScopeResult(scopeResult), false);
});
