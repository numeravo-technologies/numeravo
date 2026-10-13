import {
  isWorkflowResultProvenanceV1,
  type ProjectInputKey,
  type WorkflowUnitSystem,
} from "./workflowResultProvenance";

import {
  getWorkflowFreshnessDependency,
} from "./workflowFreshnessDependencies";

export type WorkflowFreshnessStatus =
  | "current"
  | "needs-recalculation"
  | "unverified";

export type WorkflowFreshnessReason =
  | "verified-match"
  | "relevant-input-changed"
  | "effective-input-mismatch"
  | "missing-provenance"
  | "invalid-provenance"
  | "missing-required-input"
  | "unsupported-scope"
  | "unit-system-mismatch"
  | "unsupported-calculation-mode";

export type WorkflowFreshnessAssessment = {
  status: WorkflowFreshnessStatus;
  reason: WorkflowFreshnessReason;
  affectedInputs: string[];
};

export type WorkflowFreshnessRequest = {
  stepId: string;
  calculatorId: string;
  provenance: unknown;
  currentProjectInputs: Record<string, unknown>;
  currentUnitSystem: WorkflowUnitSystem;
};

const EFFECTIVE_INPUT_KEYS: Record<string, Record<string, string>> = {
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

function assessment(
  status: WorkflowFreshnessStatus,
  reason: WorkflowFreshnessReason,
  affectedInputs: string[] = [],
): WorkflowFreshnessAssessment {
  return { status, reason, affectedInputs };
}

function validNumber(value: unknown): value is number {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0;
}

function sameNumber(a: number, b: number): boolean {
  return a === b;
}

function sameDerivedVolume(a: number, b: number): boolean {
  return Math.abs(a - b) <=
    1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
}

function derivedImperialYards(
  inputs: Partial<Record<ProjectInputKey, number>>,
): number | null {
  const length = inputs.length;
  const width = inputs.width;
  const thickness = inputs.thickness;
  const wastePercent = inputs.wastePercent;

  if (
    !validNumber(length) ||
    !validNumber(width) ||
    !validNumber(thickness) ||
    !validNumber(wastePercent)
  ) {
    return null;
  }

  return (
    length *
    width *
    (thickness / 12) /
    27 *
    (1 + wastePercent / 100)
  );
}

export function assessWorkflowResultFreshness({
  stepId,
  calculatorId,
  provenance,
  currentProjectInputs,
  currentUnitSystem,
}: WorkflowFreshnessRequest): WorkflowFreshnessAssessment {
  const dependency = getWorkflowFreshnessDependency(stepId);

  if (!dependency || dependency.calculatorId !== calculatorId) {
    return assessment("unverified", "unsupported-scope");
  }

  if (provenance === null || provenance === undefined) {
    return assessment("unverified", "missing-provenance");
  }

  if (!isWorkflowResultProvenanceV1(provenance)) {
    return assessment("unverified", "invalid-provenance");
  }

  if (
    provenance.stepId !== stepId ||
    provenance.calculatorId !== calculatorId
  ) {
    return assessment("unverified", "invalid-provenance");
  }

  if (
    currentUnitSystem !== "imperial" &&
    currentUnitSystem !== "metric"
  ) {
    return assessment("unverified", "unit-system-mismatch");
  }

  if (
    provenance.unitSystem !== currentUnitSystem ||
    currentUnitSystem !== "imperial"
  ) {
    return assessment("unverified", "unit-system-mismatch");
  }

  const savedInputs = provenance.projectInputs;

  const missing = dependency.projectInputKeys.filter(
    (key) =>
      !validNumber(savedInputs[key]) ||
      !validNumber(currentProjectInputs[key]),
  );

  if (missing.length > 0) {
    return assessment(
      "unverified",
      "missing-required-input",
      missing,
    );
  }

  if (stepId === "delivery") {
    const mode = provenance.calculationMode;

    if (mode !== "Calculate from dimensions") {
      return assessment(
        "unverified",
        "unsupported-calculation-mode",
      );
    }

    if (
      provenance.effectiveInputs.inputMode !== mode
    ) {
      return assessment(
        "unverified",
        "unsupported-calculation-mode",
      );
    }
  } else if (
    provenance.calculationMode !== undefined
  ) {
    return assessment(
      "unverified",
      "unsupported-calculation-mode",
    );
  }

  if (stepId === "pumping") {
    const expected = derivedImperialYards(savedInputs);
    const actual = provenance.effectiveInputs.concreteYards;

    if (
      expected === null ||
      !validNumber(actual) ||
      !sameDerivedVolume(expected, actual)
    ) {
      return assessment(
        "unverified",
        "effective-input-mismatch",
        ["concreteYards"],
      );
    }
  } else {
    const mappings = EFFECTIVE_INPUT_KEYS[stepId];

    if (!mappings) {
      return assessment("unverified", "unsupported-scope");
    }

    const mismatched = dependency.projectInputKeys.filter(
      (key) => {
        const effectiveKey = mappings[key];
        const actual = provenance.effectiveInputs[effectiveKey];
        const expected = savedInputs[key];

        return (
          !validNumber(actual) ||
          !validNumber(expected) ||
          !sameNumber(actual, expected)
        );
      },
    );

    if (mismatched.length > 0) {
      return assessment(
        "unverified",
        "effective-input-mismatch",
        mismatched,
      );
    }
  }

  const changed = dependency.projectInputKeys.filter(
    (key) =>
      savedInputs[key] !== currentProjectInputs[key],
  );

  if (changed.length > 0) {
    return assessment(
      "needs-recalculation",
      "relevant-input-changed",
      changed,
    );
  }

  return assessment("current", "verified-match");
}
