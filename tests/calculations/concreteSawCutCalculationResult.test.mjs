import assert from "node:assert/strict";
import test from "node:test";

import { buildConcreteSawCutCalculationResult } from "../../data/concreteSawCutCalculationResult.ts";

const baseInput = {
  preset: "Slab",
  length: 30,
  width: 20,
  thickness: 4,
  targetSpacing: 10,
  cutPurpose: "Control joints",
  cutBothDirections: true,
  extraCutLength: 0,
  costPerLinearFoot: 2.5,
  setupCost: 125,
  minimumCharge: 350,
  wasteOrOverrunPercent: 5,
};

const baseNativeResult = {
  area: 600,
  sawCutDepth: 1,
  minimumDepth: 0.8,
  deeperCutDepth: 4 / 3,
  spacingGuideLow: 8,
  spacingGuideHigh: 12,
  crossCuts: 2,
  crossCutFeet: 40,
  lengthwiseCuts: 1,
  lengthwiseCutFeet: 30,
  layoutCutFeet: 70,
  extraCutLength: 0,
  cutFeetBeforeOverrun: 70,
  overrunFeet: 3.5,
  totalCutFeet: 73.5,
  panelsLong: 3,
  panelsWide: 2,
  panelCount: 6,
  averagePanelLength: 10,
  averagePanelWidth: 10,
  cutCost: 183.75,
  setupCost: 125,
  subtotal: 308.75,
  minimumCharge: 350,
  minimumChargeAdjustment: 41.25,
  totalCost: 350,
  costPerSquareFoot: 350 / 600,
  estimatedCuttingHours: 73.5 / 120,
  notes: ["Minimum job charge is controlling the total estimate."],
};

function build(overrides = {}, resultOverrides = {}) {
  return buildConcreteSawCutCalculationResult({
    ...baseInput,
    ...overrides,
    result: {
      ...baseNativeResult,
      ...resultOverrides,
    },
  });
}

test("uses the Saw Cut calculator identity and preserves the audited inputs", () => {
  const result = build();

  assert.equal(result.calculatorId, "concrete-saw-cut-calculator");
  assert.equal(result.calculatorTitle, "Concrete Saw Cut Calculator");

  assert.deepEqual(
    result.inputSummary.map(({ key }) => key),
    [
      "preset",
      "length",
      "width",
      "thickness",
      "targetSpacing",
      "cutPurpose",
      "cutBothDirections",
      "extraCutLength",
      "costPerLinearFoot",
      "setupCost",
      "minimumCharge",
      "wasteOrOverrunPercent",
    ],
  );
});

test("preserves the native Saw Cut layout and planning metrics", () => {
  const result = build();

  assert.deepEqual(
    result.metrics.map(({ key }) => key),
    [
      "area",
      "sawCutDepth",
      "minimumDepth",
      "deeperCutDepth",
      "spacingGuideLow",
      "spacingGuideHigh",
      "crossCuts",
      "crossCutFeet",
      "lengthwiseCuts",
      "lengthwiseCutFeet",
      "layoutCutFeet",
      "cutFeetBeforeOverrun",
      "overrunFeet",
      "totalCutFeet",
      "panelsLong",
      "panelsWide",
      "panelCount",
      "averagePanelLength",
      "averagePanelWidth",
      "estimatedCuttingHours",
      "costPerSquareFoot",
    ],
  );

  assert.equal(
    result.metrics.find(({ key }) => key === "totalCutFeet")?.value,
    73.5,
  );

  assert.equal(
    result.metrics.find(({ key }) => key === "panelCount")?.value,
    6,
  );

  assert.equal(
    result.metrics.find(({ key }) => key === "sawCutDepth")?.value,
    1,
  );
});

test("preserves the native Saw Cut cost breakdown", () => {
  const result = build();

  assert.deepEqual(
    result.costs?.map(({ key }) => key),
    [
      "cutCost",
      "setupCost",
      "subtotal",
      "minimumCharge",
      "minimumChargeAdjustment",
    ],
  );

  assert.equal(
    result.costs?.find(({ key }) => key === "cutCost")?.amount,
    183.75,
  );

  assert.equal(
    result.costs?.find(({ key }) => key === "setupCost")?.amount,
    125,
  );

  assert.equal(
    result.costs?.find(({ key }) => key === "minimumChargeAdjustment")?.amount,
    41.25,
  );
});

test("uses the complete native Saw Cut total as the Project contribution", () => {
  const result = build();

  assert.equal(result.totalCost, 350);
});

test("preserves native minimum-charge behavior in the Project contribution", () => {
  const result = build();

  assert.equal(baseNativeResult.subtotal, 308.75);
  assert.equal(baseNativeResult.minimumCharge, 350);
  assert.equal(baseNativeResult.minimumChargeAdjustment, 41.25);
  assert.equal(result.totalCost, 350);
});

test("allows the native subtotal to control when it exceeds the minimum charge", () => {
  const result = build(
    {
      extraCutLength: 100,
    },
    {
      extraCutLength: 100,
      cutFeetBeforeOverrun: 170,
      overrunFeet: 8.5,
      totalCutFeet: 178.5,
      cutCost: 446.25,
      subtotal: 571.25,
      minimumChargeAdjustment: 0,
      totalCost: 571.25,
      costPerSquareFoot: 571.25 / 600,
      estimatedCuttingHours: 178.5 / 120,
    },
  );

  assert.equal(result.totalCost, 571.25);
  assert.equal(
    result.costs?.find(({ key }) => key === "minimumChargeAdjustment")?.amount,
    0,
  );
});

test("preserves the native planning notes", () => {
  const notes = [
    "Panel layout is long and narrow. More balanced panels usually perform better.",
  ];

  const result = build({}, { notes });

  assert.deepEqual(result.notes, notes);
});
