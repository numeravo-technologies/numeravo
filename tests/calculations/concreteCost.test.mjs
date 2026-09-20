import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateConcreteCost,
} from "../../lib/calculations/concreteCost.ts";

const defaults = {
  lengthFeet: 20,
  widthFeet: 20,
  thicknessInches: 4,
  wastePercent: 10,
  pricePerYard: 150,
  deliveryFee: 150,
  shortLoadFee: 0,
  baseDepthInches: 4,
  basePricePerTon: 45,
  baseTonsPerCubicYard: 1.4,
  rebarPerSqFt: 1.5,
  laborPerSqFt: 4,
  prepPerSqFt: 2,
};

test("default slab preserves area and concrete volume", () => {
  const result =
    calculateConcreteCost(defaults);

  assert.equal(result.area, 400);

  assert.ok(
    Math.abs(
      result.cubicFeet -
        133.33333333333331,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.cubicYards -
        4.938271604938271,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.cubicYardsWithWaste -
        5.432098765432099,
    ) < 1e-12,
  );
});

test("default slab preserves concrete material cost", () => {
  const result =
    calculateConcreteCost(defaults);

  assert.ok(
    Math.abs(
      result.concreteCost -
        814.8148148148148,
    ) < 1e-12,
  );
});

test("default slab preserves base material calculation", () => {
  const result =
    calculateConcreteCost(defaults);

  assert.ok(
    Math.abs(
      result.baseCubicYards -
        4.938271604938271,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.baseTons -
        6.91358024691358,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.baseCost -
        311.1111111111111,
    ) < 1e-12,
  );
});

test("default slab preserves rebar labor and prep allowances", () => {
  const result =
    calculateConcreteCost(defaults);

  assert.equal(
    result.rebarCost,
    600,
  );

  assert.equal(
    result.laborCost,
    1600,
  );

  assert.equal(
    result.prepCost,
    800,
  );
});

test("default slab preserves total and cost per square foot", () => {
  const result =
    calculateConcreteCost(defaults);

  assert.ok(
    Math.abs(
      result.totalCost -
        4275.925925925926,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.costPerSqFt -
        10.689814814814815,
    ) < 1e-12,
  );
});

test("short load fee is added directly to total cost", () => {
  const result =
    calculateConcreteCost({
      ...defaults,
      shortLoadFee: 250,
    });

  assert.ok(
    Math.abs(
      result.totalCost -
        4525.925925925926,
    ) < 1e-12,
  );
});

test("zero optional allowances preserve concrete-only calculation", () => {
  const result =
    calculateConcreteCost({
      ...defaults,
      deliveryFee: 0,
      shortLoadFee: 0,
      baseDepthInches: 0,
      rebarPerSqFt: 0,
      laborPerSqFt: 0,
      prepPerSqFt: 0,
    });

  assert.equal(
    result.baseCost,
    0,
  );

  assert.equal(
    result.rebarCost,
    0,
  );

  assert.equal(
    result.laborCost,
    0,
  );

  assert.equal(
    result.prepCost,
    0,
  );

  assert.ok(
    Math.abs(
      result.totalCost -
        814.8148148148148,
    ) < 1e-12,
  );
});

test("zero slab area produces zero cost per square foot", () => {
  const result =
    calculateConcreteCost({
      ...defaults,
      lengthFeet: 0,
      deliveryFee: 0,
    });

  assert.equal(result.area, 0);
  assert.equal(result.cubicYards, 0);
  assert.equal(result.totalCost, 0);
  assert.equal(result.costPerSqFt, 0);
});
