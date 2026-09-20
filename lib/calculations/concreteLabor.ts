export type ConcreteLaborResult = {
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

function clampNumber(value: number, fallback = 0) {
  return Number.isFinite(value) && value >= 0
    ? value
    : fallback;
}

export function calculateConcreteLabor({
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
}: {
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
}): ConcreteLaborResult {
  const safeLength =
    clampNumber(lengthFeet);

  const safeWidth =
    clampNumber(widthFeet);

  const safeThickness =
    clampNumber(thicknessInches);

  const safeCrewSize =
    Math.max(
      clampNumber(crewSize, 1),
      1,
    );

  const safeProductionRate =
    Math.max(
      clampNumber(
        productionRateSqFtPerHour,
        1,
      ),
      1,
    );

  const safeLaborRate =
    clampNumber(laborRatePerHour);

  const safeSetupHours =
    clampNumber(setupHours);

  const safeFormingHours =
    clampNumber(formingHours);

  const safePlacementHours =
    clampNumber(placementHours);

  const safeFinishingHours =
    clampNumber(finishingHours);

  const safeCleanupHours =
    clampNumber(cleanupHours);

  const safeEquipmentCost =
    clampNumber(equipmentCost);

  const safeOverheadPercent =
    clampNumber(overheadPercent);

  const safeMinimumCharge =
    clampNumber(minimumCharge);

  const area =
    safeLength * safeWidth;

  const cubicYards =
    (area * (safeThickness / 12)) / 27;

  const baseCrewHours =
    area / safeProductionRate;

  const addedCrewHours =
    safeSetupHours +
    safeFormingHours +
    safePlacementHours +
    safeFinishingHours +
    safeCleanupHours;

  const totalCrewHours =
    baseCrewHours +
    addedCrewHours;

  const personHours =
    totalCrewHours *
    safeCrewSize;

  const directLaborCost =
    personHours *
    safeLaborRate;

  const directCost =
    directLaborCost +
    safeEquipmentCost;

  const overheadCost =
    directCost *
    (safeOverheadPercent / 100);

  const subtotal =
    directCost +
    overheadCost;

  const totalCost =
    Math.max(
      subtotal,
      safeMinimumCharge,
    );

  const minimumChargeAdjustment =
    Math.max(
      safeMinimumCharge -
        subtotal,
      0,
    );

  const costPerSqFt =
    area > 0
      ? totalCost / area
      : 0;

  const costPerYard =
    cubicYards > 0
      ? totalCost / cubicYards
      : 0;

  const personHoursPerSqFt =
    area > 0
      ? personHours / area
      : 0;

  const notes: string[] = [];

  if (
    area < 250 &&
    minimumChargeAdjustment > 0
  ) {
    notes.push(
      "Small concrete labor jobs are often controlled by the minimum charge.",
    );
  }

  if (
    safeProductionRate < 100 &&
    laborType !== "Removal/demo"
  ) {
    notes.push(
      "Low production rate increases labor cost. Confirm access, finish complexity, crew size, and setup conditions.",
    );
  }

  if (laborType === "Removal/demo") {
    notes.push(
      "Removal labor may also require disposal, haul-off, saw cutting, and equipment rental estimates.",
    );
  }

  if (
    safeFormingHours >
      safeFinishingHours * 2 &&
    laborType !== "Removal/demo"
  ) {
    notes.push(
      "Forming hours are a major labor driver on this estimate.",
    );
  }

  if (safeOverheadPercent < 8) {
    notes.push(
      "Overhead allowance is low. Contractors may need higher overhead to cover insurance, supervision, tools, and admin time.",
    );
  }

  if (notes.length === 0) {
    notes.push(
      "Labor estimate looks reasonable for the selected project size, crew, and production rate.",
    );
  }

  return {
    area,
    cubicYards,
    baseCrewHours,
    addedCrewHours,
    totalCrewHours,
    personHours,
    directLaborCost,
    equipmentCost:
      safeEquipmentCost,
    directCost,
    overheadCost,
    subtotal,
    minimumCharge:
      safeMinimumCharge,
    minimumChargeAdjustment,
    totalCost,
    costPerSqFt,
    costPerYard,
    personHoursPerSqFt,
    notes,
  };
}
