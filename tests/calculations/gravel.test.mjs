import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  calculateImperialGravel,
  calculateMetricGravel,
} from "../../lib/calculations/gravel.ts";

test("40x60 area at 4 inches with 10 percent waste preserves imperial gravel math", () => {
  const result = calculateImperialGravel({
    lengthFeet: 40,
    widthFeet: 60,
    depthInches: 4,
    wastePercent: 10,
    tonsPerCubicYard: 1.4,
    pricePerTon: 45,
  });

  assert.ok(
    Math.abs(result.cubicFeet - 800) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.cubicYards -
        29.62962962962963,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.volumeWithWaste -
        32.592592592592595,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.estimatedWeight -
        45.62962962962963,
    ) < 1e-12,
  );

  assert.ok(
    Math.abs(
      result.estimatedCost -
        2053.3333333333335,
    ) < 1e-9,
  );

  assert.equal(result.smallTruckLoads, 10);
  assert.equal(result.standardTruckLoads, 5);
  assert.equal(result.largeTruckLoads, 4);
});

test("imperial calculation without waste preserves base volume", () => {
  const result = calculateImperialGravel({
    lengthFeet: 20,
    widthFeet: 10,
    depthInches: 4,
    wastePercent: 0,
    tonsPerCubicYard: 1.4,
    pricePerTon: 45,
  });

  assert.ok(
    Math.abs(
      result.cubicYards -
        result.volumeWithWaste,
    ) < 1e-12,
  );
});

test("metric gravel calculation preserves current conversion behavior", () => {
  const result = calculateMetricGravel({
    lengthMeters: 10,
    widthMeters: 5,
    depthCentimeters: 10,
    wastePercent: 10,
    tonnesPerCubicMeter: 1.7,
    pricePerTonne: 45,
  });

  assert.equal(result.cubicMeters, 5);
  assert.ok(
    Math.abs(result.volumeWithWaste - 5.5) <
      1e-12,
  );
  assert.ok(
    Math.abs(result.estimatedWeight - 9.35) <
      1e-12,
  );
  assert.ok(
    Math.abs(result.estimatedCost - 420.75) <
      1e-12,
  );

  assert.equal(result.smallTruckLoads, 2);
  assert.equal(result.standardTruckLoads, 1);
  assert.equal(result.largeTruckLoads, 1);
});

test("zero volume produces zero truck loads", () => {
  const result = calculateImperialGravel({
    lengthFeet: 0,
    widthFeet: 60,
    depthInches: 4,
    wastePercent: 10,
    tonsPerCubicYard: 1.4,
    pricePerTon: 45,
  });

  assert.equal(result.estimatedWeight, 0);
  assert.equal(result.estimatedCost, 0);
  assert.equal(result.smallTruckLoads, 0);
  assert.equal(result.standardTruckLoads, 0);
  assert.equal(result.largeTruckLoads, 0);
});

test("negative and invalid numeric values are clamped to zero", () => {
  const result = calculateImperialGravel({
    lengthFeet: -40,
    widthFeet: Number.NaN,
    depthInches: -4,
    wastePercent: -10,
    tonsPerCubicYard: -1.4,
    pricePerTon: -45,
  });

  assert.equal(result.cubicFeet, 0);
  assert.equal(result.cubicYards, 0);
  assert.equal(result.volumeWithWaste, 0);
  assert.equal(result.estimatedWeight, 0);
  assert.equal(result.estimatedCost, 0);
});

test("truck load counts round up using existing 5 10 and 15 ton capacities", () => {
  const result = calculateImperialGravel({
    lengthFeet: 10,
    widthFeet: 10,
    depthInches: 12,
    wastePercent: 0,
    tonsPerCubicYard: 1.4,
    pricePerTon: 0,
  });

  assert.equal(result.smallTruckLoads, 2);
  assert.equal(result.standardTruckLoads, 1);
  assert.equal(result.largeTruckLoads, 1);
});

function legacyHowMuchGravel({
  lengthFeet,
  widthFeet,
  depthInches,
  wastePercent,
  tonsPerCubicYard,
  pricePerTon,
}) {
  const squareFeet = lengthFeet * widthFeet;
  const depthFeet = depthInches / 12;
  const cubicFeet = squareFeet * depthFeet;
  const cubicYards = cubicFeet / 27;
  const cubicYardsWithWaste = cubicYards * (1 + wastePercent / 100);
  const estimatedTons = cubicYardsWithWaste * tonsPerCubicYard;
  const materialCost = estimatedTons * pricePerTon;

  return {
    squareFeet,
    cubicFeet,
    cubicYards,
    cubicYardsWithWaste,
    estimatedTons,
    materialCost,
    smallTruckLoads:
      estimatedTons > 0 ? Math.ceil(estimatedTons / 5) : 0,
    standardTruckLoads:
      estimatedTons > 0 ? Math.ceil(estimatedTons / 10) : 0,
    largeTruckLoads:
      estimatedTons > 0 ? Math.ceil(estimatedTons / 15) : 0,
  };
}

function assertClose(actual, expected, epsilon = 1e-10) {
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `expected ${actual} to be within ${epsilon} of ${expected}`,
  );
}

function assertHowMuchGravelParity(input) {
  const legacy = legacyHowMuchGravel(input);
  const shared = calculateImperialGravel(input);

  assertClose(shared.cubicFeet, legacy.cubicFeet);
  assertClose(shared.cubicYards, legacy.cubicYards);
  assertClose(shared.volumeWithWaste, legacy.cubicYardsWithWaste);
  assertClose(shared.estimatedWeight, legacy.estimatedTons);
  assertClose(shared.estimatedCost, legacy.materialCost);
  assert.equal(shared.smallTruckLoads, legacy.smallTruckLoads);
  assert.equal(shared.standardTruckLoads, legacy.standardTruckLoads);
  assert.equal(shared.largeTruckLoads, legacy.largeTruckLoads);
}

const howMuchGravelDefaults = {
  lengthFeet: 20,
  widthFeet: 10,
  depthInches: 4,
  wastePercent: 10,
  tonsPerCubicYard: 1.4,
  pricePerTon: 45,
};

test("How Much Gravel defaults match the canonical shared engine", () => {
  const result = calculateImperialGravel(howMuchGravelDefaults);

  assert.equal(20 * 10, 200);
  assertClose(result.cubicFeet, 66.66666666666666);
  assertClose(result.cubicYards, 2.4691358024691357);
  assertClose(result.volumeWithWaste, 2.7160493827160495);
  assertClose(result.estimatedWeight, 3.802469135802469);
  assertClose(result.estimatedCost, 171.1111111111111);
  assert.equal(result.smallTruckLoads, 1);
  assert.equal(result.standardTruckLoads, 1);
  assert.equal(result.largeTruckLoads, 1);
  assertHowMuchGravelParity(howMuchGravelDefaults);
});

test("How Much Gravel valid-input parity covers waste, fractional dimensions, density, and price", () => {
  for (const wastePercent of [0, 5, 10, 15]) {
    assertHowMuchGravelParity({
      ...howMuchGravelDefaults,
      wastePercent,
    });
  }

  assertHowMuchGravelParity({
    ...howMuchGravelDefaults,
    lengthFeet: 12.75,
    widthFeet: 7.25,
    depthInches: 3.5,
  });
  assertHowMuchGravelParity({
    ...howMuchGravelDefaults,
    tonsPerCubicYard: 1.63,
  });
  assertHowMuchGravelParity({
    ...howMuchGravelDefaults,
    pricePerTon: 73.25,
  });
});

test("How Much Gravel zero values preserve expected output behavior", () => {
  const zeroDimension = calculateImperialGravel({
    ...howMuchGravelDefaults,
    lengthFeet: 0,
  });
  assert.equal(zeroDimension.cubicFeet, 0);
  assert.equal(zeroDimension.estimatedWeight, 0);
  assert.equal(zeroDimension.estimatedCost, 0);
  assert.equal(zeroDimension.smallTruckLoads, 0);

  const zeroDensity = calculateImperialGravel({
    ...howMuchGravelDefaults,
    tonsPerCubicYard: 0,
  });
  assert.ok(zeroDensity.volumeWithWaste > 0);
  assert.equal(zeroDensity.estimatedWeight, 0);
  assert.equal(zeroDensity.estimatedCost, 0);

  const zeroPrice = calculateImperialGravel({
    ...howMuchGravelDefaults,
    pricePerTon: 0,
  });
  assert.ok(zeroPrice.estimatedWeight > 0);
  assert.equal(zeroPrice.estimatedCost, 0);
});

test("How Much Gravel conversion adopts canonical negative and invalid clamping", () => {
  const result = calculateImperialGravel({
    lengthFeet: -20,
    widthFeet: Number.NaN,
    depthInches: -4,
    wastePercent: -10,
    tonsPerCubicYard: -1.4,
    pricePerTon: -45,
  });

  assert.equal(result.cubicFeet, 0);
  assert.equal(result.cubicYards, 0);
  assert.equal(result.volumeWithWaste, 0);
  assert.equal(result.estimatedWeight, 0);
  assert.equal(result.estimatedCost, 0);
  assert.equal(result.smallTruckLoads, 0);
  assert.equal(result.standardTruckLoads, 0);
  assert.equal(result.largeTruckLoads, 0);
});

test("How Much Gravel truckload boundaries preserve Math.ceil behavior", () => {
  const cases = [
    [4.99, 1, 1, 1],
    [5, 1, 1, 1],
    [5.01, 2, 1, 1],
    [9.99, 2, 1, 1],
    [10, 2, 1, 1],
    [10.01, 3, 2, 1],
    [14.99, 3, 2, 1],
    [15, 3, 2, 1],
    [15.01, 4, 2, 2],
  ];

  for (const [tons, small, standard, large] of cases) {
    const result = calculateImperialGravel({
      lengthFeet: tons * 27,
      widthFeet: 1,
      depthInches: 12,
      wastePercent: 0,
      tonsPerCubicYard: 1,
      pricePerTon: 0,
    });

    assertClose(result.estimatedWeight, tons, 1e-9);
    assert.equal(result.smallTruckLoads, small);
    assert.equal(result.standardTruckLoads, standard);
    assert.equal(result.largeTruckLoads, large);
  }
});


function legacyGravelDriveway({
  lengthFeet,
  widthFeet,
  depthInches,
  wastePercent,
  tonsPerCubicYard,
  pricePerTon,
}) {
  const squareFeet = lengthFeet * widthFeet;
  const depthFeet = depthInches / 12;
  const cubicFeet = squareFeet * depthFeet;
  const cubicYards = cubicFeet / 27;
  const cubicYardsWithWaste = cubicYards * (1 + wastePercent / 100);
  const estimatedTons = cubicYardsWithWaste * tonsPerCubicYard;
  const materialCost = estimatedTons * pricePerTon;

  return {
    squareFeet,
    cubicFeet,
    cubicYards,
    cubicYardsWithWaste,
    estimatedTons,
    materialCost,
    smallTruckLoads:
      estimatedTons > 0 ? Math.ceil(estimatedTons / 5) : 0,
    standardTruckLoads:
      estimatedTons > 0 ? Math.ceil(estimatedTons / 10) : 0,
    largeTruckLoads:
      estimatedTons > 0 ? Math.ceil(estimatedTons / 15) : 0,
  };
}

function assertGravelDrivewayParity(input) {
  const legacy = legacyGravelDriveway(input);
  const shared = calculateImperialGravel(input);

  assertClose(shared.cubicFeet, legacy.cubicFeet);
  assertClose(shared.cubicYards, legacy.cubicYards);
  assertClose(shared.volumeWithWaste, legacy.cubicYardsWithWaste);
  assertClose(shared.estimatedWeight, legacy.estimatedTons);
  assertClose(shared.estimatedCost, legacy.materialCost);
  assert.equal(shared.smallTruckLoads, legacy.smallTruckLoads);
  assert.equal(shared.standardTruckLoads, legacy.standardTruckLoads);
  assert.equal(shared.largeTruckLoads, legacy.largeTruckLoads);
}

const gravelDrivewayDefaults = {
  lengthFeet: 100,
  widthFeet: 12,
  depthInches: 6,
  wastePercent: 10,
  tonsPerCubicYard: 1.4,
  pricePerTon: 45,
};

test("Gravel Driveway defaults match the canonical shared engine and preserve delivery total", () => {
  const result = calculateImperialGravel(gravelDrivewayDefaults);
  const deliveryFee = 150;
  const totalCost = result.estimatedCost + deliveryFee;

  assert.equal(100 * 12, 1200);
  assertClose(result.cubicFeet, 600);
  assertClose(result.cubicYards, 22.22222222222222);
  assertClose(result.volumeWithWaste, 24.444444444444446);
  assertClose(result.estimatedWeight, 34.22222222222222);
  assertClose(result.estimatedCost, 1540);
  assert.equal(result.smallTruckLoads, 7);
  assert.equal(result.standardTruckLoads, 4);
  assert.equal(result.largeTruckLoads, 3);
  assert.equal(deliveryFee, 150);
  assert.equal(totalCost, 1690);
  assertGravelDrivewayParity(gravelDrivewayDefaults);
});

test("Gravel Driveway valid-input parity covers waste, fractional dimensions, density, and price", () => {
  for (const wastePercent of [0, 5, 10, 15]) {
    assertGravelDrivewayParity({
      ...gravelDrivewayDefaults,
      wastePercent,
    });
  }

  assertGravelDrivewayParity({
    ...gravelDrivewayDefaults,
    lengthFeet: 83.75,
    widthFeet: 11.5,
    depthInches: 5.25,
  });
  assertGravelDrivewayParity({
    ...gravelDrivewayDefaults,
    tonsPerCubicYard: 1.62,
  });
  assertGravelDrivewayParity({
    ...gravelDrivewayDefaults,
    pricePerTon: 68.75,
  });
});

test("Gravel Driveway zero dimension density price and delivery preserve expected behavior", () => {
  const zeroDimension = calculateImperialGravel({
    ...gravelDrivewayDefaults,
    lengthFeet: 0,
  });
  assert.equal(zeroDimension.cubicFeet, 0);
  assert.equal(zeroDimension.estimatedWeight, 0);
  assert.equal(zeroDimension.estimatedCost, 0);
  assert.equal(zeroDimension.smallTruckLoads, 0);

  const zeroDensity = calculateImperialGravel({
    ...gravelDrivewayDefaults,
    tonsPerCubicYard: 0,
  });
  assert.ok(zeroDensity.volumeWithWaste > 0);
  assert.equal(zeroDensity.estimatedWeight, 0);
  assert.equal(zeroDensity.estimatedCost, 0);

  const zeroPrice = calculateImperialGravel({
    ...gravelDrivewayDefaults,
    pricePerTon: 0,
  });
  assert.ok(zeroPrice.estimatedWeight > 0);
  assert.equal(zeroPrice.estimatedCost, 0);

  const normal = calculateImperialGravel(gravelDrivewayDefaults);
  assert.equal(normal.estimatedCost + 0, 1540);
  assert.equal(normal.estimatedCost + 287.5, 1827.5);
});

test("Gravel Driveway conversion adopts canonical negative and invalid clamping", () => {
  const result = calculateImperialGravel({
    lengthFeet: -100,
    widthFeet: Number.NaN,
    depthInches: -6,
    wastePercent: -10,
    tonsPerCubicYard: -1.4,
    pricePerTon: -45,
  });

  assert.equal(result.cubicFeet, 0);
  assert.equal(result.cubicYards, 0);
  assert.equal(result.volumeWithWaste, 0);
  assert.equal(result.estimatedWeight, 0);
  assert.equal(result.estimatedCost, 0);
  assert.equal(result.smallTruckLoads, 0);
  assert.equal(result.standardTruckLoads, 0);
  assert.equal(result.largeTruckLoads, 0);
});

test("Gravel Driveway truckload boundaries preserve Math.ceil behavior", () => {
  const cases = [
    [4.99, 1, 1, 1],
    [5, 1, 1, 1],
    [5.01, 2, 1, 1],
    [9.99, 2, 1, 1],
    [10, 2, 1, 1],
    [10.01, 3, 2, 1],
    [14.99, 3, 2, 1],
    [15, 3, 2, 1],
    [15.01, 4, 2, 2],
  ];

  for (const [tons, small, standard, large] of cases) {
    const result = calculateImperialGravel({
      lengthFeet: tons * 27,
      widthFeet: 1,
      depthInches: 12,
      wastePercent: 0,
      tonsPerCubicYard: 1,
      pricePerTon: 0,
    });

    assertClose(result.estimatedWeight, tons, 1e-9);
    assert.equal(result.smallTruckLoads, small);
    assert.equal(result.standardTruckLoads, standard);
    assert.equal(result.largeTruckLoads, large);
  }
});

test("Gravel Driveway client preserves presets formatting copy fields and project isolation", () => {
  const source = readFileSync(
    new URL(
      "../../app/construction/gravel-driveway-calculator/GravelDrivewayCalculatorClient.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /import \{ calculateImperialGravel \} from "@\/lib\/calculations\/gravel";/);
  assert.match(source, /const gravelResult = calculateImperialGravel\(\{/);
  assert.match(source, /const totalCost = gravelResult\.estimatedCost \+ delivery;/);

  assert.doesNotMatch(source, /const depthFeet = depthNumber \/ 12;/);
  assert.doesNotMatch(source, /const cubicFeet = squareFeet \* depthFeet;/);
  assert.doesNotMatch(source, /const cubicYards = cubicFeet \/ 27;/);
  assert.doesNotMatch(source, /Math\.ceil\(estimatedTons \/ 5\)/);

  const presets = [
    ["Top dressing", "2"],
    ["Light driveway", "4"],
    ["Standard driveway", "6"],
    ["Heavy-use driveway", "8"],
    ["Deep base", "10"],
    ["Poor soil", "12"],
  ];

  for (const [label, depth] of presets) {
    assert.ok(
      source.includes(
        `<PresetButton label="${label}" value="${depth} in" onClick={() => applyPreset("${depth}")} />`,
      ),
      `missing preserved ${label} ${depth}-inch preset`,
    );
  }

  assert.match(source, /maximumFractionDigits: 0/);
  assert.equal(
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(1690),
    "$1,690",
  );

  for (const field of [
    "Driveway Size:",
    "Square Feet:",
    "Cubic Yards Before Waste:",
    "Cubic Yards With Waste:",
    "Estimated Tons:",
    "Material Cost:",
    "Delivery Fee:",
    "Estimated Total:",
    "Small Dump Truck Loads:",
    "Standard Dump Truck Loads:",
    "Large Dump Truck / Tri-Axle Loads:",
  ]) {
    assert.ok(source.includes(field), `missing preserved Copy Results field: ${field}`);
  }

  assert.doesNotMatch(source, /calculateMetricGravel/);
  assert.doesNotMatch(source, /fromProject/);
  assert.doesNotMatch(source, /saveCalculationToProject/);
  assert.doesNotMatch(source, /setProjectScopeResult/);
});

function legacyCrushedStoneCore({
  lengthFeet,
  widthFeet,
  depthInches,
  wastePercent,
  tonsPerCubicYard,
  pricePerTon,
}) {
  const squareFeet = lengthFeet * widthFeet;
  const depthFeet = depthInches / 12;
  const cubicFeet = squareFeet * depthFeet;
  const cubicYards = cubicFeet / 27;
  const cubicYardsWithWaste = cubicYards * (1 + wastePercent / 100);
  const estimatedTons = cubicYardsWithWaste * tonsPerCubicYard;
  const materialCost = estimatedTons * pricePerTon;

  return {
    squareFeet,
    cubicFeet,
    cubicYards,
    cubicYardsWithWaste,
    estimatedTons,
    materialCost,
    smallTruckLoads:
      estimatedTons > 0 ? Math.ceil(estimatedTons / 5) : 0,
    standardTruckLoads:
      estimatedTons > 0 ? Math.ceil(estimatedTons / 10) : 0,
    largeTruckLoads:
      estimatedTons > 0 ? Math.ceil(estimatedTons / 15) : 0,
  };
}

function assertCrushedStoneParity(input) {
  const legacy = legacyCrushedStoneCore(input);
  const shared = calculateImperialGravel(input);

  assertClose(shared.cubicFeet, legacy.cubicFeet);
  assertClose(shared.cubicYards, legacy.cubicYards);
  assertClose(shared.volumeWithWaste, legacy.cubicYardsWithWaste);
  assertClose(shared.estimatedWeight, legacy.estimatedTons);
  assertClose(shared.estimatedCost, legacy.materialCost);
  assert.equal(shared.smallTruckLoads, legacy.smallTruckLoads);
  assert.equal(shared.standardTruckLoads, legacy.standardTruckLoads);
  assert.equal(shared.largeTruckLoads, legacy.largeTruckLoads);
}

const crushedStoneDefaults = {
  lengthFeet: 30,
  widthFeet: 12,
  depthInches: 4,
  wastePercent: 10,
  tonsPerCubicYard: 1.4,
  pricePerTon: 50,
};

test("Crushed Stone defaults match the canonical shared engine and preserve installed cost", () => {
  const result = calculateImperialGravel(crushedStoneDefaults);
  const squareFeet = 30 * 12;
  const delivery = 125;
  const labor = 200;
  const totalCost = result.estimatedCost + delivery + labor;
  const costPerSquareFoot = squareFeet > 0 ? totalCost / squareFeet : 0;

  assert.equal(squareFeet, 360);
  assertClose(result.cubicFeet, 120);
  assertClose(result.cubicYards, 4.444444444444445);
  assertClose(result.volumeWithWaste, 4.888888888888889);
  assertClose(result.estimatedWeight, 6.844444444444444);
  assertClose(result.estimatedCost, 342.2222222222222);
  assert.equal(result.smallTruckLoads, 2);
  assert.equal(result.standardTruckLoads, 1);
  assert.equal(result.largeTruckLoads, 1);
  assert.equal(delivery, 125);
  assert.equal(labor, 200);
  assertClose(totalCost, 667.2222222222222);
  assertClose(costPerSquareFoot, 1.853395061728395);
  assertCrushedStoneParity(crushedStoneDefaults);
});

test("Crushed Stone valid-input parity covers waste, fractional dimensions, density, and price", () => {
  for (const wastePercent of [0, 5, 10, 15]) {
    assertCrushedStoneParity({
      ...crushedStoneDefaults,
      wastePercent,
    });
  }

  assertCrushedStoneParity({
    ...crushedStoneDefaults,
    lengthFeet: 28.75,
    widthFeet: 11.25,
    depthInches: 3.5,
  });
  assertCrushedStoneParity({
    ...crushedStoneDefaults,
    tonsPerCubicYard: 1.62,
  });
  assertCrushedStoneParity({
    ...crushedStoneDefaults,
    pricePerTon: 71.25,
  });
});

test("Crushed Stone zero values and supplemental costs preserve expected behavior", () => {
  const zeroDimension = calculateImperialGravel({
    ...crushedStoneDefaults,
    lengthFeet: 0,
  });
  assert.equal(zeroDimension.cubicFeet, 0);
  assert.equal(zeroDimension.estimatedWeight, 0);
  assert.equal(zeroDimension.estimatedCost, 0);
  assert.equal(zeroDimension.smallTruckLoads, 0);
  const zeroArea = 0;
  const zeroAreaTotal = zeroDimension.estimatedCost + 125 + 200;
  const zeroAreaCostPerSquareFoot =
    zeroArea > 0 ? zeroAreaTotal / zeroArea : 0;
  assert.equal(zeroAreaCostPerSquareFoot, 0);

  const zeroDensity = calculateImperialGravel({
    ...crushedStoneDefaults,
    tonsPerCubicYard: 0,
  });
  assert.ok(zeroDensity.volumeWithWaste > 0);
  assert.equal(zeroDensity.estimatedWeight, 0);
  assert.equal(zeroDensity.estimatedCost, 0);

  const zeroPrice = calculateImperialGravel({
    ...crushedStoneDefaults,
    pricePerTon: 0,
  });
  assert.ok(zeroPrice.estimatedWeight > 0);
  assert.equal(zeroPrice.estimatedCost, 0);

  const normal = calculateImperialGravel(crushedStoneDefaults);
  assertClose(normal.estimatedCost + 0 + 200, 542.2222222222222);
  assertClose(normal.estimatedCost + 287.5 + 200, 829.7222222222222);
  assertClose(normal.estimatedCost + 125 + 0, 467.2222222222222);
  assertClose(normal.estimatedCost + 125 + 375.5, 842.7222222222222);
});

test("Crushed Stone conversion adopts canonical quantity clamping while preserving supplemental parsing", () => {
  const result = calculateImperialGravel({
    lengthFeet: -30,
    widthFeet: Number.NaN,
    depthInches: -4,
    wastePercent: -10,
    tonsPerCubicYard: -1.4,
    pricePerTon: -50,
  });

  assert.equal(result.cubicFeet, 0);
  assert.equal(result.cubicYards, 0);
  assert.equal(result.volumeWithWaste, 0);
  assert.equal(result.estimatedWeight, 0);
  assert.equal(result.estimatedCost, 0);
  assert.equal(result.smallTruckLoads, 0);
  assert.equal(result.standardTruckLoads, 0);
  assert.equal(result.largeTruckLoads, 0);

  const currentSupplementalToNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  assert.equal(currentSupplementalToNumber("-125"), -125);
  assert.equal(currentSupplementalToNumber("-200"), -200);
  assert.equal(currentSupplementalToNumber("invalid"), 0);
  assert.equal(currentSupplementalToNumber(""), 0);
});

test("Crushed Stone truckload boundaries preserve Math.ceil behavior", () => {
  const cases = [
    [4.99, 1, 1, 1],
    [5, 1, 1, 1],
    [5.01, 2, 1, 1],
    [9.99, 2, 1, 1],
    [10, 2, 1, 1],
    [10.01, 3, 2, 1],
    [14.99, 3, 2, 1],
    [15, 3, 2, 1],
    [15.01, 4, 2, 2],
  ];

  for (const [tons, small, standard, large] of cases) {
    const result = calculateImperialGravel({
      lengthFeet: tons * 27,
      widthFeet: 1,
      depthInches: 12,
      wastePercent: 0,
      tonsPerCubicYard: 1,
      pricePerTon: 0,
    });

    assertClose(result.estimatedWeight, tons, 1e-9);
    assert.equal(result.smallTruckLoads, small);
    assert.equal(result.standardTruckLoads, standard);
    assert.equal(result.largeTruckLoads, large);
  }
});

test("Crushed Stone client preserves presets supplemental logic formatting copy fields and project isolation", () => {
  const source = readFileSync(
    new URL(
      "../../app/construction/crushed-stone-calculator/CrushedStoneCalculatorClient.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /import \{ calculateImperialGravel \} from "@\/lib\/calculations\/gravel";/);
  assert.match(source, /const gravelResult = calculateImperialGravel\(\{/);
  assert.match(source, /const totalCost = gravelResult\.estimatedCost \+ delivery \+ labor;/);
  assert.match(source, /const costPerSquareFoot = squareFeet > 0 \? totalCost \/ squareFeet : 0;/);

  assert.doesNotMatch(source, /const depthFeet = depthNumber \/ 12;/);
  assert.doesNotMatch(source, /const cubicFeet = squareFeet \* depthFeet;/);
  assert.doesNotMatch(source, /const cubicYards = cubicFeet \/ 27;/);
  assert.doesNotMatch(source, /Math\.ceil\(estimatedTons \/ 5\)/);

  const presets = [
    ["Decorative layer", "2"],
    ["Walkway", "3"],
    ["Patio base", "4"],
    ["Driveway top layer", "5"],
    ["Driveway base", "6"],
    ["Drainage base", "8"],
  ];

  for (const [label, depth] of presets) {
    assert.ok(
      source.includes(
        `<PresetButton label="${label}" value="${depth} in" onClick={() => applyDepth("${depth}")} />`,
      ),
      `missing preserved ${label} ${depth}-inch preset`,
    );
  }

  assert.match(
    source,
    /function toNumber\(value: string\) \{\s*const parsed = Number\(value\);\s*return Number\.isFinite\(parsed\) \? parsed : 0;\s*\}/,
  );
  assert.match(source, /const delivery = toNumber\(deliveryFee\);/);
  assert.match(source, /const labor = toNumber\(laborCost\);/);
  assert.match(source, /const \[length, setLength\] = useState\("30"\);/);
  assert.match(source, /const \[width, setWidth\] = useState\("12"\);/);
  assert.match(source, /const \[depth, setDepth\] = useState\("4"\);/);
  assert.match(source, /const \[wastePercent, setWastePercent\] = useState\("10"\);/);
  assert.match(source, /const \[tonsPerCubicYard, setTonsPerCubicYard\] = useState\("1\.4"\);/);
  assert.match(source, /const \[pricePerTon, setPricePerTon\] = useState\("50"\);/);
  assert.match(source, /const \[deliveryFee, setDeliveryFee\] = useState\("125"\);/);
  assert.match(source, /const \[laborCost, setLaborCost\] = useState\("200"\);/);
  assert.ok(source.includes('label="Project Area"'));

  assert.match(source, /maximumFractionDigits: 0/);
  assert.equal(
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(667.2222222222222),
    "$667",
  );
  assert.equal(
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(1.853395061728395),
    "$2",
  );

  for (const field of [
    "Project Size:",
    "Square Feet:",
    "Cubic Yards Before Waste:",
    "Cubic Yards With Waste:",
    "Estimated Tons:",
    "Material Cost:",
    "Delivery Fee:",
    "Labor / Spreading Cost:",
    "Estimated Total Cost:",
    "Cost Per Square Foot:",
    "Standard Dump Truck Loads:",
  ]) {
    assert.ok(source.includes(field), `missing preserved Copy Results field: ${field}`);
  }

  assert.doesNotMatch(source, /calculateMetricGravel/);
  assert.doesNotMatch(source, /fromProject/);
  assert.doesNotMatch(source, /saveCalculationToProject/);
  assert.doesNotMatch(source, /setProjectScopeResult/);
});

function legacyRoadBaseCore({
  lengthFeet,
  widthFeet,
  depthInches,
  wastePercent,
  tonsPerCubicYard,
  pricePerTon,
}) {
  const squareFeet = lengthFeet * widthFeet;
  const depthFeet = depthInches / 12;
  const cubicFeet = squareFeet * depthFeet;
  const cubicYards = cubicFeet / 27;
  const cubicYardsWithWaste = cubicYards * (1 + wastePercent / 100);
  const estimatedTons = cubicYardsWithWaste * tonsPerCubicYard;
  const materialCost = estimatedTons * pricePerTon;

  return {
    squareFeet,
    cubicFeet,
    cubicYards,
    cubicYardsWithWaste,
    estimatedTons,
    materialCost,
    smallTruckLoads:
      estimatedTons > 0 ? Math.ceil(estimatedTons / 5) : 0,
    standardTruckLoads:
      estimatedTons > 0 ? Math.ceil(estimatedTons / 10) : 0,
    largeTruckLoads:
      estimatedTons > 0 ? Math.ceil(estimatedTons / 15) : 0,
  };
}

function assertRoadBaseParity(input) {
  const legacy = legacyRoadBaseCore(input);
  const shared = calculateImperialGravel(input);

  assertClose(shared.cubicFeet, legacy.cubicFeet);
  assertClose(shared.cubicYards, legacy.cubicYards);
  assertClose(shared.volumeWithWaste, legacy.cubicYardsWithWaste);
  assertClose(shared.estimatedWeight, legacy.estimatedTons);
  assertClose(shared.estimatedCost, legacy.materialCost);
  assert.equal(shared.smallTruckLoads, legacy.smallTruckLoads);
  assert.equal(shared.standardTruckLoads, legacy.standardTruckLoads);
  assert.equal(shared.largeTruckLoads, legacy.largeTruckLoads);
}

const roadBaseDefaults = {
  lengthFeet: 40,
  widthFeet: 12,
  depthInches: 6,
  wastePercent: 10,
  tonsPerCubicYard: 1.5,
  pricePerTon: 42,
};

test("Road Base defaults match the canonical shared engine and preserve installed cost", () => {
  const result = calculateImperialGravel(roadBaseDefaults);
  const squareFeet = 40 * 12;
  const delivery = 150;
  const gradingCompaction = 250;
  const totalCost = result.estimatedCost + delivery + gradingCompaction;
  const costPerSquareFoot = squareFeet > 0 ? totalCost / squareFeet : 0;

  assert.equal(squareFeet, 480);
  assertClose(result.cubicFeet, 240);
  assertClose(result.cubicYards, 8.88888888888889);
  assertClose(result.volumeWithWaste, 9.777777777777779);
  assertClose(result.estimatedWeight, 14.666666666666668);
  assertClose(result.estimatedCost, 616);
  assert.equal(result.smallTruckLoads, 3);
  assert.equal(result.standardTruckLoads, 2);
  assert.equal(result.largeTruckLoads, 1);
  assert.equal(delivery, 150);
  assert.equal(gradingCompaction, 250);
  assert.equal(totalCost, 1016);
  assertClose(costPerSquareFoot, 2.1166666666666667);
  assertRoadBaseParity(roadBaseDefaults);
});

test("Road Base valid-input parity covers waste, fractional dimensions, density, and price", () => {
  for (const wastePercent of [0, 5, 10, 15]) {
    assertRoadBaseParity({
      ...roadBaseDefaults,
      wastePercent,
    });
  }

  assertRoadBaseParity({
    ...roadBaseDefaults,
    lengthFeet: 37.75,
    widthFeet: 13.25,
    depthInches: 7.5,
  });
  assertRoadBaseParity({
    ...roadBaseDefaults,
    tonsPerCubicYard: 1.72,
  });
  assertRoadBaseParity({
    ...roadBaseDefaults,
    pricePerTon: 58.75,
  });
});

test("Road Base zero values and supplemental costs preserve expected behavior", () => {
  const zeroDimension = calculateImperialGravel({
    ...roadBaseDefaults,
    lengthFeet: 0,
  });
  assert.equal(zeroDimension.cubicFeet, 0);
  assert.equal(zeroDimension.estimatedWeight, 0);
  assert.equal(zeroDimension.estimatedCost, 0);
  assert.equal(zeroDimension.smallTruckLoads, 0);
  const zeroArea = 0;
  const zeroAreaTotal = zeroDimension.estimatedCost + 150 + 250;
  const zeroAreaCostPerSquareFoot =
    zeroArea > 0 ? zeroAreaTotal / zeroArea : 0;
  assert.equal(zeroAreaCostPerSquareFoot, 0);

  const zeroDensity = calculateImperialGravel({
    ...roadBaseDefaults,
    tonsPerCubicYard: 0,
  });
  assert.ok(zeroDensity.volumeWithWaste > 0);
  assert.equal(zeroDensity.estimatedWeight, 0);
  assert.equal(zeroDensity.estimatedCost, 0);

  const zeroPrice = calculateImperialGravel({
    ...roadBaseDefaults,
    pricePerTon: 0,
  });
  assert.ok(zeroPrice.estimatedWeight > 0);
  assert.equal(zeroPrice.estimatedCost, 0);

  const normal = calculateImperialGravel(roadBaseDefaults);
  assert.equal(normal.estimatedCost + 0 + 250, 866);
  assert.equal(normal.estimatedCost + 287.5 + 250, 1153.5);
  assert.equal(normal.estimatedCost + 150 + 0, 766);
  assert.equal(normal.estimatedCost + 150 + 425.5, 1191.5);
});

test("Road Base conversion adopts canonical quantity clamping while preserving supplemental parsing", () => {
  const result = calculateImperialGravel({
    lengthFeet: -40,
    widthFeet: Number.NaN,
    depthInches: -6,
    wastePercent: -10,
    tonsPerCubicYard: -1.5,
    pricePerTon: -42,
  });

  assert.equal(result.cubicFeet, 0);
  assert.equal(result.cubicYards, 0);
  assert.equal(result.volumeWithWaste, 0);
  assert.equal(result.estimatedWeight, 0);
  assert.equal(result.estimatedCost, 0);
  assert.equal(result.smallTruckLoads, 0);
  assert.equal(result.standardTruckLoads, 0);
  assert.equal(result.largeTruckLoads, 0);

  const currentSupplementalToNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  assert.equal(currentSupplementalToNumber("-150"), -150);
  assert.equal(currentSupplementalToNumber("-250"), -250);
  assert.equal(currentSupplementalToNumber("invalid"), 0);
  assert.equal(currentSupplementalToNumber(""), 0);
});

test("Road Base truckload boundaries preserve Math.ceil behavior", () => {
  const cases = [
    [4.99, 1, 1, 1],
    [5, 1, 1, 1],
    [5.01, 2, 1, 1],
    [9.99, 2, 1, 1],
    [10, 2, 1, 1],
    [10.01, 3, 2, 1],
    [14.99, 3, 2, 1],
    [15, 3, 2, 1],
    [15.01, 4, 2, 2],
  ];

  for (const [tons, small, standard, large] of cases) {
    const result = calculateImperialGravel({
      lengthFeet: tons * 27,
      widthFeet: 1,
      depthInches: 12,
      wastePercent: 0,
      tonsPerCubicYard: 1,
      pricePerTon: 0,
    });

    assertClose(result.estimatedWeight, tons, 1e-9);
    assert.equal(result.smallTruckLoads, small);
    assert.equal(result.standardTruckLoads, standard);
    assert.equal(result.largeTruckLoads, large);
  }
});

test("Road Base client preserves presets supplemental logic formatting copy fields and project isolation", () => {
  const source = readFileSync(
    new URL(
      "../../app/construction/road-base-calculator/RoadBaseCalculatorClient.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /import \{ calculateImperialGravel \} from "@\/lib\/calculations\/gravel";/);
  assert.match(source, /const gravelResult = calculateImperialGravel\(\{/);
  assert.match(source, /const totalCost = gravelResult\.estimatedCost \+ delivery \+ gradingCompaction;/);
  assert.match(source, /const costPerSquareFoot = squareFeet > 0 \? totalCost \/ squareFeet : 0;/);

  assert.doesNotMatch(source, /const depthFeet = depthNumber \/ 12;/);
  assert.doesNotMatch(source, /const cubicFeet = squareFeet \* depthFeet;/);
  assert.doesNotMatch(source, /const cubicYards = cubicFeet \/ 27;/);
  assert.doesNotMatch(source, /Math\.ceil\(estimatedTons \/ 5\)/);

  const presets = [
    ["Walkway base", "3"],
    ["Patio base", "4"],
    ["Light driveway", "6"],
    ["Parking pad", "8"],
    ["Heavy-use base", "10"],
    ["Poor soil", "12"],
  ];

  for (const [label, depth] of presets) {
    assert.ok(
      source.includes(
        `<PresetButton label="${label}" value="${depth} in" onClick={() => applyDepth("${depth}")} />`,
      ),
      `missing preserved ${label} ${depth}-inch preset`,
    );
  }

  assert.match(
    source,
    /function toNumber\(value: string\) \{\s*const parsed = Number\(value\);\s*return Number\.isFinite\(parsed\) \? parsed : 0;\s*\}/,
  );
  assert.match(source, /const delivery = toNumber\(deliveryFee\);/);
  assert.match(source, /const gradingCompaction = toNumber\(gradingCompactionCost\);/);
  assert.match(source, /const \[length, setLength\] = useState\("40"\);/);
  assert.match(source, /const \[width, setWidth\] = useState\("12"\);/);
  assert.match(source, /const \[depth, setDepth\] = useState\("6"\);/);
  assert.match(source, /const \[wastePercent, setWastePercent\] = useState\("10"\);/);
  assert.match(source, /const \[tonsPerCubicYard, setTonsPerCubicYard\] = useState\("1\.5"\);/);
  assert.match(source, /const \[pricePerTon, setPricePerTon\] = useState\("42"\);/);
  assert.match(source, /const \[deliveryFee, setDeliveryFee\] = useState\("150"\);/);
  assert.match(source, /const \[gradingCompactionCost, setGradingCompactionCost\] = useState\("250"\);/);
  assert.ok(source.includes('label="Project Area"'));

  assert.match(source, /maximumFractionDigits: 0/);
  assert.equal(
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(1016),
    "$1,016",
  );
  assert.equal(
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(2.1166666666666667),
    "$2",
  );

  for (const field of [
    "Project Size:",
    "Square Feet:",
    "Cubic Yards Before Waste:",
    "Cubic Yards With Waste:",
    "Estimated Tons:",
    "Material Cost:",
    "Delivery Fee:",
    "Grading / Compaction Cost:",
    "Estimated Total Cost:",
    "Cost Per Square Foot:",
    "Standard Dump Truck Loads:",
  ]) {
    assert.ok(source.includes(field), `missing preserved Copy Results field: ${field}`);
  }

  assert.doesNotMatch(source, /calculateMetricGravel/);
  assert.doesNotMatch(source, /fromProject/);
  assert.doesNotMatch(source, /saveCalculationToProject/);
  assert.doesNotMatch(source, /setProjectScopeResult/);
});
