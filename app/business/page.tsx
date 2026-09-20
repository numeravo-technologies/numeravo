import Link from "next/link";
import CategoryPageShell from "@/components/categories/CategoryPageShell";

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
    title: "Contractor Hourly Rate Calculator",
    description:
      "Calculate a sustainable contractor billing rate from labor cost, labor burden, overhead, billable utilization, target profit margin, and payment processing fees.",
    href: "/business/contractor-hourly-rate-calculator",
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
  title: "Business Calculators | Contractor Pricing, Profit & Margin Tools",
  description:
    "Use Numeravo business calculators for contractor pricing, hourly rates, estimates, labor burden, overhead, profit margin, markup, break-even analysis, and sales tax.",
  alternates: {
    canonical: "https://numeravo.com/business",
  },
  openGraph: {
    title: "Business Calculators | Numeravo",
    description:
      "Calculate contractor pricing, hourly rates, estimates, profit margin, markup, break-even points, overhead, labor burden, and sales tax with Numeravo.",
    url: "https://numeravo.com/business",
    siteName: "Numeravo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Business Calculators | Numeravo",
    description:
      "Business calculators for contractor pricing, hourly rates, profit, margin, markup, break-even analysis, overhead, labor burden, and sales tax.",
  },
};

const calculatorGroups = [
  {
    title: "Pricing & Estimating",
    description:
      "Build prices, billing rates, estimates, overhead recovery, and fully burdened labor costs.",
    calculators: calculators.filter((calculator) =>
      [
        "/business/pricing-calculator",
        "/business/contractor-hourly-rate-calculator",
        "/business/contractor-estimate-calculator",
        "/business/contractor-overhead-calculator",
        "/business/contractor-labor-burden-calculator",
      ].includes(calculator.href),
    ),
  },
  {
    title: "Profitability & Break-Even",
    description:
      "Analyze margins, markup, job profitability, contribution margin, and break-even performance.",
    calculators: calculators.filter((calculator) =>
      [
        "/business/profit-margin-calculator",
        "/business/markup-calculator",
        "/business/break-even-calculator",
        "/business/contractor-job-profit-calculator",
      ].includes(calculator.href),
    ),
  },
  {
    title: "Tax",
    description:
      "Calculate sales tax for taxable and non-taxable transactions and tax-inclusive pricing.",
    calculators: calculators.filter((calculator) =>
      ["/business/sales-tax-calculator"].includes(calculator.href),
    ),
  },
];

const businessCollectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Numeravo Business Calculators",
  url: "https://numeravo.com/business",
  description:
    "Business calculators for contractor pricing, hourly rates, estimates, labor burden, overhead, profit margin, markup, break-even analysis, and sales tax.",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: calculators.length,
    itemListElement: calculators.map((calculator, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: calculator.title,
      url: `https://numeravo.com${calculator.href}`,
    })),
  },
};

export default function BusinessPage() {
  return (
    <CategoryPageShell theme="business">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(businessCollectionSchema).replace(/</g, "\\u003c"),
        }}
      />
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

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#1F2937] bg-[#121826] p-5">
            <p className="text-sm text-[#A0AEC0]">Price the work</p>
            <p className="mt-2 font-semibold text-white">
              Rates, estimates, and overhead
            </p>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#121826] p-5">
            <p className="text-sm text-[#A0AEC0]">Measure performance</p>
            <p className="mt-2 font-semibold text-white">
              Margin, profit, and break-even
            </p>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#121826] p-5">
            <p className="text-sm text-[#A0AEC0]">Plan the numbers</p>
            <p className="mt-2 font-semibold text-white">
              Costs, labor, and tax
            </p>
          </div>
        </div>

        <div className="mt-14 space-y-12">
          {calculatorGroups.map((group) => (
            <section key={group.title}>
              <div className="mb-5 max-w-3xl">
                <div className="mb-3 h-1.5 w-10 rounded-full bg-[#06B6D4]" />
                <h2 className="text-2xl font-bold text-white">
                  {group.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#A0AEC0]">
                  {group.description}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {group.calculators.map((calculator) => (
                  <Link
                    key={calculator.href}
                    href={calculator.href}
                    className="group rounded-2xl border border-[#1F2937] bg-[#121826] p-6 transition hover:-translate-y-1 hover:border-[#06B6D4]"
                  >
                    <div className="mb-4 h-2 w-12 rounded-full bg-[#06B6D4]" />

                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-semibold text-white">
                        {calculator.title}
                      </h3>

                      <span className="rounded-full border border-[#1F2937] px-3 py-1 text-xs text-[#A0AEC0]">
                        {calculator.status}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-[#A0AEC0]">
                      {calculator.description}
                    </p>

                    <p className="mt-5 text-sm font-semibold text-[#06B6D4]">
                      Open calculator →
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </CategoryPageShell>
  );
}
