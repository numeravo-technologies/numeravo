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

export type ConcreteUnitSystem = "imperial" | "metric";

export type RectangularConcreteBaseVolumeInput = {
  length: number;
  width: number;
  height: number;
  quantity?: number;
};

export type CircularConcreteBaseVolumeInput = {
  diameter: number;
  height: number;
  quantity?: number;
};

export type LShapedConcreteBaseVolumeInput = {
  lengthOne: number;
  widthOne: number;
  lengthTwo: number;
  widthTwo: number;
  height: number;
};

export type ConcretePhysicalVolumeInput = {
  baseVolume: number;
  unitSystem: ConcreteUnitSystem;
  wastePercent?: number;
};

export type ConcretePhysicalVolumeResult = {
  baseCubicFeet: number;
  baseCubicYards: number;
  baseCubicMeters: number;
  volumeWithWaste: number;
};

function canonicalPageNumber(value: number) {
  return Number.isNaN(value) || value < 0 ? 0 : value;
}

export function calculateRectangularConcreteBaseVolume({
  length,
  width,
  height,
  quantity = 1,
}: RectangularConcreteBaseVolumeInput) {
  return (
    canonicalPageNumber(length) *
    canonicalPageNumber(width) *
    canonicalPageNumber(height) *
    canonicalPageNumber(quantity)
  );
}

export function calculateCircularConcreteBaseVolume({
  diameter,
  height,
  quantity = 1,
}: CircularConcreteBaseVolumeInput) {
  const safeDiameter = canonicalPageNumber(diameter);
  const radius = safeDiameter / 2;

  return (
    Math.PI *
    radius *
    radius *
    canonicalPageNumber(height) *
    canonicalPageNumber(quantity)
  );
}

export function calculateLShapedConcreteBaseVolume({
  lengthOne,
  widthOne,
  lengthTwo,
  widthTwo,
  height,
}: LShapedConcreteBaseVolumeInput) {
  const safeHeight = canonicalPageNumber(height);

  return (
    canonicalPageNumber(lengthOne) *
      canonicalPageNumber(widthOne) *
      safeHeight +
    canonicalPageNumber(lengthTwo) *
      canonicalPageNumber(widthTwo) *
      safeHeight
  );
}

export function calculateConcretePhysicalVolume({
  baseVolume,
  unitSystem,
  wastePercent = 0,
}: ConcretePhysicalVolumeInput): ConcretePhysicalVolumeResult {
  const safeBaseVolume = canonicalPageNumber(baseVolume);
  const safeWaste = canonicalPageNumber(wastePercent);

  const baseCubicFeet =
    unitSystem === "imperial" ? safeBaseVolume : 0;
  const baseCubicYards =
    unitSystem === "imperial" ? baseCubicFeet / 27 : 0;
  const baseCubicMeters =
    unitSystem === "metric" ? safeBaseVolume : 0;

  const volumeWithWaste =
    unitSystem === "imperial"
      ? baseCubicYards * (1 + safeWaste / 100)
      : baseCubicMeters * (1 + safeWaste / 100);

  return {
    baseCubicFeet,
    baseCubicYards,
    baseCubicMeters,
    volumeWithWaste,
  };
}

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
