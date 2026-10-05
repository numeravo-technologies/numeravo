"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import BackToProjectButton from "@/components/projects/BackToProjectButton";
import { getCalculatorById } from "@/data/calculators";
import type { ProjectUnitSystem } from "@/data/projectContext";
import { getProjectCalculatorHref } from "@/data/projectHandoff";
import { loadProjectSession } from "@/data/projectSession";
import {
  concreteProjectToWorkflowContext,
  workflowContextToConcreteProject,
} from "@/data/workflowAdapters/concreteProjectWorkflowAdapter";
import type { WorkflowContext } from "@/data/workflowContext";
import { concreteSlabEquipmentPadWorkflowDefinition } from "@/data/workflowDefinitions/concreteSlabEquipmentPad";

const PROJECT_RECIPE_ID = "concrete-slab-equipment-pad";

type NavigatorWorkflowState = {
  workflow: WorkflowContext;
  unitSystem: ProjectUnitSystem;
};

export default function ProjectWorkflowNavigator() {
  const pathname = usePathname();
  const [project, setProject] = useState<NavigatorWorkflowState | null>(null);

  useEffect(() => {
    const storedProject = loadProjectSession(PROJECT_RECIPE_ID);

    setProject(
      storedProject
        ? {
            workflow: concreteProjectToWorkflowContext(storedProject),
            unitSystem: storedProject.unitSystem,
          }
        : null,
    );
  }, [pathname]);

  if (!project) {
    return null;
  }

  const activeWorkflow = project.workflow;
  const definition = concreteSlabEquipmentPadWorkflowDefinition;

  if (activeWorkflow.definitionId !== definition.id) {
    return null;
  }

  const selectedScope = definition.steps.filter((step) =>
    activeWorkflow.selectedStepIds.includes(step.id),
  );

  if (selectedScope.length === 0) {
    return null;
  }

  const currentScope = selectedScope.find((step) => {
    const calculator = getCalculatorById(step.calculatorId);

    return calculator?.href === pathname;
  });

  if (!currentScope) {
    return null;
  }

  const length = numericWorkflowInput(activeWorkflow.inputs.length);
  const width = numericWorkflowInput(activeWorkflow.inputs.width);
  const thickness = numericWorkflowInput(activeWorkflow.inputs.thickness);
  const wastePercent = numericWorkflowInput(activeWorkflow.inputs.wastePercent);

  const dimensionSummary =
    length !== undefined && width !== undefined && thickness !== undefined
      ? `${length} × ${width} × ${thickness}" slab`
      : null;

  const handoffProject = workflowContextToConcreteProject(
    activeWorkflow,
    project.unitSystem,
  );

  return (
    <div className="border-b border-[#1F2937] bg-[#090D14] text-white">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <BackToProjectButton compact />

            <p className="mt-2 truncate text-lg font-bold text-white">
              {activeWorkflow.name.trim() || "Concrete slab / equipment pad"}
            </p>

            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#A0AEC0]">
              {dimensionSummary ? <span>{dimensionSummary}</span> : null}

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
            {selectedScope.map((step) => {
              const calculator = getCalculatorById(step.calculatorId);

              if (!calculator) {
                return null;
              }

              const current = step.id === currentScope.id;

              return (
                <Link
                  key={step.id}
                  href={getProjectCalculatorHref(
                    {
                      calculatorId: step.calculatorId,
                      calculatorHref: calculator.href,
                    },
                    handoffProject,
                  )}
                  aria-current={current ? "page" : undefined}
                  className={
                    current
                      ? "rounded-xl border border-[#F97316] bg-[#2A170D] px-4 py-3 text-sm font-semibold text-[#FDBA74] shadow-[0_0_0_1px_rgba(249,115,22,0.15)]"
                      : "rounded-xl border border-[#263041] bg-[#121826] px-4 py-3 text-sm font-semibold text-white transition hover:border-[#F97316]/70 hover:bg-[#171F2D]"
                  }
                >
                  <span className="block">{step.label}</span>

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

function numericWorkflowInput(
  value: WorkflowContext["inputs"][string],
): number | undefined {
  return typeof value === "number" ? value : undefined;
}
