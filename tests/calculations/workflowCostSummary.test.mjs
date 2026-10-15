import assert from "node:assert/strict";
import test from "node:test";

import { summarizeWorkflowCosts } from "../../data/workflowCostSummary.ts";

function entry(stepId, totalCost, freshnessStatus) {
  return {
    result: {
      stepId,
      calculatorId: `${stepId}-calculator`,
      calculatorTitle: `${stepId} calculator`,
      updatedAt: "2026-10-14T00:00:00.000Z",
      result: {
        calculatorId: `${stepId}-calculator`,
        calculatorTitle: `${stepId} calculator`,
        inputSummary: [],
        metrics: [],
        ...(totalCost !== undefined ? { totalCost } : {}),
      },
    },
    freshnessStatus,
  };
}

test("empty results produce an empty cost summary", () => {
  assert.deepEqual(summarizeWorkflowCosts([]), {
    savedTotalCost: 0,
    savedCostCount: 0,
    current: { totalCost: 0, count: 0 },
    needsRecalculation: { totalCost: 0, count: 0 },
    unverified: { totalCost: 0, count: 0 },
    hasNonCurrentCosts: false,
  });
});

test("current costs do not trigger a warning", () => {
  const summary = summarizeWorkflowCosts([
    entry("concrete", 1200, "current"),
    entry("rebar", 300, "current"),
  ]);

  assert.equal(summary.savedTotalCost, 1500);
  assert.equal(summary.savedCostCount, 2);
  assert.deepEqual(summary.current, { totalCost: 1500, count: 2 });
  assert.equal(summary.hasNonCurrentCosts, false);
});

test("mixed freshness statuses retain the complete saved total", () => {
  const summary = summarizeWorkflowCosts([
    entry("concrete", 1200, "current"),
    entry("rebar", 300, "needs-recalculation"),
    entry("gravel", 150, "unverified"),
  ]);

  assert.equal(summary.savedTotalCost, 1650);
  assert.equal(summary.savedCostCount, 3);
  assert.deepEqual(summary.current, { totalCost: 1200, count: 1 });
  assert.deepEqual(summary.needsRecalculation, {
    totalCost: 300,
    count: 1,
  });
  assert.deepEqual(summary.unverified, { totalCost: 150, count: 1 });
  assert.equal(summary.hasNonCurrentCosts, true);
});

test("zero-cost results count as saved cost calculations", () => {
  const summary = summarizeWorkflowCosts([
    entry("concrete", 0, "needs-recalculation"),
  ]);

  assert.equal(summary.savedTotalCost, 0);
  assert.equal(summary.savedCostCount, 1);
  assert.equal(summary.needsRecalculation.count, 1);
  assert.equal(summary.hasNonCurrentCosts, true);
});

test("results without totalCost are excluded from cost counts", () => {
  const summary = summarizeWorkflowCosts([
    entry("concrete", undefined, "needs-recalculation"),
    entry("rebar", 400, "current"),
  ]);

  assert.equal(summary.savedTotalCost, 400);
  assert.equal(summary.savedCostCount, 1);
  assert.equal(summary.needsRecalculation.count, 0);
  assert.equal(summary.hasNonCurrentCosts, false);
});

test("legacy unverified results remain in the saved total", () => {
  const legacyResult = entry("legacy", 725, "unverified");

  assert.equal(legacyResult.result.provenance, undefined);

  const summary = summarizeWorkflowCosts([legacyResult]);

  assert.equal(summary.savedTotalCost, 725);
  assert.equal(summary.unverified.count, 1);
  assert.equal(summary.hasNonCurrentCosts, true);
});

test("bucket totals and counts reconcile to saved totals", () => {
  const summary = summarizeWorkflowCosts([
    entry("a", 100, "current"),
    entry("b", 250, "needs-recalculation"),
    entry("c", 50, "unverified"),
    entry("d", 0, "current"),
    entry("e", undefined, "unverified"),
  ]);

  const buckets = [
    summary.current,
    summary.needsRecalculation,
    summary.unverified,
  ];

  assert.equal(
    buckets.reduce((total, bucket) => total + bucket.totalCost, 0),
    summary.savedTotalCost,
  );

  assert.equal(
    buckets.reduce((count, bucket) => count + bucket.count, 0),
    summary.savedCostCount,
  );
});
