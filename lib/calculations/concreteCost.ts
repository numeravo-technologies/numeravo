export type ConcreteCostResult = {
  area: number;
  cubicFeet: number;
  cubicYards: number;
  cubicYardsWithWaste: number;
  concreteCost: number;
  baseCubicYards: number;
  baseTons: number;
  baseCost: number;
  rebarCost: number;
  laborCost: number;
  prepCost: number;
  totalCost: number;
  costPerSqFt: number;
};

export function calculateConcreteCost({
  lengthFeet,
  widthFeet,
  thicknessInches,
  wastePercent,
  pricePerYard,
  deliveryFee,
  shortLoadFee,
  baseDepthInches,
  basePricePerTon,
  baseTonsPerCubicYard,
  rebarPerSqFt,
  laborPerSqFt,
  prepPerSqFt,
}: {
  lengthFeet: number;
  widthFeet: number;
  thicknessInches: number;
  wastePercent: number;
  pricePerYard: number;
  deliveryFee: number;
  shortLoadFee: number;
  baseDepthInches: number;
  basePricePerTon: number;
  baseTonsPerCubicYard: number;
  rebarPerSqFt: number;
  laborPerSqFt: number;
  prepPerSqFt: number;
}): ConcreteCostResult {
  const area =
    lengthFeet * widthFeet;

  const cubicFeet =
    area * (thicknessInches / 12);

  const cubicYards =
    cubicFeet / 27;

  const cubicYardsWithWaste =
    cubicYards *
    (1 + wastePercent / 100);

  const concreteCost =
    cubicYardsWithWaste *
    pricePerYard;

  const baseCubicFeet =
    area * (baseDepthInches / 12);

  const baseCubicYards =
    baseCubicFeet / 27;

  const baseTons =
    baseCubicYards *
    baseTonsPerCubicYard;

  const baseCost =
    baseTons *
    basePricePerTon;

  const rebarCost =
    area * rebarPerSqFt;

  const laborCost =
    area * laborPerSqFt;

  const prepCost =
    area * prepPerSqFt;

  const totalCost =
    concreteCost +
    deliveryFee +
    shortLoadFee +
    baseCost +
    rebarCost +
    laborCost +
    prepCost;

  const costPerSqFt =
    area > 0
      ? totalCost / area
      : 0;

  return {
    area,
    cubicFeet,
    cubicYards,
    cubicYardsWithWaste,
    concreteCost,
    baseCubicYards,
    baseTons,
    baseCost,
    rebarCost,
    laborCost,
    prepCost,
    totalCost,
    costPerSqFt,
  };
}
