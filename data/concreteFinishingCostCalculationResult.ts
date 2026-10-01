import type { CalculationResult } from "./calculationResult";

export type ConcreteFinishingCostResult = {
  area: number;
  crewHours: number;
  personHours: number;
  laborCost: number;
  finishMaterialCost: number;
  curingCost: number;
  sealingCost: number;
  edgeWorkCost: number;
  sawCutCost: number;
  cleanupCost: number;
  directCost: number;
  overheadCost: number;
  subtotal: number;
  minimumCharge: number;
  minimumChargeAdjustment: number;
  totalCost: number;
  costPerSqFt: number;
  laborCostPerSqFt: number;
  materialCostPerSqFt: number;
  notes: string[];
};

export function buildConcreteFinishingCostCalculationResult({
  preset,
  length,
  width,
  finishType,
  productionRateSqFtPerHour,
  crewSize,
  laborRatePerHour,
  finishMaterialCostPerSqFt,
  edgeWorkCost,
  curingCostPerSqFt,
  sealingCostPerSqFt,
  sawCutCost,
  cleanupCost,
  minimumCharge,
  overheadPercent,
  result,
}: {
  preset: string;
  length: number;
  width: number;
  finishType: string;
  productionRateSqFtPerHour: number;
  crewSize: number;
  laborRatePerHour: number;
  finishMaterialCostPerSqFt: number;
  edgeWorkCost: number;
  curingCostPerSqFt: number;
  sealingCostPerSqFt: number;
  sawCutCost: number;
  cleanupCost: number;
  minimumCharge: number;
  overheadPercent: number;
  result: ConcreteFinishingCostResult;
}): CalculationResult {
  const projectDirectCost =
    result.finishMaterialCost +
    result.curingCost +
    result.sealingCost +
    result.edgeWorkCost +
    result.cleanupCost;

  const projectOverheadCost =
    projectDirectCost * (overheadPercent / 100);

  const projectTotalCost =
    projectDirectCost + projectOverheadCost;

  return {
    calculatorId: "concrete-finishing-cost-calculator",
    calculatorTitle: "Concrete Finishing Cost Calculator",

    inputSummary: [
      {
        key: "preset",
        label: "Preset",
        value: preset,
      },
      {
        key: "length",
        label: "Length",
        value: length,
        unit: "ft",
      },
      {
        key: "width",
        label: "Width",
        value: width,
        unit: "ft",
      },
      {
        key: "finishType",
        label: "Finish Type",
        value: finishType,
      },
      {
        key: "productionRateSqFtPerHour",
        label: "Production Rate",
        value: productionRateSqFtPerHour,
        unit: "sq ft/hr",
      },
      {
        key: "crewSize",
        label: "Crew Size",
        value: crewSize,
        unit: "workers",
      },
      {
        key: "laborRatePerHour",
        label: "Labor Rate",
        value: laborRatePerHour,
        unit: "$/person hr",
      },
      {
        key: "finishMaterialCostPerSqFt",
        label: "Finish Material",
        value: finishMaterialCostPerSqFt,
        unit: "$/sq ft",
      },
      {
        key: "edgeWorkCost",
        label: "Edge Work",
        value: edgeWorkCost,
        unit: "$",
      },
      {
        key: "curingCostPerSqFt",
        label: "Curing",
        value: curingCostPerSqFt,
        unit: "$/sq ft",
      },
      {
        key: "sealingCostPerSqFt",
        label: "Sealing",
        value: sealingCostPerSqFt,
        unit: "$/sq ft",
      },
      {
        key: "sawCutCost",
        label: "Saw Cut Allowance",
        value: sawCutCost,
        unit: "$",
      },
      {
        key: "cleanupCost",
        label: "Cleanup",
        value: cleanupCost,
        unit: "$",
      },
      {
        key: "minimumCharge",
        label: "Minimum Charge",
        value: minimumCharge,
        unit: "$",
      },
      {
        key: "overheadPercent",
        label: "Overhead Allowance",
        value: overheadPercent,
        unit: "%",
      },
    ],

    metrics: [
      {
        key: "area",
        label: "Surface Area",
        value: result.area,
        unit: "sq ft",
      },
      {
        key: "crewHours",
        label: "Crew Hours",
        value: result.crewHours,
        unit: "hr",
      },
      {
        key: "personHours",
        label: "Person Hours",
        value: result.personHours,
        unit: "person hr",
      },
      {
        key: "costPerSqFt",
        label: "Native Cost Per Square Foot",
        value: result.costPerSqFt,
        unit: "$/sq ft",
      },
      {
        key: "laborCostPerSqFt",
        label: "Labor Cost Per Square Foot",
        value: result.laborCostPerSqFt,
        unit: "$/sq ft",
      },
      {
        key: "materialCostPerSqFt",
        label: "Material / Add-on Cost Per Square Foot",
        value: result.materialCostPerSqFt,
        unit: "$/sq ft",
      },
    ],

    costs: [
      {
        key: "laborCost",
        label: "Labor Cost",
        amount: result.laborCost,
      },
      {
        key: "finishMaterialCost",
        label: "Finish Material Cost",
        amount: result.finishMaterialCost,
      },
      {
        key: "curingCost",
        label: "Curing Cost",
        amount: result.curingCost,
      },
      {
        key: "sealingCost",
        label: "Sealing Cost",
        amount: result.sealingCost,
      },
      {
        key: "edgeWorkCost",
        label: "Edge Work",
        amount: result.edgeWorkCost,
      },
      {
        key: "sawCutCost",
        label: "Saw Cut Allowance",
        amount: result.sawCutCost,
      },
      {
        key: "cleanupCost",
        label: "Cleanup",
        amount: result.cleanupCost,
      },
      {
        key: "nativeDirectCost",
        label: "Native Direct Cost",
        amount: result.directCost,
      },
      {
        key: "nativeOverheadCost",
        label: "Native Overhead Allowance",
        amount: result.overheadCost,
      },
      {
        key: "nativeSubtotal",
        label: "Native Subtotal",
        amount: result.subtotal,
      },
      {
        key: "minimumCharge",
        label: "Minimum Charge",
        amount: result.minimumCharge,
      },
      {
        key: "minimumChargeAdjustment",
        label: "Minimum Charge Adjustment",
        amount: result.minimumChargeAdjustment,
      },
      {
        key: "nativeTotalCost",
        label: "Native Finishing Estimate Total",
        amount: result.totalCost,
      },
      {
        key: "projectDirectCost",
        label: "Project Finishing Direct Cost",
        amount: projectDirectCost,
      },
      {
        key: "projectOverheadCost",
        label: "Project Finishing Overhead",
        amount: projectOverheadCost,
      },
    ],

    totalCost: projectTotalCost,

    notes: [
      ...result.notes,
      "Project total contribution includes finish materials, curing, sealing, edge work, cleanup, and overhead attributable to those Finishing-owned costs.",
      "Finishing labor is excluded from the Project contribution because labor is tracked separately by the project's Labor scope.",
      "Saw-cut allowance is excluded from the Project contribution because saw cutting is tracked separately by the project's Joints scope.",
      "The native finishing minimum charge is preserved for reference but is not reapplied to the reduced Project Finishing contribution because the native minimum covers the combined finishing estimate.",
    ],
  };
}
