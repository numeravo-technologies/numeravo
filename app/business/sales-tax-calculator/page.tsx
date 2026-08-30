import type { Metadata } from "next";
import Link from "next/link";
import SalesTaxCalculatorClient from "./SalesTaxCalculatorClient";

const url = "https://numeravo.com/business/sales-tax-calculator";

export const metadata: Metadata = {
  title: "Sales Tax Calculator: Add or Reverse Sales Tax",
  description: "Estimate sales tax for multiple taxable and non-taxable items, combined rates, discounts, shipping, and tax-inclusive totals.",
  alternates: { canonical: url },
  openGraph: { title: "Sales Tax Calculator | Numeravo", description: "Add sales tax or extract included tax with item-level taxability, discounts, shipping, and combined rates.", url, siteName: "Numeravo", type: "website" },
  twitter: { card: "summary_large_image", title: "Sales Tax Calculator | Numeravo", description: "Estimate sales tax, taxable base, pre-tax price, and customer total." },
};

const faqs = [
  { question: "How do I calculate sales tax?", answer: "Multiply the taxable base by the combined tax rate expressed as a decimal. Then add the tax to the pre-tax total when tax is charged separately." },
  { question: "How do I calculate the pre-tax price when tax is included?", answer: "Divide the tax-inclusive taxable amount by one plus the tax rate. The difference between the inclusive amount and that base is the included tax." },
  { question: "Are shipping charges taxable?", answer: "Shipping and delivery taxability varies by jurisdiction, delivery arrangement, and the items sold. Confirm the rule that applies before selecting the shipping-taxable option." },
  { question: "Does a discount reduce sales tax?", answer: "A qualifying discount often reduces the taxable selling price, but treatment varies. This calculator allocates an entered order discount proportionally across the line items." },
  { question: "Does Numeravo look up the correct sales-tax rate?", answer: "No. You enter the state, county, city, and special-district components. Confirm the applicable rate and sourcing location with official tax authorities or a qualified adviser." },
  { question: "Does this calculator determine sales-tax nexus?", answer: "No. Nexus, registration, filing, exemptions, sourcing, and marketplace rules are compliance questions outside this arithmetic estimator." },
];

const schema = [
  { "@context": "https://schema.org", "@type": "WebApplication", name: "Numeravo Sales Tax Calculator", url, applicationCategory: "BusinessApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, featureList: ["Add sales tax", "Extract included sales tax", "Multiple line items", "Taxable and non-taxable items", "Component tax rates", "Discount allocation", "Shipping taxability", "CSV export"] },
  { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Business Calculators", item: "https://numeravo.com/business" }, { "@type": "ListItem", position: 2, name: "Sales Tax Calculator", item: url }] },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
];

export default function SalesTaxCalculatorPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] px-5 py-12 text-white sm:px-6 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="text-sm text-[#718096]"><Link href="/business" className="hover:text-[#22D3EE]">Business Calculators</Link><span className="mx-2">/</span><span className="text-white">Sales Tax Calculator</span></nav>
        <header className="mt-8 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[.25em] text-[#22D3EE]">Business transaction tool</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Sales Tax Calculator</h1>
          <p className="mt-6 text-lg leading-8 text-[#A0AEC0]">Add sales tax to a transaction or extract tax from an inclusive total. Separate taxable and non-taxable items, combine jurisdiction rates, allocate discounts, test shipping taxability, and export a clear calculation record.</p>
        </header>

        <SalesTaxCalculatorClient />

        <section className="mt-14 grid gap-4 md:grid-cols-3">
          <Info title="Add tax to a sale">Enter pre-tax line items, mark what is taxable, and use the combined rate to estimate tax and the final customer total.</Info>
          <Info title="Reverse an inclusive total">Use “Extract included tax” when a taxable amount already includes tax and you need the estimated pre-tax base and tax portion.</Info>
          <Info title="Document your assumptions">The component rates and taxable toggles make the calculation easier to review than a single unexplained percentage.</Info>
        </section>

        <Content title="How the sales tax calculator works">
          <p>In add-tax mode, the calculator multiplies the taxable base by the combined rate. The taxable base includes taxable line items after the proportional discount plus shipping when you mark shipping taxable. Non-taxable amounts remain in the final total but do not generate estimated tax.</p>
          <p><strong className="text-white">Sales tax = taxable base × combined tax rate.</strong> The final total equals the discounted item subtotal, shipping, and calculated tax.</p>
          <p>In tax-inclusive mode, the calculator reverses the arithmetic: <strong className="text-white">pre-tax taxable base = tax-inclusive taxable amount ÷ (1 + tax rate).</strong> Included tax is the difference between the inclusive amount and that base.</p>
        </Content>

        <Content title="What makes up a combined sales tax rate?">
          <p>A transaction may be subject to more than one rate component, such as state, county, city, or special-district tax. The calculator adds the components you enter and displays the combined percentage used in the estimate.</p>
          <p>The correct rate can depend on sourcing rules, the seller and customer locations, product delivery, marketplace involvement, and other facts. Numeravo deliberately does not guess a jurisdiction or provide a live rate lookup. Verify the applicable components through official sources or qualified tax support.</p>
        </Content>

        <Content title="Taxable items, exemptions, and mixed transactions">
          <p>Use a separate line for each meaningful product, service, fee, or charge, then mark whether it is taxable under the rule you have confirmed. This is useful for mixed invoices containing taxable products and non-taxable services, or exempt and non-exempt charges.</p>
          <p>An exemption may depend on the customer, item, intended use, documentation, or jurisdiction. Keep exemption certificates and supporting records where required. A calculator cannot validate whether an exemption is legally available.</p>
        </Content>

        <Content title="Discounts and shipping">
          <p>This tool allocates an order-level discount proportionally between taxable and non-taxable item subtotals. That produces a transparent estimate, but the legal treatment of coupons, rebates, trade-ins, and seller- or manufacturer-funded discounts can differ.</p>
          <p>Shipping, delivery, handling, and installation charges may be taxable in some transactions and not others. Use the shipping toggle only after confirming how the charge is treated for the specific sale.</p>
        </Content>

        <Content title="Sales-tax nexus, sourcing, and filing">
          <p>Calculating a tax amount is separate from determining whether a business must register, collect, remit, and file. Physical presence, economic activity, marketplace rules, product type, customer status, and transaction location may all matter.</p>
          <p>For business use, document the rate source, sourcing assumption, item-taxability decision, exemption support, transaction date, and calculation output. The CSV and print controls can help preserve the arithmetic, but they are not a tax return or compliance record system.</p>
        </Content>

        <section className="mt-14 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
          <h2 className="text-2xl font-bold">Worked example</h2>
          <div className="mt-5 space-y-4 leading-7 text-[#A0AEC0]">
            <p>Assume a business sells a $1,000 taxable item and a $200 non-taxable service, applies a $120 order discount, charges $50 non-taxable delivery, and enters an 8% combined tax rate.</p>
            <p>The discount is 10% of the $1,200 item subtotal, so the taxable item is reduced to $900 and the non-taxable service to $180. Estimated tax is $72 ($900 × 8%). The estimated final total is $1,202: $900 taxable amount + $180 non-taxable amount + $50 delivery + $72 tax.</p>
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
          <h2 className="text-2xl font-bold">Sales tax calculator FAQs</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">{faqs.map((faq) => <article key={faq.question} className="rounded-2xl border border-[#1F2937] bg-[#0B0F19] p-5"><h3 className="font-semibold">{faq.question}</h3><p className="mt-3 text-sm leading-6 text-[#A0AEC0]">{faq.answer}</p></article>)}</div>
        </section>

        <section className="mt-10 rounded-3xl border border-[#7C2D12] bg-[#431407]/30 p-6 md:p-8">
          <h2 className="text-2xl font-bold">Tax and compliance disclaimer</h2>
          <p className="mt-4 leading-7 text-[#FED7AA]">Results are educational estimates based solely on your inputs and are not tax, accounting, legal, or compliance advice. Numeravo does not determine nexus, registration requirements, sourcing, exemptions, taxability, the correct rate, filing obligations, or remittance duties. Confirm current requirements with official tax authorities and qualified professionals.</p>
          <p className="mt-4 text-sm text-[#A0AEC0]">Created and maintained by Numeravo Technologies LLC.</p>
        </section>

        <section className="mt-10 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
          <h2 className="text-2xl font-bold">Related business calculators</h2>
          <div className="mt-5 flex flex-wrap gap-3"><Related href="/business/pricing-calculator">Business Pricing Calculator</Related><Related href="/business/profit-margin-calculator">Profit Margin Calculator</Related><Related href="/business/markup-calculator">Markup Calculator</Related><Related href="/business/break-even-calculator">Break-Even Calculator</Related><Related href="/business">All Business Calculators</Related></div>
        </section>
      </div>
    </main>
  );
}

function Info({ title, children }: { title: string; children: React.ReactNode }) { return <article className="rounded-2xl border border-[#1F2937] bg-[#121826] p-5"><h2 className="font-semibold text-[#22D3EE]">{title}</h2><p className="mt-3 text-sm leading-6 text-[#A0AEC0]">{children}</p></article>; }
function Content({ title, children }: { title: string; children: React.ReactNode }) { return <section className="mt-12 max-w-4xl"><h2 className="text-2xl font-bold">{title}</h2><div className="mt-4 space-y-4 leading-7 text-[#A0AEC0]">{children}</div></section>; }
function Related({ href, children }: { href: string; children: React.ReactNode }) { return <Link href={href} className="rounded-xl border border-[#374151] px-5 py-3 font-semibold hover:border-[#06B6D4]">{children}</Link>; }
