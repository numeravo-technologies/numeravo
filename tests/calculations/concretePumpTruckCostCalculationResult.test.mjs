import assert from "node:assert/strict";
import test from "node:test";

import { buildConcretePumpTruckCostCalculationResult } from "../../data/concretePumpTruckCostCalculationResult.ts";

const resultValues = {
  estimatedPumpingHours: 12 / 18,
  billablePumpHours: 4,
  unusedMinimumHours: 4 - 12 / 18,
  hourlyPumpCost: 700,
  standbyCost: 0,
  yardageSurchargeCost: 0,
  fixedFees: 575,
  setupFee: 250,
  travelFee: 150,
  washoutFee: 75,
  hoseFee: 100,
  extraLaborCost: 0,
  totalCost: 1275,
  costPerYard: 1275 / 12,
  costPerHour: 1275 / 4,
  notes: ["Small pours are often controlled by the pump minimum charge."],
};

function buildResult(overrides = {}, resultOverrides = {}) {
  return buildConcretePumpTruckCostCalculationResult({
    preset: "Line pump",
    pumpType: "Line pump",
    concreteYards: 12,
    pumpRateYardsPerHour: 18,
    minimumHours: 4,
    hourlyRate: 175,
    setupFee: 250,
    travelFee: 150,
    washoutFee: 75,
    hoseFee: 100,
    yardageSurcharge: 0,
    standbyHours: 0,
    standbyRate: 150,
    extraLaborCost: 0,
    ...overrides,
    result: {
      ...resultValues,
      ...resultOverrides,
    },
  });
}

test("uses the Pump calculator identity and preserves the audited inputs", () => {
  const result = buildResult();

  assert.equal(result.calculatorId, "concrete-pump-truck-cost-calculator");
  assert.equal(result.calculatorTitle, "Concrete Pump Truck Cost Calculator");

  assert.deepEqual(
    result.inputSummary.map(({ key }) => key),
    [
      "preset",
      "pumpType",
      "concreteYards",
      "pumpRateYardsPerHour",
      "minimumHours",
      "hourlyRate",
      "setupFee",
      "travelFee",
      "washoutFee",
      "hoseFee",
      "yardageSurcharge",
      "extraLaborCost",
      "standbyHours",
      "standbyRate",
    ],
  );
});

test("preserves the native Pump timing and unit-cost metrics", () => {
  const result = buildResult();

  assert.deepEqual(
    result.metrics.map(({ key }) => key),
    [
      "estimatedPumpingHours",
      "billablePumpHours",
      "unusedMinimumHours",
      "costPerYard",
      "costPerHour",
    ],
  );

  assert.equal(
    result.metrics.find(({ key }) => key === "billablePumpHours")?.value,
    4,
  );
  assert.equal(
    result.metrics.find(({ key }) => key === "costPerYard")?.value,
    1275 / 12,
  );
});

test("preserves the native Pump cost breakdown", () => {
  const result = buildResult();

  assert.deepEqual(
    result.costs?.map(({ key }) => key),
    [
      "hourlyPumpCost",
      "setupFee",
      "travelFee",
      "washoutFee",
      "hoseFee",
      "extraLaborCost",
      "yardageSurchargeCost",
      "standbyCost",
    ],
  );

  assert.equal(
    result.costs?.find(({ key }) => key === "hourlyPumpCost")?.amount,
    700,
  );
  assert.equal(
    result.costs?.find(({ key }) => key === "setupFee")?.amount,
    250,
  );
});

test("uses the complete native Pump total as the Project contribution", () => {
  const result = buildResult();

  assert.equal(result.totalCost, 1275);
});

test("keeps pump-specific extra labor and access cost inside Pumping", () => {
  const result = buildResult(
    {
      extraLaborCost: 200,
    },
    {
      extraLaborCost: 200,
      fixedFees: 775,
      totalCost: 1475,
      costPerYard: 1475 / 12,
      costPerHour: 1475 / 4,
    },
  );

  assert.equal(
    result.costs?.find(({ key }) => key === "extraLaborCost")?.amount,
    200,
  );
  assert.equal(result.totalCost, 1475);
});

test("preserves standby and yardage surcharge as Pumping costs", () => {
  const result = buildResult(
    {
      yardageSurcharge: 10,
      standbyHours: 1.5,
      standbyRate: 150,
    },
    {
      standbyCost: 225,
      yardageSurchargeCost: 120,
      totalCost: 1620,
      costPerYard: 1620 / 12,
      costPerHour: 1620 / 4,
    },
  );

  assert.equal(
    result.costs?.find(({ key }) => key === "standbyCost")?.amount,
    225,
  );
  assert.equal(
    result.costs?.find(({ key }) => key === "yardageSurchargeCost")?.amount,
    120,
  );
  assert.equal(result.totalCost, 1620);
});

test("preserves the native planning notes", () => {
  const notes = [
    "Standby time can add cost when trucks, forms, crew, or site access are delayed.",
  ];

  const result = buildResult({}, { notes });

  assert.deepEqual(result.notes, notes);
});
