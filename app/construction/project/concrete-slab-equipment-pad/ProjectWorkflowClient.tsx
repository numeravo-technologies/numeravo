"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { ProjectUnitSystem } from "@/data/projectContext";
import {
  createWorkflowContext,
  isWorkflowStepSelected,
  setWorkflowInput,
  toggleWorkflowStep,
  type WorkflowContext,
} from "@/data/workflowContext";
import { workflowContextToConcreteProject } from "@/data/workflowAdapters/concreteProjectWorkflowAdapter";
import { getConcreteWorkflowCalculatorHref } from "@/data/workflowHandoff/concreteWorkflowHandoff";
import { saveProjectSession } from "@/data/projectSession";
import type { WorkflowInputDefinition } from "@/data/workflowDefinition";
import { loadConcreteWorkflowSession } from "@/data/workflowPersistence/concreteWorkflowSession";

type WorkflowScopeItem = {
  id: string;
  label: string;
  description: string;
  calculatorId: string;
  calculatorTitle: string;
  calculatorHref: string;
};

type ProjectWorkflowClientProps = {
  definitionId: string;
  title: string;
  description: string;
  coreInputs: WorkflowInputDefinition[];
  scope: WorkflowScopeItem[];
};

export default function ProjectWorkflowClient({
  definitionId,
  title,
  description,
  coreInputs,
  scope,
}: ProjectWorkflowClientProps) {
  const [workflow, setWorkflow] = useState(() =>
    createWorkflowContext(definitionId),
  );
  const [unitSystem, setUnitSystem] = useState<ProjectUnitSystem>("imperial");
  const [sessionRestored, setSessionRestored] = useState(false);

  useEffect(() => {
    const session = loadConcreteWorkflowSession();

    if (session) {
      setWorkflow(session.workflow);
      setUnitSystem(session.unitSystem);
    }

    setSessionRestored(true);
  }, [definitionId]);

  useEffect(() => {
    if (!sessionRestored) {
      return;
    }

    saveProjectSession(workflowContextToConcreteProject(workflow, unitSystem));
  }, [workflow, unitSystem, sessionRestored]);

  const selectedScope = scope.filter((item) =>
    workflow.selectedStepIds.includes(item.id),
  );

  function getCalculatorHref(item: WorkflowScopeItem) {
    return getConcreteWorkflowCalculatorHref(item, workflow);
  }

  const updateInput = (key: string, rawValue: string) => {
    if (rawValue === "") {
      setWorkflow((current) => setWorkflowInput(current, key, null));

      return;
    }

    const value = Number(rawValue);

    if (!Number.isFinite(value) || value < 0) {
      return;
    }

    setWorkflow((current) => setWorkflowInput(current, key, value));
  };

  const toggleScope = (item: WorkflowScopeItem) => {
    setWorkflow((current) => toggleWorkflowStep(current, item.id));
  };

  return (
    <div>
      <div className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F97316]">
          Project workflow preview
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-8 text-[#A0AEC0] sm:text-lg">
          {description}
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-[#1F2937] bg-[#121826] p-5 sm:p-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F97316]">
                Project
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                Project information
              </h2>
            </div>

            <label className="mt-6 block">
              <span className="text-sm font-medium text-[#A0AEC0]">
                Project name
              </span>

              <input
                type="text"
                value={workflow.name}
                onChange={(event) =>
                  setWorkflow((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Example: North equipment pad"
                className="mt-2 min-h-12 w-full rounded-xl border border-[#2A3444] bg-[#090F18] px-4 py-3 text-base text-white outline-none transition placeholder:text-[#596273] focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10"
              />
            </label>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {coreInputs.map((input) => {
                const suffix =
                  input.key === "thickness"
                    ? "in"
                    : input.key === "wastePercent"
                      ? "%"
                      : "ft";

                return (
                  <label key={input.key} className="block">
                    <span className="text-sm font-medium text-[#A0AEC0]">
                      {input.label}
                    </span>

                    <div className="mt-2 flex min-h-12 overflow-hidden rounded-xl border border-[#2A3444] bg-[#090F18] transition focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-[#F97316]/10">
                      <input
                        type="number"
                        min="0"
                        inputMode="decimal"
                        value={
                          numericWorkflowInput(workflow.inputs[input.key]) ?? ""
                        }
                        onChange={(event) =>
                          updateInput(input.key, event.target.value)
                        }
                        className="w-full bg-transparent px-4 py-3 text-base text-white outline-none"
                      />

                      <span className="border-l border-[#1F2937] px-4 py-3 text-sm text-[#A0AEC0]">
                        {suffix}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-[#6B7280]">
                      {input.description}
                    </p>
                  </label>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-[#1F2937] bg-[#121826] p-5 sm:p-6">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F97316]">
                Scope
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                What should this project include?
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#A0AEC0]">
                Select the estimating categories you want to review. These are
                planning options and are not a statement that every item is
                required for every project.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {scope.map((item) => {
                const selected = isWorkflowStepSelected(workflow, item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleScope(item)}
                    className={
                      selected
                        ? "rounded-2xl border border-[#F97316] bg-[#2A170D] p-4 text-left transition"
                        : "rounded-2xl border border-[#263041] bg-[#0B0F19] p-4 text-left transition hover:border-[#F97316]/60"
                    }
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-white">
                          {item.label}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-[#A0AEC0]">
                          {item.description}
                        </p>
                      </div>

                      <span
                        className={
                          selected
                            ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F97316] text-xs font-bold text-[#090D14]"
                            : "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#4B5563] text-xs text-[#6B7280]"
                        }
                      >
                        {selected ? "✓" : "+"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-3xl border border-[#3A2A20] bg-[#121826] p-5 sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F97316]">
              Project summary
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              {workflow.name.trim() || "Untitled project"}
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <SummaryValue
                label="Length"
                value={formatProjectValue(
                  numericWorkflowInput(workflow.inputs.length),
                  "ft",
                )}
              />
              <SummaryValue
                label="Width"
                value={formatProjectValue(
                  numericWorkflowInput(workflow.inputs.width),
                  "ft",
                )}
              />
              <SummaryValue
                label="Thickness"
                value={formatProjectValue(
                  numericWorkflowInput(workflow.inputs.thickness),
                  "in",
                )}
              />
              <SummaryValue
                label="Waste"
                value={formatProjectValue(
                  numericWorkflowInput(workflow.inputs.wastePercent),
                  "%",
                )}
              />
            </div>

            <div className="mt-6 border-t border-[#1F2937] pt-5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold text-white">Selected scope</h3>

                <span className="text-sm font-semibold text-[#F97316]">
                  {selectedScope.length}
                </span>
              </div>

              {selectedScope.length === 0 ? (
                <p className="mt-4 text-sm leading-6 text-[#A0AEC0]">
                  Select project scope items to build the calculation workflow.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {selectedScope.map((item, index) => (
                    <Link
                      key={item.id}
                      href={getCalculatorHref(item)}
                      className="group block rounded-xl border border-[#263041] bg-[#0B0F19] p-3 transition hover:border-[#F97316]/70"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#F97316]/50 text-xs font-bold text-[#F97316]">
                          {index + 1}
                        </span>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white">
                            {item.label}
                          </p>

                          <p className="mt-1 truncate text-xs text-[#6B7280]">
                            {item.calculatorTitle}
                          </p>
                        </div>

                        <span className="ml-auto text-[#6B7280] transition group-hover:translate-x-1 group-hover:text-[#F97316]">
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-[#1F2937] pt-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-white">
                    Calculation progress
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-[#7F8A9B]">
                    Saved results from the calculators selected for this
                    project.
                  </p>
                </div>

                <span className="text-sm font-semibold text-[#F97316]">
                  {
                    selectedScope.filter((item) => workflow.results[item.id])
                      .length
                  }
                  /{selectedScope.length}
                </span>
              </div>

              {selectedScope.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedScope.map((item) => {
                    const saved = workflow.results[item.id];

                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-[#263041] bg-[#0B0F19] px-3 py-3"
                      >
                        <span className="text-sm font-medium text-white">
                          {item.label}
                        </span>

                        <span
                          className={
                            saved
                              ? "text-xs font-semibold uppercase tracking-[0.12em] text-emerald-400"
                              : "text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]"
                          }
                        >
                          {saved ? "Saved" : "Not calculated"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      <ProjectResultsWorkspace
        workflow={workflow}
        selectedScope={selectedScope}
        getCalculatorHref={getCalculatorHref}
      />
    </div>
  );
}

function ProjectResultsWorkspace({
  workflow,
  selectedScope,
  getCalculatorHref,
}: {
  workflow: WorkflowContext;
  selectedScope: WorkflowScopeItem[];
  getCalculatorHref: (item: WorkflowScopeItem) => string;
}) {
  const savedScope = selectedScope
    .map((item) => ({
      item,
      scopeResult: workflow.results[item.id],
    }))
    .filter(
      (
        entry,
      ): entry is {
        item: WorkflowScopeItem;
        scopeResult: NonNullable<(typeof workflow.results)[string]>;
      } => Boolean(entry.scopeResult),
    );

  const savedTotalCost = savedScope.reduce(
    (total, { scopeResult }) => total + (scopeResult.result.totalCost ?? 0),
    0,
  );

  const savedCostCount = savedScope.filter(
    ({ scopeResult }) => scopeResult.result.totalCost !== undefined,
  ).length;

  return (
    <section className="mt-8 rounded-3xl border border-[#1F2937] bg-[#121826] p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F97316]">
            Project results
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Calculation workspace
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#A0AEC0]">
            Review the individual calculations saved to this project. Results
            remain separated by scope so the estimate can be traced back to each
            calculator.
          </p>
        </div>

        <div className="rounded-2xl border border-[#3A2A20] bg-[#0B0F19] px-4 py-3 sm:min-w-56">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7F8A9B]">
            Saved cost total
          </p>
          <p className="mt-1 text-2xl font-bold text-white">
            {formatCurrency(savedTotalCost)}
          </p>
          <p className="mt-1 text-xs leading-5 text-[#7F8A9B]">
            From {savedCostCount} saved calculation
            {savedCostCount === 1 ? "" : "s"} with cost totals.
          </p>
        </div>
      </div>

      {selectedScope.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[#2A3444] bg-[#0B0F19] p-5">
          <p className="text-sm text-[#A0AEC0]">
            Select project scope items above to build the calculation workspace.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {selectedScope.map((item) => {
            const scopeResult = workflow.results[item.id];

            if (!scopeResult) {
              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-[#263041] bg-[#0B0F19] p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-white">
                          {item.label}
                        </h3>
                        <span className="rounded-full border border-[#374151] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7F8A9B]">
                          Not calculated
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-[#A0AEC0]">
                        {item.description}
                      </p>
                    </div>

                    <Link
                      href={getCalculatorHref(item)}
                      className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-[#F97316] px-4 py-2 text-sm font-semibold text-[#FDBA74] transition hover:bg-[#2A170D]"
                    >
                      Open Calculator
                    </Link>
                  </div>
                </article>
              );
            }

            const result = scopeResult.result;

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-[#3A2A20] bg-[#0B0F19]"
              >
                <div className="flex flex-col gap-4 border-b border-[#263041] p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold text-white">
                        {item.label}
                      </h3>
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-400">
                        Saved
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-[#A0AEC0]">
                      {scopeResult.calculatorTitle}
                    </p>

                    <p className="mt-2 text-xs text-[#6B7280]">
                      Updated {formatUpdatedAt(scopeResult.updatedAt)}
                    </p>
                  </div>

                  <Link
                    href={getCalculatorHref(item)}
                    className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-[#F97316] px-4 py-2 text-sm font-semibold text-[#FDBA74] transition hover:bg-[#2A170D]"
                  >
                    Open / Update
                  </Link>
                </div>

                <div className="grid gap-6 p-5 lg:grid-cols-3">
                  <ResultGroup
                    title="Inputs"
                    rows={result.inputSummary.map((field) => ({
                      key: field.key,
                      label: field.label,
                      value: formatResultValue(field.value, field.unit),
                    }))}
                  />

                  <ResultGroup
                    title="Results"
                    rows={result.metrics.map((metric) => ({
                      key: metric.key,
                      label: metric.label,
                      value: formatResultNumber(metric.value, metric.unit),
                    }))}
                  />

                  <ResultGroup
                    title="Costs"
                    rows={
                      result.costs && result.costs.length > 0
                        ? [
                            ...result.costs.map((cost) => ({
                              key: cost.key,
                              label: cost.label,
                              value: formatCurrency(cost.amount),
                            })),
                            ...(result.totalCost !== undefined
                              ? [
                                  {
                                    key: "totalCost",
                                    label: "Saved Total",
                                    value: formatCurrency(result.totalCost),
                                  },
                                ]
                              : []),
                          ]
                        : [
                            {
                              key: "no-cost",
                              label: "Cost result",
                              value: "Not provided",
                            },
                          ]
                    }
                  />
                </div>

                {result.notes && result.notes.length > 0 && (
                  <div className="border-t border-[#263041] px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7F8A9B]">
                      Notes
                    </p>
                    <div className="mt-2 space-y-1">
                      {result.notes.map((note, index) => (
                        <p
                          key={`${item.id}-note-${index}`}
                          className="text-sm leading-6 text-[#A0AEC0]"
                        >
                          {note}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ResultGroup({
  title,
  rows,
}: {
  title: string;
  rows: Array<{
    key: string;
    label: string;
    value: string;
  }>;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#F97316]">
        {title}
      </p>

      <dl className="mt-3 space-y-3">
        {rows.map((row) => (
          <div
            key={row.key}
            className="border-b border-[#1F2937] pb-3 last:border-b-0 last:pb-0"
          >
            <dt className="text-xs leading-5 text-[#7F8A9B]">{row.label}</dt>
            <dd className="mt-1 break-words text-sm font-semibold text-white">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function formatResultValue(
  value: string | number | boolean | null,
  unit?: string,
) {
  if (value === null) {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "number") {
    return formatResultNumber(value, unit);
  }

  return unit ? `${value} ${unit}` : value;
}

function formatResultNumber(value: number, unit?: string) {
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);

  return unit ? `${formatted} ${unit}` : formatted;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatUpdatedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function SummaryValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#263041] bg-[#0B0F19] p-3">
      <p className="text-xs text-[#6B7280]">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}

function numericWorkflowInput(
  value: WorkflowContext["inputs"][string],
): number | undefined {
  return typeof value === "number" ? value : undefined;
}

function formatProjectValue(value: number | undefined, suffix: string) {
  if (value === undefined) {
    return "—";
  }

  return `${value} ${suffix}`;
}
