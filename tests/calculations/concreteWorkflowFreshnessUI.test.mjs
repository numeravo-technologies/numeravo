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

test("freshness assessment occurs after missing-result guard", () => {
  const guard = workspace.indexOf("if (!scopeResult)");
  const assessment = workspace.indexOf(
    "getWorkflowResultFreshnessPresentation({",
  );

  assert.ok(guard >= 0);
  assert.ok(assessment > guard);
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
