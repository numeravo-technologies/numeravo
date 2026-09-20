import type { CalculationResult } from "./calculationResult";

export type ConcreteCalculationResultValues = {
  baseCubicFeet: number;
  baseCubicYards: number;
  baseCubicMeters: number;
  volumeWithWaste: number;
  recommendedOrder: number;
  estimatedCost: number;
  truckLoads: number;
  eightyLbBags: number;
  sixtyLbBags: number;
  eightyLbPallets: number;
  sixtyLbPallets: number;
  formulaLabel: string;
};

export function buildConcreteCalculationResult({
  projectLabel,
  unitSystem,
  orderMode,
  wastePercent,
  pricePerUnit,
  pricePer80LbBag,
  pricePer60LbBag,
  results,
}: {
  projectLabel: string;
  unitSystem: "imperial" | "metric";
  orderMode: "readyMix" | "bags";
  wastePercent: number;
  pricePerUnit: number;
  pricePer80LbBag: number;
  pricePer60LbBag: number;
  results: ConcreteCalculationResultValues;
}): CalculationResult {
  return {
    calculatorId: "concrete-calculator",
    calculatorTitle: "Concrete Calculator",

    inputSummary: [
      {
        key: "projectType",
        label: "Project Type",
        value: projectLabel,
      },
      {
        key: "unitSystem",
        label: "Unit System",
        value: unitSystem,
      },
      {
        key: "orderMethod",
        label: "Order Method",
        value:
          orderMode === "bags"
            ? "Concrete Bags"
            : "Ready-Mix Truck",
      },
      {
        key: "wastePercent",
        label: "Waste",
        value: wastePercent,
        unit: "%",
      },
      {
        key: "pricePerUnit",
        label:
          unitSystem === "imperial"
            ? "Concrete Price Per Cubic Yard"
            : "Concrete Price Per Cubic Meter",
        value: pricePerUnit,
        unit: unitSystem === "imperial" ? "$/yd³" : "$/m³",
      },
      {
        key: "pricePer80LbBag",
        label: "Cost Per 80 lb Bag",
        value: pricePer80LbBag,
        unit: "$/bag",
      },
      {
        key: "pricePer60LbBag",
        label: "Cost Per 60 lb Bag",
        value: pricePer60LbBag,
        unit: "$/bag",
      },
    ],

    metrics:
      unitSystem === "imperial"
        ? [
            {
              key: "baseCubicFeet",
              label: "Cubic Feet",
              value: results.baseCubicFeet,
              unit: "ft³",
            },
            {
              key: "baseCubicYards",
              label: "Cubic Yards Before Waste",
              value: results.baseCubicYards,
              unit: "yd³",
            },
            {
              key: "volumeWithWaste",
              label: "Cubic Yards With Waste",
              value: results.volumeWithWaste,
              unit: "yd³",
            },
            {
              key: "recommendedOrder",
              label: "Recommended Order",
              value: results.recommendedOrder,
              unit: "yd³",
            },
            ...(orderMode === "readyMix"
              ? [
                  {
                    key: "truckLoads",
                    label: "Estimated Truck Loads",
                    value: results.truckLoads,
                    unit: "loads",
                  },
                ]
              : [
                  {
                    key: "eightyLbBags",
                    label: "80 lb Bags Needed",
                    value: results.eightyLbBags,
                    unit: "bags",
                  },
                  {
                    key: "eightyLbPallets",
                    label: "80 lb Pallets",
                    value: results.eightyLbPallets,
                    unit: "pallets",
                  },
                  {
                    key: "sixtyLbBags",
                    label: "60 lb Bags Needed",
                    value: results.sixtyLbBags,
                    unit: "bags",
                  },
                  {
                    key: "sixtyLbPallets",
                    label: "60 lb Pallets",
                    value: results.sixtyLbPallets,
                    unit: "pallets",
                  },
                ]),
          ]
        : [
            {
              key: "baseCubicMeters",
              label: "Cubic Meters Before Waste",
              value: results.baseCubicMeters,
              unit: "m³",
            },
            {
              key: "volumeWithWaste",
              label: "Cubic Meters With Waste",
              value: results.volumeWithWaste,
              unit: "m³",
            },
            {
              key: "recommendedOrder",
              label: "Recommended Order",
              value: results.recommendedOrder,
              unit: "m³",
            },
          ],

    costs: [
      {
        key: "materialCost",
        label: "Estimated Material Cost",
        amount: results.estimatedCost,
      },
    ],

    totalCost: results.estimatedCost,

    notes: [results.formulaLabel],
  };
}
