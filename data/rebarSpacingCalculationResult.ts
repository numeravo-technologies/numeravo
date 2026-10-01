import type { CalculationResult } from "./calculationResult";

export type RebarSpacingCalculationResultValues = {
  usableLengthFeet: number;
  usableWidthFeet: number;
  barsRunningLength: number;
  barsRunningWidth: number;
  totalGridBars: number;
  baseLinearFeet: number;
  lapAllowanceFeet: number;
  wasteFeet: number;
  totalLinearFeet: number;
  stockBars: number;
  totalPurchasedFeet: number;
  totalWeight: number;
  materialCost: number;
  slabArea: number;
  costPerSquareFoot: number;
};

export function buildRebarSpacingCalculationResult({
  slabLengthFeet,
  slabWidthFeet,
  spacingInches,
  edgeClearanceInches,
  rebarSize,
  stockLengthFeet,
  lapLengthInches,
  wastePercent,
  pricePerFoot,
  results,
}: {
  slabLengthFeet: number;
  slabWidthFeet: number;
  spacingInches: number;
  edgeClearanceInches: number;
  rebarSize: string;
  stockLengthFeet: number;
  lapLengthInches: number;
  wastePercent: number;
  pricePerFoot: number;
  results: RebarSpacingCalculationResultValues;
}): CalculationResult {
  return {
    calculatorId: "rebar-spacing-for-concrete-slab",
    calculatorTitle: "Rebar Spacing for Concrete Slab",

    inputSummary: [
      {
        key: "slabLengthFeet",
        label: "Slab Length",
        value: slabLengthFeet,
        unit: "ft",
      },
      {
        key: "slabWidthFeet",
        label: "Slab Width",
        value: slabWidthFeet,
        unit: "ft",
      },
      {
        key: "spacingInches",
        label: "Rebar Spacing",
        value: spacingInches,
        unit: "in OC",
      },
      {
        key: "edgeClearanceInches",
        label: "Edge Clearance",
        value: edgeClearanceInches,
        unit: "in",
      },
      {
        key: "rebarSize",
        label: "Rebar Size",
        value: rebarSize,
      },
      {
        key: "stockLengthFeet",
        label: "Stock Bar Length",
        value: stockLengthFeet,
        unit: "ft",
      },
      {
        key: "lapLengthInches",
        label: "Lap Length",
        value: lapLengthInches,
        unit: "in",
      },
      {
        key: "wastePercent",
        label: "Waste",
        value: wastePercent,
        unit: "%",
      },
      {
        key: "pricePerFoot",
        label: "Price Per Foot",
        value: pricePerFoot,
        unit: "$/ft",
      },
    ],

    metrics: [
      {
        key: "slabArea",
        label: "Slab Area",
        value: results.slabArea,
        unit: "sq ft",
      },
      {
        key: "usableLengthFeet",
        label: "Usable Grid Length",
        value: results.usableLengthFeet,
        unit: "ft",
      },
      {
        key: "usableWidthFeet",
        label: "Usable Grid Width",
        value: results.usableWidthFeet,
        unit: "ft",
      },
      {
        key: "barsRunningLength",
        label: "Bars Running Length Direction",
        value: results.barsRunningLength,
        unit: "bars",
      },
      {
        key: "barsRunningWidth",
        label: "Bars Running Width Direction",
        value: results.barsRunningWidth,
        unit: "bars",
      },
      {
        key: "totalGridBars",
        label: "Total Grid Bars",
        value: results.totalGridBars,
        unit: "bars",
      },
      {
        key: "baseLinearFeet",
        label: "Base Linear Feet",
        value: results.baseLinearFeet,
        unit: "ft",
      },
      {
        key: "lapAllowanceFeet",
        label: "Lap Allowance",
        value: results.lapAllowanceFeet,
        unit: "ft",
      },
      {
        key: "wasteFeet",
        label: "Waste Allowance",
        value: results.wasteFeet,
        unit: "ft",
      },
      {
        key: "totalLinearFeet",
        label: "Total Linear Feet",
        value: results.totalLinearFeet,
        unit: "ft",
      },
      {
        key: "stockBars",
        label: "Stock Bars to Buy",
        value: results.stockBars,
        unit: "bars",
      },
      {
        key: "totalPurchasedFeet",
        label: "Purchased Feet",
        value: results.totalPurchasedFeet,
        unit: "ft",
      },
      {
        key: "totalWeight",
        label: "Estimated Weight",
        value: results.totalWeight,
        unit: "lb",
      },
      {
        key: "costPerSquareFoot",
        label: "Cost Per Square Foot",
        value: results.costPerSquareFoot,
        unit: "$/sq ft",
      },
    ],

    costs: [
      {
        key: "materialCost",
        label: "Estimated Material Cost",
        amount: results.materialCost,
      },
    ],

    totalCost: results.materialCost,
  };
}
