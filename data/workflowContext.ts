import type { WorkflowResult } from "./workflowResult";

export type WorkflowInputValue =
  | string
  | number
  | boolean
  | null;

export type WorkflowInputValues =
  Record<string, WorkflowInputValue>;

export type WorkflowContext = {
  definitionId: string;
  name: string;
  inputs: WorkflowInputValues;
  selectedStepIds: string[];
  results: Record<string, WorkflowResult>;
};

export function createWorkflowContext(
  definitionId: string,
): WorkflowContext {
  return {
    definitionId,
    name: "",
    inputs: {},
    selectedStepIds: [],
    results: {},
  };
}

export function isWorkflowStepSelected(
  workflow: WorkflowContext,
  stepId: string,
) {
  return workflow.selectedStepIds.includes(stepId);
}

export function toggleWorkflowStep(
  workflow: WorkflowContext,
  stepId: string,
): WorkflowContext {
  const isSelected =
    workflow.selectedStepIds.includes(stepId);

  return {
    ...workflow,
    selectedStepIds: isSelected
      ? workflow.selectedStepIds.filter(
          (id) => id !== stepId,
        )
      : [...workflow.selectedStepIds, stepId],
  };
}

export function setWorkflowInput(
  workflow: WorkflowContext,
  key: string,
  value: WorkflowInputValue,
): WorkflowContext {
  return {
    ...workflow,
    inputs: {
      ...workflow.inputs,
      [key]: value,
    },
  };
}

export function setWorkflowResult(
  workflow: WorkflowContext,
  workflowResult: WorkflowResult,
): WorkflowContext {
  return {
    ...workflow,
    results: {
      ...workflow.results,
      [workflowResult.stepId]: workflowResult,
    },
  };
}
