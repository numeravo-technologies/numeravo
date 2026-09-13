import type { Metadata } from "next";
import Link from "next/link";
import ContractorOverheadCalculatorClient from "./ContractorOverheadCalculatorClient";

const url = "https://numeravo.com/business/contractor-overhead-calculator";

export const metadata: Metadata = {
  title: "Contractor Overhead Calculator | Rate, Cost & Pricing",
  description: "Calculate monthly and annual contractor overhead, overhead percentage, cost per billable hour, cost per job, break-even revenue, and target-profit revenue.",
  alternates: { canonical: url },
  openGraph: {
    title: "Contractor Overhead Calculator | Numeravo",
    description: "Calculate contractor overhead rates, overhead per hour and job, break-even revenue, and the revenue required for a target profit.",
    url,
    siteName: "Numeravo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contractor Overhead Calculator | Numeravo",
    description: "Estimate contractor overhead rates and revenue requirements for more defensible pricing.",
  },
};

const faqs = [
  { question: "What is contractor overhead?", answer: "Contractor overhead includes necessary business expenses that cannot be assigned directly to one project, such as office payroll, rent, insurance, vehicles, software, accounting, and marketing." },
  { question: "How is an overhead percentage calculated?", answer: "This calculator divides annual overhead by annual revenue to show overhead as a percentage of revenue. It also divides overhead by direct job costs to estimate an overhead markup rate." },
  { question: "Should labor be included in overhead?", answer: "Direct field labor performed for a specific job normally belongs in direct job costs. Office, management, estimating, and administrative payroll commonly belongs in overhead, although accounting practices vary." },
  { question: "How do contractors allocate overhead to jobs?", answer: "Common allocation methods include a percentage of revenue, a markup on direct costs, a cost per billable labor hour, or a cost per job. The best method should reflect how the company actually uses resources." },
  { question: "Is overhead the same as profit?", answer: "No. Overhead pays indirect operating expenses. Profit remains only after revenue covers direct job costs, overhead, fees, and other applicable costs." },
  { question: "How often should overhead rates be updated?", answer: "Review overhead at least quarterly and whenever staffing, insurance, rent, vehicles, software, or expected revenue changes materially." },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Numeravo Contractor Overhead Calculator",
    url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: ["Monthly and annual overhead", "Overhead percentage of revenue", "Overhead markup on direct cost", "Overhead per billable hour", "Overhead per job", "Break-even revenue", "Target-profit revenue", "CSV export"],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Business Calculators", item: "https://numeravo.com/business" },
      { "@type": "ListItem", position: 2, name: "Contractor Overhead Calculator", item: url },
    ],
  },
];

export default function ContractorOverheadCalculatorPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] px-6 py-12 text-white md:py-16">
      {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="text-sm text-[#718096]">
          <Link href="/business" className="hover:text-[#22D3EE]">Business Calculators</Link><span className="mx-2">/</span><span className="text-white">Contractor Overhead Calculator</span>
        </nav>

        <header className="mt-6 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[.25em] text-[#22D3EE]">Contractor financial planning</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Contractor Overhead Calculator</h1>
          <p className="mt-5 text-lg leading-8 text-[#A0AEC0]">Calculate the real cost of keeping your contracting business open, then convert overhead into practical rates per dollar of revenue, direct cost, billable hour, and job.</p>
        </header>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Info title="Capture indirect costs">List recurring expenses that support the business but cannot be charged directly to one project.</Info>
          <Info title="Choose an allocation rate">Compare overhead as a percentage of revenue, a markup on direct costs, a cost per hour, and a cost per job.</Info>
          <Info title="Protect your profit">Estimate break-even revenue and the annual revenue required to reach your target profit margin.</Info>
        </div>

        <ContractorOverheadCalculatorClient />

        <Content title="What should a contractor include in overhead?">
          <p>Overhead generally includes the indirect costs required to operate the company: office and management payroll, payroll-related administrative costs, office or shop rent, utilities, general insurance, vehicle costs not assigned to jobs, software, phones, bookkeeping, legal services, licenses, advertising, and similar expenses.</p>
          <p>Materials, subcontractors, equipment rentals, permits, and field labor attributable to a specific project usually belong in direct job costs instead. Keeping direct and indirect costs separate makes job-cost reports and pricing decisions more useful.</p>
        </Content>

        <Content title="Contractor overhead formulas">
          <div className="grid gap-4 md:grid-cols-2">
            <Formula title="Annual overhead">Monthly overhead × 12</Formula>
            <Formula title="Overhead percentage of revenue">Annual overhead ÷ annual revenue × 100</Formula>
            <Formula title="Overhead markup on direct cost">Annual overhead ÷ annual direct costs × 100</Formula>
            <Formula title="Overhead per billable hour">Annual overhead ÷ annual billable hours</Formula>
            <Formula title="Overhead per job">Annual overhead ÷ annual number of jobs</Formula>
            <Formula title="Target-profit revenue">(Direct costs + overhead) ÷ (1 − target margin)</Formula>
          </div>
        </Content>

        <Content title="How to use the results">
          <p>No single allocation method is ideal for every contractor. A labor-heavy contractor may find overhead per billable hour useful, while a project-based company may prefer overhead per job. Revenue percentage and direct-cost markup methods work well for company-level planning and quick pricing checks.</p>
          <p>Compare calculated rates with completed-job results. If projects appear profitable before overhead but the business still loses money, overhead may be understated, billable-hour assumptions may be too high, or prices may not recover enough indirect cost.</p>
        </Content>

        <section className="mt-14 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
          <h2 className="text-2xl font-bold">Contractor overhead calculator FAQs</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => <article key={faq.question} className="rounded-2xl border border-[#1F2937] bg-[#0B0F19] p-5"><h3 className="font-semibold">{faq.question}</h3><p className="mt-3 text-sm leading-6 text-[#A0AEC0]">{faq.answer}</p></article>)}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
          <h2 className="text-2xl font-bold">Business-planning disclaimer</h2>
          <p className="mt-4 leading-7 text-[#A0AEC0]">Results are educational estimates and are not accounting, financial, tax, legal, contracting, or pricing advice. Overhead classifications and allocation methods vary by company and accounting policy. Verify your records and decisions with qualified professionals when appropriate.</p>
          <p className="mt-4 text-sm text-[#718096]">Created and maintained by Numeravo Technologies LLC.</p>
        </section>

        <section className="mt-10 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
          <h2 className="text-2xl font-bold">Related business calculators</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Related href="/business/contractor-job-profit-calculator">Contractor Job Profit Calculator</Related>
            <Related href="/business/pricing-calculator">Business Pricing Calculator</Related>
            <Related href="/business/break-even-calculator">Break-Even Calculator</Related>
            <Related href="/business/profit-margin-calculator">Profit Margin Calculator</Related>
            <Related href="/business/contractor-labor-burden-calculator">Contractor Labor Burden Calculator</Related><Related href="/business">All Business Calculators</Related>
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

function Formula({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-2xl border border-[#1F2937] bg-[#121826] p-5"><h3 className="font-semibold text-white">{title}</h3><p className="mt-2 text-sm text-[#22D3EE]">{children}</p></div>;
}

function Related({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="rounded-xl border border-[#374151] px-5 py-3 font-semibold hover:border-[#06B6D4]">{children}</Link>;
}
