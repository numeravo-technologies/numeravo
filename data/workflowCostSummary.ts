import type { WorkflowFreshnessStatus } from "./workflowFreshness";
import type { WorkflowResult } from "./workflowResult";

export type WorkflowCostSummaryBucket = {
  totalCost: number;
  count: number;
};

export type WorkflowCostSummary = {
  savedTotalCost: number;
  savedCostCount: number;
  current: WorkflowCostSummaryBucket;
  needsRecalculation: WorkflowCostSummaryBucket;
  unverified: WorkflowCostSummaryBucket;
  hasNonCurrentCosts: boolean;
};

export type WorkflowCostSummaryEntry = {
  result: WorkflowResult;
  freshnessStatus: WorkflowFreshnessStatus;
};

export function summarizeWorkflowCosts(
  entries: readonly WorkflowCostSummaryEntry[],
): WorkflowCostSummary {
  const summary: WorkflowCostSummary = {
    savedTotalCost: 0,
    savedCostCount: 0,
    current: { totalCost: 0, count: 0 },
    needsRecalculation: { totalCost: 0, count: 0 },
    unverified: { totalCost: 0, count: 0 },
    hasNonCurrentCosts: false,
  };

  for (const entry of entries) {
    const totalCost = entry.result.result.totalCost;

    if (totalCost === undefined) {
      continue;
    }

    summary.savedTotalCost += totalCost;
    summary.savedCostCount += 1;

    const bucket =
      entry.freshnessStatus === "current"
        ? summary.current
        : entry.freshnessStatus === "needs-recalculation"
          ? summary.needsRecalculation
          : summary.unverified;

    bucket.totalCost += totalCost;
    bucket.count += 1;
  }

  summary.hasNonCurrentCosts =
    summary.needsRecalculation.count > 0 ||
    summary.unverified.count > 0;

  return summary;
}
