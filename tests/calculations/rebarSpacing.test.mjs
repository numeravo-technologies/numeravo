import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateRebarSpacing,
} from "../../lib/calculations/rebarSpacing.ts";

const standard = {
  slabLengthFeet: 20,
  slabWidthFeet: 20,
  spacingInches: 18,
  edgeClearanceInches: 3,
  stockLengthFeet: 20,
  lapLengthInches: 24,
  wastePercent: 10,
  weightPerFoot: 0.668,
  pricePerFoot: 0.85,
};

test("default 20x20 standard slab preserves grid counts", () => {
  const result =
    calculateRebarSpacing(standard);

  assert.equal(
    result.usableLengthFeet,
    19.5,
  );

  assert.equal(
    result.usableWidthFeet,
    19.5,
  );

  assert.equal(
    result.barsRunningLength,
    14,
  );

  assert.equal(
    result.barsRunningWidth,
    14,
  );

  assert.equal(
    result.totalGridBars,
    28,
  );
});

test("default slab preserves linear footage and waste", () => {
  const result =
    calculateRebarSpacing(standard);

  assert.equal(
    result.baseLinearFeet,
    546,
  );

  assert.equal(
    result.lapAllowanceFeet,
    0,
  );

  assert.ok(
    Math.abs(
      result.wasteFeet - 54.6,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.totalLinearFeet -
        600.6,
    ) < 1e-12,
  );
});

test("default slab preserves stock quantity weight and cost", () => {
  const result =
    calculateRebarSpacing(standard);

  assert.equal(result.stockBars, 31);
  assert.equal(
    result.totalPurchasedFeet,
    620,
  );

  assert.ok(
    Math.abs(
      result.totalWeight -
        414.16,
    ) < 1e-12,
  );

  assert.equal(
    result.materialCost,
    527,
  );

  assert.equal(
    result.slabArea,
    400,
  );

  assert.ok(
    Math.abs(
      result.costPerSquareFoot -
        1.3175,
    ) < 1e-12,
  );
});

test("40x60 project dimensions preserve lap behavior", () => {
  const result =
    calculateRebarSpacing({
      ...standard,
      slabLengthFeet: 40,
      slabWidthFeet: 60,
    });

  assert.equal(
    result.barsRunningLength,
    40,
  );

  assert.equal(
    result.barsRunningWidth,
    27,
  );

  assert.equal(
    result.baseLinearFeet,
    3186.5,
  );

  assert.equal(
    result.lapAllowanceFeet,
    188,
  );

  assert.ok(
    Math.abs(
      result.totalLinearFeet -
        3711.95,
    ) < 1e-12,
  );

  assert.equal(
    result.stockBars,
    186,
  );

  assert.equal(
    result.totalPurchasedFeet,
    3720,
  );

  assert.ok(
    Math.abs(
      result.totalWeight -
        2484.96,
    ) < 1e-12,
  );

  assert.equal(
    result.materialCost,
    3162,
  );
});

test("zero spacing produces zero grid bars", () => {
  const result =
    calculateRebarSpacing({
      ...standard,
      spacingInches: 0,
    });

  assert.equal(
    result.barsRunningLength,
    0,
  );

  assert.equal(
    result.barsRunningWidth,
    0,
  );

  assert.equal(
    result.totalGridBars,
    0,
  );

  assert.equal(
    result.baseLinearFeet,
    0,
  );
});

test("zero stock length produces zero purchased bars", () => {
  const result =
    calculateRebarSpacing({
      ...standard,
      stockLengthFeet: 0,
    });

  assert.equal(
    result.lapAllowanceFeet,
    0,
  );

  assert.equal(result.stockBars, 0);

  assert.equal(
    result.totalPurchasedFeet,
    0,
  );

  assert.equal(
    result.totalWeight,
    0,
  );

  assert.equal(
    result.materialCost,
    0,
  );
});
