import type { CalculationResult } from "./calculationResult";

export type ConcreteLaborCalculationResultValues = {
  area: number;
  cubicYards: number;
  baseCrewHours: number;
  addedCrewHours: number;
  totalCrewHours: number;
  personHours: number;
  directLaborCost: number;
  equipmentCost: number;
  directCost: number;
  overheadCost: number;
  subtotal: number;
  minimumCharge: number;
  minimumChargeAdjustment: number;
  totalCost: number;
  costPerSqFt: number;
  costPerYard: number;
  personHoursPerSqFt: number;
  notes: string[];
};

export function buildConcreteLaborCalculationResult({
  preset,
  lengthFeet,
  widthFeet,
  thicknessInches,
  laborType,
  crewSize,
  productionRateSqFtPerHour,
  laborRatePerHour,
  setupHours,
  formingHours,
  placementHours,
  finishingHours,
  cleanupHours,
  equipmentCost,
  overheadPercent,
  minimumCharge,
  result,
}: {
  preset: string;
  lengthFeet: number;
  widthFeet: number;
  thicknessInches: number;
  laborType: string;
  crewSize: number;
  productionRateSqFtPerHour: number;
  laborRatePerHour: number;
  setupHours: number;
  formingHours: number;
  placementHours: number;
  finishingHours: number;
  cleanupHours: number;
  equipmentCost: number;
  overheadPercent: number;
  minimumCharge: number;
  result: ConcreteLaborCalculationResultValues;
}): CalculationResult {
  return {
    calculatorId: "concrete-labor-cost-calculator",
    calculatorTitle: "Concrete Labor Cost Calculator",
    inputSummary: [
      {
        key: "preset",
        label: "Preset",
        value: preset,
      },
      {
        key: "lengthFeet",
        label: "Length",
        value: lengthFeet,
        unit: "ft",
      },
      {
        key: "widthFeet",
        label: "Width",
        value: widthFeet,
        unit: "ft",
      },
      {
        key: "thicknessInches",
        label: "Thickness",
        value: thicknessInches,
        unit: "in",
      },
      {
        key: "laborType",
        label: "Labor Type",
        value: laborType,
      },
      {
        key: "crewSize",
        label: "Crew Size",
        value: crewSize,
        unit: "workers",
      },
      {
        key: "productionRateSqFtPerHour",
        label: "Production Rate",
        value: productionRateSqFtPerHour,
        unit: "sq ft/hr",
      },
      {
        key: "laborRatePerHour",
        label: "Labor Rate",
        value: laborRatePerHour,
        unit: "$/person hr",
      },
      {
        key: "setupHours",
        label: "Setup Hours",
        value: setupHours,
        unit: "crew hr",
      },
      {
        key: "formingHours",
        label: "Forming Hours",
        value: formingHours,
        unit: "crew hr",
      },
      {
        key: "placementHours",
        label: "Placement Hours",
        value: placementHours,
        unit: "crew hr",
      },
      {
        key: "finishingHours",
        label: "Finishing Hours",
        value: finishingHours,
        unit: "crew hr",
      },
      {
        key: "cleanupHours",
        label: "Cleanup Hours",
        value: cleanupHours,
        unit: "crew hr",
      },
      {
        key: "equipmentCost",
        label: "Equipment Cost",
        value: equipmentCost,
        unit: "$",
      },
      {
        key: "overheadPercent",
        label: "Overhead Allowance",
        value: overheadPercent,
        unit: "%",
      },
      {
        key: "minimumCharge",
        label: "Minimum Charge",
        value: minimumCharge,
        unit: "$",
      },
    ],
    metrics: [
      {
        key: "area",
        label: "Project Area",
        value: result.area,
        unit: "sq ft",
      },
      {
        key: "cubicYards",
        label: "Concrete Volume",
        value: result.cubicYards,
        unit: "yd³",
      },
      {
        key: "baseCrewHours",
        label: "Base Production Hours",
        value: result.baseCrewHours,
        unit: "crew hr",
      },
      {
        key: "addedCrewHours",
        label: "Added Phase Hours",
        value: result.addedCrewHours,
        unit: "crew hr",
      },
      {
        key: "totalCrewHours",
        label: "Total Crew Hours",
        value: result.totalCrewHours,
        unit: "crew hr",
      },
      {
        key: "personHours",
        label: "Person Hours",
        value: result.personHours,
        unit: "person hr",
      },
      {
        key: "personHoursPerSqFt",
        label: "Person Hours Per Square Foot",
        value: result.personHoursPerSqFt,
        unit: "person hr/sq ft",
      },
      {
        key: "costPerSqFt",
        label: "Cost Per Square Foot",
        value: result.costPerSqFt,
        unit: "$/sq ft",
      },
      {
        key: "costPerYard",
        label: "Cost Per Cubic Yard",
        value: result.costPerYard,
        unit: "$/yd³",
      },
    ],
    costs: [
      {
        key: "directLaborCost",
        label: "Direct Labor Cost",
        amount: result.directLaborCost,
      },
      {
        key: "equipmentCost",
        label: "Equipment Cost",
        amount: result.equipmentCost,
      },
      {
        key: "directCost",
        label: "Direct Cost",
        amount: result.directCost,
      },
      {
        key: "overheadCost",
        label: "Overhead Allowance",
        amount: result.overheadCost,
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
