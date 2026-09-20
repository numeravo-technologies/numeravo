export type GravelCalculationResult = {
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

function safeNumber(value: number) {
  return Number.isFinite(value) && value >= 0
    ? value
    : 0;
}

export function calculateImperialGravel({
  lengthFeet,
  widthFeet,
  depthInches,
  wastePercent,
  tonsPerCubicYard,
  pricePerTon,
}: {
  lengthFeet: number;
  widthFeet: number;
  depthInches: number;
  wastePercent: number;
  tonsPerCubicYard: number;
  pricePerTon: number;
}): GravelCalculationResult {
  const length = safeNumber(lengthFeet);
  const width = safeNumber(widthFeet);
  const depth = safeNumber(depthInches);
  const waste = safeNumber(wastePercent);
  const density = safeNumber(tonsPerCubicYard);
  const price = safeNumber(pricePerTon);

  const depthFeet = depth / 12;
  const cubicFeet = length * width * depthFeet;
  const cubicYards = cubicFeet / 27;

  const volumeWithWaste =
    cubicYards * (1 + waste / 100);

  const estimatedWeight =
    volumeWithWaste * density;

  const estimatedCost =
    estimatedWeight * price;

  return {
    cubicFeet,
    cubicYards,
    cubicMeters: cubicYards * 0.764555,
    volumeWithWaste,
    estimatedWeight,
    estimatedCost,
    smallTruckLoads:
      estimatedWeight > 0
        ? Math.ceil(estimatedWeight / 5)
        : 0,
    standardTruckLoads:
      estimatedWeight > 0
        ? Math.ceil(estimatedWeight / 10)
        : 0,
    largeTruckLoads:
      estimatedWeight > 0
        ? Math.ceil(estimatedWeight / 15)
        : 0,
  };
}

export function calculateMetricGravel({
  lengthMeters,
  widthMeters,
  depthCentimeters,
  wastePercent,
  tonnesPerCubicMeter,
  pricePerTonne,
}: {
  lengthMeters: number;
  widthMeters: number;
  depthCentimeters: number;
  wastePercent: number;
  tonnesPerCubicMeter: number;
  pricePerTonne: number;
}): GravelCalculationResult {
  const length = safeNumber(lengthMeters);
  const width = safeNumber(widthMeters);
  const depth = safeNumber(depthCentimeters);
  const waste = safeNumber(wastePercent);
  const density = safeNumber(tonnesPerCubicMeter);
  const price = safeNumber(pricePerTonne);

  const depthMeters = depth / 100;
  const cubicMeters =
    length * width * depthMeters;

  const volumeWithWaste =
    cubicMeters * (1 + waste / 100);

  const estimatedWeight =
    volumeWithWaste * density;

  const estimatedCost =
    estimatedWeight * price;

  return {
    cubicFeet: cubicMeters * 35.3147,
    cubicYards: cubicMeters * 1.30795,
    cubicMeters,
    volumeWithWaste,
    estimatedWeight,
    estimatedCost,
    smallTruckLoads:
      estimatedWeight > 0
        ? Math.ceil(estimatedWeight / 5)
        : 0,
    standardTruckLoads:
      estimatedWeight > 0
        ? Math.ceil(estimatedWeight / 10)
        : 0,
    largeTruckLoads:
      estimatedWeight > 0
        ? Math.ceil(estimatedWeight / 15)
        : 0,
  };
}
