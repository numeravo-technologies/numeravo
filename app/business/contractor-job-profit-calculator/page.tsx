import type { Metadata } from "next";
import Link from "next/link";
import ContractorJobProfitCalculatorClient from "./ContractorJobProfitCalculatorClient";

const url = "https://numeravo.com/business/contractor-job-profit-calculator";

export const metadata: Metadata = {
  title: "Contractor Job Profit Calculator | Job Cost & Margin",
  description: "Compare estimated and actual contractor job costs, revenue, overhead, fees, profit margin, cost variance, break-even revenue, and target pricing.",
  alternates: { canonical: url },
  openGraph: {
    title: "Contractor Job Profit Calculator | Numeravo",
    description: "Track estimated versus actual job costs, profit, margins, change orders, overhead, payment fees, and pricing targets.",
    url,
    siteName: "Numeravo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contractor Job Profit Calculator | Numeravo",
    description: "Analyze contractor job costs, cost variance, profit margin, break-even revenue, and required pricing.",
  },
};

const faqs = [
  { question: "How do contractors calculate profit on a job?", answer: "Subtract complete job costs—including labor, materials, equipment, subcontractors, permits, allocated overhead, and applicable payment fees—from contract revenue. Divide the resulting profit by revenue to calculate profit margin." },
  { question: "What is the difference between markup and profit margin?", answer: "Markup measures profit relative to cost, while profit margin measures profit relative to selling price. A 25% markup does not produce a 25% profit margin." },
  { question: "Should contractor labor include payroll burden?", answer: "For a useful job-cost analysis, labor should generally include wages plus employer payroll taxes, workers’ compensation, benefits, and other labor burden attributable to the work." },
  { question: "How should overhead be included in job costing?", answer: "Allocate a reasonable share of indirect operating expenses—such as office payroll, insurance, vehicles, software, rent, and administration—to jobs using a consistent method." },
  { question: "Do change orders increase job profit?", answer: "Only when the added revenue exceeds the added direct costs, overhead, fees, and risk created by the changed scope. Enter approved change-order revenue and update the related costs." },
  { question: "What does a positive cost variance mean?", answer: "In this calculator, a positive cost variance means actual total cost is higher than estimated total cost. A negative variance means the job is currently under its estimated cost." },
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Numeravo Contractor Job Profit Calculator",
    url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: ["Estimated and actual job costing", "Labor and material cost tracking", "Overhead and contingency", "Change orders", "Payment fees", "Cost and profit variance", "Target-margin pricing", "Break-even revenue", "CSV export"],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Business Calculators", item: "https://numeravo.com/business" },
      { "@type": "ListItem", position: 2, name: "Contractor Job Profit Calculator", item: url },
    ],
  },
];

export default function ContractorJobProfitCalculatorPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] px-6 py-12 text-white sm:py-16">
      {structuredData.map((data, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />)}
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb" className="text-sm text-[#718096]">
          <Link href="/business" className="hover:text-[#22D3EE]">Business Calculators</Link><span className="mx-2">/</span><span className="text-white">Contractor Job Profit Calculator</span>
        </nav>

        <header className="mt-8 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[.25em] text-[#22D3EE]">Contractor job costing</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Contractor Job Profit Calculator</h1>
          <p className="mt-6 text-lg leading-8 text-[#A0AEC0]">Compare estimated and actual job costs, expose margin erosion, account for overhead and fees, and calculate the revenue required to protect your target profit margin.</p>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Info title="Price the complete job">Include direct costs, allocated overhead, contingency, and payment fees before deciding what to charge.</Info>
          <Info title="Track estimate versus actual">See whether labor, materials, equipment, subcontractors, and other costs are running over or under budget.</Info>
          <Info title="Protect contractor margin">Compare expected and actual profit, calculate break-even revenue, and find the price required for a target margin.</Info>
        </section>

        <ContractorJobProfitCalculatorClient />

        <Content title="How to calculate profit on a contractor job">
          <p>Start with total contract revenue, including the original accepted price and approved change orders. Then subtract every cost required to deliver the work. Direct job costs commonly include labor, materials, equipment, rentals, subcontractors, permits, inspections, disposal, freight, and project-specific expenses.</p>
          <p>A complete analysis should also allocate overhead and account for payment-processing fees. Profit equals contract revenue minus total job cost. Profit margin equals profit divided by contract revenue, multiplied by 100.</p>
        </Content>

        <Content title="Estimated profit versus actual profit">
          <p>Estimated profit describes the expected result using budgeted costs. Actual profit uses recorded job costs. Comparing the two helps identify cost overruns, missed scope, weak pricing, purchasing problems, labor-productivity issues, and unapproved change-order work.</p>
          <p>Update actual costs throughout the project instead of waiting until closeout. Early visibility gives a contractor more time to correct field performance, document changed conditions, invoice approved work, and manage remaining commitments.</p>
        </Content>

        <Content title="Costs contractors frequently miss">
          <ul className="grid gap-3 sm:grid-cols-2">
            {["Payroll taxes, benefits, and workers’ compensation", "Small tools, equipment mobilization, and fuel", "Freight, delivery, disposal, and material waste", "Supervision, estimating, administration, and insurance", "Permits, inspections, testing, and bonds", "Payment fees, warranty exposure, callbacks, and rework"].map(item => <li key={item} className="rounded-xl border border-[#1F2937] bg-[#121826] p-4">{item}</li>)}
          </ul>
        </Content>

        <section className="mt-14 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
          <h2 className="text-2xl font-bold">Contractor job profit calculator FAQs</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">{faqs.map(faq => <article key={faq.question} className="rounded-2xl border border-[#1F2937] bg-[#0B0F19] p-5"><h3 className="font-semibold">{faq.question}</h3><p className="mt-3 text-sm leading-6 text-[#A0AEC0]">{faq.answer}</p></article>)}</div>
        </section>

        <section className="mt-10 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
          <h2 className="text-2xl font-bold">Job-costing disclaimer</h2>
          <p className="mt-4 leading-7 text-[#A0AEC0]">Results are educational estimates and are not accounting, tax, legal, contracting, or financial advice. Actual profitability depends on complete and accurate job-cost records, contract terms, billing, collections, tax treatment, overhead allocation, warranty obligations, and other factors. Verify material decisions with qualified professionals when appropriate.</p>
          <p className="mt-4 text-sm text-[#718096]">Created and maintained by Numeravo Technologies LLC.</p>
        </section>

        <section className="mt-10 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
          <h2 className="text-2xl font-bold">Related business calculators</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Related href="/business/pricing-calculator">Business Pricing Calculator</Related>
            <Related href="/business/profit-margin-calculator">Profit Margin Calculator</Related>
            <Related href="/business/markup-calculator">Markup Calculator</Related>
            <Related href="/business/break-even-calculator">Break-Even Calculator</Related>
            <Related href="/business/sales-tax-calculator">Sales Tax Calculator</Related>
            <Related href="/business/contractor-overhead-calculator">Contractor Overhead Calculator</Related><Related href="/business/contractor-labor-burden-calculator">Contractor Labor Burden Calculator</Related><Related href="/business">All Business Calculators</Related>
          </div>
        </section>
      </div>
    </main>
  );
}

function Info({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="rounded-2xl border border-[#1F2937] bg-[#121826] p-5"><h2 className="font-semibold text-[#22D3EE]">{title}</h2><p className="mt-3 text-sm leading-6 text-[#A0AEC0]">{children}</p></article>;
}

function Content({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mt-12 max-w-4xl"><h2 className="text-2xl font-bold">{title}</h2><div className="mt-4 space-y-4 leading-7 text-[#A0AEC0]">{children}</div></section>;
}

function Related({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="rounded-xl border border-[#374151] px-5 py-3 font-semibold hover:border-[#06B6D4]">{children}</Link>;
}
