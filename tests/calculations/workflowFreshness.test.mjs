import assert from "node:assert/strict";
import test from "node:test";

import {
  assessWorkflowResultFreshness,
} from "../../data/workflowFreshness.ts";

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

const EFFECTIVE_KEYS = {
  concrete: {
    length: "length",
    width: "width",
    thickness: "thickness",
    wastePercent: "wastePercent",
  },
  base: {
    length: "length",
    width: "width",
    wastePercent: "wastePercent",
  },
  reinforcement: {
    length: "slabLengthFeet",
    width: "slabWidthFeet",
  },
  formwork: {
    length: "length",
    width: "width",
    wastePercent: "wastePercent",
  },
  delivery: {
    length: "length",
    width: "width",
    thickness: "thicknessInches",
    wastePercent: "wastePercent",
  },
  labor: {
    length: "lengthFeet",
    width: "widthFeet",
    thickness: "thicknessInches",
  },
  finishing: {
    length: "length",
    width: "width",
  },
  joints: {
    length: "length",
    width: "width",
    thickness: "thickness",
  },
};

const DEPENDENCIES = {
  concrete: ["length", "width", "thickness", "wastePercent"],
  base: ["length", "width", "wastePercent"],
  reinforcement: ["length", "width"],
  formwork: ["length", "width", "wastePercent"],
  delivery: ["length", "width", "thickness", "wastePercent"],
  pumping: ["length", "width", "thickness", "wastePercent"],
  labor: ["length", "width", "thickness"],
  finishing: ["length", "width"],
  joints: ["length", "width", "thickness"],
};

function volumeYards(inputs = PROJECT) {
  return (
    (inputs.length * inputs.width * (inputs.thickness / 12)) /
    27
  ) * (1 + inputs.wastePercent / 100);
}

function makeProvenance(stepId, overrides = {}) {
  const effectiveInputs = {};

  if (stepId === "pumping") {
    effectiveInputs.concreteYards = volumeYards();
  } else {
    for (const key of DEPENDENCIES[stepId]) {
      effectiveInputs[EFFECTIVE_KEYS[stepId][key]] = PROJECT[key];
    }
  }

  const modeFields = stepId === "delivery"
    ? {
        calculationMode: "Calculate from dimensions",
        effectiveInputs: {
          ...effectiveInputs,
          inputMode: "Calculate from dimensions",
        },
      }
    : { effectiveInputs };

  return {
    version: 1,
    workflowDefinitionId: CONCRETE_WORKFLOW_DEFINITION_ID,
    stepId,
    calculatorId: CONCRETE_WORKFLOW_SCOPE_CALCULATORS[stepId],
    unitSystem: "imperial",
    projectInputs: { ...PROJECT },
    ...modeFields,
    ...overrides,
  };
}

function evaluate(stepId, overrides = {}) {
  return assessWorkflowResultFreshness({
    stepId,
    calculatorId: CONCRETE_WORKFLOW_SCOPE_CALCULATORS[stepId],
    provenance: makeProvenance(stepId),
    currentProjectInputs: { ...PROJECT },
    currentUnitSystem: "imperial",
    ...overrides,
  });
}

function expectAssessment(result, status, reason) {
  assert.equal(result.status, status);
  assert.equal(result.reason, reason);
  assert.ok(Array.isArray(result.affectedInputs));
}

for (const stepId of Object.keys(CONCRETE_WORKFLOW_SCOPE_CALCULATORS)) {
  test(`${stepId}: matching provenance is current`, () => {
    expectAssessment(
      evaluate(stepId),
      "current",
      "verified-match",
    );
  });

  test(`${stepId}: relevant input change requires recalculation`, () => {
    const key = DEPENDENCIES[stepId][0];

    const result = evaluate(stepId, {
      currentProjectInputs: {
        ...PROJECT,
        [key]: PROJECT[key] + 1,
      },
    });

    expectAssessment(
      result,
      "needs-recalculation",
      "relevant-input-changed",
    );

    assert.ok(result.affectedInputs.includes(key));
  });
}

test("irrelevant thickness change does not stale finishing", () => {
  const result = evaluate("finishing", {
    currentProjectInputs: {
      ...PROJECT,
      thickness: 8,
    },
  });

  expectAssessment(result, "current", "verified-match");
});

test("irrelevant slab thickness change does not stale base", () => {
  const result = evaluate("base", {
    currentProjectInputs: {
      ...PROJECT,
      thickness: 8,
    },
  });

  expectAssessment(result, "current", "verified-match");
});

test("irrelevant waste change does not stale reinforcement", () => {
  const result = evaluate("reinforcement", {
    currentProjectInputs: {
      ...PROJECT,
      wastePercent: 25,
    },
  });

  expectAssessment(result, "current", "verified-match");
});

test("missing provenance is unverified", () => {
  expectAssessment(
    evaluate("concrete", { provenance: undefined }),
    "unverified",
    "missing-provenance",
  );
});

test("malformed provenance is unverified", () => {
  expectAssessment(
    evaluate("concrete", { provenance: { version: 999 } }),
    "unverified",
    "invalid-provenance",
  );
});

test("mismatched provenance scope is rejected", () => {
  expectAssessment(
    evaluate("concrete", {
      provenance: makeProvenance("base"),
    }),
    "unverified",
    "invalid-provenance",
  );
});

test("unsupported calculator pairing is rejected", () => {
  expectAssessment(
    evaluate("concrete", {
      calculatorId: "gravel-calculator",
    }),
    "unverified",
    "unsupported-scope",
  );
});

test("unsupported workflow scope is rejected", () => {
  expectAssessment(
    assessWorkflowResultFreshness({
      stepId: "not-a-scope",
      calculatorId: "unknown-calculator",
      provenance: null,
      currentProjectInputs: { ...PROJECT },
      currentUnitSystem: "imperial",
    }),
    "unverified",
    "unsupported-scope",
  );
});

test("effective dimension override is unverified", () => {
  const provenance = makeProvenance("concrete");

  provenance.effectiveInputs.width = 99;

  const result = evaluate("concrete", { provenance });

  expectAssessment(
    result,
    "unverified",
    "effective-input-mismatch",
  );

  assert.ok(result.affectedInputs.includes("width"));
});

test("missing effective input is unverified", () => {
  const provenance = makeProvenance("labor");

  delete provenance.effectiveInputs.lengthFeet;

  expectAssessment(
    evaluate("labor", { provenance }),
    "unverified",
    "effective-input-mismatch",
  );
});

test("missing required project input is unverified", () => {
  const provenance = makeProvenance("concrete");

  delete provenance.projectInputs.length;

  expectAssessment(
    evaluate("concrete", { provenance }),
    "unverified",
    "missing-required-input",
  );
});

test("missing current project input is unverified", () => {
  expectAssessment(
    evaluate("concrete", {
      currentProjectInputs: {
        width: PROJECT.width,
        thickness: PROJECT.thickness,
        wastePercent: PROJECT.wastePercent,
      },
    }),
    "unverified",
    "missing-required-input",
  );
});

test("metric results are not automatically verified", () => {
  const provenance = makeProvenance("concrete", {
    unitSystem: "metric",
  });

  expectAssessment(
    evaluate("concrete", {
      provenance,
      currentUnitSystem: "metric",
    }),
    "unverified",
    "unit-system-mismatch",
  );
});

test("changed unit system is unverified", () => {
  expectAssessment(
    evaluate("concrete", {
      currentUnitSystem: "metric",
    }),
    "unverified",
    "unit-system-mismatch",
  );
});

test("delivery known-yards mode is unverified", () => {
  const provenance = makeProvenance("delivery", {
    calculationMode: "Known cubic yards",
    effectiveInputs: {
      ...makeProvenance("delivery").effectiveInputs,
      inputMode: "Known cubic yards",
    },
  });

  expectAssessment(
    evaluate("delivery", { provenance }),
    "unverified",
    "unsupported-calculation-mode",
  );
});

test("delivery unknown mode is unverified", () => {
  const provenance = makeProvenance("delivery", {
    calculationMode: "unknown",
  });

  expectAssessment(
    evaluate("delivery", { provenance }),
    "unverified",
    "unsupported-calculation-mode",
  );
});

test("delivery mode disagreement is unverified", () => {
  const provenance = makeProvenance("delivery");

  provenance.effectiveInputs.inputMode = "Known cubic yards";

  expectAssessment(
    evaluate("delivery", { provenance }),
    "unverified",
    "unsupported-calculation-mode",
  );
});

test("unexpected calculation mode is unverified for direct scope", () => {
  const provenance = makeProvenance("finishing", {
    calculationMode: "manual",
  });

  expectAssessment(
    evaluate("finishing", { provenance }),
    "unverified",
    "unsupported-calculation-mode",
  );
});

test("pumping volume mismatch is unverified", () => {
  const provenance = makeProvenance("pumping");

  provenance.effectiveInputs.concreteYards += 2;

  expectAssessment(
    evaluate("pumping", { provenance }),
    "unverified",
    "effective-input-mismatch",
  );
});

test("pumping missing volume is unverified", () => {
  const provenance = makeProvenance("pumping");

  delete provenance.effectiveInputs.concreteYards;

  expectAssessment(
    evaluate("pumping", { provenance }),
    "unverified",
    "effective-input-mismatch",
  );
});

test("pumping volume includes waste percentage", () => {
  const provenance = makeProvenance("pumping");

  assert.equal(
    provenance.effectiveInputs.concreteYards,
    volumeYards(),
  );

  expectAssessment(
    evaluate("pumping", { provenance }),
    "current",
    "verified-match",
  );
});

test("assessment does not mutate supplied provenance", () => {
  const provenance = makeProvenance("concrete");
  const before = structuredClone(provenance);

  evaluate("concrete", { provenance });

  assert.deepEqual(provenance, before);
});
