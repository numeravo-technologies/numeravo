import assert from "node:assert/strict";
import test from "node:test";

import {
  CONCRETE_WORKFLOW_DEFINITION_ID,
  CONCRETE_WORKFLOW_SCOPE_CALCULATORS,
  WORKFLOW_PROVENANCE_VERSION,
  isWorkflowResultProvenanceV1,
} from "../../data/workflowResultProvenance.ts";

function makeProvenance(overrides = {}) {
  return {
    version: WORKFLOW_PROVENANCE_VERSION,
    workflowDefinitionId:
      CONCRETE_WORKFLOW_DEFINITION_ID,
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
      useReadyMix: true,
      optionalNote: null,
    },
    ...overrides,
  };
}

test("recognizes all nine workflow scopes", () => {
  assert.equal(
    Object.keys(
      CONCRETE_WORKFLOW_SCOPE_CALCULATORS,
    ).length,
    9,
  );

  for (const [stepId, calculatorId] of Object.entries(
    CONCRETE_WORKFLOW_SCOPE_CALCULATORS,
  )) {
    assert.equal(
      isWorkflowResultProvenanceV1(
        makeProvenance({ stepId, calculatorId }),
      ),
      true,
      stepId,
    );
  }
});

test("accepts valid provenance", () => {
  assert.equal(
    isWorkflowResultProvenanceV1(makeProvenance()),
    true,
  );
});

test("accepts optional calculation mode", () => {
  assert.equal(
    isWorkflowResultProvenanceV1(
      makeProvenance({
        calculationMode: "dimensions",
      }),
    ),
    true,
  );
});

test("rejects missing and invalid provenance", () => {
  for (const value of [
    undefined,
    null,
    false,
    [],
    {},
    "legacy",
  ]) {
    assert.equal(
      isWorkflowResultProvenanceV1(value),
      false,
    );
  }
});

test("rejects unsupported versions", () => {
  assert.equal(
    isWorkflowResultProvenanceV1(
      makeProvenance({ version: 2 }),
    ),
    false,
  );
});

test("rejects wrong workflow definition", () => {
  assert.equal(
    isWorkflowResultProvenanceV1(
      makeProvenance({
        workflowDefinitionId: "other.workflow",
      }),
    ),
    false,
  );
});

test("rejects incorrect scope and calculator pairing", () => {
  assert.equal(
    isWorkflowResultProvenanceV1(
      makeProvenance({
        stepId: "pumping",
        calculatorId: "concrete-calculator",
      }),
    ),
    false,
  );
});

test("rejects unknown scopes", () => {
  assert.equal(
    isWorkflowResultProvenanceV1(
      makeProvenance({ stepId: "unknown" }),
    ),
    false,
  );
});

test("rejects unsupported unit systems", () => {
  assert.equal(
    isWorkflowResultProvenanceV1(
      makeProvenance({ unitSystem: "yards" }),
    ),
    false,
  );
});

test("rejects nonfinite project inputs", () => {
  for (const value of [NaN, Infinity, -Infinity]) {
    assert.equal(
      isWorkflowResultProvenanceV1(
        makeProvenance({
          projectInputs: { length: value },
        }),
      ),
      false,
    );
  }
});

test("rejects unknown project input keys", () => {
  assert.equal(
    isWorkflowResultProvenanceV1(
      makeProvenance({
        projectInputs: { unknownInput: 40 },
      }),
    ),
    false,
  );
});

test("rejects nonfinite effective inputs", () => {
  for (const value of [NaN, Infinity, -Infinity]) {
    assert.equal(
      isWorkflowResultProvenanceV1(
        makeProvenance({
          effectiveInputs: { length: value },
        }),
      ),
      false,
    );
  }
});

test("rejects nested effective input objects", () => {
  assert.equal(
    isWorkflowResultProvenanceV1(
      makeProvenance({
        effectiveInputs: {
          length: { value: 40 },
        },
      }),
    ),
    false,
  );
});

test("rejects malformed calculation modes", () => {
  for (const calculationMode of ["", "  ", 42]) {
    assert.equal(
      isWorkflowResultProvenanceV1(
        makeProvenance({ calculationMode }),
      ),
      false,
    );
  }
});

test("rejects unknown top-level fields", () => {
  assert.equal(
    isWorkflowResultProvenanceV1(
      makeProvenance({ inventedField: true }),
    ),
    false,
  );
});

test("rejects missing required fields", () => {
  const requiredFields = [
    "version",
    "workflowDefinitionId",
    "stepId",
    "calculatorId",
    "unitSystem",
    "projectInputs",
    "effectiveInputs",
  ];

  for (const field of requiredFields) {
    const provenance = makeProvenance();
    delete provenance[field];

    assert.equal(
      isWorkflowResultProvenanceV1(provenance),
      false,
      field,
    );
  }
});

test("does not mutate provenance during validation", () => {
  const provenance = makeProvenance();
  const before = structuredClone(provenance);

  assert.equal(
    isWorkflowResultProvenanceV1(provenance),
    true,
  );

  assert.deepEqual(provenance, before);
});
