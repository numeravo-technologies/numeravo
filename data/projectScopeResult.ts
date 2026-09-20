import {
  isCalculationResult,
  type CalculationResult,
} from "./calculationResult";

export type ProjectScopeResult = {
  scopeId: string;
  calculatorId: string;
  calculatorTitle: string;
  result: CalculationResult;
  updatedAt: string;
};

export function createProjectScopeResult({
  scopeId,
  result,
  updatedAt,
}: {
  scopeId: string;
  result: CalculationResult;
  updatedAt: string;
}): ProjectScopeResult {
  return {
    scopeId,
    calculatorId: result.calculatorId,
    calculatorTitle: result.calculatorTitle,
    result,
    updatedAt,
  };
}

export function isProjectScopeResult(
  value: unknown,
): value is ProjectScopeResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const scopeResult = value as Partial<ProjectScopeResult>;

  return (
    typeof scopeResult.scopeId === "string" &&
    typeof scopeResult.calculatorId === "string" &&
    typeof scopeResult.calculatorTitle === "string" &&
    typeof scopeResult.updatedAt === "string" &&
    isCalculationResult(scopeResult.result)
  );
}
