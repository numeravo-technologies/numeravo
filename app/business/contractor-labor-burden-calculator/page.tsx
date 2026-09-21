import type { Metadata } from "next";
import Link from "next/link";
import ContractorLaborBurdenCalculatorClient from "./ContractorLaborBurdenCalculatorClient";

import CalculatorCanvas from "@/components/calculators/CalculatorCanvas";
const url = "https://numeravo.com/business/contractor-labor-burden-calculator";

export const metadata: Metadata = {
  title: "Contractor Labor Burden Calculator | True Labor Cost",
  description: "Calculate fully burdened labor cost, employer taxes, workers’ compensation, benefits, billable-hour cost, and a target-margin billing rate.",
  alternates: { canonical: url },
  openGraph: { title: "Contractor Labor Burden Calculator | Numeravo", description: "Estimate the true hourly cost of an employee and a sustainable contractor billing rate.", url, siteName: "Numeravo", type: "website" },
  twitter: { card: "summary_large_image", title: "Contractor Labor Burden Calculator | Numeravo", description: "Calculate labor burden, true employee cost, and a target-margin billing rate." },
};

const schemas = [
  { "@context": "https://schema.org", "@type": "WebApplication", name: "Numeravo Contractor Labor Burden Calculator", url, applicationCategory: "BusinessApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, featureList: ["Annual employer cost", "Labor burden rate", "Payroll taxes", "Workers’ compensation", "Benefits and paid time off", "Billable utilization", "Cost per billable hour", "Target-margin billing rate", "CSV export"] },
  { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Business Calculators", item: "https://numeravo.com/business" }, { "@type": "ListItem", position: 2, name: "Contractor Labor Burden Calculator", item: url }] },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
    { "@type": "Question", name: "What is labor burden?", acceptedAnswer: { "@type": "Answer", text: "Labor burden is the employer cost above base wages, such as payroll taxes, workers’ compensation, insurance, benefits, paid leave, training, tools, and other employee-related expenses." } },
    { "@type": "Question", name: "Why is cost per billable hour higher than hourly wage?", acceptedAnswer: { "@type": "Answer", text: "The business pays for nonbillable time and employer expenses in addition to wages. Dividing total annual employer cost by actual billable hours produces a more realistic cost per billable hour." } },
    { "@type": "Question", name: "Does this calculator provide payroll or tax advice?", acceptedAnswer: { "@type": "Answer", text: "No. It provides planning estimates only. Applicable taxes, insurance rates, benefit costs, and employment requirements vary by worker, company, state, and jurisdiction." } },
  ] },
];

export default function ContractorLaborBurdenCalculatorPage() {
  return <CalculatorCanvas theme="business" className="px-6 py-14">
    {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
    <div className="mx-auto max-w-6xl">
      <nav aria-label="Breadcrumb" className="text-sm text-[#A0AEC0]"><Link href="/business" className="hover:text-[#22D3EE]">Business Calculators</Link><span className="mx-2">/</span><span className="text-white">Contractor Labor Burden Calculator</span></nav>
      <header className="mt-8 max-w-4xl"><p className="text-sm font-semibold uppercase tracking-[.25em] text-[#22D3EE]">Contractor workforce planning</p><h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Contractor Labor Burden Calculator</h1><p className="mt-6 text-lg leading-8 text-[#A0AEC0]">Estimate the real annual and hourly cost of an employee after employer payroll taxes, workers’ compensation, benefits, paid time off, training, tools, and other labor expenses. Then translate that cost into a sustainable billing rate.</p></header>
      <ContractorLaborBurdenCalculatorClient />
      <section className="mt-10 grid gap-5 md:grid-cols-3"><Info title="Start with wages">Hourly wage multiplied by annual paid hours gives base wages before employer-paid labor costs.</Info><Info title="Add the burden">Taxes, insurance, benefits, paid leave, tools, and training increase the real cost of employing a worker.</Info><Info title="Account for utilization">Only a portion of paid hours may be billable. The calculator spreads total employer cost across estimated billable hours.</Info></section>
      <section className="mt-10 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8"><h2 className="text-2xl font-bold">Labor burden formulas</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><Formula title="Annual employer cost">Base wages + payroll taxes + workers’ compensation + unemployment taxes + benefits + other employee costs</Formula><Formula title="Labor burden rate">Labor burden ÷ base wages × 100</Formula><Formula title="Cost per billable hour">Annual employer cost ÷ annual billable hours</Formula><Formula title="Target-margin billing rate">Cost per billable hour ÷ (1 − target margin)</Formula></div></section>
      <section className="mt-10 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8"><h2 className="text-2xl font-bold">How to use the result</h2><div className="mt-4 space-y-4 leading-7 text-[#A0AEC0]"><p>Use the fully burdened cost—not the wage alone—when estimating project labor. Understating employee cost can make profitable-looking jobs lose money after payroll taxes, insurance, benefits, nonbillable time, and field support costs are paid.</p><p>The recommended billing rate uses your target profit margin and expected billable utilization. It is a planning benchmark, not a required market price. Compare it with overhead allocation, job risk, supervision, travel, equipment, and local market conditions before preparing an estimate.</p></div></section>
      <section className="mt-10 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8"><h2 className="text-2xl font-bold">Employment-cost disclaimer</h2><p className="mt-4 leading-7 text-[#A0AEC0]">Numeravo provides educational estimates based on the values entered. Results are not payroll, accounting, tax, insurance, employment-law, legal, or pricing advice. Rates and obligations vary by employee classification, state, jurisdiction, insurer, benefit plan, and company. Verify actual costs and requirements with qualified payroll, accounting, insurance, and legal professionals.</p><p className="mt-4 text-sm text-[#718096]">Created and maintained by Numeravo Technologies LLC.</p></section>
      <section className="mt-10 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8"><h2 className="text-2xl font-bold">Related business calculators</h2><div className="mt-5 flex flex-wrap gap-3"><Related href="/business/contractor-overhead-calculator">Contractor Overhead Calculator</Related><Related href="/business/contractor-job-profit-calculator">Contractor Job Profit Calculator</Related><Related href="/business/pricing-calculator">Business Pricing Calculator</Related><Related href="/business/break-even-calculator">Break-Even Calculator</Related><Related href="/business/contractor-estimate-calculator">Contractor Estimate Calculator</Related><Related href="/business/contractor-hourly-rate-calculator">Contractor Hourly Rate Calculator</Related><Related href="/business">All Business Calculators</Related></div></section>
    </div>
  </CalculatorCanvas>;
}

function Info({ title, children }: { title: string; children: React.ReactNode }) { return <article className="rounded-2xl border border-[#1F2937] bg-[#121826] p-5"><h2 className="font-semibold text-[#22D3EE]">{title}</h2><p className="mt-3 text-sm leading-6 text-[#A0AEC0]">{children}</p></article>; }
function Formula({ title, children }: { title: string; children: React.ReactNode }) { return <div className="rounded-2xl border border-[#1F2937] bg-[#0B0F19] p-5"><h3 className="font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-[#A0AEC0]">{children}</p></div>; }
function Related({ href, children }: { href: string; children: React.ReactNode }) { return <Link href={href} className="rounded-xl border border-[#374151] px-5 py-3 font-semibold hover:border-[#06B6D4]">{children}</Link>; }
