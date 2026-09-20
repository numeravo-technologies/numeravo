export type ConcreteMixCalculationResult = {
  wetCubicFeet: number;
  dryCubicFeet: number;
  totalParts: number;
  cementCubicFeet: number;
  sandCubicFeet: number;
  gravelCubicFeet: number;
  cementPounds: number;
  cementBags: number;
  cementBagsRounded: number;
  sandYards: number;
  gravelYards: number;
  waterPounds: number;
  waterGallons: number;
  cementCost: number;
  sandCost: number;
  gravelCost: number;
  totalCost: number;
  costPerYard: number;
};

export function calculateConcreteMix({
  targetYards,
  dryVolumeFactor,
  cementParts,
  sandParts,
  gravelParts,
  cementBagWeight,
  cementDensityLbPerCubicFoot,
  waterCementRatio,
  cementBagPrice,
  sandPricePerYard,
  gravelPricePerYard,
}: {
  targetYards: number;
  dryVolumeFactor: number;
  cementParts: number;
  sandParts: number;
  gravelParts: number;
  cementBagWeight: number;
  cementDensityLbPerCubicFoot: number;
  waterCementRatio: number;
  cementBagPrice: number;
  sandPricePerYard: number;
  gravelPricePerYard: number;
}): ConcreteMixCalculationResult {
  const wetCubicFeet = targetYards * 27;
  const dryCubicFeet = wetCubicFeet * dryVolumeFactor;
  const totalParts =
    cementParts + sandParts + gravelParts;

  const cementCubicFeet =
    totalParts > 0
      ? dryCubicFeet * (cementParts / totalParts)
      : 0;

  const sandCubicFeet =
    totalParts > 0
      ? dryCubicFeet * (sandParts / totalParts)
      : 0;

  const gravelCubicFeet =
    totalParts > 0
      ? dryCubicFeet * (gravelParts / totalParts)
      : 0;

  const cementPounds =
    cementCubicFeet *
    cementDensityLbPerCubicFoot;

  const cementBags =
    cementBagWeight > 0
      ? cementPounds / cementBagWeight
      : 0;

  const cementBagsRounded =
    Math.ceil(cementBags);

  const sandYards =
    sandCubicFeet / 27;

  const gravelYards =
    gravelCubicFeet / 27;

  const waterPounds =
    cementPounds * waterCementRatio;

  const waterGallons =
    waterPounds / 8.34;

  const cementCost =
    cementBagsRounded * cementBagPrice;

  const sandCost =
    sandYards * sandPricePerYard;

  const gravelCost =
    gravelYards * gravelPricePerYard;

  const totalCost =
    cementCost + sandCost + gravelCost;

  const costPerYard =
    targetYards > 0
      ? totalCost / targetYards
      : 0;

  return {
    wetCubicFeet,
    dryCubicFeet,
    totalParts,
    cementCubicFeet,
    sandCubicFeet,
    gravelCubicFeet,
    cementPounds,
    cementBags,
    cementBagsRounded,
    sandYards,
    gravelYards,
    waterPounds,
    waterGallons,
    cementCost,
    sandCost,
    gravelCost,
    totalCost,
    costPerYard,
  };
}
