export type CalculationResultValue =
  | string
  | number
  | boolean
  | null;

export type CalculationResultField = {
  key: string;
  label: string;
  value: CalculationResultValue;
  unit?: string;
};

export type CalculationResultMetric = {
  key: string;
  label: string;
  value: number;
  unit?: string;
};

export type CalculationResultCost = {
  key: string;
  label: string;
  amount: number;
};

export type CalculationResult = {
  calculatorId: string;
  calculatorTitle: string;

  inputSummary: CalculationResultField[];

  metrics: CalculationResultMetric[];

  costs?: CalculationResultCost[];

  totalCost?: number;

  notes?: string[];
};

export function isCalculationResult(
  value: unknown,
): value is CalculationResult {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const result =
    value as Partial<CalculationResult>;

  return (
    typeof result.calculatorId === "string" &&
    typeof result.calculatorTitle === "string" &&
    Array.isArray(result.inputSummary) &&
    Array.isArray(result.metrics) &&
    (
      result.costs === undefined ||
      Array.isArray(result.costs)
    ) &&
    (
      result.totalCost === undefined ||
      (
        typeof result.totalCost === "number" &&
        Number.isFinite(result.totalCost)
      )
    ) &&
    (
      result.notes === undefined ||
      Array.isArray(result.notes)
    )
  );
}
