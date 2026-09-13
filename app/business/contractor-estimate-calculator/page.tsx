import type { Metadata } from "next";
import Link from "next/link";
import ContractorEstimateCalculatorClient from "./ContractorEstimateCalculatorClient";

const url = "https://numeravo.com/business/contractor-estimate-calculator";

export const metadata: Metadata = {
  title: "Contractor Estimate Calculator | Cost, Markup & Price",
  description: "Build a contractor estimate from material, labor, equipment, subcontractor, overhead, contingency, markup, tax, and deposit inputs.",
  alternates: { canonical: url },
  openGraph: { title: "Contractor Estimate Calculator | Numeravo", description: "Estimate project cost, selling price, tax, profit, deposit, and balance due for a contracting job.", url, siteName: "Numeravo", type: "website" },
  twitter: { card: "summary_large_image", title: "Contractor Estimate Calculator | Numeravo", description: "Build a detailed contractor estimate and calculate cost, markup, tax, profit, deposit, and balance due." },
};

const schemas = [
  {
    "@context": "https://schema.org", "@type": "WebApplication", name: "Numeravo Contractor Estimate Calculator", url,
    description: metadata.description, applicationCategory: "BusinessApplication", operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: ["Material, labor, equipment, subcontractor, and other costs", "Overhead allocation", "Contingency", "Markup", "Sales tax", "Estimated gross profit and margin", "Deposit and balance due", "CSV export"],
  },
  {
    "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Business Calculators", item: "https://numeravo.com/business" },
      { "@type": "ListItem", position: 2, name: "Contractor Estimate Calculator", item: url },
    ],
  },
  {
    "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
      { "@type": "Question", name: "What should a contractor estimate include?", acceptedAnswer: { "@type": "Answer", text: "A complete estimate commonly includes materials, labor, equipment, subcontractors, other direct costs, overhead, contingency, profit or markup, applicable tax, and payment terms." } },
      { "@type": "Question", name: "What is the difference between markup and margin?", acceptedAnswer: { "@type": "Answer", text: "Markup is profit divided by cost, while margin is profit divided by selling price. The same percentage produces different selling prices depending on which method is used." } },
      { "@type": "Question", name: "Should sales tax be added to every estimate item?", acceptedAnswer: { "@type": "Answer", text: "Taxability varies by location, contract type, customer, and item. The calculator lets you estimate the taxable share, but you should verify the applicable rules for the job." } },
    ],
  },
];

export default function ContractorEstimateCalculatorPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] px-6 py-16 text-white">
      {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />)}
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb" className="text-sm text-[#A0AEC0]"><Link href="/business" className="hover:text-[#22D3EE]">Business Calculators</Link><span className="mx-2">/</span><span className="text-white">Contractor Estimate Calculator</span></nav>
        <header className="mt-8 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[.25em] text-[#22D3EE]">Contractor estimating</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Contractor Estimate Calculator</h1>
          <p className="mt-6 text-lg leading-8 text-[#A0AEC0]">Build a detailed job estimate from direct costs, overhead, contingency, markup, tax, and deposit terms. See the estimated customer price, gross profit, margin, deposit, and remaining balance as your inputs change.</p>
        </header>

        <ContractorEstimateCalculatorClient />

        <section className="mt-10 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
          <h2 className="text-2xl font-bold">How the contractor estimate is calculated</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Formula title="Direct cost">Sum of quantity × unit cost for every estimate line</Formula>
            <Formula title="Estimated project cost">Direct cost + overhead + contingency</Formula>
            <Formula title="Price before tax">Estimated project cost + markup</Formula>
            <Formula title="Estimated gross margin">Gross profit ÷ price before tax × 100</Formula>
          </div>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          <Info title="Use true labor cost">Use a burdened labor rate that includes payroll taxes, insurance, benefits, paid time off, and non-billable time—not wages alone.</Info>
          <Info title="Account for overhead">Include a reasonable allocation for office costs, vehicles, software, insurance, management, and other expenses not assigned directly to one job.</Info>
          <Info title="Verify tax treatment">Sales tax rules differ by jurisdiction and contract type. Confirm which labor, materials, and services are taxable before issuing a final estimate.</Info>
        </section>

        <section className="mt-10 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
          <h2 className="text-2xl font-bold">Estimate limitations and disclaimer</h2>
          <p className="mt-4 leading-7 text-[#A0AEC0]">Numeravo provides educational estimates based on the values entered. Results are not accounting, tax, legal, insurance, contracting, or pricing advice and do not replace a complete scope review, supplier quotes, subcontractor bids, contract terms, local tax rules, permit requirements, or professional judgment. Verify all quantities, costs, rates, exclusions, and customer terms before using an estimate.</p>
          <p className="mt-4 text-sm text-[#718096]">Created and maintained by Numeravo Technologies LLC.</p>
        </section>

        <section className="mt-10 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
          <h2 className="text-2xl font-bold">Related business calculators</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Related href="/business/contractor-job-profit-calculator">Contractor Job Profit Calculator</Related>
            <Related href="/business/contractor-overhead-calculator">Contractor Overhead Calculator</Related>
            <Related href="/business/contractor-labor-burden-calculator">Contractor Labor Burden Calculator</Related>
            <Related href="/business/pricing-calculator">Business Pricing Calculator</Related>
            <Related href="/business/profit-margin-calculator">Profit Margin Calculator</Related>
            <Related href="/business/sales-tax-calculator">Sales Tax Calculator</Related>
            <Related href="/business">All Business Calculators</Related>
          </div>
        </section>
      </div>
    </main>
  );
}

function Formula({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="rounded-2xl border border-[#1F2937] bg-[#0B0F19] p-5"><h3 className="font-semibold text-[#22D3EE]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#A0AEC0]">{children}</p></article>;
}
function Info({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="rounded-2xl border border-[#1F2937] bg-[#121826] p-5"><h2 className="font-semibold text-[#22D3EE]">{title}</h2><p className="mt-3 text-sm leading-6 text-[#A0AEC0]">{children}</p></article>;
}
function Related({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="rounded-xl border border-[#374151] px-5 py-3 font-semibold transition hover:border-[#06B6D4]">{children}</Link>;
}
