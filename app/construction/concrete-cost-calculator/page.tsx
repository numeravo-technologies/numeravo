import type { Metadata } from "next";
import ConcreteCostCalculatorClient from "./ConcreteCostCalculatorClient";

const url = "https://numeravo.com/construction/concrete-cost-calculator";
const description =
  "Use the Numeravo concrete cost calculator to estimate concrete cubic yards, ready-mix cost, gravel base, reinforcement, labor, delivery fees, and total project cost.";

export const metadata: Metadata = {
  title: "Concrete Cost Calculator | Estimate Concrete Price, Base, Rebar & Labor",
  description,
  alternates: {
    canonical: url,
  },
  openGraph: {
    title: "Concrete Cost Calculator | Numeravo",
    description:
      "Estimate concrete cost by cubic yard, slab area, gravel base, reinforcement, labor, delivery, and total installed project cost.",
    url,
    siteName: "Numeravo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Concrete Cost Calculator | Numeravo",
    description:
      "Calculate concrete cubic yards, ready-mix cost, base material, reinforcement, labor, and total concrete project cost.",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Numeravo Concrete Cost Calculator",
  url,
  description,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Concrete cubic yards",
    "Ready-mix concrete cost",
    "Gravel base cost",
    "Reinforcement cost",
    "Labor cost",
    "Delivery fees",
    "Total project cost",
  ],
};

export default function ConcreteCostCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <ConcreteCostCalculatorClient />
    </>
  );
}
