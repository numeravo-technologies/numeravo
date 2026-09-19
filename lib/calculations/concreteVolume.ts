export type ImperialConcreteVolumeInput = {
  lengthFeet: number;
  widthFeet: number;
  thicknessInches: number;
  quantity?: number;
  wastePercent?: number;
};

export type ImperialConcreteVolumeResult = {
  baseCubicFeet: number;
  baseCubicYards: number;
  volumeWithWaste: number;
};

export function calculateImperialConcreteVolume({
  lengthFeet,
  widthFeet,
  thicknessInches,
  quantity = 1,
  wastePercent = 0,
}: ImperialConcreteVolumeInput): ImperialConcreteVolumeResult {
  const safeLength =
    Number.isFinite(lengthFeet) && lengthFeet >= 0
      ? lengthFeet
      : 0;

  const safeWidth =
    Number.isFinite(widthFeet) && widthFeet >= 0
      ? widthFeet
      : 0;

  const safeThickness =
    Number.isFinite(thicknessInches) && thicknessInches >= 0
      ? thicknessInches
      : 0;

  const safeQuantity =
    Number.isFinite(quantity) && quantity >= 0
      ? quantity
      : 0;

  const safeWaste =
    Number.isFinite(wastePercent) && wastePercent >= 0
      ? wastePercent
      : 0;

  const baseCubicFeet =
    safeLength * safeWidth * (safeThickness / 12) * safeQuantity;

  const baseCubicYards =
    baseCubicFeet / 27;

  const volumeWithWaste =
    baseCubicYards * (1 + safeWaste / 100);

  return {
    baseCubicFeet,
    baseCubicYards,
    volumeWithWaste,
  };
}
