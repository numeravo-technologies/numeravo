import test from "node:test";
import assert from "node:assert/strict";

import {
  addLoanMonths,
  buildLoanSchedule,
  calculateLoanPayment,
  getLoanScheduleTotals,
} from "../../lib/calculations/loan.ts";

test("100000 loan at 6 percent for 360 months has expected payment", () => {
  const payment = calculateLoanPayment(
    100000,
    6,
    360,
  );

  assert.ok(Math.abs(payment - 599.5505251527569) < 1e-9);
});

test("zero-interest loan divides principal evenly", () => {
  const payment = calculateLoanPayment(
    12000,
    0,
    12,
  );

  assert.equal(payment, 1000);
});

test("standard 30-year schedule creates 360 payments and pays off", () => {
  const rows = buildLoanSchedule(
    100000,
    6,
    360,
    0,
    new Date("2026-01-31T12:00:00"),
  );

  assert.equal(rows.length, 360);
  assert.ok(rows.at(-1).endingBalance < 0.005);
});

test("standard 30-year schedule has expected total interest", () => {
  const rows = buildLoanSchedule(
    100000,
    6,
    360,
    0,
    new Date("2026-01-31T12:00:00"),
  );

  const totals = getLoanScheduleTotals(rows);

  assert.ok(Math.abs(totals.interest - 115838.18905499213) < 1e-6);
});

test("extra payments shorten payoff", () => {
  const baseRows = buildLoanSchedule(
    100000,
    6,
    360,
    0,
    new Date("2026-01-31T12:00:00"),
  );

  const acceleratedRows = buildLoanSchedule(
    100000,
    6,
    360,
    100,
    new Date("2026-01-31T12:00:00"),
  );

  assert.ok(acceleratedRows.length < baseRows.length);

  const baseTotals = getLoanScheduleTotals(baseRows);
  const acceleratedTotals =
    getLoanScheduleTotals(acceleratedRows);

  assert.ok(
    acceleratedTotals.interest <
      baseTotals.interest,
  );
});

test("month-end dates clamp to valid calendar dates", () => {
  const jan31 = new Date("2026-01-31T12:00:00");

  const feb = addLoanMonths(jan31, 1);
  const mar = addLoanMonths(jan31, 2);

  assert.equal(feb.getMonth(), 1);
  assert.equal(feb.getDate(), 28);

  assert.equal(mar.getMonth(), 2);
  assert.equal(mar.getDate(), 31);
});
