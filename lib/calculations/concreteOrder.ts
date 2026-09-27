import type { ConcreteUnitSystem } from "./concreteVolume";

export type ConcreteOrderInput = {
  unitSystem: ConcreteUnitSystem;
  volumeWithWaste: number;
  pricePerUnit: number;
  pricePer80LbBag: number;
  pricePer60LbBag: number;
};

export type ConcreteOrderResult = {
  recommendedOrder: number;
  estimatedCost: number;
  recommendedCubicYards: number;
  truckLoads: number;
  eightyLbBags: number;
  sixtyLbBags: number;
  eightyLbPallets: number;
  sixtyLbPallets: number;
  eightyLbBagCost: number;
  sixtyLbBagCost: number;
  exceedsOnePickupPallet: boolean;
};

export function roundConcreteOrder(
  value: number,
  unitSystem: ConcreteUnitSystem,
) {
  const increment = unitSystem === "imperial" ? 0.25 : 0.1;

  if (value <= 0) {
    return 0;
  }

  return Math.ceil(value / increment) * increment;
}

export function calculateConcreteOrder({
  unitSystem,
  volumeWithWaste,
  pricePerUnit,
  pricePer80LbBag,
  pricePer60LbBag,
}: ConcreteOrderInput): ConcreteOrderResult {
  const recommendedOrder = roundConcreteOrder(
    volumeWithWaste,
    unitSystem,
  );

  const estimatedCost = recommendedOrder * pricePerUnit;

  const recommendedCubicYards =
    unitSystem === "imperial"
      ? recommendedOrder
      : recommendedOrder * 1.30795;

  const truckLoads =
    recommendedCubicYards > 0
      ? Math.ceil(recommendedCubicYards / 10)
      : 0;

  const eightyLbBagYieldYards = 0.022;
  const sixtyLbBagYieldYards = 0.0167;

  const eightyLbBags =
    recommendedCubicYards > 0
      ? Math.ceil(
          recommendedCubicYards / eightyLbBagYieldYards,
        )
      : 0;

  const sixtyLbBags =
    recommendedCubicYards > 0
      ? Math.ceil(
          recommendedCubicYards / sixtyLbBagYieldYards,
        )
      : 0;

  const eightyLbPallets =
    eightyLbBags > 0 ? Math.ceil(eightyLbBags / 42) : 0;

  const sixtyLbPallets =
    sixtyLbBags > 0 ? Math.ceil(sixtyLbBags / 56) : 0;

  const eightyLbBagCost = eightyLbBags * pricePer80LbBag;
  const sixtyLbBagCost = sixtyLbBags * pricePer60LbBag;

  const exceedsOnePickupPallet =
    eightyLbBags > 42 || sixtyLbBags > 56;

  return {
    recommendedOrder,
    estimatedCost,
    recommendedCubicYards,
    truckLoads,
    eightyLbBags,
    sixtyLbBags,
    eightyLbPallets,
    sixtyLbPallets,
    eightyLbBagCost,
    sixtyLbBagCost,
    exceedsOnePickupPallet,
  };
}
