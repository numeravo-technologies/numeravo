import type { CalculationResult } from "./calculationResult";

export type ConcreteSawCutCalculationResultValues = {
  area: number;
  sawCutDepth: number;
  minimumDepth: number;
  deeperCutDepth: number;
  spacingGuideLow: number;
  spacingGuideHigh: number;
  crossCuts: number;
  crossCutFeet: number;
  lengthwiseCuts: number;
  lengthwiseCutFeet: number;
  layoutCutFeet: number;
  extraCutLength: number;
  cutFeetBeforeOverrun: number;
  overrunFeet: number;
  totalCutFeet: number;
  panelsLong: number;
  panelsWide: number;
  panelCount: number;
  averagePanelLength: number;
  averagePanelWidth: number;
  cutCost: number;
  setupCost: number;
  subtotal: number;
  minimumCharge: number;
  minimumChargeAdjustment: number;
  totalCost: number;
  costPerSquareFoot: number;
  estimatedCuttingHours: number;
  notes: string[];
};

export function buildConcreteSawCutCalculationResult({
  preset,
  length,
  width,
  thickness,
  targetSpacing,
  cutPurpose,
  cutBothDirections,
  extraCutLength,
  costPerLinearFoot,
  setupCost,
  minimumCharge,
  wasteOrOverrunPercent,
  result,
}: {
  preset: string;
  length: number;
  width: number;
  thickness: number;
  targetSpacing: number;
  cutPurpose: string;
  cutBothDirections: boolean;
  extraCutLength: number;
  costPerLinearFoot: number;
  setupCost: number;
  minimumCharge: number;
  wasteOrOverrunPercent: number;
  result: ConcreteSawCutCalculationResultValues;
}): CalculationResult {
  return {
    calculatorId: "concrete-saw-cut-calculator",
    calculatorTitle: "Concrete Saw Cut Calculator",

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
        key: "thickness",
        label: "Slab Thickness",
        value: thickness,
        unit: "in",
      },
      {
        key: "targetSpacing",
        label: "Target Spacing",
        value: targetSpacing,
        unit: "ft",
      },
      {
        key: "cutPurpose",
        label: "Cut Purpose",
        value: cutPurpose,
      },
      {
        key: "cutBothDirections",
        label: "Cuts In Both Directions",
        value: cutBothDirections,
      },
      {
        key: "extraCutLength",
        label: "Extra Edge / Demo Cuts",
        value: extraCutLength,
        unit: "ft",
      },
      {
        key: "costPerLinearFoot",
        label: "Saw Cutting Price",
        value: costPerLinearFoot,
        unit: "$/ft",
      },
      {
        key: "setupCost",
        label: "Setup Cost",
        value: setupCost,
        unit: "$",
      },
      {
        key: "minimumCharge",
        label: "Minimum Charge",
        value: minimumCharge,
        unit: "$",
      },
      {
        key: "wasteOrOverrunPercent",
        label: "Overrun Allowance",
        value: wasteOrOverrunPercent,
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
        key: "sawCutDepth",
        label: "Saw Cut Depth Guide",
        value: result.sawCutDepth,
        unit: "in",
      },
      {
        key: "minimumDepth",
        label: "Minimum Depth Guide",
        value: result.minimumDepth,
        unit: "in",
      },
      {
        key: "deeperCutDepth",
        label: "Deeper Cut Reference",
        value: result.deeperCutDepth,
        unit: "in",
      },
      {
        key: "spacingGuideLow",
        label: "Spacing Guide Low",
        value: result.spacingGuideLow,
        unit: "ft",
      },
      {
        key: "spacingGuideHigh",
        label: "Spacing Guide High",
        value: result.spacingGuideHigh,
        unit: "ft",
      },
      {
        key: "crossCuts",
        label: "Cross Cuts",
        value: result.crossCuts,
        unit: "cuts",
      },
      {
        key: "crossCutFeet",
        label: "Cross Cut Length",
        value: result.crossCutFeet,
        unit: "ft",
      },
      {
        key: "lengthwiseCuts",
        label: "Lengthwise Cuts",
        value: result.lengthwiseCuts,
        unit: "cuts",
      },
      {
        key: "lengthwiseCutFeet",
        label: "Lengthwise Cut Length",
        value: result.lengthwiseCutFeet,
        unit: "ft",
      },
      {
        key: "layoutCutFeet",
        label: "Layout Cut Length",
        value: result.layoutCutFeet,
        unit: "ft",
      },
      {
        key: "cutFeetBeforeOverrun",
        label: "Cut Length Before Overrun",
        value: result.cutFeetBeforeOverrun,
        unit: "ft",
      },
      {
        key: "overrunFeet",
        label: "Overrun Allowance",
        value: result.overrunFeet,
        unit: "ft",
      },
      {
        key: "totalCutFeet",
        label: "Total Saw Cut Length",
        value: result.totalCutFeet,
        unit: "ft",
      },
      {
        key: "panelsLong",
        label: "Panels Long",
        value: result.panelsLong,
        unit: "panels",
      },
      {
        key: "panelsWide",
        label: "Panels Wide",
        value: result.panelsWide,
        unit: "panels",
      },
      {
        key: "panelCount",
        label: "Panel Count",
        value: result.panelCount,
        unit: "panels",
      },
      {
        key: "averagePanelLength",
        label: "Average Panel Length",
        value: result.averagePanelLength,
        unit: "ft",
      },
      {
        key: "averagePanelWidth",
        label: "Average Panel Width",
        value: result.averagePanelWidth,
        unit: "ft",
      },
      {
        key: "estimatedCuttingHours",
        label: "Estimated Cutting Time",
        value: result.estimatedCuttingHours,
        unit: "hr",
      },
      {
        key: "costPerSquareFoot",
        label: "Cost Per Square Foot",
        value: result.costPerSquareFoot,
        unit: "$/sq ft",
      },
    ],

    costs: [
      {
        key: "cutCost",
        label: "Cutting Cost",
        amount: result.cutCost,
      },
      {
        key: "setupCost",
        label: "Setup Cost",
        amount: result.setupCost,
      },
      {
        key: "subtotal",
        label: "Subtotal",
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
    ],

    totalCost: result.totalCost,
    notes: result.notes,
  };
}
