import assert from "node:assert/strict";
import test from "node:test";

import {
  presentWorkflowFreshnessAssessment,
  getWorkflowResultFreshnessPresentation,
} from "../../data/workflowFreshnessPresentation.ts";

import {
  CONCRETE_WORKFLOW_DEFINITION_ID,
  CONCRETE_WORKFLOW_SCOPE_CALCULATORS,
} from "../../data/workflowResultProvenance.ts";

const PROJECT = Object.freeze({
  length: 20,
  width: 15,
  thickness: 4,
  wastePercent: 10,
});

const CALCULATOR_ID =
  CONCRETE_WORKFLOW_SCOPE_CALCULATORS.concrete;

function makeProvenance(overrides = {}) {
  return {
    version: 1,
    workflowDefinitionId: CONCRETE_WORKFLOW_DEFINITION_ID,
    stepId: "concrete",
    calculatorId: CALCULATOR_ID,
    unitSystem: "imperial",
    projectInputs: { ...PROJECT },
    effectiveInputs: { ...PROJECT },
    ...overrides,
  };
}

function makeResult(overrides = {}) {
  return {
    stepId: "concrete",
    calculatorId: CALCULATOR_ID,
    calculatorTitle: "Concrete Calculator",
    result: {
      calculatorId: CALCULATOR_ID,
      calculatorTitle: "Concrete Calculator",
      inputs: [],
      metrics: [],
      costs: [],
    },
    updatedAt: "2026-10-12T12:00:00.000Z",
    provenance: makeProvenance(),
    ...overrides,
  };
}

function present(result = makeResult(), overrides = {}) {
  return getWorkflowResultFreshnessPresentation({
    result,
    currentProjectInputs: { ...PROJECT },
    currentUnitSystem: "imperial",
    ...overrides,
  });
}


test("irrelevant thickness change preserves Current", () => {
  const provenance = {
    ...makeProvenance(),
    stepId: "finishing",
    calculatorId:
      CONCRETE_WORKFLOW_SCOPE_CALCULATORS.finishing,
    effectiveInputs: {
      length: PROJECT.length,
      width: PROJECT.width,
    },
  };

  const result = makeResult({
    stepId: "finishing",
    calculatorId: provenance.calculatorId,
    provenance,
  });

  const output = present(result, {
    currentProjectInputs: {
      ...PROJECT,
      thickness: 8,
    },
  });

  assert.equal(output.status, "current");
  assert.equal(output.reason, "verified-match");
  assert.equal(output.label, "Current");
});

test("delivery known-yards mode remains Unverified", () => {
  const provenance = {
    ...makeProvenance(),
    stepId: "delivery",
    calculatorId:
      CONCRETE_WORKFLOW_SCOPE_CALCULATORS.delivery,
    calculationMode: "Known cubic yards",
    effectiveInputs: {
      length: PROJECT.length,
      width: PROJECT.width,
      thicknessInches: PROJECT.thickness,
      wastePercent: PROJECT.wastePercent,
      inputMode: "Known cubic yards",
    },
  };

  const output = present(makeResult({
    stepId: "delivery",
    calculatorId: provenance.calculatorId,
    provenance,
  }));

  assert.equal(output.status, "unverified");
  assert.equal(output.reason, "unsupported-calculation-mode");
});

test("delivery unknown mode remains Unverified", () => {
  const provenance = {
    ...makeProvenance(),
    stepId: "delivery",
    calculatorId:
      CONCRETE_WORKFLOW_SCOPE_CALCULATORS.delivery,
    calculationMode: "unknown",
    effectiveInputs: {
      length: PROJECT.length,
      width: PROJECT.width,
      thicknessInches: PROJECT.thickness,
      wastePercent: PROJECT.wastePercent,
      inputMode: "Calculate from dimensions",
    },
  };

  const output = present(makeResult({
    stepId: "delivery",
    calculatorId: provenance.calculatorId,
    provenance,
  }));

  assert.equal(output.status, "unverified");
  assert.equal(output.reason, "unsupported-calculation-mode");
});

test("effective-input mismatch preserves affected input", () => {
  const provenance = makeProvenance({
    effectiveInputs: {
      ...PROJECT,
      width: 99,
    },
  });

  const output = present(makeResult({ provenance }));

  assert.equal(output.status, "unverified");
  assert.equal(output.reason, "effective-input-mismatch");
  assert.ok(output.affectedInputs.includes("width"));
});

test("matching provenance displays Current", () => {
  const output = present();

  assert.equal(output.status, "current");
  assert.equal(output.reason, "verified-match");
  assert.equal(output.label, "Current");
  assert.match(output.description, /verified/i);
  assert.deepEqual(output.affectedInputs, []);
});

test("relevant input change displays Needs recalculation", () => {
  const output = present(makeResult(), {
    currentProjectInputs: {
      ...PROJECT,
      length: 25,
    },
  });

  assert.equal(output.status, "needs-recalculation");
  assert.equal(output.reason, "relevant-input-changed");
  assert.equal(output.label, "Needs recalculation");
  assert.match(output.description, /changed/i);
  assert.ok(output.affectedInputs.includes("length"));
});

test("missing provenance displays Unverified", () => {
  const result = makeResult();
  delete result.provenance;

  const output = present(result);

  assert.equal(output.status, "unverified");
  assert.equal(output.reason, "missing-provenance");
  assert.equal(output.label, "Unverified");
  assert.match(output.description, /cannot be verified/i);
});

test("invalid provenance remains unverified", () => {
  const output = present(
    makeResult({
      provenance: { version: 999 },
    }),
  );

  assert.equal(output.status, "unverified");
  assert.equal(output.reason, "invalid-provenance");
});

test("unsupported scope remains unverified", () => {
  const output = present(
    makeResult({
      stepId: "unknown-scope",
      calculatorId: "unknown-calculator",
      provenance: undefined,
    }),
  );

  assert.equal(output.status, "unverified");
  assert.equal(output.reason, "unsupported-scope");
});

test("metric results are not incorrectly marked current", () => {
  const output = present(makeResult(), {
    currentUnitSystem: "metric",
  });

  assert.equal(output.status, "unverified");
  assert.equal(output.reason, "unit-system-mismatch");
});

test("assessment reason and affected inputs are preserved", () => {
  const assessment = {
    status: "needs-recalculation",
    reason: "relevant-input-changed",
    affectedInputs: ["length", "width"],
  };

  const output = presentWorkflowFreshnessAssessment(assessment);

  assert.equal(output.reason, assessment.reason);
  assert.deepEqual(output.affectedInputs, ["length", "width"]);
  assert.notStrictEqual(
    output.affectedInputs,
    assessment.affectedInputs,
  );
});

test("unverified assessment preserves its reason", () => {
  const output = presentWorkflowFreshnessAssessment({
    status: "unverified",
    reason: "unsupported-calculation-mode",
    affectedInputs: [],
  });

  assert.equal(output.status, "unverified");
  assert.equal(output.reason, "unsupported-calculation-mode");
  assert.equal(output.label, "Unverified");
});

test("presentation does not mutate the supplied result", () => {
  const result = makeResult();
  const before = structuredClone(result);

  present(result);

  assert.deepEqual(result, before);
});

test("presentation does not mutate current project inputs", () => {
  const inputs = { ...PROJECT };
  const before = structuredClone(inputs);

  present(makeResult(), {
    currentProjectInputs: inputs,
  });

  assert.deepEqual(inputs, before);
});

test("presentation does not mutate assessment inputs", () => {
  const assessment = {
    status: "current",
    reason: "verified-match",
    affectedInputs: [],
  };

  const before = structuredClone(assessment);

  presentWorkflowFreshnessAssessment(assessment);

  assert.deepEqual(assessment, before);
});

test("legacy saved results remain unverified, not discarded", () => {
  const result = makeResult();
  delete result.provenance;

  const before = structuredClone(result);
  const output = present(result);

  assert.equal(output.status, "unverified");
  assert.deepEqual(result, before);
});

test("presentation does not alter saved cost values", () => {
  const result = makeResult({
    result: {
      calculatorId: CALCULATOR_ID,
      calculatorTitle: "Concrete Calculator",
      inputs: [],
      metrics: [],
      costs: [],
      totalCost: 1250,
    },
  });

  const output = present(result);

  assert.equal(output.status, "current");
  assert.equal(result.result.totalCost, 1250);
});
