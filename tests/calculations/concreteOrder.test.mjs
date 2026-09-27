import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateConcreteOrder,
  roundConcreteOrder,
} from "../../lib/calculations/concreteOrder.ts";

function close(actual, expected, tolerance = 1e-12) {
  assert.ok(
    Math.abs(actual - expected) < tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  );
}

test("imperial recommended order rounds upward to 0.25 cubic yard boundaries", () => {
  assert.equal(roundConcreteOrder(1, "imperial"), 1);
  assert.equal(roundConcreteOrder(1.01, "imperial"), 1.25);
  assert.equal(roundConcreteOrder(1.24, "imperial"), 1.25);
  assert.equal(roundConcreteOrder(1.25, "imperial"), 1.25);
  assert.equal(roundConcreteOrder(1.26, "imperial"), 1.5);
  assert.equal(roundConcreteOrder(0, "imperial"), 0);
});

test("metric recommended order rounds upward to 0.1 cubic meter boundaries", () => {
  assert.equal(roundConcreteOrder(1, "metric"), 1);
  close(roundConcreteOrder(1.01, "metric"), 1.1);
  close(roundConcreteOrder(1.09, "metric"), 1.1);
  close(roundConcreteOrder(1.1, "metric"), 1.1);
  close(roundConcreteOrder(1.11, "metric"), 1.2);
  assert.equal(roundConcreteOrder(0, "metric"), 0);
});

test("10x10x4 slab with 10 percent waste preserves canonical ready-mix bag pallet and material-cost outputs", () => {
  const result = calculateConcreteOrder({
    unitSystem: "imperial",
    volumeWithWaste: 1.3580246913580247,
    pricePerUnit: 150,
    pricePer80LbBag: 6.5,
    pricePer60LbBag: 5.5,
  });

  assert.equal(result.recommendedOrder, 1.5);
  assert.equal(result.estimatedCost, 225);
  assert.equal(result.recommendedCubicYards, 1.5);
  assert.equal(result.truckLoads, 1);
  assert.equal(result.eightyLbBags, 69);
  assert.equal(result.sixtyLbBags, 90);
  assert.equal(result.eightyLbPallets, 2);
  assert.equal(result.sixtyLbPallets, 2);
  assert.equal(result.eightyLbBagCost, 448.5);
  assert.equal(result.sixtyLbBagCost, 495);
  assert.equal(result.exceedsOnePickupPallet, true);
});

test("ready-mix truckload behavior preserves just-below exact and just-above 10-yard capacity", () => {
  const calculate = (volumeWithWaste) =>
    calculateConcreteOrder({
      unitSystem: "imperial",
      volumeWithWaste,
      pricePerUnit: 150,
      pricePer80LbBag: 6.5,
      pricePer60LbBag: 5.5,
    });

  assert.equal(calculate(9.99).recommendedOrder, 10);
  assert.equal(calculate(9.99).truckLoads, 1);
  assert.equal(calculate(10).truckLoads, 1);
  assert.equal(calculate(10.01).recommendedOrder, 10.25);
  assert.equal(calculate(10.01).truckLoads, 2);
});

test("metric policy preserves current cubic-meter rounding then 1.30795 cubic-yard conversion for downstream planning", () => {
  const result = calculateConcreteOrder({
    unitSystem: "metric",
    volumeWithWaste: 1.0382843750400002,
    pricePerUnit: 150,
    pricePer80LbBag: 6.5,
    pricePer60LbBag: 5.5,
  });

  close(result.recommendedOrder, 1.1);
  close(result.recommendedCubicYards, 1.438745);
  assert.equal(result.truckLoads, 1);
  assert.equal(result.eightyLbBags, 66);
  assert.equal(result.sixtyLbBags, 87);
  close(result.estimatedCost, 165);
});

test("zero volume preserves zero truck bag pallet and material-cost outputs", () => {
  const result = calculateConcreteOrder({
    unitSystem: "imperial",
    volumeWithWaste: 0,
    pricePerUnit: 150,
    pricePer80LbBag: 6.5,
    pricePer60LbBag: 5.5,
  });

  assert.deepEqual(result, {
    recommendedOrder: 0,
    estimatedCost: 0,
    recommendedCubicYards: 0,
    truckLoads: 0,
    eightyLbBags: 0,
    sixtyLbBags: 0,
    eightyLbPallets: 0,
    sixtyLbPallets: 0,
    eightyLbBagCost: 0,
    sixtyLbBagCost: 0,
    exceedsOnePickupPallet: false,
  });
});
