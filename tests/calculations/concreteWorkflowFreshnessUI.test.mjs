import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL(
    "../../app/construction/project/concrete-slab-equipment-pad/ProjectWorkflowClient.tsx",
    import.meta.url,
  ),
  "utf8",
);

const workspaceStart = source.indexOf(
  "function ProjectResultsWorkspace(",
);

assert.notEqual(
  workspaceStart,
  -1,
  "ProjectResultsWorkspace must exist",
);

const workspace = source.slice(workspaceStart);

test("freshness adapter is imported and receives project context", () => {
  assert.match(
    source,
    /import\s*\{\s*getWorkflowResultFreshnessPresentation\s*\}\s*from\s*["']@\/data\/workflowFreshnessPresentation["']/,
  );

  assert.match(
    workspace,
    /getWorkflowResultFreshnessPresentation\s*\(\s*\{\s*result:\s*scopeResult,\s*currentProjectInputs:\s*workflow\.inputs,\s*currentUnitSystem:\s*unitSystem,\s*\}\s*\)/,
  );
});

test("project unit system is passed to results workspace", () => {
  assert.match(
    source,
    /<ProjectResultsWorkspace[\s\S]*?unitSystem=\{unitSystem\}/,
  );

  assert.match(
    workspace,
    /unitSystem:\s*ProjectUnitSystem/,
  );
});

test("card freshness assessment occurs after missing-result guard", () => {
  const guard = workspace.indexOf("if (!scopeResult)");
  const cardResult = workspace.indexOf(
    "const result = scopeResult.result;",
    guard,
  );
  const assessment = workspace.indexOf(
    "const freshness = getWorkflowResultFreshnessPresentation({",
    guard,
  );

  assert.ok(guard >= 0, "missing-result guard must exist");
  assert.ok(cardResult > guard, "card result must follow the guard");
  assert.ok(
    assessment > cardResult,
    "card freshness assessment must follow the guarded result",
  );
});

test("aggregate freshness assessment uses filtered saved results", () => {
  const filter = workspace.indexOf("const savedScope = selectedScope");
  const savedResultGuard = workspace.indexOf(
    "Boolean(entry.scopeResult)",
    filter,
  );
  const summary = workspace.indexOf(
    "const costSummary = summarizeWorkflowCosts(",
  );
  const aggregateAssessment = workspace.indexOf(
    "getWorkflowResultFreshnessPresentation({",
    summary,
  );
  const render = workspace.indexOf("  return (", summary);

  assert.ok(filter >= 0);
  assert.ok(savedResultGuard > filter);
  assert.ok(summary > savedResultGuard);
  assert.ok(
    aggregateAssessment > summary && aggregateAssessment < render,
    "aggregate freshness assessment must precede rendering",
  );

  assert.match(
    workspace.slice(summary, render),
    /savedScope\.map\(\(\{ scopeResult \}\) => \(\{/,
  );
});

test("freshness statuses retain distinct presentation", () => {
  assert.match(
    workspace,
    /freshness\.status === "current"/,
  );

  assert.match(
    workspace,
    /freshness\.status === "needs-recalculation"/,
  );

  assert.match(workspace, /\{freshness\.label\}/);
  assert.match(workspace, /\{freshness\.description\}/);

  assert.match(workspace, /border-emerald-500\/30/);
  assert.match(workspace, /border-amber-500\/30/);
  assert.match(workspace, /border-\[#374151\]/);
});

test("existing saved and missing-result states remain", () => {
  assert.match(workspace, />\s*Saved\s*</);
  assert.match(workspace, />\s*Not calculated\s*</);
});

test("saved cost aggregation remains independent of freshness", () => {
  assert.match(
    workspace,
    /savedScope\.reduce\s*\(/,
  );

  assert.match(
    workspace,
    /scopeResult\.result\.totalCost\s*\?\?\s*0/,
  );

  assert.match(
    workspace,
    /savedScope\.filter\s*\(/,
  );
});

test("cost freshness breakdown preserves saved-total presentation", () => {
  assert.match(
    source,
    /import\s*\{\s*summarizeWorkflowCosts\s*\}\s*from\s*["']@\/data\/workflowCostSummary["']/,
  );

  assert.match(workspace, /const costSummary = summarizeWorkflowCosts\(/);
  assert.match(workspace, /Saved cost total/);
  assert.match(workspace, /formatCurrency\(savedTotalCost\)/);
  assert.match(workspace, /savedCostCount/);
});

test("cost breakdown renders only when saved costs exist", () => {
  assert.match(
    workspace,
    /\{savedCostCount > 0 && \([\s\S]*?Saved cost freshness breakdown/,
  );

  for (const bucket of [
    "costSummary.current",
    "costSummary.needsRecalculation",
    "costSummary.unverified",
  ]) {
    assert.ok(
      workspace.includes(bucket),
      `${bucket} must appear in the breakdown`,
    );
  }
});

test("non-current cost warning is conditional", () => {
  assert.match(
    workspace,
    /\{costSummary\.hasNonCurrentCosts && \([\s\S]*?role="status"/,
  );

  assert.match(
    workspace,
    /The saved cost total includes calculations that need recalculation/,
  );

  assert.match(
    workspace,
    /before relying on this total for an estimate/,
  );
});

test("calculator navigation and result groups remain", () => {
  assert.match(
    workspace,
    /href=\{getCalculatorHref\(item\)\}/,
  );

  for (const title of ["Inputs", "Results", "Costs"]) {
    assert.ok(
      workspace.includes(`title="${title}"`),
      `${title} result group must remain`,
    );
  }
});
