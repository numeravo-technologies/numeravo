import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateImperialConcreteVolume,
} from "../../lib/calculations/concreteVolume.ts";

test("10x10 slab at 4 inches without waste", () => {
  const result = calculateImperialConcreteVolume({
    lengthFeet: 10,
    widthFeet: 10,
    thicknessInches: 4,
    wastePercent: 0,
  });

  assert.ok(Math.abs(result.baseCubicFeet - 33.33333333333333) < 1e-12);
  assert.ok(Math.abs(result.baseCubicYards - 1.2345679012345678) < 1e-12);
  assert.ok(Math.abs(result.volumeWithWaste - 1.2345679012345678) < 1e-12);
});

test("10x10 slab at 4 inches with 10 percent waste", () => {
  const result = calculateImperialConcreteVolume({
    lengthFeet: 10,
    widthFeet: 10,
    thicknessInches: 4,
    wastePercent: 10,
  });

  assert.ok(Math.abs(result.volumeWithWaste - 1.3580246913580247) < 1e-12);
});

test("40x60 slab at 6 inches with 10 percent waste", () => {
  const result = calculateImperialConcreteVolume({
    lengthFeet: 40,
    widthFeet: 60,
    thicknessInches: 6,
    wastePercent: 10,
  });

  assert.ok(Math.abs(result.baseCubicYards - 44.44444444444444) < 1e-12);
  assert.ok(Math.abs(result.volumeWithWaste - 48.88888888888889) < 1e-12);
});

test("negative or invalid values are clamped to zero", () => {
  const result = calculateImperialConcreteVolume({
    lengthFeet: -10,
    widthFeet: 20,
    thicknessInches: Number.NaN,
    wastePercent: -5,
  });

  assert.equal(result.baseCubicFeet, 0);
  assert.equal(result.baseCubicYards, 0);
  assert.equal(result.volumeWithWaste, 0);
});

test("slab quantity multiplies concrete volume", () => {
  const result = calculateImperialConcreteVolume({
    lengthFeet: 10,
    widthFeet: 10,
    thicknessInches: 4,
    quantity: 2,
    wastePercent: 0,
  });

  assert.ok(Math.abs(result.baseCubicYards - 2.4691358024691357) < 1e-12);
});

test("fractional quantity preserves existing calculator behavior", () => {
  const result = calculateImperialConcreteVolume({
    lengthFeet: 10,
    widthFeet: 10,
    thicknessInches: 4,
    quantity: 1.5,
    wastePercent: 0,
  });

  assert.ok(Math.abs(result.baseCubicYards - 1.8518518518518516) < 1e-12);
});
