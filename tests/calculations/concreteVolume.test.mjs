import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateCircularConcreteBaseVolume,
  calculateConcretePhysicalVolume,
  calculateImperialConcreteVolume,
  calculateLShapedConcreteBaseVolume,
  calculateRectangularConcreteBaseVolume,
} from "../../lib/calculations/concreteVolume.ts";

function close(actual, expected, tolerance = 1e-12) {
  assert.ok(
    Math.abs(actual - expected) < tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  );
}

test("10x10 slab at 4 inches without waste", () => {
  const result = calculateImperialConcreteVolume({
    lengthFeet: 10,
    widthFeet: 10,
    thicknessInches: 4,
    wastePercent: 0,
  });

  close(result.baseCubicFeet, 33.33333333333333);
  close(result.baseCubicYards, 1.2345679012345678);
  close(result.volumeWithWaste, 1.2345679012345678);
});

test("10x10 slab at 4 inches with 10 percent waste", () => {
  const result = calculateImperialConcreteVolume({
    lengthFeet: 10,
    widthFeet: 10,
    thicknessInches: 4,
    wastePercent: 10,
  });

  close(result.volumeWithWaste, 1.3580246913580247);
});

test("40x60 slab at 6 inches with 10 percent waste", () => {
  const result = calculateImperialConcreteVolume({
    lengthFeet: 40,
    widthFeet: 60,
    thicknessInches: 6,
    wastePercent: 10,
  });

  close(result.baseCubicYards, 44.44444444444444);
  close(result.volumeWithWaste, 48.88888888888889);
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

  close(result.baseCubicYards, 2.4691358024691357);
});

test("fractional quantity preserves existing calculator behavior", () => {
  const result = calculateImperialConcreteVolume({
    lengthFeet: 10,
    widthFeet: 10,
    thicknessInches: 4,
    quantity: 1.5,
    wastePercent: 0,
  });

  close(result.baseCubicYards, 1.8518518518518516);
});

test("rectangular base-volume primitive covers footing, rectangular pier, wall, stairs, and curb formulas", () => {
  close(
    calculateRectangularConcreteBaseVolume({
      length: 40,
      width: 1,
      height: 1,
      quantity: 2,
    }),
    80,
  );

  close(
    calculateRectangularConcreteBaseVolume({
      length: 2,
      width: 2,
      height: 3,
      quantity: 2,
    }),
    24,
  );

  close(
    calculateRectangularConcreteBaseVolume({
      length: 20,
      width: 4,
      height: 8 / 12,
    }),
    53.33333333333333,
  );

  close(
    calculateRectangularConcreteBaseVolume({
      length: 4,
      width: 11 / 12,
      height: 7 / 12,
      quantity: 4,
    }),
    8.555555555555555,
  );

  close(
    calculateRectangularConcreteBaseVolume({
      length: 30,
      width: 6 / 12,
      height: 6 / 12,
    }),
    7.5,
  );
});

test("circular base-volume primitive preserves circular pad and round pier formulas", () => {
  close(
    calculateCircularConcreteBaseVolume({
      diameter: 10,
      height: 4 / 12,
      quantity: 2,
    }),
    52.35987755982988,
  );

  close(
    calculateCircularConcreteBaseVolume({
      diameter: 1,
      height: 3,
      quantity: 4,
    }),
    9.42477796076938,
  );

  assert.equal(
    calculateCircularConcreteBaseVolume({
      diameter: 0,
      height: 3,
      quantity: 4,
    }),
    0,
  );

  assert.equal(
    calculateCircularConcreteBaseVolume({
      diameter: 1,
      height: 0,
      quantity: 4,
    }),
    0,
  );
});

test("L-shaped base-volume primitive preserves two-rectangle behavior including zero second section", () => {
  close(
    calculateLShapedConcreteBaseVolume({
      lengthOne: 12,
      widthOne: 8,
      lengthTwo: 6,
      widthTwo: 4,
      height: 4 / 12,
    }),
    40,
  );

  close(
    calculateLShapedConcreteBaseVolume({
      lengthOne: 12,
      widthOne: 8,
      lengthTwo: 0,
      widthTwo: 0,
      height: 4 / 12,
    }),
    32,
  );
});

test("physical-volume conversion preserves imperial and metric output paths", () => {
  const imperial = calculateConcretePhysicalVolume({
    baseVolume: 33.33333333333333,
    unitSystem: "imperial",
    wastePercent: 10,
  });

  close(imperial.baseCubicFeet, 33.33333333333333);
  close(imperial.baseCubicYards, 1.2345679012345678);
  assert.equal(imperial.baseCubicMeters, 0);
  close(imperial.volumeWithWaste, 1.3580246913580247);

  const metric = calculateConcretePhysicalVolume({
    baseVolume: 3.048 * 3.048 * 0.1016,
    unitSystem: "metric",
    wastePercent: 10,
  });

  assert.equal(metric.baseCubicFeet, 0);
  assert.equal(metric.baseCubicYards, 0);
  close(metric.baseCubicMeters, 0.9438948864000001);
  close(metric.volumeWithWaste, 1.0382843750400002);
});

test("physical-volume waste preserves 0 5 10 and 15 percent behavior", () => {
  for (const [wastePercent, multiplier] of [
    [0, 1],
    [5, 1.05],
    [10, 1.1],
    [15, 1.15],
  ]) {
    const result = calculateConcretePhysicalVolume({
      baseVolume: 27,
      unitSystem: "imperial",
      wastePercent,
    });

    close(result.volumeWithWaste, multiplier);
  }
});

test("new canonical page primitives preserve current page negative and NaN normalization", () => {
  assert.equal(
    calculateRectangularConcreteBaseVolume({
      length: -10,
      width: 20,
      height: 1,
      quantity: 1,
    }),
    0,
  );

  assert.equal(
    calculateCircularConcreteBaseVolume({
      diameter: Number.NaN,
      height: 3,
      quantity: 4,
    }),
    0,
  );

  const result = calculateConcretePhysicalVolume({
    baseVolume: 27,
    unitSystem: "imperial",
    wastePercent: -10,
  });

  close(result.volumeWithWaste, 1);
});

test("existing rectangular helper retains stricter nonfinite clamping while page-compatible primitives retain Infinity", () => {
  const existing = calculateImperialConcreteVolume({
    lengthFeet: Number.POSITIVE_INFINITY,
    widthFeet: 10,
    thicknessInches: 4,
  });

  assert.equal(existing.baseCubicFeet, 0);

  const pageCompatible = calculateRectangularConcreteBaseVolume({
    length: Number.POSITIVE_INFINITY,
    width: 10,
    height: 4 / 12,
  });

  assert.equal(pageCompatible, Number.POSITIVE_INFINITY);
});
