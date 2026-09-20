import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateConcreteLabor,
} from "../../lib/calculations/concreteLabor.ts";

const defaults = {
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
};

test("default slab labor preserves area and volume", () => {
  const result =
    calculateConcreteLabor(defaults);

  assert.equal(result.area, 600);

  assert.ok(
    Math.abs(
      result.cubicYards -
        7.407407407407407,
    ) < 1e-12,
  );
});

test("default slab labor preserves crew hour calculation", () => {
  const result =
    calculateConcreteLabor(defaults);

  assert.ok(
    Math.abs(
      result.baseCrewHours -
        3.3333333333333335,
    ) < 1e-12,
  );

  assert.equal(
    result.addedCrewHours,
    5.5,
  );

  assert.ok(
    Math.abs(
      result.totalCrewHours -
        8.833333333333334,
    ) < 1e-12,
  );

  assert.equal(
    result.personHours,
    26.5,
  );
});

test("default slab labor preserves direct cost and overhead", () => {
  const result =
    calculateConcreteLabor(defaults);

  assert.equal(
    result.directLaborCost,
    1457.5,
  );

  assert.equal(
    result.equipmentCost,
    150,
  );

  assert.equal(
    result.directCost,
    1607.5,
  );

  assert.ok(
    Math.abs(
      result.overheadCost -
        192.9,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.subtotal -
        1800.4,
    ) < 1e-12,
  );
});

test("default slab labor preserves total and unit costs", () => {
  const result =
    calculateConcreteLabor(defaults);

  assert.equal(
    result.minimumCharge,
    900,
  );

  assert.equal(
    result.minimumChargeAdjustment,
    0,
  );

  assert.ok(
    Math.abs(
      result.totalCost -
        1800.4,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.costPerSqFt -
        3.000666666666667,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.costPerYard -
        243.054,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.personHoursPerSqFt -
        0.04416666666666667,
    ) < 1e-12,
  );
});

test("small job minimum charge controls final cost", () => {
  const result =
    calculateConcreteLabor({
      ...defaults,
      lengthFeet: 5,
      widthFeet: 5,
      setupHours: 0,
      formingHours: 0,
      placementHours: 0,
      finishingHours: 0,
      cleanupHours: 0,
      equipmentCost: 0,
      minimumCharge: 900,
    });

  assert.equal(
    result.totalCost,
    900,
  );

  assert.ok(
    result.minimumChargeAdjustment > 0,
  );

  assert.ok(
    result.notes.includes(
      "Small concrete labor jobs are often controlled by the minimum charge.",
    ),
  );
});

test("low production rate adds current warning", () => {
  const result =
    calculateConcreteLabor({
      ...defaults,
      productionRateSqFtPerHour: 80,
    });

  assert.ok(
    result.notes.includes(
      "Low production rate increases labor cost. Confirm access, finish complexity, crew size, and setup conditions.",
    ),
  );
});

test("removal labor adds current removal warning", () => {
  const result =
    calculateConcreteLabor({
      ...defaults,
      laborType: "Removal/demo",
    });

  assert.ok(
    result.notes.includes(
      "Removal labor may also require disposal, haul-off, saw cutting, and equipment rental estimates.",
    ),
  );
});

test("invalid crew and production values preserve current clamps", () => {
  const result =
    calculateConcreteLabor({
      ...defaults,
      crewSize: -3,
      productionRateSqFtPerHour: -50,
    });

  assert.equal(
    result.baseCrewHours,
    600,
  );

  assert.equal(
    result.personHours,
    605.5,
  );
});
