import type { WorkflowDefinition } from "../workflowDefinition";

export const concreteSlabEquipmentPadWorkflowDefinition: WorkflowDefinition = {
  id: "construction.concrete-slab-equipment-pad",
  vertical: "construction",
  terminology: "project",
  title: "Concrete Slab / Equipment Pad",
  description:
    "Plan a slab or equipment pad by carrying the same project dimensions through concrete quantity, base, reinforcement, forms, delivery, placement, labor, finishing, and joint calculations.",
  inputs: [
    {
      key: "length",
      label: "Length",
      description: "Overall project length.",
    },
    {
      key: "width",
      label: "Width",
      description: "Overall project width.",
    },
    {
      key: "thickness",
      label: "Thickness",
      description: "Concrete slab thickness.",
    },
    {
      key: "wastePercent",
      label: "Waste",
      description: "Additional material allowance used for project planning.",
    },
  ],
  steps: [
    {
      id: "concrete",
      label: "Concrete quantity",
      description: "Calculate concrete volume and order quantity.",
      calculatorId: "concrete-calculator",
    },
    {
      id: "base",
      label: "Base material",
      description: "Estimate gravel or aggregate base material.",
      calculatorId: "gravel-calculator",
    },
    {
      id: "reinforcement",
      label: "Reinforcement",
      description:
        "Estimate slab rebar layout, quantity, weight, and material.",
      calculatorId: "rebar-spacing-for-concrete-slab",
    },
    {
      id: "formwork",
      label: "Formwork",
      description:
        "Estimate forms, stakes, bracing, fasteners, and formwork cost.",
      calculatorId: "concrete-formwork-calculator",
    },
    {
      id: "delivery",
      label: "Delivery and truckloads",
      description:
        "Estimate concrete truckloads and delivery requirements.",
      calculatorId: "concrete-truckload-calculator",
    },
    {
      id: "pumping",
      label: "Pumping",
      description:
        "Estimate pump truck cost when pumping is part of the project.",
      calculatorId: "concrete-pump-truck-cost-calculator",
    },
    {
      id: "labor",
      label: "Labor",
      description:
        "Estimate crew time, production, and labor cost.",
      calculatorId: "concrete-labor-cost-calculator",
    },
    {
      id: "finishing",
      label: "Finishing",
      description:
        "Estimate concrete finishing labor and project cost.",
      calculatorId: "concrete-finishing-cost-calculator",
    },
    {
      id: "joints",
      label: "Saw cuts and joints",
      description:
        "Estimate saw-cut layout, length, depth, and cutting cost.",
      calculatorId: "concrete-saw-cut-calculator",
    },
  ],
};
