import test from "node:test";
import assert from "node:assert/strict";

import {
  buildConcreteFinishingCostCalculationResult,
} from "../../data/concreteFinishingCostCalculationResult.ts";

function close(actual, expected, epsilon = 1e-9) {
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `expected ${actual} to be within ${epsilon} of ${expected}`,
  );
}

const baseInput = {
  preset: "Broom finish",
  length: 30,
  width: 20,
  finishType: "Broom finish",
  productionRateSqFtPerHour: 225,
  crewSize: 3,
  laborRatePerHour: 55,
  finishMaterialCostPerSqFt: 0.15,
  edgeWorkCost: 150,
  curingCostPerSqFt: 0.12,
  sealingCostPerSqFt: 0,
  sawCutCost: 0,
  cleanupCost: 125,
  minimumCharge: 750,
  overheadPercent: 10,
};

const baseNativeResult = {
  area: 600,
  crewHours: 600 / 225,
  personHours: (600 / 225) * 3,
  laborCost: 440,
  finishMaterialCost: 90,
  curingCost: 72,
  sealingCost: 0,
  edgeWorkCost: 150,
  sawCutCost: 0,
  cleanupCost: 125,
  directCost: 877,
  overheadCost: 87.7,
  subtotal: 964.7,
  minimumCharge: 750,
  minimumChargeAdjustment: 0,
  totalCost: 964.7,
  costPerSqFt: 964.7 / 600,
  laborCostPerSqFt: 440 / 600,
  materialCostPerSqFt: (90 + 72) / 600,
  notes: [
    "Finishing estimate looks reasonable for the selected area, finish type, and crew productivity.",
  ],
};

function build(overrides = {}) {
  const {
    result: resultOverrides = {},
    ...inputOverrides
  } = overrides;

  return buildConcreteFinishingCostCalculationResult({
    ...baseInput,
    ...inputOverrides,
    result: {
      ...baseNativeResult,
      ...resultOverrides,
    },
  });
}

test("uses the Finishing calculator identity and preserves the audited inputs", () => {
  const result = build();

  assert.equal(
    result.calculatorId,
    "concrete-finishing-cost-calculator",
  );
  assert.equal(
    result.calculatorTitle,
    "Concrete Finishing Cost Calculator",
  );

  assert.deepEqual(
    result.inputSummary.map(({ key }) => key),
    [
      "preset",
      "length",
      "width",
      "finishType",
      "productionRateSqFtPerHour",
      "crewSize",
      "laborRatePerHour",
      "finishMaterialCostPerSqFt",
      "edgeWorkCost",
      "curingCostPerSqFt",
      "sealingCostPerSqFt",
      "sawCutCost",
      "cleanupCost",
      "minimumCharge",
      "overheadPercent",
    ],
  );
});

test("preserves the native Finishing metrics", () => {
  const result = build();

  const metrics = Object.fromEntries(
    result.metrics.map(({ key, value }) => [key, value]),
  );

  close(metrics.area, baseNativeResult.area);
  close(metrics.crewHours, baseNativeResult.crewHours);
  close(metrics.personHours, baseNativeResult.personHours);
  close(metrics.costPerSqFt, baseNativeResult.costPerSqFt);
  close(
    metrics.laborCostPerSqFt,
    baseNativeResult.laborCostPerSqFt,
  );
  close(
    metrics.materialCostPerSqFt,
    baseNativeResult.materialCostPerSqFt,
  );
});

test("preserves native Finishing economics in the cost breakdown", () => {
  const result = build();

  const costs = Object.fromEntries(
    result.costs.map(({ key, amount }) => [key, amount]),
  );

  assert.equal(costs.laborCost, 440);
  assert.equal(costs.finishMaterialCost, 90);
  assert.equal(costs.curingCost, 72);
  assert.equal(costs.sealingCost, 0);
  assert.equal(costs.edgeWorkCost, 150);
  assert.equal(costs.sawCutCost, 0);
  assert.equal(costs.cleanupCost, 125);
  assert.equal(costs.nativeDirectCost, 877);
  assert.equal(costs.nativeOverheadCost, 87.7);
  assert.equal(costs.nativeSubtotal, 964.7);
  assert.equal(costs.minimumCharge, 750);
  assert.equal(costs.minimumChargeAdjustment, 0);
  assert.equal(costs.nativeTotalCost, 964.7);
});

test("excludes Finishing labor from the Project contribution", () => {
  const result = build({
    result: {
      laborCost: 5000,
      directCost: 5437,
      overheadCost: 543.7,
      subtotal: 5980.7,
      totalCost: 5980.7,
    },
  });

  close(result.totalCost, 480.7);
});

test("excludes saw-cut allowance from the Project contribution", () => {
  const result = build({
    sawCutCost: 500,
    result: {
      sawCutCost: 500,
      directCost: 1377,
      overheadCost: 137.7,
      subtotal: 1514.7,
      totalCost: 1514.7,
    },
  });

  close(result.totalCost, 480.7);
});

test("applies overhead only to Finishing-owned Project costs", () => {
  const result = build();

  const costs = Object.fromEntries(
    result.costs.map(({ key, amount }) => [key, amount]),
  );

  assert.equal(costs.projectDirectCost, 437);
  close(costs.projectOverheadCost, 43.7);
  close(result.totalCost, 480.7);
});

test("does not reapply the native minimum charge to the reduced Project contribution", () => {
  const result = build({
    length: 10,
    width: 10,
    minimumCharge: 750,
    result: {
      area: 100,
      crewHours: 0.5,
      personHours: 1.5,
      laborCost: 82.5,
      finishMaterialCost: 15,
      curingCost: 12,
      sealingCost: 0,
      edgeWorkCost: 25,
      sawCutCost: 50,
      cleanupCost: 25,
      directCost: 209.5,
      overheadCost: 20.95,
      subtotal: 230.45,
      minimumCharge: 750,
      minimumChargeAdjustment: 519.55,
      totalCost: 750,
      costPerSqFt: 7.5,
      laborCostPerSqFt: 0.825,
      materialCostPerSqFt: 0.27,
      notes: [
        "Small finishing jobs are often controlled by the minimum charge.",
        "Saw cutting is included as a finishing-related add-on. Confirm joint layout separately.",
      ],
    },
  });

  close(result.totalCost, 84.7);
  assert.ok(result.totalCost < 750);

  const costs = Object.fromEntries(
    result.costs.map(({ key, amount }) => [key, amount]),
  );

  assert.equal(costs.nativeTotalCost, 750);
  assert.equal(costs.minimumCharge, 750);
  close(costs.minimumChargeAdjustment, 519.55);
});

test("preserves native notes and documents the Project accounting boundary", () => {
  const result = build({
    result: {
      notes: [
        "Saw cutting is included as a finishing-related add-on. Confirm joint layout separately.",
      ],
    },
  });

  assert.equal(
    result.notes[0],
    "Saw cutting is included as a finishing-related add-on. Confirm joint layout separately.",
  );

  assert.ok(
    result.notes.some((note) =>
      note.includes("labor is tracked separately"),
    ),
  );

  assert.ok(
    result.notes.some((note) =>
      note.includes("Joints scope"),
    ),
  );

  assert.ok(
    result.notes.some((note) =>
      note.includes("minimum charge"),
    ),
  );
});
