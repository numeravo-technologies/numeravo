import test from "node:test";
import assert from "node:assert/strict";

import { buildConcreteLaborCalculationResult } from "../../data/concreteLaborCalculationResult.ts";

const nativeResult = {
  area: 600,
  cubicYards: 7.407407407407407,
  baseCrewHours: 3.3333333333333335,
  addedCrewHours: 5.5,
  totalCrewHours: 8.833333333333334,
  personHours: 26.5,
  directLaborCost: 1457.5,
  equipmentCost: 150,
  directCost: 1607.5,
  overheadCost: 192.9,
  subtotal: 1800.4,
  minimumCharge: 900,
  minimumChargeAdjustment: 0,
  totalCost: 1800.4,
  costPerSqFt: 3.000666666666667,
  costPerYard: 243.054,
  personHoursPerSqFt: 0.04416666666666667,
  notes: [
    "Labor estimate looks reasonable for the selected project size, crew, and production rate.",
  ],
};

function buildResult(overrides = {}) {
  return buildConcreteLaborCalculationResult({
    preset: "Slab labor",
    lengthFeet: 30,
    widthFeet: 20,
    thicknessInches: 4,
    laborType: "Flatwork placement",
    crewSize: 3,
    productionRateSqFtPerHour: 180,
    laborRatePerHour: 55,
    setupHours: 1,
    formingHours: 2,
    placementHours: 0,
    finishingHours: 1.5,
    cleanupHours: 1,
    equipmentCost: 150,
    overheadPercent: 12,
    minimumCharge: 900,
    result: nativeResult,
    ...overrides,
  });
}

test("uses the Labor calculator identity and preserves the audited inputs", () => {
  const result = buildResult();

  assert.equal(result.calculatorId, "concrete-labor-cost-calculator");
  assert.equal(result.calculatorTitle, "Concrete Labor Cost Calculator");

  assert.deepEqual(
    result.inputSummary.map(({ key }) => key),
    [
      "preset",
      "lengthFeet",
      "widthFeet",
      "thicknessInches",
      "laborType",
      "crewSize",
      "productionRateSqFtPerHour",
      "laborRatePerHour",
      "setupHours",
      "formingHours",
      "placementHours",
      "finishingHours",
      "cleanupHours",
      "equipmentCost",
      "overheadPercent",
      "minimumCharge",
    ],
  );
});

test("preserves the native Labor quantity and productivity metrics", () => {
  const result = buildResult();

  const metrics = Object.fromEntries(
    result.metrics.map((metric) => [metric.key, metric.value]),
  );

  assert.equal(metrics.area, nativeResult.area);
  assert.equal(metrics.cubicYards, nativeResult.cubicYards);
  assert.equal(metrics.baseCrewHours, nativeResult.baseCrewHours);
  assert.equal(metrics.addedCrewHours, nativeResult.addedCrewHours);
  assert.equal(metrics.totalCrewHours, nativeResult.totalCrewHours);
  assert.equal(metrics.personHours, nativeResult.personHours);
  assert.equal(metrics.personHoursPerSqFt, nativeResult.personHoursPerSqFt);
  assert.equal(metrics.costPerSqFt, nativeResult.costPerSqFt);
  assert.equal(metrics.costPerYard, nativeResult.costPerYard);
});

test("preserves the native Labor cost breakdown", () => {
  const result = buildResult();

  const costs = Object.fromEntries(
    result.costs.map((cost) => [cost.key, cost.amount]),
  );

  assert.equal(costs.directLaborCost, 1457.5);
  assert.equal(costs.equipmentCost, 150);
  assert.equal(costs.directCost, 1607.5);
  assert.equal(costs.overheadCost, 192.9);
  assert.equal(costs.subtotal, 1800.4);
  assert.equal(costs.minimumCharge, 900);
  assert.equal(costs.minimumChargeAdjustment, 0);
});

test("uses the complete native Labor total as the Project contribution", () => {
  const result = buildResult();

  assert.equal(result.totalCost, 1800.4);
  assert.equal(result.totalCost, nativeResult.totalCost);
});

test("keeps equipment cost inside the Labor Project contribution", () => {
  const result = buildResult({
    result: {
      ...nativeResult,
      equipmentCost: 300,
      directCost: 1757.5,
      overheadCost: 210.9,
      subtotal: 1968.4,
      totalCost: 1968.4,
    },
  });

  assert.equal(result.totalCost, 1968.4);
  assert.notEqual(result.totalCost, nativeResult.directLaborCost);
});

test("preserves minimum-charge-controlled Labor economics", () => {
  const result = buildResult({
    result: {
      ...nativeResult,
      area: 25,
      cubicYards: 0.30864197530864196,
      directLaborCost: 100,
      equipmentCost: 0,
      directCost: 100,
      overheadCost: 12,
      subtotal: 112,
      minimumCharge: 900,
      minimumChargeAdjustment: 788,
      totalCost: 900,
      notes: [
        "Small concrete labor jobs are often controlled by the minimum charge.",
      ],
    },
  });

  const costs = Object.fromEntries(
    result.costs.map((cost) => [cost.key, cost.amount]),
  );

  assert.equal(costs.subtotal, 112);
  assert.equal(costs.minimumCharge, 900);
  assert.equal(costs.minimumChargeAdjustment, 788);
  assert.equal(result.totalCost, 900);
});

test("preserves the native Labor planning notes", () => {
  const result = buildResult();

  assert.deepEqual(result.notes, nativeResult.notes);
});
