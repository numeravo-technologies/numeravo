export type CalculatorCategory =
  | "construction"
  | "finance"
  | "business"
  | "tools"
  | "converters"
  | "seller-tools"
  | "energy"
  | "student";

export type ConstructionWorkflowStage =
  | "planning"
  | "measurement"
  | "area"
  | "excavation"
  | "base"
  | "concrete-quantity"
  | "reinforcement"
  | "formwork"
  | "delivery"
  | "placement"
  | "labor"
  | "finishing"
  | "joints"
  | "demolition"
  | "removal"
  | "roofing"
  | "framing";

export type CalculatorRecord = {
  id: string;
  title: string;
  href: string;

  category: CalculatorCategory;
  subcategory?: string;

  description?: string;
  keywords: string[];

  workflowStages?: ConstructionWorkflowStage[];

  related?: string[];

  methodologyHref?: string;

  featured?: boolean;
};

export const calculators: CalculatorRecord[] = [
  {
    id: "area-calculator",
    title: "Area Calculator",
    href: "/construction/area-calculator",
    category: "construction",
    subcategory: "measurement",
    description: "Calculate square feet, square yards, acres, and square meters.",
    keywords: ["area", "square feet", "square yards", "acres", "measurement"],
    workflowStages: ["measurement", "area"],
    related: [
      "concrete-calculator",
      "gravel-calculator",
      "flooring-calculator",
      "paint-calculator",
    ],
    featured: true,
  },
  {
    id: "concrete-calculator",
    title: "Concrete Calculator",
    href: "/construction/concrete-calculator",
    category: "construction",
    subcategory: "concrete",
    description: "Estimate concrete volume, cubic yards, waste, and project quantities.",
    keywords: ["concrete", "cubic yards", "yards", "volume", "slab"],
    workflowStages: ["concrete-quantity"],
    related: [
      "concrete-yard-calculator",
      "concrete-waste-calculator",
      "rebar-calculator",
      "concrete-formwork-calculator",
      "concrete-truckload-calculator",
    ],
    featured: true,
  },
  {
    id: "concrete-yard-calculator",
    title: "Concrete Yard Calculator",
    href: "/construction/concrete-yard-calculator",
    category: "construction",
    subcategory: "concrete",
    description: "Calculate cubic yards of concrete for common project shapes.",
    keywords: ["concrete yard", "cubic yards", "yardage", "concrete volume"],
    workflowStages: ["concrete-quantity"],
    related: [
      "concrete-calculator",
      "how-much-concrete-do-i-need",
      "concrete-waste-calculator",
      "concrete-truckload-calculator",
    ],
  },
  {
    id: "how-much-concrete-do-i-need",
    title: "How Much Concrete Do I Need?",
    href: "/construction/how-much-concrete-do-i-need",
    category: "construction",
    subcategory: "concrete",
    description: "Estimate concrete yards, waste, loads, weight, and material quantity.",
    keywords: ["how much concrete", "concrete needed", "yards", "ready mix"],
    workflowStages: ["concrete-quantity"],
    related: [
      "concrete-calculator",
      "concrete-yard-calculator",
      "concrete-bag-calculator",
      "concrete-waste-calculator",
    ],
  },
  {
    id: "concrete-bag-calculator",
    title: "Concrete Bag Calculator",
    href: "/construction/concrete-bag-calculator",
    category: "construction",
    subcategory: "concrete",
    description: "Estimate concrete bags required for small concrete projects.",
    keywords: ["concrete bags", "80 lb bags", "60 lb bags", "bagged concrete"],
    workflowStages: ["concrete-quantity"],
    related: [
      "concrete-calculator",
      "concrete-yard-calculator",
      "concrete-mix-ratio",
    ],
  },
  {
    id: "concrete-mix-ratio",
    title: "Concrete Mix Ratio Calculator",
    href: "/construction/concrete-mix-ratio",
    category: "construction",
    subcategory: "concrete",
    description: "Estimate cement, sand, gravel, and water for concrete mix ratios.",
    keywords: ["concrete mix", "cement", "sand", "gravel", "mix ratio"],
    workflowStages: ["concrete-quantity"],
    related: [
      "concrete-calculator",
      "concrete-bag-calculator",
      "concrete-psi-calculator",
    ],
  },
  {
    id: "concrete-slab-thickness",
    title: "Concrete Slab Thickness Calculator",
    href: "/construction/concrete-slab-thickness",
    category: "construction",
    subcategory: "concrete",
    description: "Estimate slab thickness and associated concrete quantities.",
    keywords: ["slab thickness", "concrete depth", "driveway thickness", "patio thickness"],
    workflowStages: ["planning", "concrete-quantity"],
    related: [
      "concrete-psi-calculator",
      "concrete-calculator",
      "rebar-spacing-for-concrete-slab",
    ],
  },
  {
    id: "concrete-psi-calculator",
    title: "Concrete PSI Calculator",
    href: "/construction/concrete-psi-calculator",
    category: "construction",
    subcategory: "concrete",
    description: "Estimate concrete strength requirements by project type.",
    keywords: ["concrete psi", "concrete strength", "3000 psi", "4000 psi"],
    workflowStages: ["planning"],
    related: [
      "concrete-slab-thickness",
      "concrete-mix-ratio",
      "concrete-calculator",
    ],
  },
  {
    id: "concrete-waste-calculator",
    title: "Concrete Waste Calculator",
    href: "/construction/concrete-waste-calculator",
    category: "construction",
    subcategory: "concrete",
    description: "Estimate extra concrete, final order quantity, and waste cost.",
    keywords: ["concrete waste", "waste allowance", "extra concrete", "order quantity"],
    workflowStages: ["concrete-quantity"],
    related: [
      "concrete-calculator",
      "concrete-yard-calculator",
      "concrete-truckload-calculator",
    ],
  },
  {
    id: "concrete-weight-calculator",
    title: "Concrete Weight Calculator",
    href: "/construction/concrete-weight-calculator",
    category: "construction",
    subcategory: "concrete",
    description: "Estimate concrete weight in pounds, tons, kilograms, and metric tons.",
    keywords: ["concrete weight", "weight per yard", "tons", "pounds"],
    workflowStages: ["concrete-quantity", "removal"],
    related: [
      "concrete-yard-calculator",
      "concrete-demolition-calculator",
      "concrete-removal-cost-calculator",
    ],
  },
  {
    id: "concrete-cure-time",
    title: "Concrete Cure Time Calculator",
    href: "/construction/concrete-cure-time",
    category: "construction",
    subcategory: "concrete",
    description: "Estimate concrete curing milestones for walking, vehicles, sealing, and full cure.",
    keywords: ["concrete cure time", "curing", "walk on concrete", "drive on concrete"],
    workflowStages: ["finishing"],
    related: [
      "concrete-finishing-cost-calculator",
      "concrete-psi-calculator",
      "concrete-saw-cut-calculator",
    ],
  },
  {
    id: "concrete-cost-calculator",
    title: "Concrete Cost Calculator",
    href: "/construction/concrete-cost-calculator",
    category: "construction",
    subcategory: "concrete-cost",
    description: "Estimate concrete, base, reinforcement, labor, delivery, and project cost.",
    keywords: ["concrete cost", "slab cost", "concrete price", "project cost"],
    workflowStages: ["planning", "delivery", "labor"],
    related: [
      "concrete-cost-per-yard",
      "concrete-delivery-cost-calculator",
      "concrete-labor-cost-calculator",
      "concrete-finishing-cost-calculator",
    ],
    featured: true,
  },
  {
    id: "concrete-cost-per-yard",
    title: "Concrete Cost Per Yard Calculator",
    href: "/construction/concrete-cost-per-yard",
    category: "construction",
    subcategory: "concrete-cost",
    description: "Estimate ready-mix concrete cost per cubic yard and delivered cost.",
    keywords: ["concrete cost per yard", "ready mix price", "concrete price"],
    workflowStages: ["planning", "delivery"],
    related: [
      "concrete-cost-calculator",
      "concrete-delivery-cost-calculator",
      "concrete-short-load-fee-calculator",
    ],
  },
  {
    id: "concrete-delivery-cost-calculator",
    title: "Concrete Delivery Cost Calculator",
    href: "/construction/concrete-delivery-cost-calculator",
    category: "construction",
    subcategory: "delivery",
    description: "Estimate ready-mix delivery fees and delivered concrete cost.",
    keywords: ["concrete delivery", "delivery fee", "ready mix delivery", "concrete truck"],
    workflowStages: ["delivery"],
    related: [
      "concrete-truckload-calculator",
      "concrete-short-load-fee-calculator",
      "concrete-pump-truck-cost-calculator",
      "concrete-cost-per-yard",
    ],
  },
  {
    id: "concrete-short-load-fee-calculator",
    title: "Concrete Short Load Fee Calculator",
    href: "/construction/concrete-short-load-fee-calculator",
    category: "construction",
    subcategory: "delivery",
    description: "Estimate short-load charges for smaller ready-mix orders.",
    keywords: ["short load", "concrete minimum", "small load concrete", "delivery fee"],
    workflowStages: ["delivery"],
    related: [
      "concrete-delivery-cost-calculator",
      "concrete-truckload-calculator",
      "concrete-bag-calculator",
    ],
  },
  {
    id: "concrete-truckload-calculator",
    title: "Concrete Truckload Calculator",
    href: "/construction/concrete-truckload-calculator",
    category: "construction",
    subcategory: "delivery",
    description: "Estimate ready-mix truckloads, capacity, delivery fees, and order quantity.",
    keywords: ["concrete truckload", "ready mix truck", "truck capacity", "concrete loads"],
    workflowStages: ["delivery"],
    related: [
      "concrete-yard-calculator",
      "concrete-delivery-cost-calculator",
      "concrete-pump-truck-cost-calculator",
    ],
  },
  {
    id: "concrete-pump-truck-cost-calculator",
    title: "Concrete Pump Truck Cost Calculator",
    href: "/construction/concrete-pump-truck-cost-calculator",
    category: "construction",
    subcategory: "placement",
    description: "Estimate line-pump or boom-pump charges for concrete placement.",
    keywords: ["concrete pump", "pump truck", "boom pump", "line pump", "pumping cost"],
    workflowStages: ["placement"],
    related: [
      "concrete-truckload-calculator",
      "concrete-delivery-cost-calculator",
      "concrete-labor-cost-calculator",
    ],
  },
  {
    id: "concrete-labor-cost-calculator",
    title: "Concrete Labor Cost Calculator",
    href: "/construction/concrete-labor-cost-calculator",
    category: "construction",
    subcategory: "labor",
    description: "Estimate concrete crew hours, person-hours, labor cost, and productivity.",
    keywords: ["concrete labor", "crew hours", "labor cost", "concrete crew"],
    workflowStages: ["labor"],
    related: [
      "concrete-pump-truck-cost-calculator",
      "concrete-finishing-cost-calculator",
      "concrete-formwork-calculator",
    ],
  },
  {
    id: "concrete-finishing-cost-calculator",
    title: "Concrete Finishing Cost Calculator",
    href: "/construction/concrete-finishing-cost-calculator",
    category: "construction",
    subcategory: "finishing",
    description: "Estimate finishing labor, curing, sealing, saw cuts, and finishing cost.",
    keywords: ["concrete finishing", "finishing cost", "broom finish", "slab finishing"],
    workflowStages: ["finishing"],
    related: [
      "concrete-labor-cost-calculator",
      "concrete-cure-time",
      "concrete-saw-cut-calculator",
    ],
  },
  {
    id: "concrete-formwork-calculator",
    title: "Concrete Formwork Calculator",
    href: "/construction/concrete-formwork-calculator",
    category: "construction",
    subcategory: "formwork",
    description: "Estimate form boards, stakes, bracing, fasteners, labor, and formwork cost.",
    keywords: ["concrete forms", "formwork", "form boards", "stakes"],
    workflowStages: ["formwork"],
    related: [
      "concrete-calculator",
      "rebar-calculator",
      "concrete-labor-cost-calculator",
    ],
  },
  {
    id: "rebar-calculator",
    title: "Rebar Calculator",
    href: "/construction/rebar-calculator",
    category: "construction",
    subcategory: "reinforcement",
    description: "Estimate rebar quantity, spacing, length, weight, and cost.",
    keywords: ["rebar", "reinforcement", "rebar grid", "steel reinforcement"],
    workflowStages: ["reinforcement"],
    related: [
      "rebar-spacing-for-concrete-slab",
      "rebar-weight-calculator",
      "rebar-lap-splice-calculator",
      "wire-mesh-calculator",
      "concrete-formwork-calculator",
    ],
    featured: true,
  },
  {
    id: "rebar-spacing-for-concrete-slab",
    title: "Rebar Spacing for Concrete Slab Calculator",
    href: "/construction/rebar-spacing-for-concrete-slab",
    category: "construction",
    subcategory: "reinforcement",
    description: "Estimate slab rebar grid spacing, quantity, length, and cost.",
    keywords: ["rebar spacing", "slab rebar", "rebar grid", "reinforcement spacing"],
    workflowStages: ["reinforcement"],
    related: [
      "rebar-calculator",
      "rebar-weight-calculator",
      "rebar-lap-splice-calculator",
      "wire-mesh-calculator",
    ],
  },
  {
    id: "rebar-weight-calculator",
    title: "Rebar Weight Calculator",
    href: "/construction/rebar-weight-calculator",
    category: "construction",
    subcategory: "reinforcement",
    description: "Estimate rebar weight, total length, and material cost.",
    keywords: ["rebar weight", "steel weight", "rebar pounds", "rebar cost"],
    workflowStages: ["reinforcement"],
    related: [
      "rebar-calculator",
      "rebar-spacing-for-concrete-slab",
      "rebar-lap-splice-calculator",
    ],
  },
  {
    id: "rebar-lap-splice-calculator",
    title: "Rebar Lap Splice Calculator",
    href: "/construction/rebar-lap-splice-calculator",
    category: "construction",
    subcategory: "reinforcement",
    description: "Estimate rebar lap length, added steel, weight, and material cost.",
    keywords: ["rebar lap", "lap splice", "rebar overlap", "splice length"],
    workflowStages: ["reinforcement"],
    related: [
      "rebar-calculator",
      "rebar-spacing-for-concrete-slab",
      "rebar-weight-calculator",
    ],
  },
  {
    id: "wire-mesh-calculator",
    title: "Wire Mesh Calculator",
    href: "/construction/wire-mesh-calculator",
    category: "construction",
    subcategory: "reinforcement",
    description: "Estimate welded wire mesh rolls or sheets for concrete slabs.",
    keywords: ["wire mesh", "welded wire mesh", "concrete mesh", "slab reinforcement"],
    workflowStages: ["reinforcement"],
    related: [
      "rebar-calculator",
      "rebar-spacing-for-concrete-slab",
      "concrete-calculator",
    ],
  },
  {
    id: "gravel-calculator",
    title: "Gravel Calculator",
    href: "/construction/gravel-calculator",
    category: "construction",
    subcategory: "aggregate",
    description: "Estimate gravel volume, cubic yards, tons, and material quantity.",
    keywords: ["gravel", "gravel calculator", "tons", "cubic yards", "base"],
    workflowStages: ["base"],
    related: [
      "road-base-calculator",
      "crushed-stone-calculator",
      "paver-base-calculator",
      "concrete-calculator",
    ],
    featured: true,
  },
  {
    id: "gravel-cost-calculator",
    title: "Gravel Cost Calculator",
    href: "/construction/gravel-cost-calculator",
    category: "construction",
    subcategory: "aggregate",
    description: "Estimate gravel quantity and total material cost.",
    keywords: ["gravel cost", "gravel price", "tons", "cubic yards"],
    workflowStages: ["base"],
    related: [
      "gravel-calculator",
      "gravel-driveway-calculator",
      "road-base-calculator",
    ],
  },
  {
    id: "gravel-driveway-calculator",
    title: "Gravel Driveway Calculator",
    href: "/construction/gravel-driveway-calculator",
    category: "construction",
    subcategory: "aggregate",
    description: "Estimate driveway gravel volume, tons, yards, and cost.",
    keywords: ["gravel driveway", "driveway gravel", "road base", "tons"],
    workflowStages: ["area", "base"],
    related: [
      "area-calculator",
      "road-base-calculator",
      "gravel-cost-calculator",
    ],
  },
  {
    id: "crushed-stone-calculator",
    title: "Crushed Stone Calculator",
    href: "/construction/crushed-stone-calculator",
    category: "construction",
    subcategory: "aggregate",
    description: "Estimate crushed stone cubic yards, tons, and cost.",
    keywords: ["crushed stone", "stone calculator", "aggregate", "tons"],
    workflowStages: ["base"],
    related: [
      "gravel-calculator",
      "road-base-calculator",
      "paver-base-calculator",
    ],
  },
  {
    id: "pea-gravel-calculator",
    title: "Pea Gravel Calculator",
    href: "/construction/pea-gravel-calculator",
    category: "construction",
    subcategory: "aggregate",
    description: "Estimate pea gravel volume, cubic yards, tons, and cost.",
    keywords: ["pea gravel", "gravel", "tons", "cubic yards"],
    workflowStages: ["base"],
    related: [
      "gravel-calculator",
      "river-rock-calculator",
      "drainage-rock-calculator",
    ],
  },
  {
    id: "river-rock-calculator",
    title: "River Rock Calculator",
    href: "/construction/river-rock-calculator",
    category: "construction",
    subcategory: "aggregate",
    description: "Estimate river rock volume, cubic yards, tons, and cost.",
    keywords: ["river rock", "landscape rock", "stone", "tons"],
    workflowStages: ["base"],
    related: [
      "gravel-calculator",
      "pea-gravel-calculator",
      "drainage-rock-calculator",
    ],
  },
  {
    id: "drainage-rock-calculator",
    title: "Drainage Rock Calculator",
    href: "/construction/drainage-rock-calculator",
    category: "construction",
    subcategory: "aggregate",
    description: "Estimate drainage-rock quantity, tons, volume, and cost.",
    keywords: ["drainage rock", "french drain", "drain rock", "tons"],
    workflowStages: ["base"],
    related: [
      "gravel-calculator",
      "river-rock-calculator",
      "crushed-stone-calculator",
    ],
  },
  {
    id: "decomposed-granite-calculator",
    title: "Decomposed Granite Calculator",
    href: "/construction/decomposed-granite-calculator",
    category: "construction",
    subcategory: "aggregate",
    description: "Estimate decomposed granite cubic yards, tons, and cost.",
    keywords: ["decomposed granite", "dg", "landscape base", "tons"],
    workflowStages: ["base"],
    related: [
      "gravel-calculator",
      "crushed-stone-calculator",
      "paver-base-calculator",
    ],
  },
  {
    id: "road-base-calculator",
    title: "Road Base Calculator",
    href: "/construction/road-base-calculator",
    category: "construction",
    subcategory: "aggregate",
    description: "Estimate road-base quantity in tons and cubic yards.",
    keywords: ["road base", "base material", "aggregate base", "tons"],
    workflowStages: ["base"],
    related: [
      "gravel-calculator",
      "gravel-driveway-calculator",
      "crushed-stone-calculator",
    ],
  },
  {
    id: "paver-base-calculator",
    title: "Paver Base Calculator",
    href: "/construction/paver-base-calculator",
    category: "construction",
    subcategory: "aggregate",
    description: "Estimate gravel base and bedding sand for paver projects.",
    keywords: ["paver base", "gravel base", "bedding sand", "pavers"],
    workflowStages: ["base"],
    related: [
      "area-calculator",
      "gravel-calculator",
      "crushed-stone-calculator",
    ],
  },
  {
    id: "concrete-driveway-calculator",
    title: "Concrete Driveway Calculator",
    href: "/construction/concrete-driveway-calculator",
    category: "construction",
    subcategory: "flatwork",
    description: "Estimate driveway concrete, base, reinforcement, labor, finishing, and cost.",
    keywords: ["concrete driveway", "driveway cost", "driveway concrete"],
    workflowStages: ["area", "base", "concrete-quantity", "reinforcement", "labor", "finishing"],
    related: [
      "area-calculator",
      "gravel-calculator",
      "concrete-calculator",
      "rebar-calculator",
      "concrete-finishing-cost-calculator",
    ],
  },
  {
    id: "concrete-patio-calculator",
    title: "Concrete Patio Calculator",
    href: "/construction/concrete-patio-calculator",
    category: "construction",
    subcategory: "flatwork",
    description: "Estimate patio concrete, base, reinforcement, labor, finishing, and cost.",
    keywords: ["concrete patio", "patio concrete", "patio cost"],
    workflowStages: ["area", "base", "concrete-quantity", "reinforcement", "labor", "finishing"],
    related: [
      "area-calculator",
      "gravel-calculator",
      "concrete-calculator",
      "rebar-calculator",
    ],
  },
  {
    id: "concrete-sidewalk-calculator",
    title: "Concrete Sidewalk Calculator",
    href: "/construction/concrete-sidewalk-calculator",
    category: "construction",
    subcategory: "flatwork",
    description: "Estimate sidewalk concrete, forms, base, labor, finishing, and cost.",
    keywords: ["concrete sidewalk", "sidewalk concrete", "sidewalk cost"],
    workflowStages: ["area", "base", "concrete-quantity", "formwork", "labor", "finishing"],
    related: [
      "concrete-calculator",
      "concrete-formwork-calculator",
      "concrete-finishing-cost-calculator",
    ],
  },
  {
    id: "concrete-pad-calculator",
    title: "Concrete Pad Calculator",
    href: "/construction/concrete-pad-calculator",
    category: "construction",
    subcategory: "flatwork",
    description: "Estimate concrete pad volume, base, forms, reinforcement, labor, and cost.",
    keywords: ["concrete pad", "equipment pad", "shed pad", "slab"],
    workflowStages: ["area", "base", "concrete-quantity", "reinforcement", "formwork"],
    related: [
      "concrete-calculator",
      "rebar-calculator",
      "concrete-formwork-calculator",
    ],
  },
  {
    id: "concrete-stairs-calculator",
    title: "Concrete Stairs Calculator",
    href: "/construction/concrete-stairs-calculator",
    category: "construction",
    subcategory: "flatwork",
    description: "Estimate concrete stairs, steps, forms, reinforcement, and cost.",
    keywords: ["concrete stairs", "concrete steps", "stair concrete", "steps"],
    workflowStages: ["concrete-quantity", "reinforcement", "formwork", "labor", "finishing"],
    related: [
      "concrete-calculator",
      "concrete-formwork-calculator",
      "rebar-calculator",
    ],
  },
  {
    id: "concrete-saw-cut-calculator",
    title: "Concrete Saw Cut Calculator",
    href: "/construction/concrete-saw-cut-calculator",
    category: "construction",
    subcategory: "joints",
    description: "Estimate saw-cut spacing, depth, linear feet, and cutting cost.",
    keywords: ["concrete saw cut", "saw cut spacing", "joint depth", "control joint"],
    workflowStages: ["joints"],
    related: [
      "concrete-control-joint-spacing",
      "concrete-expansion-joint-spacing",
      "concrete-finishing-cost-calculator",
    ],
    featured: true,
  },
  {
    id: "concrete-control-joint-spacing",
    title: "Concrete Control Joint Spacing Calculator",
    href: "/construction/concrete-control-joint-spacing",
    category: "construction",
    subcategory: "joints",
    description: "Estimate control-joint spacing, cut depth, panel layout, and cut length.",
    keywords: ["control joint", "joint spacing", "concrete joints", "saw cut"],
    workflowStages: ["joints"],
    related: [
      "concrete-saw-cut-calculator",
      "concrete-expansion-joint-spacing",
      "concrete-slab-thickness",
    ],
  },
  {
    id: "concrete-expansion-joint-spacing",
    title: "Concrete Expansion Joint Spacing Calculator",
    href: "/construction/concrete-expansion-joint-spacing",
    category: "construction",
    subcategory: "joints",
    description: "Estimate expansion-joint spacing, layout, material length, and cost.",
    keywords: ["expansion joint", "joint spacing", "isolation joint", "concrete joints"],
    workflowStages: ["joints"],
    related: [
      "concrete-control-joint-spacing",
      "concrete-saw-cut-calculator",
      "concrete-finishing-cost-calculator",
    ],
  },
  {
    id: "concrete-demolition-calculator",
    title: "Concrete Demolition Calculator",
    href: "/construction/concrete-demolition-calculator",
    category: "construction",
    subcategory: "demolition",
    description: "Estimate demolition time, concrete weight, crew requirements, and haul loads.",
    keywords: ["concrete demolition", "demo concrete", "breaking concrete", "haul loads"],
    workflowStages: ["demolition"],
    related: [
      "concrete-weight-calculator",
      "concrete-removal-cost-calculator",
      "concrete-saw-cut-calculator",
    ],
  },
  {
    id: "concrete-removal-cost-calculator",
    title: "Concrete Removal Cost Calculator",
    href: "/construction/concrete-removal-cost-calculator",
    category: "construction",
    subcategory: "demolition",
    description: "Estimate concrete demolition, haul-off, disposal, labor, and removal cost.",
    keywords: ["concrete removal", "demolition cost", "haul off", "disposal"],
    workflowStages: ["demolition", "removal"],
    related: [
      "concrete-demolition-calculator",
      "concrete-weight-calculator",
      "concrete-saw-cut-calculator",
    ],
  },
  {
    id: "lumber-calculator",
    title: "Lumber Calculator",
    href: "/construction/lumber-calculator",
    category: "construction",
    subcategory: "framing",
    description: "Estimate lumber quantity, board feet, waste, and material cost.",
    keywords: ["lumber", "board feet", "wood", "framing lumber"],
    workflowStages: ["framing"],
    related: [
      "stud-calculator",
      "wall-sheathing-calculator",
      "deck-materials-calculator",
    ],
    featured: true,
  },
  {
    id: "stud-calculator",
    title: "Stud Calculator",
    href: "/construction/stud-calculator",
    category: "construction",
    subcategory: "framing",
    description: "Estimate wall studs, plates, framing linear feet, and material cost.",
    keywords: ["studs", "wall framing", "2x4", "2x6", "framing"],
    workflowStages: ["framing"],
    related: [
      "lumber-calculator",
      "wall-sheathing-calculator",
      "drywall-calculator",
    ],
  },
  {
    id: "wall-sheathing-calculator",
    title: "Wall Sheathing Calculator",
    href: "/construction/wall-sheathing-calculator",
    category: "construction",
    subcategory: "framing",
    description: "Estimate wall sheathing panels, fasteners, waste, and cost.",
    keywords: ["wall sheathing", "osb", "plywood", "panels"],
    workflowStages: ["framing"],
    related: [
      "stud-calculator",
      "lumber-calculator",
      "drywall-calculator",
    ],
  },
  {
    id: "deck-materials-calculator",
    title: "Deck Materials Calculator",
    href: "/construction/deck-materials-calculator",
    category: "construction",
    subcategory: "framing",
    description: "Estimate deck boards, framing lumber, fasteners, waste, and cost.",
    keywords: ["deck materials", "deck boards", "joists", "framing"],
    workflowStages: ["framing"],
    related: [
      "lumber-calculator",
      "area-calculator",
    ],
  },
  {
    id: "roof-pitch-calculator",
    title: "Roof Pitch Calculator",
    href: "/construction/roof-pitch-calculator",
    category: "construction",
    subcategory: "roofing",
    description: "Calculate roof pitch, slope, angle, roof area, and rafter length.",
    keywords: ["roof pitch", "roof slope", "roof angle", "rafter"],
    workflowStages: ["measurement", "roofing"],
    related: [
      "roofing-calculator",
      "shingle-calculator",
    ],
    featured: true,
  },
  {
    id: "roofing-calculator",
    title: "Roofing Calculator",
    href: "/construction/roofing-calculator",
    category: "construction",
    subcategory: "roofing",
    description: "Estimate roof area, roofing squares, material quantities, and project cost.",
    keywords: ["roofing", "roof area", "roofing squares", "roof cost"],
    workflowStages: ["roofing"],
    related: [
      "roof-pitch-calculator",
      "shingle-calculator",
    ],
    featured: true,
  },
  {
    id: "shingle-calculator",
    title: "Shingle Calculator",
    href: "/construction/shingle-calculator",
    category: "construction",
    subcategory: "roofing",
    description: "Estimate shingle bundles, roofing squares, accessories, and material cost.",
    keywords: ["shingles", "shingle bundles", "roofing squares", "roof materials"],
    workflowStages: ["roofing"],
    related: [
      "roof-pitch-calculator",
      "roofing-calculator",
    ],
  },
  {
    id: "paint-calculator",
    title: "Paint Calculator",
    href: "/construction/paint-calculator",
    category: "construction",
    subcategory: "finishes",
    description: "Estimate paint gallons, primer, coverage, waste, and cost.",
    keywords: ["paint", "paint gallons", "primer", "coverage"],
    workflowStages: ["finishing"],
    related: [
      "area-calculator",
      "drywall-calculator",
    ],
  },
  {
    id: "drywall-calculator",
    title: "Drywall Calculator",
    href: "/construction/drywall-calculator",
    category: "construction",
    subcategory: "finishes",
    description: "Estimate drywall sheets, screws, tape, compound, waste, and cost.",
    keywords: ["drywall", "sheetrock", "drywall sheets", "screws"],
    workflowStages: ["finishing"],
    related: [
      "stud-calculator",
      "paint-calculator",
      "wall-sheathing-calculator",
    ],
  },
  {
    id: "flooring-calculator",
    title: "Flooring Calculator",
    href: "/construction/flooring-calculator",
    category: "construction",
    subcategory: "finishes",
    description: "Estimate flooring coverage, cartons, waste, and material cost.",
    keywords: ["flooring", "floor area", "cartons", "flooring waste"],
    workflowStages: ["finishing"],
    related: [
      "area-calculator",
      "tile-calculator",
    ],
  },
  {
    id: "tile-calculator",
    title: "Tile Calculator",
    href: "/construction/tile-calculator",
    category: "construction",
    subcategory: "finishes",
    description: "Estimate tile quantity, boxes, thinset, grout, waste, and cost.",
    keywords: ["tile", "tile boxes", "thinset", "grout"],
    workflowStages: ["finishing"],
    related: [
      "area-calculator",
      "flooring-calculator",
    ],
  },
  {
    id: "fence-calculator",
    title: "Fence Calculator",
    href: "/construction/fence-calculator",
    category: "construction",
    subcategory: "exterior",
    description: "Estimate fence posts, pickets, panels, rails, concrete, and cost.",
    keywords: ["fence", "fence posts", "pickets", "panels"],
    workflowStages: ["measurement", "framing"],
    related: [
      "area-calculator",
      "concrete-bag-calculator",
      "lumber-calculator",
    ],
  },
];

export function getCalculatorById(id: string) {
  return calculators.find((calculator) => calculator.id === id);
}

export function getCalculatorByHref(href: string) {
  return calculators.find((calculator) => calculator.href === href);
}

export function getCalculatorsByCategory(category: CalculatorCategory) {
  return calculators.filter((calculator) => calculator.category === category);
}

export function searchCalculators(query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return calculators;
  }

  return calculators.filter((calculator) => {
    const searchableText = [
      calculator.title,
      calculator.description ?? "",
      calculator.category,
      calculator.subcategory ?? "",
      ...calculator.keywords,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalized);
  });
}

export function getRelatedCalculators(
  calculatorId: string,
  limit = 6,
): CalculatorRecord[] {
  const current = getCalculatorById(calculatorId);

  if (!current || limit <= 0) {
    return [];
  }

  const results: CalculatorRecord[] = [];
  const seen = new Set<string>([current.id]);

  const addCalculator = (calculator: CalculatorRecord | undefined) => {
    if (!calculator || seen.has(calculator.id) || results.length >= limit) {
      return;
    }

    seen.add(calculator.id);
    results.push(calculator);
  };

  for (const relatedId of current.related ?? []) {
    addCalculator(getCalculatorById(relatedId));
  }

  if (results.length < limit && current.subcategory) {
    for (const calculator of calculators) {
      if (
        calculator.category === current.category &&
        calculator.subcategory === current.subcategory
      ) {
        addCalculator(calculator);
      }

      if (results.length >= limit) {
        break;
      }
    }
  }

  if (results.length < limit && current.workflowStages?.length) {
    const currentStages = new Set(current.workflowStages);

    for (const calculator of calculators) {
      if (
        calculator.category === current.category &&
        calculator.workflowStages?.some((stage) => currentStages.has(stage))
      ) {
        addCalculator(calculator);
      }

      if (results.length >= limit) {
        break;
      }
    }
  }

  if (results.length < limit) {
    for (const calculator of calculators) {
      if (calculator.category === current.category) {
        addCalculator(calculator);
      }

      if (results.length >= limit) {
        break;
      }
    }
  }

  return results;
}

export type CalculatorRegistryIssue = {
  type:
    | "duplicate-id"
    | "duplicate-href"
    | "missing-related-id"
    | "self-related";
  calculatorId: string;
  detail: string;
};

export function validateCalculatorRegistry(): CalculatorRegistryIssue[] {
  const issues: CalculatorRegistryIssue[] = [];

  const ids = new Set<string>();
  const hrefs = new Set<string>();
  const validIds = new Set(calculators.map((calculator) => calculator.id));

  for (const calculator of calculators) {
    if (ids.has(calculator.id)) {
      issues.push({
        type: "duplicate-id",
        calculatorId: calculator.id,
        detail: `Duplicate calculator id: ${calculator.id}`,
      });
    }

    ids.add(calculator.id);

    if (hrefs.has(calculator.href)) {
      issues.push({
        type: "duplicate-href",
        calculatorId: calculator.id,
        detail: `Duplicate calculator href: ${calculator.href}`,
      });
    }

    hrefs.add(calculator.href);

    for (const relatedId of calculator.related ?? []) {
      if (relatedId === calculator.id) {
        issues.push({
          type: "self-related",
          calculatorId: calculator.id,
          detail: `Calculator links to itself: ${relatedId}`,
        });
      }

      if (!validIds.has(relatedId)) {
        issues.push({
          type: "missing-related-id",
          calculatorId: calculator.id,
          detail: `Related calculator id does not exist: ${relatedId}`,
        });
      }
    }
  }

  return issues;
}
