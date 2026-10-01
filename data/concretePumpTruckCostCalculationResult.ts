import type { CalculationResult } from "./calculationResult";

export type ConcretePumpTruckCostCalculationResultValues = {
  estimatedPumpingHours: number;
  billablePumpHours: number;
  unusedMinimumHours: number;
  hourlyPumpCost: number;
  standbyCost: number;
  yardageSurchargeCost: number;
  fixedFees: number;
  setupFee: number;
  travelFee: number;
  washoutFee: number;
  hoseFee: number;
  extraLaborCost: number;
  totalCost: number;
  costPerYard: number;
  costPerHour: number;
  notes: string[];
};

export function buildConcretePumpTruckCostCalculationResult({
  preset,
  pumpType,
  concreteYards,
  pumpRateYardsPerHour,
  minimumHours,
  hourlyRate,
  setupFee,
  travelFee,
  washoutFee,
  hoseFee,
  yardageSurcharge,
  standbyHours,
  standbyRate,
  extraLaborCost,
  result,
}: {
  preset: string;
  pumpType: string;
  concreteYards: number;
  pumpRateYardsPerHour: number;
  minimumHours: number;
  hourlyRate: number;
  setupFee: number;
  travelFee: number;
  washoutFee: number;
  hoseFee: number;
  yardageSurcharge: number;
  standbyHours: number;
  standbyRate: number;
  extraLaborCost: number;
  result: ConcretePumpTruckCostCalculationResultValues;
}): CalculationResult {
  return {
    calculatorId: "concrete-pump-truck-cost-calculator",
    calculatorTitle: "Concrete Pump Truck Cost Calculator",
    inputSummary: [
      {
        key: "preset",
        label: "Preset",
        value: preset,
      },
      {
        key: "pumpType",
        label: "Pump Type",
        value: pumpType,
      },
      {
        key: "concreteYards",
        label: "Concrete Volume",
        value: concreteYards,
        unit: "yd³",
      },
      {
        key: "pumpRateYardsPerHour",
        label: "Pump Rate",
        value: pumpRateYardsPerHour,
        unit: "yd³/hr",
      },
      {
        key: "minimumHours",
        label: "Minimum Hours",
        value: minimumHours,
        unit: "hr",
      },
      {
        key: "hourlyRate",
        label: "Hourly Rate",
        value: hourlyRate,
        unit: "$/hr",
      },
      {
        key: "setupFee",
        label: "Setup Fee",
        value: setupFee,
        unit: "$",
      },
      {
        key: "travelFee",
        label: "Travel Fee",
        value: travelFee,
        unit: "$",
      },
      {
        key: "washoutFee",
        label: "Washout Fee",
        value: washoutFee,
        unit: "$",
      },
      {
        key: "hoseFee",
        label: "Hose / Line Fee",
        value: hoseFee,
        unit: "$",
      },
      {
        key: "yardageSurcharge",
        label: "Yardage Surcharge",
        value: yardageSurcharge,
        unit: "$/yd³",
      },
      {
        key: "extraLaborCost",
        label: "Extra Labor / Access Cost",
        value: extraLaborCost,
        unit: "$",
      },
      {
        key: "standbyHours",
        label: "Standby Time",
        value: standbyHours,
        unit: "hr",
      },
      {
        key: "standbyRate",
        label: "Standby Rate",
        value: standbyRate,
        unit: "$/hr",
      },
    ],
    metrics: [
      {
        key: "estimatedPumpingHours",
        label: "Estimated Pumping Time",
        value: result.estimatedPumpingHours,
        unit: "hr",
      },
      {
        key: "billablePumpHours",
        label: "Billable Pump Hours",
        value: result.billablePumpHours,
        unit: "hr",
      },
      {
        key: "unusedMinimumHours",
        label: "Unused Minimum Hours",
        value: result.unusedMinimumHours,
        unit: "hr",
      },
      {
        key: "costPerYard",
        label: "Cost Per Yard",
        value: result.costPerYard,
        unit: "$/yd³",
      },
      {
        key: "costPerHour",
        label: "Cost Per Billable Hour",
        value: result.costPerHour,
        unit: "$/hr",
      },
    ],
    costs: [
      {
        key: "hourlyPumpCost",
        label: "Hourly Pump Cost",
        amount: result.hourlyPumpCost,
      },
      {
        key: "setupFee",
        label: "Setup Fee",
        amount: result.setupFee,
      },
      {
        key: "travelFee",
        label: "Travel Fee",
        amount: result.travelFee,
      },
      {
        key: "washoutFee",
        label: "Washout Fee",
        amount: result.washoutFee,
      },
      {
        key: "hoseFee",
        label: "Hose / Line Fee",
        amount: result.hoseFee,
      },
      {
        key: "extraLaborCost",
        label: "Extra Labor / Access Cost",
        amount: result.extraLaborCost,
      },
      {
        key: "yardageSurchargeCost",
        label: "Yardage Surcharge",
        amount: result.yardageSurchargeCost,
      },
      {
        key: "standbyCost",
        label: "Standby Cost",
        amount: result.standbyCost,
      },
    ],
    totalCost: result.totalCost,
    notes: result.notes,
  };
}
