import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateAllowableCost,
  calculateBreakEvenPrice,
  calculateProfitMarginMetrics,
  calculateTargetSellingPrice,
} from "../../lib/calculations/profitMargin.ts";

test("100 cost sold for 125 produces 20 percent margin and 25 percent markup", () => {
  const result = calculateProfitMarginMetrics(
    100,
    125,
    0,
    0,
  );

  assert.equal(result.grossProfit, 25);
  assert.equal(result.grossMargin, 20);
  assert.equal(result.markup, 25);
  assert.equal(result.fees, 0);
  assert.equal(result.profitAfterFees, 25);
  assert.equal(result.marginAfterFees, 20);
  assert.equal(result.multiplier, 1.25);
});

test("find selling price returns 125 for 100 cost at 20 percent target margin", () => {
  const price = calculateTargetSellingPrice(
    100,
    20,
    0,
    0,
  );

  assert.equal(price, 125);
});

test("transaction fees reduce after-fee profit and margin", () => {
  const result = calculateProfitMarginMetrics(
    40,
    75,
    2,
    3,
  );

  assert.equal(result.grossProfit, 35);
  assert.equal(result.fees, 4.25);
  assert.equal(result.profitAfterFees, 30.75);
  assert.equal(result.marginAfterFees, 41);
});

test("find allowable cost preserves target margin formula", () => {
  const cost = calculateAllowableCost(
    125,
    20,
    0,
    0,
  );

  assert.equal(cost, 100);
});

test("break-even price includes fixed and percentage fees", () => {
  const price = calculateBreakEvenPrice(
    40,
    2,
    3,
  );

  assert.ok(
    Math.abs(price - 43.29896907216495) <
      1e-12,
  );
});

test("break-even price is unavailable at 100 percent fee rate", () => {
  const price = calculateBreakEvenPrice(
    40,
    0,
    100,
  );

  assert.equal(price, null);
});
