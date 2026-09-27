import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateCircularConcreteBaseVolume,
  calculateConcretePhysicalVolume,
  calculateLShapedConcreteBaseVolume,
  calculateRectangularConcreteBaseVolume,
} from "../../lib/calculations/concreteVolume.ts";
import { calculateConcreteOrder } from "../../lib/calculations/concreteOrder.ts";

function close(actual, expected, tolerance = 1e-12) {
  assert.ok(
    Math.abs(actual - expected) < tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  );
}

function legacyDownstream({
  baseVolume,
  unitSystem,
  waste,
  price,
  pricePer80LbBag,
  pricePer60LbBag,
}) {
  const baseCubicFeet = unitSystem === "imperial" ? baseVolume : 0;
  const baseCubicYards = unitSystem === "imperial" ? baseCubicFeet / 27 : 0;
  const baseCubicMeters = unitSystem === "metric" ? baseVolume : 0;
  const volumeWithWaste =
    unitSystem === "imperial"
      ? baseCubicYards * (1 + waste / 100)
      : baseCubicMeters * (1 + waste / 100);
  const increment = unitSystem === "imperial" ? 0.25 : 0.1;
  const recommendedOrder =
    volumeWithWaste <= 0
      ? 0
      : Math.ceil(volumeWithWaste / increment) * increment;
  const estimatedCost = recommendedOrder * price;
  const recommendedCubicYards =
    unitSystem === "imperial"
      ? recommendedOrder
      : recommendedOrder * 1.30795;
  const truckLoads =
    recommendedCubicYards > 0
      ? Math.ceil(recommendedCubicYards / 10)
      : 0;
  const eightyLbBags =
    recommendedCubicYards > 0
      ? Math.ceil(recommendedCubicYards / 0.022)
      : 0;
  const sixtyLbBags =
    recommendedCubicYards > 0
      ? Math.ceil(recommendedCubicYards / 0.0167)
      : 0;
  const eightyLbPallets =
    eightyLbBags > 0 ? Math.ceil(eightyLbBags / 42) : 0;
  const sixtyLbPallets =
    sixtyLbBags > 0 ? Math.ceil(sixtyLbBags / 56) : 0;

  return {
    baseCubicFeet,
    baseCubicYards,
    baseCubicMeters,
    volumeWithWaste,
    recommendedOrder,
    estimatedCost,
    recommendedCubicYards,
    truckLoads,
    eightyLbBags,
    sixtyLbBags,
    eightyLbPallets,
    sixtyLbPallets,
    eightyLbBagCost: eightyLbBags * pricePer80LbBag,
    sixtyLbBagCost: sixtyLbBags * pricePer60LbBag,
    exceedsOnePickupPallet:
      eightyLbBags > 42 || sixtyLbBags > 56,
  };
}

function extractedDownstream(input) {
  const physical = calculateConcretePhysicalVolume({
    baseVolume: input.baseVolume,
    unitSystem: input.unitSystem,
    wastePercent: input.waste,
  });
  const order = calculateConcreteOrder({
    unitSystem: input.unitSystem,
    volumeWithWaste: physical.volumeWithWaste,
    pricePerUnit: input.price,
    pricePer80LbBag: input.pricePer80LbBag,
    pricePer60LbBag: input.pricePer60LbBag,
  });
  return { ...physical, ...order };
}

const modeCases = [
  [
    "slab / pad",
    calculateRectangularConcreteBaseVolume({
      length: 10,
      width: 10,
      height: 4 / 12,
      quantity: 2,
    }),
  ],
  [
    "circular pad",
    calculateCircularConcreteBaseVolume({
      diameter: 10,
      height: 4 / 12,
      quantity: 2,
    }),
  ],
  [
    "L-shaped slab",
    calculateLShapedConcreteBaseVolume({
      lengthOne: 12,
      widthOne: 8,
      lengthTwo: 6,
      widthTwo: 4,
      height: 4 / 12,
    }),
  ],
  [
    "footing / trench",
    calculateRectangularConcreteBaseVolume({
      length: 40,
      width: 1,
      height: 1,
      quantity: 2,
    }),
  ],
  [
    "round pier / Sonotube",
    calculateCircularConcreteBaseVolume({
      diameter: 1,
      height: 3,
      quantity: 4,
    }),
  ],
  [
    "square / rectangular pier",
    calculateRectangularConcreteBaseVolume({
      length: 2,
      width: 2,
      height: 3,
      quantity: 2,
    }),
  ],
  [
    "wall",
    calculateRectangularConcreteBaseVolume({
      length: 20,
      width: 4,
      height: 8 / 12,
    }),
  ],
  [
    "steps / stairs",
    calculateRectangularConcreteBaseVolume({
      length: 4,
      width: 11 / 12,
      height: 7 / 12,
      quantity: 4,
    }),
  ],
  [
    "curb",
    calculateRectangularConcreteBaseVolume({
      length: 30,
      width: 6 / 12,
      height: 6 / 12,
    }),
  ],
];

for (const [label, baseVolume] of modeCases) {
  test(`${label} extracted downstream math matches the legacy canonical page`, () => {
    for (const waste of [0, 5, 10, 15]) {
      const input = {
        baseVolume,
        unitSystem: "imperial",
        waste,
        price: 187.5,
        pricePer80LbBag: 7.25,
        pricePer60LbBag: 6.15,
      };
      const legacy = legacyDownstream(input);
      const extracted = extractedDownstream(input);

      for (const key of Object.keys(legacy)) {
        if (typeof legacy[key] === "number") {
          close(extracted[key], legacy[key]);
        } else {
          assert.equal(extracted[key], legacy[key]);
        }
      }
    }
  });
}

test("metric extracted downstream math matches the legacy canonical page", () => {
  const input = {
    baseVolume: 3.048 * 3.048 * 0.1016,
    unitSystem: "metric",
    waste: 10,
    price: 187.5,
    pricePer80LbBag: 7.25,
    pricePer60LbBag: 6.15,
  };
  const legacy = legacyDownstream(input);
  const extracted = extractedDownstream(input);

  for (const key of Object.keys(legacy)) {
    if (typeof legacy[key] === "number") {
      close(extracted[key], legacy[key]);
    } else {
      assert.equal(extracted[key], legacy[key]);
    }
  }
});
