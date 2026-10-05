import {
  isCalculationResult,
  type CalculationResult,
} from "./calculationResult";

export type WorkflowResult = {
  stepId: string;
  calculatorId: string;
  calculatorTitle: string;
  result: CalculationResult;
  updatedAt: string;
};

export function createWorkflowResult({
  stepId,
  result,
  updatedAt,
}: {
  stepId: string;
  result: CalculationResult;
  updatedAt: string;
}): WorkflowResult {
  return {
    stepId,
    calculatorId: result.calculatorId,
    calculatorTitle: result.calculatorTitle,
    result,
    updatedAt,
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

  return (
    workflowResult.calculatorId ===
      workflowResult.result.calculatorId &&
    workflowResult.calculatorTitle ===
      workflowResult.result.calculatorTitle
  );
}
