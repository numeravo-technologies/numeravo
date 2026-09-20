import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateConcreteMix,
} from "../../lib/calculations/concreteMix.ts";

const defaultInputs = {
  targetYards: 1,
  dryVolumeFactor: 1.54,
  cementParts: 1,
  sandParts: 2,
  gravelParts: 3,
  cementBagWeight: 94,
  cementDensityLbPerCubicFoot: 94,
  waterCementRatio: 0.5,
  cementBagPrice: 15,
  sandPricePerYard: 45,
  gravelPricePerYard: 55,
};

test("default 1:2:3 mix preserves current material quantities", () => {
  const result =
    calculateConcreteMix(defaultInputs);

  assert.equal(result.wetCubicFeet, 27);
  assert.equal(result.dryCubicFeet, 41.58);
  assert.equal(result.totalParts, 6);

  assert.ok(
    Math.abs(
      result.cementCubicFeet - 6.93,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.sandCubicFeet - 13.86,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.gravelCubicFeet - 20.79,
    ) < 1e-12,
  );
});

test("default mix preserves cement bag calculation", () => {
  const result =
    calculateConcreteMix(defaultInputs);

  assert.ok(
    Math.abs(
      result.cementPounds - 651.42,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.cementBags - 6.93,
    ) < 1e-12,
  );

  assert.equal(result.cementBagsRounded, 7);
});

test("default mix preserves sand and gravel yardage", () => {
  const result =
    calculateConcreteMix(defaultInputs);

  assert.ok(
    Math.abs(
      result.sandYards -
        0.5133333333333333,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.gravelYards - 0.77,
    ) < 1e-12,
  );
});

test("default mix preserves water estimate", () => {
  const result =
    calculateConcreteMix(defaultInputs);

  assert.ok(
    Math.abs(
      result.waterPounds - 325.71,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.waterGallons -
        39.05395683453237,
    ) < 1e-12,
  );
});

test("default mix preserves material cost", () => {
  const result =
    calculateConcreteMix(defaultInputs);

  assert.equal(result.cementCost, 105);

  assert.ok(
    Math.abs(
      result.sandCost - 23.1,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.gravelCost - 42.35,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.totalCost - 170.45,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.costPerYard - 170.45,
    ) < 1e-12,
  );
});

test("zero target volume produces zero quantities and cost", () => {
  const result =
    calculateConcreteMix({
      ...defaultInputs,
      targetYards: 0,
    });

  assert.equal(result.wetCubicFeet, 0);
  assert.equal(result.dryCubicFeet, 0);
  assert.equal(result.cementBagsRounded, 0);
  assert.equal(result.totalCost, 0);
  assert.equal(result.costPerYard, 0);
});

test("zero mix parts avoid division by zero", () => {
  const result =
    calculateConcreteMix({
      ...defaultInputs,
      cementParts: 0,
      sandParts: 0,
      gravelParts: 0,
    });

  assert.equal(result.totalParts, 0);
  assert.equal(result.cementCubicFeet, 0);
  assert.equal(result.sandCubicFeet, 0);
  assert.equal(result.gravelCubicFeet, 0);
});

test("zero cement bag weight preserves current zero exact bag behavior", () => {
  const result =
    calculateConcreteMix({
      ...defaultInputs,
      cementBagWeight: 0,
    });

  assert.equal(result.cementBags, 0);
  assert.equal(result.cementBagsRounded, 0);
});
