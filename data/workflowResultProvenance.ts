export const WORKFLOW_PROVENANCE_VERSION = 1 as const;

export const CONCRETE_WORKFLOW_DEFINITION_ID =
  "construction.concrete-slab-equipment-pad" as const;

export const CONCRETE_WORKFLOW_SCOPE_CALCULATORS = {
  concrete: "concrete-calculator",
  base: "gravel-calculator",
  reinforcement: "rebar-spacing-for-concrete-slab",
  formwork: "concrete-formwork-calculator",
  delivery: "concrete-truckload-calculator",
  pumping: "concrete-pump-truck-cost-calculator",
  labor: "concrete-labor-cost-calculator",
  finishing: "concrete-finishing-cost-calculator",
  joints: "concrete-saw-cut-calculator",
} as const;

export type ConcreteWorkflowStepId =
  keyof typeof CONCRETE_WORKFLOW_SCOPE_CALCULATORS;

export type ProjectInputKey =
  | "length"
  | "width"
  | "thickness"
  | "wastePercent";

export type WorkflowUnitSystem =
  | "imperial"
  | "metric";

export type EffectiveInputValue =
  | string
  | number
  | boolean
  | null;

export type WorkflowResultProvenanceV1 = {
  version: typeof WORKFLOW_PROVENANCE_VERSION;
  workflowDefinitionId:
    typeof CONCRETE_WORKFLOW_DEFINITION_ID;
  stepId: ConcreteWorkflowStepId;
  calculatorId: string;
  unitSystem: WorkflowUnitSystem;
  projectInputs: Partial<Record<ProjectInputKey, number>>;
  effectiveInputs: Record<string, EffectiveInputValue>;
  calculationMode?: string;
};

const PROJECT_INPUT_KEYS = new Set<string>([
  "length",
  "width",
  "thickness",
  "wastePercent",
]);

const REQUIRED_KEYS = [
  "version",
  "workflowDefinitionId",
  "stepId",
  "calculatorId",
  "unitSystem",
  "projectInputs",
  "effectiveInputs",
];

const ALLOWED_KEYS = new Set([
  ...REQUIRED_KEYS,
  "calculationMode",
]);

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function hasOwn(
  record: Record<string, unknown>,
  key: string,
): boolean {
  return Object.prototype.hasOwnProperty.call(
    record,
    key,
  );
}

function isFiniteNumber(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

export function isWorkflowResultProvenanceV1(
  value: unknown,
): value is WorkflowResultProvenanceV1 {
  if (!isRecord(value)) {
    return false;
  }

  if (
    REQUIRED_KEYS.some((key) => !hasOwn(value, key)) ||
    Object.keys(value).some(
      (key) => !ALLOWED_KEYS.has(key),
    )
  ) {
    return false;
  }

  if (
    value.version !== WORKFLOW_PROVENANCE_VERSION ||
    value.workflowDefinitionId !==
      CONCRETE_WORKFLOW_DEFINITION_ID ||
    typeof value.stepId !== "string" ||
    !hasOwn(
      CONCRETE_WORKFLOW_SCOPE_CALCULATORS,
      value.stepId,
    )
  ) {
    return false;
  }

  const stepId =
    value.stepId as ConcreteWorkflowStepId;

  if (
    value.calculatorId !==
      CONCRETE_WORKFLOW_SCOPE_CALCULATORS[stepId] ||
    (
      value.unitSystem !== "imperial" &&
      value.unitSystem !== "metric"
    )
  ) {
    return false;
  }

  if (
    !isRecord(value.projectInputs) ||
    !isRecord(value.effectiveInputs)
  ) {
    return false;
  }

  for (const [key, input] of Object.entries(
    value.projectInputs,
  )) {
    if (
      !PROJECT_INPUT_KEYS.has(key) ||
      !isFiniteNumber(input)
    ) {
      return false;
    }
  }

  for (const [key, input] of Object.entries(
    value.effectiveInputs,
  )) {
    if (
      key.length === 0 ||
      !(
        input === null ||
        typeof input === "string" ||
        typeof input === "boolean" ||
        isFiniteNumber(input)
      )
    ) {
      return false;
    }
  }

  if (
    value.calculationMode !== undefined &&
    (
      typeof value.calculationMode !== "string" ||
      value.calculationMode.trim().length === 0
    )
  ) {
    return false;
  }

  return true;
}
