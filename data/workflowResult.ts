import {
  isCalculationResult,
  type CalculationResult,
} from "./calculationResult";
import {
  isWorkflowResultProvenanceV1,
  type WorkflowResultProvenanceV1,
} from "./workflowResultProvenance";

export type WorkflowResult = {
  stepId: string;
  calculatorId: string;
  calculatorTitle: string;
  result: CalculationResult;
  updatedAt: string;
  provenance?: WorkflowResultProvenanceV1;
};

export function createWorkflowResult({
  stepId,
  result,
  updatedAt,
  provenance,
}: {
  stepId: string;
  result: CalculationResult;
  updatedAt: string;
  provenance?: WorkflowResultProvenanceV1;
}): WorkflowResult {
  return {
    stepId,
    calculatorId: result.calculatorId,
    calculatorTitle: result.calculatorTitle,
    result,
    updatedAt,
    ...(provenance !== undefined ? { provenance } : {}),
  };
}

export function isWorkflowResult(
  value: unknown,
): value is WorkflowResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const workflowResult = value as Partial<WorkflowResult>;

  if (
    typeof workflowResult.stepId !== "string" ||
    typeof workflowResult.calculatorId !== "string" ||
    typeof workflowResult.calculatorTitle !== "string" ||
    typeof workflowResult.updatedAt !== "string" ||
    !isCalculationResult(workflowResult.result)
  ) {
    return false;
  }

  if (
    workflowResult.calculatorId !==
      workflowResult.result.calculatorId ||
    workflowResult.calculatorTitle !==
      workflowResult.result.calculatorTitle
  ) {
    return false;
  }

  if ("provenance" in workflowResult) {
    return (
      isWorkflowResultProvenanceV1(workflowResult.provenance) &&
      workflowResult.provenance.stepId === workflowResult.stepId &&
      workflowResult.provenance.calculatorId ===
        workflowResult.calculatorId
    );
  }

  return true;
}
