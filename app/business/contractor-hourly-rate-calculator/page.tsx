import type { Metadata } from "next";
import Link from "next/link";
import ContractorHourlyRateCalculatorClient from "./ContractorHourlyRateCalculatorClient";

import CalculatorCanvas from "@/components/calculators/CalculatorCanvas";
const url =
  "https://numeravo.com/business/contractor-hourly-rate-calculator";

export const metadata: Metadata = {
  title: "Contractor Hourly Rate Calculator | Calculate Your Billing Rate",
  description:
    "Calculate a sustainable contractor hourly rate using labor cost, labor burden, overhead, billable hours, target profit margin, and payment processing fees.",
  alternates: {
    canonical: url,
  },
  openGraph: {
    title: "Contractor Hourly Rate Calculator | Numeravo",
    description:
      "Calculate the hourly rate your contracting business should charge based on labor, overhead, utilization, profit margin, and payment fees.",
    url,
    siteName: "Numeravo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contractor Hourly Rate Calculator | Numeravo",
    description:
      "Calculate a sustainable contractor billing rate from real labor and overhead costs.",
  },
};

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Numeravo Contractor Hourly Rate Calculator",
    url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Annual labor cost",
      "Labor burden",
      "Annual overhead allocation",
      "Billable hours",
      "Cost per billable hour",
      "Target profit margin",
      "Payment processing fees",
      "Recommended hourly billing rate",
      "Annual revenue target",
      "CSV export",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Business Calculators",
        item: "https://numeravo.com/business",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contractor Hourly Rate Calculator",
        item: url,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do contractors calculate an hourly rate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A sustainable contractor hourly rate should account for direct labor cost, employer labor burden, business overhead, billable utilization, desired profit margin, and applicable payment processing costs.",
        },
      },
      {
        "@type": "Question",
        name: "Why should overhead be included in an hourly rate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Overhead costs such as insurance, vehicles, office expenses, software, rent, administration, and professional services must ultimately be recovered through customer revenue. Allocating overhead across billable hours helps establish a more realistic minimum billing rate.",
        },
      },
      {
        "@type": "Question",
        name: "What is billable utilization?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Billable utilization is the percentage of available working hours that can actually be charged to customers. Travel, estimating, training, meetings, maintenance, administration, and downtime can reduce billable hours.",
        },
      },
      {
        "@type": "Question",
        name: "Does this calculator determine the market rate I should charge?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. The calculator estimates a financially sustainable internal billing benchmark. Market conditions, trade specialization, project risk, demand, geographic location, competition, and customer expectations may justify a different selling price.",
        },
      },
    ],
  },
];

export default function ContractorHourlyRateCalculatorPage() {
  return (
    <CalculatorCanvas theme="business" className="px-6 py-14">
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="text-sm text-[#A0AEC0]">
          <Link href="/business" className="hover:text-[#22D3EE]">
            Business Calculators
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">Contractor Hourly Rate Calculator</span>
        </nav>

        <header className="mt-8 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[.25em] text-[#22D3EE]">
            Contractor pricing
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Contractor Hourly Rate Calculator
          </h1>

          <p className="mt-6 text-lg leading-8 text-[#A0AEC0]">
            Calculate the hourly rate your contracting business needs to charge
            after labor cost, labor burden, business overhead, nonbillable time,
            profit margin, and payment processing fees.
          </p>
        </header>

        <ContractorHourlyRateCalculatorClient />

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          <Info title="Start with real labor cost">
            Include wages and employer labor burden rather than using the hourly
            wage alone.
          </Info>

          <Info title="Recover business overhead">
            Spread annual overhead across realistic billable hours so customer
            work contributes toward operating expenses.
          </Info>

          <Info title="Protect your margin">
            Add the profit margin and payment-fee allowance needed to reach a
            sustainable selling rate.
          </Info>
        </section>

        <section className="mt-10 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
          <h2 className="text-2xl font-bold">
            Contractor hourly rate formulas
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Formula title="Annual direct labor cost">
              Hourly wage × paid hours per year × (1 + labor burden rate)
            </Formula>

            <Formula title="Annual billable hours">
              Paid hours per year × billable utilization
            </Formula>

            <Formula title="Cost per billable hour">
              (Annual labor cost + allocated annual overhead) ÷ annual billable
              hours
            </Formula>

            <Formula title="Target-margin billing rate">
              Cost per billable hour ÷ (1 − target profit margin)
            </Formula>

            <Formula title="Rate including payment fees">
              Target-margin billing rate ÷ (1 − payment processing rate)
            </Formula>

            <Formula title="Annual revenue target">
              Final hourly billing rate × annual billable hours
            </Formula>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
          <h2 className="text-2xl font-bold">How to use the result</h2>

          <div className="mt-4 space-y-4 leading-7 text-[#A0AEC0]">
            <p>
              The calculated hourly rate is an internal pricing benchmark. It
              represents the approximate rate needed for billable labor to
              recover the costs entered and achieve the selected target margin.
            </p>

            <p>
              Contractors may charge more or less depending on trade,
              specialization, project complexity, crew size, travel, equipment,
              supervision, risk, warranties, geographic market, and demand.
              Project-based pricing may also produce a different effective
              hourly rate.
            </p>

            <p>
              Use realistic billable utilization. Assuming every paid working
              hour can be billed to customers can significantly understate the
              rate required to cover nonbillable estimating, administration,
              travel, training, maintenance, meetings, and downtime.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
          <h2 className="text-2xl font-bold">Pricing disclaimer</h2>

          <p className="mt-4 leading-7 text-[#A0AEC0]">
            Numeravo provides educational planning estimates based on the values
            entered. Results are not accounting, tax, payroll, legal,
            employment, insurance, financial, or pricing advice. Actual costs,
            taxes, insurance rates, employee classifications, market pricing,
            and business requirements vary. Verify important business decisions
            with qualified professionals.
          </p>

          <p className="mt-4 text-sm text-[#718096]">
            Created and maintained by Numeravo Technologies LLC.
          </p>
        </section>

        <section className="mt-10 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
          <h2 className="text-2xl font-bold">Related business calculators</h2>

          <div className="mt-5 flex flex-wrap gap-3">
            <Related href="/business/contractor-labor-burden-calculator">
              Contractor Labor Burden Calculator
            </Related>

            <Related href="/business/contractor-overhead-calculator">
              Contractor Overhead Calculator
            </Related>

            <Related href="/business/contractor-estimate-calculator">
              Contractor Estimate Calculator
            </Related>

            <Related href="/business/contractor-job-profit-calculator">
              Contractor Job Profit Calculator
            </Related>

            <Related href="/business/pricing-calculator">
              Business Pricing Calculator
            </Related>

            <Related href="/business">
              All Business Calculators
            </Related>
          </div>
        </section>
      </div>
    </CalculatorCanvas>
  );
}

function Info({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-[#1F2937] bg-[#121826] p-5">
      <h2 className="font-semibold text-[#22D3EE]">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#A0AEC0]">{children}</p>
    </article>
  );
}

function Formula({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#1F2937] bg-[#0B0F19] p-5">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#A0AEC0]">{children}</p>
    </div>
  );
}

function Related({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-[#374151] px-5 py-3 font-semibold hover:border-[#06B6D4]"
    >
      {children}
    </Link>
  );
}
