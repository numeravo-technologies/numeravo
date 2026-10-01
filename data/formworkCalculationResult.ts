import type { CalculationResult } from "./calculationResult";

export type FormworkCalculationResultValues = {
  perimeter: number;
  baseFormLinearFeet: number;
  wasteLinearFeet: number;
  totalFormLinearFeet: number;
  boardCount: number;
  stakeCount: number;
  braceCount: number;
  boardCostTotal: number;
  stakeCostTotal: number;
  braceCostTotal: number;
  fastenerCost: number;
  formOilCost: number;
  materialCost: number;
  laborCost: number;
  totalCost: number;
  costPerLinearFoot: number;
  laborCostPerLinearFoot: number;
  notes: string[];
};

export function buildFormworkCalculationResult({
  presetType,
  length,
  width,
  formRuns,
  extraFormRuns,
  boardLength,
  boardCost,
  stakeSpacing,
  stakeCost,
  braceSpacing,
  braceCost,
  fastenerCostPerBoard,
  formOilCostPerFoot,
  wastePercent,
  laborHours,
  laborRate,
  results,
}: {
  presetType: string;
  length: number;
  width: number;
  formRuns: number;
  extraFormRuns: number;
  boardLength: number;
  boardCost: number;
  stakeSpacing: number;
  stakeCost: number;
  braceSpacing: number;
  braceCost: number;
  fastenerCostPerBoard: number;
  formOilCostPerFoot: number;
  wastePercent: number;
  laborHours: number;
  laborRate: number;
  results: FormworkCalculationResultValues;
}): CalculationResult {
  return {
    calculatorId: "concrete-formwork-calculator",
    calculatorTitle: "Concrete Formwork Calculator",

    inputSummary: [
      {
        key: "presetType",
        label: "Preset",
        value: presetType,
      },
      {
        key: "length",
        label: "Pour Length",
        value: length,
        unit: "ft",
      },
      {
        key: "width",
        label: "Pour Width",
        value: width,
        unit: "ft",
      },
      {
        key: "formRuns",
        label: "Form Runs",
        value: formRuns,
        unit: "runs",
      },
      {
        key: "extraFormRuns",
        label: "Extra Form Length",
        value: extraFormRuns,
        unit: "ft",
      },
      {
        key: "boardLength",
        label: "Board Length",
        value: boardLength,
        unit: "ft",
      },
      {
        key: "boardCost",
        label: "Cost Per Board",
        value: boardCost,
        unit: "$",
      },
      {
        key: "stakeSpacing",
        label: "Stake Spacing",
        value: stakeSpacing,
        unit: "ft",
      },
      {
        key: "stakeCost",
        label: "Cost Per Stake",
        value: stakeCost,
        unit: "$",
      },
      {
        key: "braceSpacing",
        label: "Brace Spacing",
        value: braceSpacing,
        unit: "ft",
      },
      {
        key: "braceCost",
        label: "Cost Per Brace",
        value: braceCost,
        unit: "$",
      },
      {
        key: "fastenerCostPerBoard",
        label: "Fastener Cost Per Board",
        value: fastenerCostPerBoard,
        unit: "$",
      },
      {
        key: "formOilCostPerFoot",
        label: "Form Oil Cost",
        value: formOilCostPerFoot,
        unit: "$/ft",
      },
      {
        key: "wastePercent",
        label: "Waste",
        value: wastePercent,
        unit: "%",
      },
      {
        key: "laborHours",
        label: "Labor Hours",
        value: laborHours,
        unit: "hr",
      },
      {
        key: "laborRate",
        label: "Labor Rate",
        value: laborRate,
        unit: "$/hr",
      },
    ],

    metrics: [
      {
        key: "perimeter",
        label: "Perimeter",
        value: results.perimeter,
        unit: "ft",
      },
      {
        key: "baseFormLinearFeet",
        label: "Base Form Linear Feet",
        value: results.baseFormLinearFeet,
        unit: "ft",
      },
      {
        key: "wasteLinearFeet",
        label: "Waste Linear Feet",
        value: results.wasteLinearFeet,
        unit: "ft",
      },
      {
        key: "totalFormLinearFeet",
        label: "Total Form Linear Feet",
        value: results.totalFormLinearFeet,
        unit: "ft",
      },
      {
        key: "boardCount",
        label: "Form Boards",
        value: results.boardCount,
        unit: "boards",
      },
      {
        key: "stakeCount",
        label: "Stakes",
        value: results.stakeCount,
        unit: "stakes",
      },
      {
        key: "braceCount",
        label: "Braces",
        value: results.braceCount,
        unit: "braces",
      },
      {
        key: "costPerLinearFoot",
        label: "Cost Per Linear Foot",
        value: results.costPerLinearFoot,
        unit: "$/ft",
      },
      {
        key: "laborCostPerLinearFoot",
        label: "Labor Cost Per Linear Foot",
        value: results.laborCostPerLinearFoot,
        unit: "$/ft",
      },
    ],

    costs: [
      {
        key: "boardCost",
        label: "Board Cost",
        amount: results.boardCostTotal,
      },
      {
        key: "stakeCost",
        label: "Stake Cost",
        amount: results.stakeCostTotal,
      },
      {
        key: "braceCost",
        label: "Brace Cost",
        amount: results.braceCostTotal,
      },
      {
        key: "fastenerCost",
        label: "Fasteners",
        amount: results.fastenerCost,
      },
      {
        key: "formOilCost",
        label: "Form Oil / Release",
        amount: results.formOilCost,
      },
      {
        key: "materialCost",
        label: "Formwork Material Cost",
        amount: results.materialCost,
      },
      {
        key: "laborCost",
        label: "Formwork Labor Cost",
        amount: results.laborCost,
      },
    ],

    totalCost: results.materialCost,

    notes: [
      ...results.notes,
      "Project total contribution uses formwork material cost only. Labor is tracked separately by the project's Labor scope.",
    ],
  };
}
