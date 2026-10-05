import { getCalculatorById } from "./calculators";

export type WorkflowVertical =
  | "construction"
  | "finance"
  | "business"
  | "seller-tools";

export type WorkflowTerminology =
  | "project"
  | "plan"
  | "estimate"
  | "workflow";

export type WorkflowInputDefinition = {
  key: string;
  label: string;
  description: string;
};

export type WorkflowStepDefinition = {
  id: string;
  label: string;
  description: string;
  calculatorId: string;
};

export type WorkflowDefinition = {
  id: string;
  vertical: WorkflowVertical;
  terminology: WorkflowTerminology;
  title: string;
  description: string;
  inputs: WorkflowInputDefinition[];
  steps: WorkflowStepDefinition[];
};

export type WorkflowDefinitionIssue = {
  definitionId: string;
  stepId?: string;
  detail: string;
};

export function validateWorkflowDefinition(
  definition: WorkflowDefinition,
): WorkflowDefinitionIssue[] {
  const issues: WorkflowDefinitionIssue[] = [];
  const stepIds = new Set<string>();

  for (const step of definition.steps) {
    if (stepIds.has(step.id)) {
      issues.push({
        definitionId: definition.id,
        stepId: step.id,
        detail: `Duplicate workflow step id: ${step.id}`,
      });
    }

    stepIds.add(step.id);

    if (!getCalculatorById(step.calculatorId)) {
      issues.push({
        definitionId: definition.id,
        stepId: step.id,
        detail: `Calculator does not exist: ${step.calculatorId}`,
      });
    }
  }

  return issues;
}

export function validateWorkflowDefinitions(
  definitions: WorkflowDefinition[],
): WorkflowDefinitionIssue[] {
  const issues: WorkflowDefinitionIssue[] = [];
  const definitionIds = new Set<string>();

  for (const definition of definitions) {
    if (definitionIds.has(definition.id)) {
      issues.push({
        definitionId: definition.id,
        detail: `Duplicate workflow definition id: ${definition.id}`,
      });
    }

    definitionIds.add(definition.id);
    issues.push(...validateWorkflowDefinition(definition));
  }

  return issues;
}
