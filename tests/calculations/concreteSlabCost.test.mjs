import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  calculateImperialConcreteVolume,
} from "../../lib/calculations/concreteVolume.ts";

function close(actual, expected, tolerance = 1e-12) {
  assert.ok(
    Math.abs(actual - expected) < tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  );
}

function assertSameNumber(actual, expected, label) {
  if (Number.isNaN(expected)) {
    assert.ok(Number.isNaN(actual), `${label} should remain NaN`);
    return;
  }

  if (!Number.isFinite(expected)) {
    assert.equal(actual, expected, label);
    return;
  }

  close(actual, expected);
}

function legacySlabResults({
  length,
  width,
  thicknessInches = 4,
  wastePercent = 10,
  concretePricePerYard = 160,
  deliveryFee = 150,
  shortLoadFee = 100,
  baseDepthInches = 4,
  basePricePerTon = 45,
  baseTonsPerCubicYard = 1.45,
  reinforcementCost,
  formCost,
  laborCostPerSquareFoot = 6,
  taxPercent = 0,
}) {
  const slabArea = length * width;

  const concreteCubicFeet = slabArea * (thicknessInches / 12);
  const concreteYards = concreteCubicFeet / 27;
  const concreteYardsWithWaste =
    concreteYards * (1 + wastePercent / 100);
  const concreteMaterialCost =
    concreteYardsWithWaste * concretePricePerYard;

  const baseCubicFeet = slabArea * (baseDepthInches / 12);
  const baseCubicYards = baseCubicFeet / 27;
  const baseTons = baseCubicYards * baseTonsPerCubicYard;
  const baseCost = baseTons * basePricePerTon;

  const laborCost = slabArea * laborCostPerSquareFoot;

  const subtotal =
    concreteMaterialCost +
    deliveryFee +
    shortLoadFee +
    baseCost +
    reinforcementCost +
    formCost +
    laborCost;

  const taxAmount = subtotal * (taxPercent / 100);
  const totalCost = subtotal + taxAmount;
  const costPerSquareFoot = totalCost / slabArea;

  const deliveredConcreteCostPerYard =
    concreteYardsWithWaste > 0
      ? (concreteMaterialCost + deliveryFee + shortLoadFee) /
        concreteYardsWithWaste
      : 0;

  const concreteWeight = concreteYardsWithWaste * 4050;

  return {
    concreteCubicFeet,
    concreteYards,
    concreteYardsWithWaste,
    concreteMaterialCost,
    baseCubicYards,
    baseTons,
    baseCost,
    laborCost,
    subtotal,
    taxAmount,
    totalCost,
    costPerSquareFoot,
    deliveredConcreteCostPerYard,
    concreteWeight,
  };
}

function refactoredSlabResults({
  length,
  width,
  thicknessInches = 4,
  wastePercent = 10,
  concretePricePerYard = 160,
  deliveryFee = 150,
  shortLoadFee = 100,
  baseDepthInches = 4,
  basePricePerTon = 45,
  baseTonsPerCubicYard = 1.45,
  reinforcementCost,
  formCost,
  laborCostPerSquareFoot = 6,
  taxPercent = 0,
}) {
  const slabArea = length * width;

  const concreteVolume = calculateImperialConcreteVolume({
    lengthFeet: length,
    widthFeet: width,
    thicknessInches,
    wastePercent,
  });

  const concreteCubicFeet = concreteVolume.baseCubicFeet;
  const concreteYards = concreteVolume.baseCubicYards;
  const concreteYardsWithWaste = concreteVolume.volumeWithWaste;

  const concreteMaterialCost =
    concreteYardsWithWaste * concretePricePerYard;

  const baseCubicFeet = slabArea * (baseDepthInches / 12);
  const baseCubicYards = baseCubicFeet / 27;
  const baseTons = baseCubicYards * baseTonsPerCubicYard;
  const baseCost = baseTons * basePricePerTon;

  const laborCost = slabArea * laborCostPerSquareFoot;

  const subtotal =
    concreteMaterialCost +
    deliveryFee +
    shortLoadFee +
    baseCost +
    reinforcementCost +
    formCost +
    laborCost;

  const taxAmount = subtotal * (taxPercent / 100);
  const totalCost = subtotal + taxAmount;
  const costPerSquareFoot = totalCost / slabArea;

  const deliveredConcreteCostPerYard =
    concreteYardsWithWaste > 0
      ? (concreteMaterialCost + deliveryFee + shortLoadFee) /
        concreteYardsWithWaste
      : 0;

  const concreteWeight = concreteYardsWithWaste * 4050;

  return {
    concreteCubicFeet,
    concreteYards,
    concreteYardsWithWaste,
    concreteMaterialCost,
    baseCubicYards,
    baseTons,
    baseCost,
    laborCost,
    subtotal,
    taxAmount,
    totalCost,
    costPerSquareFoot,
    deliveredConcreteCostPerYard,
    concreteWeight,
  };
}

function assertParity(input) {
  const legacy = legacySlabResults(input);
  const refactored = refactoredSlabResults(input);

  for (const key of Object.keys(legacy)) {
    assertSameNumber(refactored[key], legacy[key], key);
  }

  return refactored;
}

test("10x10 default slab preserves complete legacy result parity", () => {
  const result = assertParity({
    length: 10,
    width: 10,
    reinforcementCost: 125,
    formCost: 90,
  });

  assert.equal(result.concreteCubicFeet, 33.33333333333333);
  close(result.concreteYards, 1.2345679012345678);
  close(result.concreteYardsWithWaste, 1.3580246913580247);
  close(result.concreteMaterialCost, 217.28395061728395);
  close(result.baseCubicYards, 1.2345679012345678);
  close(result.baseTons, 1.7901234567901234);
  close(result.baseCost, 80.55555555555556);
  close(result.laborCost, 600);
  close(result.totalCost, 1362.8395061728394);
});

test("12x12 default slab preserves complete legacy result parity", () => {
  const result = assertParity({
    length: 12,
    width: 12,
    reinforcementCost: 175,
    formCost: 120,
  });

  close(result.concreteCubicFeet, 48);
  close(result.concreteYards, 1.7777777777777777);
  close(result.concreteYardsWithWaste, 1.9555555555555555);
  close(result.concreteMaterialCost, 312.8888888888889);
  close(result.baseCubicYards, 1.7777777777777777);
  close(result.baseTons, 2.5777777777777775);
  close(result.baseCost, 116);
  close(result.laborCost, 864);
  close(result.totalCost, 1837.8888888888888);
});

test("10x10 and 12x12 preserve zero-waste behavior", () => {
  for (const [length, width, reinforcementCost, formCost] of [
    [10, 10, 125, 90],
    [12, 12, 175, 120],
  ]) {
    for (const wastePercent of [0, 5, 10, 15]) {
      assertParity({
        length,
        width,
        reinforcementCost,
        formCost,
        wastePercent,
      });
    }
  }
});

test("fixed-size slab calculators preserve fractional thickness and pricing", () => {
  assertParity({
    length: 10,
    width: 10,
    thicknessInches: 5.25,
    wastePercent: 7.5,
    concretePricePerYard: 187.5,
    deliveryFee: 175,
    shortLoadFee: 125,
    baseDepthInches: 6.5,
    basePricePerTon: 62.25,
    baseTonsPerCubicYard: 1.55,
    reinforcementCost: 162.5,
    formCost: 112.5,
    laborCostPerSquareFoot: 7.5,
    taxPercent: 8.25,
  });

  assertParity({
    length: 12,
    width: 12,
    thicknessInches: 6.25,
    wastePercent: 12.5,
    concretePricePerYard: 215.75,
    deliveryFee: 175,
    shortLoadFee: 125,
    baseDepthInches: 6,
    basePricePerTon: 62.25,
    baseTonsPerCubicYard: 1.55,
    reinforcementCost: 325,
    formCost: 135,
    laborCostPerSquareFoot: 8,
    taxPercent: 8.25,
  });
});

test("fixed-size slab calculators preserve zero geometry behavior", () => {
  for (const [length, width, reinforcementCost, formCost] of [
    [10, 10, 125, 90],
    [12, 12, 175, 120],
  ]) {
    const zeroThickness = assertParity({
      length,
      width,
      thicknessInches: 0,
      reinforcementCost,
      formCost,
    });

    assert.equal(zeroThickness.concreteCubicFeet, 0);
    assert.equal(zeroThickness.concreteYards, 0);
    assert.equal(zeroThickness.concreteYardsWithWaste, 0);
    assert.equal(zeroThickness.concreteMaterialCost, 0);
  }
});

test("canonical volume reuse preserves valid physical-volume calculations", () => {
  const tenByTen = calculateImperialConcreteVolume({
    lengthFeet: 10,
    widthFeet: 10,
    thicknessInches: 4,
    wastePercent: 10,
  });

  close(tenByTen.baseCubicFeet, 33.33333333333333);
  close(tenByTen.baseCubicYards, 1.2345679012345678);
  close(tenByTen.volumeWithWaste, 1.3580246913580247);

  const twelveByTwelve = calculateImperialConcreteVolume({
    lengthFeet: 12,
    widthFeet: 12,
    thicknessInches: 4,
    wastePercent: 10,
  });

  close(twelveByTwelve.baseCubicFeet, 48);
  close(twelveByTwelve.baseCubicYards, 1.7777777777777777);
  close(twelveByTwelve.volumeWithWaste, 1.9555555555555555);
});

test("source files use canonical concrete volume calculation and retain local slab cost policy", () => {
  const sources = [
    readFileSync(
      "app/construction/10x10-concrete-slab-cost/TenByTenConcreteSlabCostClient.tsx",
      "utf8",
    ),
    readFileSync(
      "app/construction/12x12-concrete-slab-cost/TwelveByTwelveConcreteSlabCostClient.tsx",
      "utf8",
    ),
  ];

  for (const source of sources) {
    assert.match(source, /calculateImperialConcreteVolume/);
    assert.match(source, /concreteVolume\.baseCubicFeet/);
    assert.match(source, /concreteVolume\.baseCubicYards/);
    assert.match(source, /concreteVolume\.volumeWithWaste/);

    assert.doesNotMatch(
      source,
      /const concreteCubicFeet = slabArea \* \(thicknessInches \/ 12\)/,
    );

    assert.doesNotMatch(
      source,
      /const concreteYards = concreteCubicFeet \/ 27/,
    );

    assert.doesNotMatch(
      source,
      /const concreteYardsWithWaste = concreteYards \* \(1 \+ wastePercent \/ 100\)/,
    );

    assert.match(
      source,
      /const baseCubicFeet = slabArea \* \(baseDepthInches \/ 12\)/,
    );

    assert.match(source, /const baseCubicYards = baseCubicFeet \/ 27/);
    assert.match(source, /const taxAmount = subtotal \* \(taxPercent \/ 100\)/);
    assert.match(source, /const concreteWeight = concreteYardsWithWaste \* 4050/);
  }
});
