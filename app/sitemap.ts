import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://numeravo.com";

  const routes = [
    "",
    "/construction",
    "/construction/concrete-waste-calculator",
    "/construction/concrete-weight-calculator",
    "/construction/concrete-yard-calculator",
    "/construction/how-much-concrete-do-i-need",
    "/construction/concrete-calculator",
    "/construction/concrete-labor-cost-calculator",
    "/construction/concrete-finishing-cost-calculator",
    "/construction/concrete-pump-truck-cost-calculator",
    "/construction/concrete-saw-cut-calculator",
    "/construction/concrete-expansion-joint-spacing",
    "/construction/concrete-control-joint-spacing",
    "/construction/concrete-cost-calculator",
    "/construction/concrete-bag-calculator",
    "/construction/rebar-calculator",
    "/construction/rebar-lap-splice-calculator",
    "/construction/rebar-spacing-for-concrete-slab",
    "/construction/rebar-weight-calculator",
    "/construction/wire-mesh-calculator",
    "/construction/lumber-calculator",
    "/construction/stud-calculator",
    "/construction/wall-sheathing-calculator",
    "/construction/roof-pitch-calculator",
    "/construction/roofing-calculator",
    "/construction/shingle-calculator",
    "/construction/drywall-calculator",
    "/construction/paint-calculator",
    "/construction/flooring-calculator",
    "/construction/tile-calculator",
    "/construction/deck-materials-calculator",
    "/construction/fence-calculator",
    "/construction/concrete-delivery-cost-calculator",
    "/construction/concrete-driveway-calculator",
    "/construction/concrete-patio-calculator",
    "/construction/concrete-psi-calculator",
    "/construction/concrete-short-load-fee-calculator",
    "/construction/concrete-sidewalk-calculator",
    "/construction/concrete-pad-calculator",
    "/construction/concrete-stairs-calculator",
    "/construction/concrete-truckload-calculator",
    "/construction/concrete-mix-ratio",
    "/construction/concrete-slab-thickness",
    "/construction/concrete-cure-time",
    "/construction/concrete-cost-per-yard",
    "/construction/10x10-concrete-slab-cost",
    "/construction/12x12-concrete-slab-cost",
    "/construction/concrete-slab-calculator",
    "/construction/concrete-demolition-calculator",
    "/construction/concrete-removal-cost-calculator",
    "/construction/concrete-formwork-calculator",
    "/construction/concrete-footing-calculator",
    "/construction/sonotube-concrete-calculator",
    "/construction/concrete-wall-calculator",
    "/construction/gravel-calculator",
    "/construction/gravel-driveway-calculator",
    "/construction/gravel-driveway-cost",
    "/construction/gravel-cost-calculator",
    "/construction/how-much-gravel-do-i-need",
    "/construction/gravel-cost-per-ton",
    "/construction/pea-gravel-calculator",
    "/construction/river-rock-calculator",
    "/construction/drainage-rock-calculator",
    "/construction/decomposed-granite-calculator",
    "/construction/crushed-stone-vs-gravel",
    "/construction/crushed-stone-calculator",
    "/construction/road-base-calculator",
    "/construction/paver-base-calculator",
    "/construction/base-for-concrete-slab-depth",
    "/construction/how-to-prepare-ground-for-concrete-slab",
    "/finance",
    "/finance/loan-calculator",
    "/finance/mortgage-calculator",
    "/finance/compound-interest-calculator",
    "/finance/auto-loan-calculator",
    "/finance/credit-card-payoff-calculator",
    "/finance/savings-calculator",
    "/student",
    "/business",
    "/business/profit-margin-calculator",
    "/business/markup-calculator",
    "/business/break-even-calculator",
    "/business/pricing-calculator",
    "/business/contractor-job-profit-calculator",
    "/business/contractor-overhead-calculator",
    "/business/contractor-labor-burden-calculator",
    "/business/contractor-hourly-rate-calculator",
    "/business/contractor-estimate-calculator",
    "/business/sales-tax-calculator",
    "/converters",
    "/tools",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
  ];

  const categoryRoutes = new Set([
    "/construction",
    "/finance",
    "/student",
    "/business",
    "/converters",
    "/tools",
  ]);

  const legalRoutes = new Set([
    "/privacy-policy",
    "/terms",
  ]);

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority:
      route === ""
        ? 1
        : categoryRoutes.has(route)
          ? 0.9
          : legalRoutes.has(route)
            ? 0.3
            : route === "/about" || route === "/contact"
              ? 0.5
              : 0.8,
  }));
}