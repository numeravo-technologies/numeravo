import Link from "next/link";

const calculators = [
  {
    title: "Profit Margin Calculator",
    description:
      "Calculate gross margin, markup, selling price, allowable cost, transaction fees, break-even price, discounts, and total profit.",
    href: "/business/profit-margin-calculator",
    status: "Live",
  },
  {
    title: "Markup Calculator",
    description:
      "Calculate selling price, markup, equivalent margin, transaction fees, discounts, break-even price, and quantity profit.",
    href: "/business/markup-calculator",
    status: "Live",
  },
  {
    title: "Break-Even Calculator",
    description:
      "Calculate break-even units and revenue, contribution margin, target-profit volume, margin of safety, daily sales requirements, and capacity.",
    href: "/business/break-even-calculator",
    status: "Live",
  },
  {
    title: "Business Pricing Calculator",
    description:
      "Build defensible product, service, wholesale, and project prices from true costs, overhead, payment fees, target margin, discounts, and quantity scenarios.",
    href: "/business/pricing-calculator",
    status: "Live",
  },
  {
    title: "Contractor Job Profit Calculator",
    description:
      "Compare estimated and actual job costs, revenue, profit, margin, change orders, overhead, fees, cost variance, target pricing, and break-even revenue.",
    href: "/business/contractor-job-profit-calculator",
    status: "Live",
  },
  {
    title: "Contractor Overhead Calculator",
    description:
      "Calculate monthly and annual overhead, overhead rates, cost per billable hour, cost per job, break-even revenue, and target-profit revenue.",
    href: "/business/contractor-overhead-calculator",
    status: "Live",
  },
  {
    title: "Contractor Labor Burden Calculator",
    description:
      "Calculate fully burdened labor cost, employer payroll taxes, workers’ compensation, benefits, billable-hour cost, and a target-margin billing rate.",
    href: "/business/contractor-labor-burden-calculator",
    status: "Live",
  },
  {
    title: "Contractor Estimate Calculator",
    description:
      "Build contractor estimates from materials, labor, equipment, subcontractors, overhead, contingency, markup, sales tax, and deposit requirements.",
    href: "/business/contractor-estimate-calculator",
    status: "Live",
  },
  {
    title: "Sales Tax Calculator",
    description:
      "Add or extract sales tax across taxable and non-taxable line items, combined jurisdiction rates, discounts, shipping, and tax-inclusive totals.",
    href: "/business/sales-tax-calculator",
    status: "Live",
  },
];

export const metadata = {
  title: "Business Calculators | Profit, Margin, Markup & Tax Tools",
  description:
    "Use Numeravo business calculators to estimate profit margin, markup, break-even points, pricing, sales tax, revenue, and business planning numbers.",
  alternates: {
    canonical: "https://numeravo.com/business",
  },
  openGraph: {
    title: "Business Calculators | Numeravo",
    description:
      "Calculate profit margin, markup, break-even points, sales tax, pricing, and business numbers with Numeravo.",
    url: "https://numeravo.com/business",
    siteName: "Numeravo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Business Calculators | Numeravo",
    description:
      "Fast business calculators for profit, margin, markup, break-even analysis, and sales tax.",
  },
};

export default function BusinessPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] px-6 py-16 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#06B6D4]">
            Business Calculators
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Business calculators for pricing, profit, and planning.
          </h1>

          <p className="mt-6 text-lg leading-8 text-[#A0AEC0]">
            Calculate margins, break-even points, taxes, pricing, and business
            numbers faster.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calculator) => (
            <Link
              key={calculator.href}
              href={calculator.href}
              className="rounded-2xl border border-[#1F2937] bg-[#121826] p-6 transition hover:border-[#06B6D4]"
            >
              <div className="mb-4 h-2 w-12 rounded-full bg-[#06B6D4]" />

              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold text-white">
                  {calculator.title}
                </h2>

                <span className="rounded-full border border-[#1F2937] px-3 py-1 text-xs text-[#A0AEC0]">
                  {calculator.status}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-[#A0AEC0]">
                {calculator.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}