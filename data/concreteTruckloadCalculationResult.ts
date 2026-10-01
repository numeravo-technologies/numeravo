import type { CalculationResult } from "./calculationResult";

export type ConcreteTruckloadCalculationResultValues = {
  baseYards: number;
  yardsWithWaste: number;
  orderYards: number;
  truckloads: number;
  isShortLoad: boolean;
  concreteMaterialCost: number;
  deliveryCost: number;
  shortLoadCost: number;
  totalCost: number;
  costPerYard: number;
  totalWeight: number;
  unusedTruckCapacity: number;
};

export function buildConcreteTruckloadCalculationResult({
  inputMode,
  projectType,
  knownYards,
  length,
  width,
  thicknessInches,
  wastePercent,
  truckCapacityYards,
  minimumDeliveryYards,
  roundToNearestYard,
  concretePricePerYard,
  deliveryFeePerTruck,
  shortLoadFee,
  fuelSurcharge,
  environmentalFee,
  waitingTimeFee,
  concreteWeightPerYard,
  results,
}: {
  inputMode: string;
  projectType: string;
  knownYards: number;
  length: number;
  width: number;
  thicknessInches: number;
  wastePercent: number;
  truckCapacityYards: number;
  minimumDeliveryYards: number;
  roundToNearestYard: number;
  concretePricePerYard: number;
  deliveryFeePerTruck: number;
  shortLoadFee: number;
  fuelSurcharge: number;
  environmentalFee: number;
  waitingTimeFee: number;
  concreteWeightPerYard: number;
  results: ConcreteTruckloadCalculationResultValues;
}): CalculationResult {
  const deliveryProjectCost =
    results.deliveryCost +
    results.shortLoadCost +
    fuelSurcharge +
    environmentalFee +
    waitingTimeFee;

  return {
    calculatorId: "concrete-truckload-calculator",
    calculatorTitle: "Concrete Truckload Calculator",

    inputSummary: [
      {
        key: "inputMode",
        label: "Input Mode",
        value: inputMode,
      },
      {
        key: "projectType",
        label: "Project Type",
        value: projectType,
      },
      {
        key: "knownYards",
        label: "Known Concrete Quantity",
        value: knownYards,
        unit: "yd³",
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
        key: "thicknessInches",
        label: "Thickness",
        value: thicknessInches,
        unit: "in",
      },
      {
        key: "wastePercent",
        label: "Waste / Overage",
        value: wastePercent,
        unit: "%",
      },
      {
        key: "truckCapacityYards",
        label: "Truck Capacity",
        value: truckCapacityYards,
        unit: "yd³",
      },
      {
        key: "minimumDeliveryYards",
        label: "Minimum Delivery",
        value: minimumDeliveryYards,
        unit: "yd³",
      },
      {
        key: "roundToNearestYard",
        label: "Round Order To Nearest",
        value: roundToNearestYard,
        unit: "yd³",
      },
      {
        key: "concretePricePerYard",
        label: "Concrete Price",
        value: concretePricePerYard,
        unit: "$/yd³",
      },
      {
        key: "deliveryFeePerTruck",
        label: "Delivery Fee",
        value: deliveryFeePerTruck,
        unit: "$/truck",
      },
      {
        key: "shortLoadFee",
        label: "Short-Load Fee",
        value: shortLoadFee,
        unit: "$",
      },
      {
        key: "fuelSurcharge",
        label: "Fuel Surcharge",
        value: fuelSurcharge,
        unit: "$",
      },
      {
        key: "environmentalFee",
        label: "Environmental Fee",
        value: environmentalFee,
        unit: "$",
      },
      {
        key: "waitingTimeFee",
        label: "Waiting Time Fee",
        value: waitingTimeFee,
        unit: "$",
      },
      {
        key: "concreteWeightPerYard",
        label: "Concrete Weight",
        value: concreteWeightPerYard,
        unit: "lb/yd³",
      },
    ],

    metrics: [
      {
        key: "baseYards",
        label: "Base Concrete",
        value: results.baseYards,
        unit: "yd³",
      },
      {
        key: "yardsWithWaste",
        label: "Yards With Waste",
        value: results.yardsWithWaste,
        unit: "yd³",
      },
      {
        key: "orderYards",
        label: "Rounded Order",
        value: results.orderYards,
        unit: "yd³",
      },
      {
        key: "truckloads",
        label: "Truckloads",
        value: results.truckloads,
        unit: "loads",
      },
      {
        key: "unusedTruckCapacity",
        label: "Unused Truck Capacity",
        value: results.unusedTruckCapacity,
        unit: "yd³",
      },
      {
        key: "totalWeight",
        label: "Estimated Concrete Weight",
        value: results.totalWeight,
        unit: "lb",
      },
      {
        key: "costPerYard",
        label: "Native Total Cost Per Ordered Yard",
        value: results.costPerYard,
        unit: "$/yd³",
      },
    ],

    costs: [
      {
        key: "concreteMaterialCost",
        label: "Concrete Material",
        amount: results.concreteMaterialCost,
      },
      {
        key: "deliveryCost",
        label: "Delivery",
        amount: results.deliveryCost,
      },
      {
        key: "shortLoadCost",
        label: "Short-Load Fee",
        amount: results.shortLoadCost,
      },
      {
        key: "fuelSurcharge",
        label: "Fuel Surcharge",
        amount: fuelSurcharge,
      },
      {
        key: "environmentalFee",
        label: "Environmental Fee",
        amount: environmentalFee,
      },
      {
        key: "waitingTimeFee",
        label: "Waiting Time Fee",
        amount: waitingTimeFee,
      },
      {
        key: "nativeTotalCost",
        label: "Native Truckload Estimate Total",
        amount: results.totalCost,
      },
    ],

    totalCost: deliveryProjectCost,

    notes: [
      results.isShortLoad
        ? "This order is below the entered minimum delivery quantity and includes the calculated short-load fee."
        : "This order is not below the entered minimum delivery quantity.",
      "Project total contribution includes delivery and delivery-specific fees only. Concrete material cost is tracked separately by the project's Concrete scope.",
      "Native truckload estimate total includes concrete material plus delivery and delivery-specific fees.",
    ],
  };
}
