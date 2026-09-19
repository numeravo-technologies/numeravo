"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  createProjectContext,
  isScopeComponentSelected,
  setProjectInput,
  toggleScopeComponent,
} from "@/data/projectContext";
import {
  loadProjectSession,
  saveProjectSession,
} from "@/data/projectSession";
import type {
  ProjectInputKey,
  ProjectRecipeId,
  ProjectRecipeInput,
} from "@/data/projectRecipes";

type WorkflowScopeItem = {
  id: string;
  label: string;
  description: string;
  calculatorId: string;
  calculatorTitle: string;
  calculatorHref: string;
};

type ProjectWorkflowClientProps = {
  recipeId: ProjectRecipeId;
  title: string;
  description: string;
  coreInputs: ProjectRecipeInput[];
  scope: WorkflowScopeItem[];
};

export default function ProjectWorkflowClient({
  recipeId,
  title,
  description,
  coreInputs,
  scope,
}: ProjectWorkflowClientProps) {
  const [project, setProject] = useState(() =>
    createProjectContext(recipeId),
  );
  const [sessionRestored, setSessionRestored] = useState(false);

  useEffect(() => {
    const storedProject = loadProjectSession(recipeId);

    if (storedProject) {
      setProject(storedProject);
    }

    setSessionRestored(true);
  }, [recipeId]);

  useEffect(() => {
    if (!sessionRestored) {
      return;
    }

    saveProjectSession(project);
  }, [project, sessionRestored]);

  const selectedScope = scope.filter((item) =>
    project.selectedScopeIds.includes(item.id),
  );

  function getCalculatorHref(item: WorkflowScopeItem) {
    const supportedCalculatorIds = new Set([
      "concrete-calculator",
      "gravel-calculator",
      "rebar-spacing-for-concrete-slab",
      "concrete-formwork-calculator",
      "concrete-truckload-calculator",
    ]);

    if (!supportedCalculatorIds.has(item.calculatorId)) {
      return item.calculatorHref;
    }

    const params = new URLSearchParams({
      fromProject: recipeId,
    });

    const length = project.inputs.length;
    const width = project.inputs.width;
    const thickness = project.inputs.thickness;
    const wastePercent = project.inputs.wastePercent;

    if (length !== undefined) {
      params.set("length", String(length));
    }

    if (width !== undefined) {
      params.set("width", String(width));
    }

    if (
      (item.calculatorId === "concrete-calculator" ||
        item.calculatorId === "concrete-truckload-calculator") &&
      thickness !== undefined
    ) {
      params.set("thickness", String(thickness));
    }

    if (
      (item.calculatorId === "concrete-calculator" ||
        item.calculatorId === "gravel-calculator" ||
        item.calculatorId === "concrete-formwork-calculator" ||
        item.calculatorId === "concrete-truckload-calculator") &&
      wastePercent !== undefined
    ) {
      params.set("waste", String(wastePercent));
    }

    return `${item.calculatorHref}?${params.toString()}`;
  }

  const updateInput = (
    key: ProjectInputKey,
    rawValue: string,
  ) => {
    if (rawValue === "") {
      setProject((current) => ({
        ...current,
        inputs: {
          ...current.inputs,
          [key]: undefined,
        },
      }));

      return;
    }

    const value = Number(rawValue);

    if (!Number.isFinite(value) || value < 0) {
      return;
    }

    setProject((current) =>
      setProjectInput(current, key, value),
    );
  };

  const toggleScope = (item: WorkflowScopeItem) => {
    setProject((current) =>
      toggleScopeComponent(current, item.id),
    );
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
                value={project.projectName}
                onChange={(event) =>
                  setProject((current) => ({
                    ...current,
                    projectName: event.target.value,
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
                        value={project.inputs[input.key] ?? ""}
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
                const selected = isScopeComponentSelected(
                  project,
                  item.id,
                );

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
              {project.projectName.trim() || "Untitled project"}
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <SummaryValue
                label="Length"
                value={formatProjectValue(project.inputs.length, "ft")}
              />
              <SummaryValue
                label="Width"
                value={formatProjectValue(project.inputs.width, "ft")}
              />
              <SummaryValue
                label="Thickness"
                value={formatProjectValue(project.inputs.thickness, "in")}
              />
              <SummaryValue
                label="Waste"
                value={formatProjectValue(project.inputs.wastePercent, "%")}
              />
            </div>

            <div className="mt-6 border-t border-[#1F2937] pt-5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold text-white">
                  Selected scope
                </h3>

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

            <div className="mt-6 rounded-xl border border-[#263041] bg-[#0B0F19] p-4">
              <p className="text-sm font-semibold text-white">
                Prototype behavior
              </p>

              <p className="mt-2 text-xs leading-5 text-[#A0AEC0]">
                Project inputs and scope selections currently stay on this page
                only. Opening a calculator does not yet transfer these values
                automatically.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SummaryValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#263041] bg-[#0B0F19] p-3">
      <p className="text-xs text-[#6B7280]">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}

function formatProjectValue(
  value: number | undefined,
  suffix: string,
) {
  if (value === undefined) {
    return "—";
  }

  return `${value} ${suffix}`;
}
