import type { CalculationResult } from "./calculationResult";

export type GravelCalculationResultValues = {
  cubicFeet: number;
  cubicYards: number;
  cubicMeters: number;
  volumeWithWaste: number;
  estimatedWeight: number;
  estimatedCost: number;
  smallTruckLoads: number;
  standardTruckLoads: number;
  largeTruckLoads: number;
};

export function buildGravelCalculationResult({
  material,
  unitSystem,
  length,
  width,
  depth,
  wastePercent,
  density,
  pricePerWeightUnit,
  results,
}: {
  material: string;
  unitSystem: "imperial" | "metric";
  length: number;
  width: number;
  depth: number;
  wastePercent: number;
  density: number;
  pricePerWeightUnit: number;
  results: GravelCalculationResultValues;
}): CalculationResult {
  return {
    calculatorId: "gravel-calculator",
    calculatorTitle: "Gravel Calculator",

    inputSummary: [
      {
        key: "material",
        label: "Material",
        value: material,
      },
      {
        key: "unitSystem",
        label: "Unit System",
        value: unitSystem,
      },
      {
        key: "length",
        label: "Length",
        value: length,
        unit: unitSystem === "imperial" ? "ft" : "m",
      },
      {
        key: "width",
        label: "Width",
        value: width,
        unit: unitSystem === "imperial" ? "ft" : "m",
      },
      {
        key: "depth",
        label: "Depth",
        value: depth,
        unit: unitSystem === "imperial" ? "in" : "cm",
      },
      {
        key: "wastePercent",
        label: "Waste",
        value: wastePercent,
        unit: "%",
      },
      {
        key: "density",
        label:
          unitSystem === "imperial"
            ? "Tons Per Cubic Yard"
            : "Tonnes Per Cubic Meter",
        value: density,
        unit:
          unitSystem === "imperial"
            ? "tons/yd³"
            : "tonnes/m³",
      },
      {
        key: "pricePerWeightUnit",
        label:
          unitSystem === "imperial"
            ? "Price Per Ton"
            : "Price Per Tonne",
        value: pricePerWeightUnit,
        unit:
          unitSystem === "imperial"
            ? "$/ton"
            : "$/tonne",
      },
    ],

    metrics:
      unitSystem === "imperial"
        ? [
            {
              key: "cubicFeet",
              label: "Cubic Feet",
              value: results.cubicFeet,
              unit: "ft³",
            },
            {
              key: "cubicYards",
              label: "Cubic Yards Before Waste",
              value: results.cubicYards,
              unit: "yd³",
            },
            {
              key: "volumeWithWaste",
              label: "Cubic Yards With Waste",
              value: results.volumeWithWaste,
              unit: "yd³",
            },
            {
              key: "estimatedWeight",
              label: "Estimated Tons",
              value: results.estimatedWeight,
              unit: "tons",
            },
            {
              key: "smallTruckLoads",
              label: "Small Dump Truck Loads",
              value: results.smallTruckLoads,
              unit: "loads",
            },
            {
              key: "standardTruckLoads",
              label: "Standard Dump Truck Loads",
              value: results.standardTruckLoads,
              unit: "loads",
            },
            {
              key: "largeTruckLoads",
              label: "Large Dump Truck Loads",
              value: results.largeTruckLoads,
              unit: "loads",
            },
          ]
        : [
            {
              key: "cubicMeters",
              label: "Cubic Meters Before Waste",
              value: results.cubicMeters,
              unit: "m³",
            },
            {
              key: "volumeWithWaste",
              label: "Cubic Meters With Waste",
              value: results.volumeWithWaste,
              unit: "m³",
            },
            {
              key: "estimatedWeight",
              label: "Estimated Tonnes",
              value: results.estimatedWeight,
              unit: "tonnes",
            },
            {
              key: "smallTruckLoads",
              label: "Small Dump Truck Loads",
              value: results.smallTruckLoads,
              unit: "loads",
            },
            {
              key: "standardTruckLoads",
              label: "Standard Dump Truck Loads",
              value: results.standardTruckLoads,
              unit: "loads",
            },
            {
              key: "largeTruckLoads",
              label: "Large Dump Truck Loads",
              value: results.largeTruckLoads,
              unit: "loads",
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
  };
}
