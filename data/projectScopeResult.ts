import {
  isCalculationResult,
  type CalculationResult,
} from "./calculationResult";
import {
  isWorkflowResultProvenanceV1,
  type WorkflowResultProvenanceV1,
} from "./workflowResultProvenance";

export type ProjectScopeResult = {
  scopeId: string;
  calculatorId: string;
  calculatorTitle: string;
  result: CalculationResult;
  updatedAt: string;
  provenance?: WorkflowResultProvenanceV1;
};

export function isProjectScopeResult(
  value: unknown,
): value is ProjectScopeResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const scopeResult = value as Partial<ProjectScopeResult>;

  if (
    typeof scopeResult.scopeId !== "string" ||
    typeof scopeResult.calculatorId !== "string" ||
    typeof scopeResult.calculatorTitle !== "string" ||
    typeof scopeResult.updatedAt !== "string" ||
    !isCalculationResult(scopeResult.result)
  ) {
    return false;
  }

  if (
    scopeResult.calculatorId !==
      scopeResult.result.calculatorId ||
    scopeResult.calculatorTitle !==
      scopeResult.result.calculatorTitle
  ) {
    return false;
  }

  if ("provenance" in scopeResult) {
    return (
      isWorkflowResultProvenanceV1(scopeResult.provenance) &&
      scopeResult.provenance.stepId === scopeResult.scopeId &&
      scopeResult.provenance.calculatorId ===
        scopeResult.calculatorId
    );
  }

  return true;
}
