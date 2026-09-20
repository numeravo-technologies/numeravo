export type ProfitMarginMetrics = {
  cost: number;
  price: number;
  grossProfit: number;
  grossMargin: number;
  markup: number | null;
  fees: number;
  profitAfterFees: number;
  marginAfterFees: number;
  multiplier: number | null;
};

export function calculateProfitMarginMetrics(
  cost: number,
  price: number,
  fixedFee: number,
  feeRate: number,
): ProfitMarginMetrics {
  const grossProfit = price - cost;

  const grossMargin =
    price > 0
      ? (grossProfit / price) * 100
      : 0;

  const markup =
    cost > 0
      ? (grossProfit / cost) * 100
      : null;

  const fees =
    fixedFee + (price * feeRate) / 100;

  const profitAfterFees =
    grossProfit - fees;

  const marginAfterFees =
    price > 0
      ? (profitAfterFees / price) * 100
      : 0;

  const multiplier =
    cost > 0
      ? price / cost
      : null;

  return {
    cost,
    price,
    grossProfit,
    grossMargin,
    markup,
    fees,
    profitAfterFees,
    marginAfterFees,
    multiplier,
  };
}

export function calculateTargetSellingPrice(
  cost: number,
  targetMargin: number,
  fixedFee: number,
  feeRate: number,
) {
  return (
    (cost + fixedFee) /
    (1 - (targetMargin + feeRate) / 100)
  );
}

export function calculateAllowableCost(
  price: number,
  targetMargin: number,
  fixedFee: number,
  feeRate: number,
) {
  return Math.max(
    0,
    price *
      (1 - (targetMargin + feeRate) / 100) -
      fixedFee,
  );
}

export function calculateBreakEvenPrice(
  cost: number,
  fixedFee: number,
  feeRate: number,
) {
  if (feeRate >= 100) {
    return null;
  }

  return (
    (cost + fixedFee) /
    (1 - feeRate / 100)
  );
}
