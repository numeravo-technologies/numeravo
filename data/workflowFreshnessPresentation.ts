import {
  assessWorkflowResultFreshness,
  type WorkflowFreshnessAssessment,
  type WorkflowFreshnessReason,
  type WorkflowFreshnessStatus,
} from "./workflowFreshness";
import type { WorkflowResult } from "./workflowResult";
import type { WorkflowUnitSystem } from "./workflowResultProvenance";

export type WorkflowFreshnessPresentation = {
  status: WorkflowFreshnessStatus;
  reason: WorkflowFreshnessReason;
  label: string;
  description: string;
  affectedInputs: string[];
};

export function presentWorkflowFreshnessAssessment(
  assessment: WorkflowFreshnessAssessment,
): WorkflowFreshnessPresentation {
  switch (assessment.status) {
    case "current":
      return {
        status: "current",
        reason: assessment.reason,
        label: "Current",
        description:
          "Saved calculation inputs are verified against the current project inputs.",
        affectedInputs: [...assessment.affectedInputs],
      };

    case "needs-recalculation":
      return {
        status: "needs-recalculation",
        reason: assessment.reason,
        label: "Needs recalculation",
        description:
          "Relevant project inputs have changed since this calculation was saved. Open the calculator to update the result.",
        affectedInputs: [...assessment.affectedInputs],
      };

    case "unverified":
      return {
        status: "unverified",
        reason: assessment.reason,
        label: "Unverified",
        description:
          "The saved calculation is available, but its freshness cannot be verified against the current project inputs.",
        affectedInputs: [...assessment.affectedInputs],
      };
  }
}

export function getWorkflowResultFreshnessPresentation({
  result,
  currentProjectInputs,
  currentUnitSystem,
}: {
  result: WorkflowResult;
  currentProjectInputs: Record<string, unknown>;
  currentUnitSystem: WorkflowUnitSystem;
}): WorkflowFreshnessPresentation {
  return presentWorkflowFreshnessAssessment(
    assessWorkflowResultFreshness({
      stepId: result.stepId,
      calculatorId: result.calculatorId,
      provenance: result.provenance,
      currentProjectInputs,
      currentUnitSystem,
    }),
  );
}
