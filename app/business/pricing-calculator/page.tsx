import type { Metadata } from "next";
import Link from "next/link";
import PricingCalculatorClient from "./PricingCalculatorClient";

const url = "https://numeravo.com/business/pricing-calculator";

export const metadata: Metadata = {
  title: "Business Pricing Calculator: Cost, Margin & Selling Price",
  description: "Calculate a recommended selling price from materials, labor, overhead, contingency, payment fees, and target margin. Test discounts, tax, quantity profit, and break-even pricing.",
  alternates: { canonical: url },
  openGraph: {
    title: "Business Pricing Calculator | Numeravo",
    description: "Build a defensible selling price from true costs, overhead, fees, and target profit margin.",
    url,
    siteName: "Numeravo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Business Pricing Calculator | Numeravo",
    description: "Estimate selling price, profit, margin, markup, break-even price, discounts, and quantity results.",
  },
};

const faqs = [
  { question: "How do I calculate a selling price from a target margin?", answer: "Add the costs required to deliver the product or service, include contingency and overhead, account for selling fees, and divide by the portion of revenue left after the desired margin and percentage fee. Numeravo solves the price algebraically so the selected margin remains after estimated processing fees." },
  { question: "What is the difference between margin and markup?", answer: "Profit margin divides profit by selling price. Markup divides profit by cost. The same transaction therefore has different margin and markup percentages. A 25% margin is not the same as a 25% markup." },
  { question: "Should labor be included in product or service pricing?", answer: "Yes. Use a loaded labor rate that reflects wages plus applicable payroll costs, benefits, insurance, supervision, and other labor burden when those costs are relevant to the work." },
  { question: "How should overhead be included?", answer: "Allocate a reasonable portion of indirect operating expenses such as office costs, software, vehicles, administration, insurance, and management. This calculator applies the entered overhead percentage after direct costs and contingency." },
  { question: "Does sales tax count as revenue or profit?", answer: "Sales tax collected for a taxing authority is generally added after the pre-tax selling price and should not be treated as business profit. Taxability and sourcing rules vary, so verify the correct treatment with the relevant authority or a qualified tax professional." },
  { question: "What is the break-even price?", answer: "The estimated break-even price covers the entered costs and transaction fee but produces no profit. Pricing at break-even leaves no allowance for estimating errors or unexpected expenses." },
  { question: "What does maximum estimated discount mean?", answer: "It is the calculated discount that would reduce the recommended price to the estimated break-even price. It is a guardrail, not a recommended promotion, because it eliminates projected profit." },
  { question: "Can this calculator replace an estimate or accounting review?", answer: "No. It is an educational planning tool. Verify cost inputs, contracts, tax treatment, fee schedules, market conditions, and pricing decisions with appropriate professionals." },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Numeravo Business Pricing Calculator",
    url,
    description: metadata.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: ["Product and service pricing modes", "Reverse price analysis", "Cost-based pricing", "Target margin pricing", "Pricing scenario comparison", "Overhead and contingency", "Payment fee calculation", "Discount testing", "Break-even price", "Quantity projections", "CSV export", "Printable pricing summary"],
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Business Calculators", item: "https://numeravo.com/business" },
      { "@type": "ListItem", position: 2, name: "Business Pricing Calculator", item: url },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0B0F19] px-6 py-12 text-white">
      {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />)}
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="text-sm text-[#A0AEC0]">
          <Link href="/business" className="hover:text-[#22D3EE]">Business Calculators</Link><span className="mx-2">/</span><span className="text-white">Business Pricing Calculator</span>
        </nav>

        <header className="mt-8 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[.25em] text-[#22D3EE]">Business pricing tool</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Business Pricing Calculator</h1>
          <p className="mt-6 text-lg leading-8 text-[#A0AEC0]">Build a recommended selling price from materials, labor, equipment, subcontractors, contingency, overhead, payment fees, and target profit margin. Test discounts and quantity scenarios before quoting a customer or setting a product price.</p>
        </header>

        <div className="mt-10"><PricingCalculatorClient /></div>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          <Info title="True cost before price">Include direct costs, labor, contingency, and allocated overhead. Leaving out operating costs can make an apparently profitable sale lose money.</Info>
          <Info title="Margin is based on revenue">Margin equals profit divided by selling price. Markup equals profit divided by cost, so the two percentages should never be used interchangeably.</Info>
          <Info title="Fees change the required price">A percentage processing fee rises with the selling price. The calculator solves for the price required to preserve the selected margin after that fee.</Info>
        </section>

        <Content title="How to use the business pricing calculator">
          <p>Enter the costs that are directly attributable to one product, service, project, or job. Labor is calculated from hours multiplied by the loaded hourly rate. Add contingency for foreseeable estimating uncertainty and allocate overhead to represent indirect business expenses.</p>
          <p>Then enter the desired profit margin and any payment-processing fee. The recommended price is the estimated pre-tax amount needed to cover those inputs while preserving the selected margin. Use the discount slider to see whether a proposed promotion remains profitable.</p>
        </Content>

        <Content title="Pricing formula used">
          <p>Direct cost equals materials plus labor, equipment, subcontractors, shipping, and other entered costs. Contingency is applied to direct cost. Overhead is then applied to direct cost plus contingency.</p>
          <p>Recommended price = (total estimated cost + fixed transaction fee) ÷ (1 − target margin rate − percentage transaction-fee rate). Sales tax is calculated separately and added to the customer total.</p>
        </Content>

        <Content title="Margin, markup, and selling price explained">
          <p><strong className="text-white">Selling price</strong> is the amount charged before separately added sales tax. <strong className="text-white">Profit</strong> is selling price minus costs and applicable selling fees. <strong className="text-white">Margin</strong> expresses profit as a percentage of selling price, while <strong className="text-white">markup</strong> expresses profit as a percentage of cost.</p>
          <p>For example, an item that costs $75 and sells for $100 produces $25 of profit. That is a 25% margin but a 33.33% markup. Confusing these measurements can lead to underpricing.</p>
        </Content>

        <Content title="What to include in a loaded labor rate">
          <p>A loaded labor rate may include base wages plus employer payroll taxes, workers’ compensation, benefits, paid time off, training, supervision, and other labor-related costs. The correct components depend on the business and the purpose of the estimate. Do not use wage alone when the business incurs additional costs for each labor hour.</p>
        </Content>

        <Content title="Pricing decisions beyond the formula">
          <p>Cost-based pricing establishes a financial floor, but market demand, customer value, positioning, competition, capacity, contract risk, warranty exposure, collection risk, and strategic objectives also affect the final price. Review the calculated result as a planning estimate rather than an automatic quote.</p>
        </Content>

        <Content title="Fixed costs, variable costs, and allocated overhead">
          <p><strong className="text-white">Variable costs</strong> generally change with each unit, sale, or job, such as materials, production labor, shipping, packaging, and payment fees. <strong className="text-white">Fixed costs</strong> may continue even when sales volume changes, such as office rent, software, licenses, insurance, and administrative payroll.</p>
          <p>Allocated overhead assigns a reasonable portion of indirect operating costs to each product, service, or project. If overhead is ignored, a price may cover the work itself while failing to support the business that delivers it.</p>
        </Content>

        <Content title="Selling price compared with customer total">
          <p>The selling price is the business price before separately added sales tax. The customer total is the selling price plus the entered tax. Sales tax collected for a taxing authority is generally a liability rather than business profit, although the applicable rules depend on the jurisdiction and transaction.</p>
        </Content>

        <Content title="Worked business pricing examples">
          <p><strong className="text-white">Contractor job:</strong> include materials, loaded field labor, equipment, subcontractors, permits, contingency, allocated overhead, payment fees, and the target margin. Review the maximum discount before negotiating the quote.</p>
          <p><strong className="text-white">Professional service:</strong> include delivery hours at a loaded labor rate, software or outside-service costs, administrative overhead, payment fees, and a risk allowance for revisions or scope uncertainty.</p>
          <p><strong className="text-white">Retail or ecommerce product:</strong> include acquisition or production cost, inbound freight, packaging, fulfillment, returns allowance, marketplace or payment fees, overhead, and the target margin. Sales tax should remain separate from profit.</p>
          <p><strong className="text-white">Wholesale or resale item:</strong> account for acquisition cost, freight, handling, shrinkage, volume economics, selling fees, and required contribution per unit before committing to a customer price.</p>
        </Content>

        <section className="mt-14 rounded-3xl border border-[#164E63] bg-[#083344]/30 p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#22D3EE]">Professional pricing workflow</p>
          <h2 className="mt-3 text-2xl font-bold">Need to price more than one product or job?</h2>
          <p className="mt-4 max-w-3xl leading-7 text-[#BAE6FD]">Numeravo is developing saved pricing scenarios, reusable cost templates, team review, project histories, and branded client-ready pricing summaries. The calculator remains free while these professional workflow features are evaluated.</p>
        </section>

        <section className="mt-14 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
          <h2 className="text-2xl font-bold">Business pricing calculator FAQs</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">{faqs.map((faq) => <article key={faq.question} className="rounded-2xl border border-[#1F2937] bg-[#0B0F19] p-5"><h3 className="font-semibold">{faq.question}</h3><p className="mt-3 text-sm leading-6 text-[#A0AEC0]">{faq.answer}</p></article>)}</div>
        </section>

        <section className="mt-10 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
          <h2 className="text-2xl font-bold">Methodology and disclaimer</h2>
          <p className="mt-4 leading-7 text-[#A0AEC0]">Numeravo calculates educational estimates from the values entered. Results are not accounting, financial, tax, legal, contracting, or pricing advice. Actual profitability depends on complete costs, tax treatment, fee schedules, returns, discounts, collection losses, contract terms, market conditions, and other factors. Verify inputs and decisions with qualified professionals when appropriate.</p>
          <p className="mt-4 text-sm text-[#718096]">Created and maintained by Numeravo Technologies LLC.</p>
        </section>

        <section className="mt-10 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
          <h2 className="text-2xl font-bold">Related business calculators</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Related href="/business/profit-margin-calculator">Profit Margin Calculator</Related>
            <Related href="/business/markup-calculator">Markup Calculator</Related>
            <Related href="/business/break-even-calculator">Break-Even Calculator</Related>
            <Related href="/business/sales-tax-calculator">Sales Tax Calculator</Related>
            <Related href="/business/contractor-job-profit-calculator">Contractor Job Profit Calculator</Related><Related href="/business">All Business Calculators</Related>
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
