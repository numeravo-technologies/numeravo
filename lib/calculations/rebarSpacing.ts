export type RebarSpacingResult = {
  usableLengthFeet: number;
  usableWidthFeet: number;
  barsRunningLength: number;
  barsRunningWidth: number;
  totalGridBars: number;
  baseLinearFeet: number;
  lapAllowanceFeet: number;
  wasteFeet: number;
  totalLinearFeet: number;
  stockBars: number;
  totalPurchasedFeet: number;
  totalWeight: number;
  materialCost: number;
  slabArea: number;
  costPerSquareFoot: number;
};

export function calculateRebarSpacing({
  slabLengthFeet,
  slabWidthFeet,
  spacingInches,
  edgeClearanceInches,
  stockLengthFeet,
  lapLengthInches,
  wastePercent,
  weightPerFoot,
  pricePerFoot,
}: {
  slabLengthFeet: number;
  slabWidthFeet: number;
  spacingInches: number;
  edgeClearanceInches: number;
  stockLengthFeet: number;
  lapLengthInches: number;
  wastePercent: number;
  weightPerFoot: number;
  pricePerFoot: number;
}): RebarSpacingResult {
  const usableLengthFeet =
    Math.max(
      slabLengthFeet -
        (edgeClearanceInches * 2) / 12,
      0,
    );

  const usableWidthFeet =
    Math.max(
      slabWidthFeet -
        (edgeClearanceInches * 2) / 12,
      0,
    );

  const spacingFeet =
    spacingInches / 12;

  const barsRunningLength =
    spacingFeet > 0
      ? Math.floor(
          usableWidthFeet / spacingFeet,
        ) + 1
      : 0;

  const barsRunningWidth =
    spacingFeet > 0
      ? Math.floor(
          usableLengthFeet / spacingFeet,
        ) + 1
      : 0;

  const lengthDirectionFeet =
    barsRunningLength * usableLengthFeet;

  const widthDirectionFeet =
    barsRunningWidth * usableWidthFeet;

  const baseLinearFeet =
    lengthDirectionFeet +
    widthDirectionFeet;

  const lapLengthFeet =
    lapLengthInches / 12;

  const barsNeedingLap =
    stockLengthFeet > 0
      ? Math.max(
          Math.ceil(
            usableLengthFeet /
              stockLengthFeet,
          ) - 1,
          0,
        ) *
          barsRunningLength +
        Math.max(
          Math.ceil(
            usableWidthFeet /
              stockLengthFeet,
          ) - 1,
          0,
        ) *
          barsRunningWidth
      : 0;

  const lapAllowanceFeet =
    barsNeedingLap * lapLengthFeet;

  const linearFeetWithLap =
    baseLinearFeet +
    lapAllowanceFeet;

  const wasteFeet =
    linearFeetWithLap *
    (wastePercent / 100);

  const totalLinearFeet =
    linearFeetWithLap + wasteFeet;

  const stockBars =
    stockLengthFeet > 0
      ? Math.ceil(
          totalLinearFeet /
            stockLengthFeet,
        )
      : 0;

  const totalPurchasedFeet =
    stockBars * stockLengthFeet;

  const totalWeight =
    totalPurchasedFeet *
    weightPerFoot;

  const materialCost =
    totalPurchasedFeet *
    pricePerFoot;

  const slabArea =
    slabLengthFeet * slabWidthFeet;

  const costPerSquareFoot =
    slabArea > 0
      ? materialCost / slabArea
      : 0;

  return {
    usableLengthFeet,
    usableWidthFeet,
    barsRunningLength,
    barsRunningWidth,
    totalGridBars:
      barsRunningLength +
      barsRunningWidth,
    baseLinearFeet,
    lapAllowanceFeet,
    wasteFeet,
    totalLinearFeet,
    stockBars,
    totalPurchasedFeet,
    totalWeight,
    materialCost,
    slabArea,
    costPerSquareFoot,
  };
}
