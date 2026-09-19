"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { getCalculatorById } from "@/data/calculators";
import {
  getProjectConcreteYards,
  type ProjectContext,
} from "@/data/projectContext";
import { loadProjectSession } from "@/data/projectSession";
import { getProjectRecipeById } from "@/data/projectRecipes";

const PROJECT_RECIPE_ID = "concrete-slab-equipment-pad";

const PROJECT_HREF =
  "/construction/project/concrete-slab-equipment-pad";

export default function ProjectWorkflowNavigator() {
  const pathname = usePathname();
  const [project, setProject] = useState<ProjectContext | null>(null);

  useEffect(() => {
    setProject(loadProjectSession(PROJECT_RECIPE_ID));
  }, [pathname]);

  if (!project) {
    return null;
  }

  const activeProject = project;
  const recipe = getProjectRecipeById(activeProject.recipeId);

  if (!recipe) {
    return null;
  }

  const selectedScope = recipe.scope.filter((component) =>
    activeProject.selectedScopeIds.includes(component.id),
  );

  if (selectedScope.length === 0) {
    return null;
  }

  const currentScope = selectedScope.find((component) => {
    const calculator = getCalculatorById(component.calculatorId);

    return calculator?.href === pathname;
  });

  if (!currentScope) {
    return null;
  }

  function getCalculatorHref(
    calculatorId: string,
    calculatorHref: string,
  ) {
    const supportedCalculatorIds = new Set([
      "concrete-calculator",
      "gravel-calculator",
      "rebar-spacing-for-concrete-slab",
      "concrete-formwork-calculator",
      "concrete-truckload-calculator",
      "concrete-pump-truck-cost-calculator",
      "concrete-labor-cost-calculator",
      "concrete-finishing-cost-calculator",
    ]);

    if (!supportedCalculatorIds.has(calculatorId)) {
      return calculatorHref;
    }

    const params = new URLSearchParams({
      fromProject: activeProject.recipeId,
    });

    const length = activeProject.inputs.length;
    const width = activeProject.inputs.width;
    const thickness = activeProject.inputs.thickness;
    const wastePercent = activeProject.inputs.wastePercent;

    const usesDimensions =
      calculatorId !==
      "concrete-pump-truck-cost-calculator";

    if (usesDimensions && length !== undefined) {
      params.set("length", String(length));
    }

    if (usesDimensions && width !== undefined) {
      params.set("width", String(width));
    }

    if (
      (calculatorId === "concrete-calculator" ||
        calculatorId === "concrete-truckload-calculator" ||
        calculatorId === "concrete-labor-cost-calculator") &&
      thickness !== undefined
    ) {
      params.set("thickness", String(thickness));
    }

    if (
      (calculatorId === "concrete-calculator" ||
        calculatorId === "gravel-calculator" ||
        calculatorId === "concrete-formwork-calculator" ||
        calculatorId === "concrete-truckload-calculator") &&
      wastePercent !== undefined
    ) {
      params.set("waste", String(wastePercent));
    }

    if (
      calculatorId ===
      "concrete-pump-truck-cost-calculator"
    ) {
      const concreteYards =
        getProjectConcreteYards(activeProject);

      if (concreteYards !== null) {
        params.set("yards", String(concreteYards));
      }
    }

    return `${calculatorHref}?${params.toString()}`;
  }

  const length = activeProject.inputs.length;
  const width = activeProject.inputs.width;
  const thickness = activeProject.inputs.thickness;
  const wastePercent = activeProject.inputs.wastePercent;

  const dimensionSummary =
    length !== undefined &&
    width !== undefined &&
    thickness !== undefined
      ? `${length} × ${width} × ${thickness}" slab`
      : null;

  return (
    <div className="border-b border-[#1F2937] bg-[#090D14] text-white">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <Link
              href={PROJECT_HREF}
              className="inline-flex items-center text-sm font-semibold text-[#F97316] transition hover:text-[#FDBA74]"
            >
              ← Back to project
            </Link>

            <p className="mt-2 truncate text-lg font-bold text-white">
              {activeProject.projectName.trim() ||
                "Concrete slab / equipment pad"}
            </p>

            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#A0AEC0]">
              {dimensionSummary ? (
                <span>{dimensionSummary}</span>
              ) : null}

              {wastePercent !== undefined ? (
                <span>{wastePercent}% waste</span>
              ) : null}

              <span>
                {selectedScope.length} scope item
                {selectedScope.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          <div className="lg:text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F97316]">
              Project workflow
            </p>

            <p className="mt-1 text-xs text-[#A0AEC0]">
              Current: {currentScope.label}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#A0AEC0]">
            Selected scope
          </p>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {selectedScope.map((component) => {
              const calculator = getCalculatorById(
                component.calculatorId,
              );

              if (!calculator) {
                return null;
              }

              const current =
                component.id === currentScope.id;

              return (
                <Link
                  key={component.id}
                  href={getCalculatorHref(
                    component.calculatorId,
                    calculator.href,
                  )}
                  aria-current={current ? "page" : undefined}
                  className={
                    current
                      ? "rounded-xl border border-[#F97316] bg-[#2A170D] px-4 py-3 text-sm font-semibold text-[#FDBA74] shadow-[0_0_0_1px_rgba(249,115,22,0.15)]"
                      : "rounded-xl border border-[#263041] bg-[#121826] px-4 py-3 text-sm font-semibold text-white transition hover:border-[#F97316]/70 hover:bg-[#171F2D]"
                  }
                >
                  <span className="block">
                    {component.label}
                  </span>

                  {current ? (
                    <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.12em] text-[#F97316]">
                      Current
                    </span>
                  ) : (
                    <span className="mt-1 block text-xs font-normal text-[#7F8A9B]">
                      Open calculator
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
