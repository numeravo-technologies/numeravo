import type { Metadata } from "next";
import AreaCalculatorClient from "./AreaCalculatorClient";
import ConstructionCalculatorSearchSection from "@/components/calculators/ConstructionCalculatorSearchSection";

const url = "https://numeravo.com/construction/area-calculator";
const description =
  "Use the Numeravo area calculator to calculate square feet, square yards, square meters, acres, waste-adjusted area, and material cost for rectangles, triangles, circles, and trapezoids.";

export const metadata: Metadata = {
  title: "Area Calculator | Square Feet, Square Yards, Acres & Square Meters",
  description,
  alternates: {
    canonical: url,
  },
  openGraph: {
    title: "Area Calculator | Square Feet, Square Yards, Acres & Square Meters",
    description:
      "Calculate area for flooring, roofing, drywall, paint, decking, concrete slabs, landscaping, tile, and carpet projects.",
    url,
    siteName: "Numeravo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Area Calculator | Square Feet, Square Yards, Acres & Square Meters",
    description:
      "Calculate square feet, square yards, square meters, acres, waste-adjusted area, and project cost.",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Numeravo Area Calculator",
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
    "Rectangle area",
    "Triangle area",
    "Circle area",
    "Trapezoid area",
    "Square feet",
    "Square yards",
    "Square meters",
    "Acres",
    "Waste adjustment",
    "Material cost estimate",
  ],
};

export default function AreaCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <AreaCalculatorClient />

      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 sm:pb-12 lg:pb-16">
        <ConstructionCalculatorSearchSection />
      </div>
    </>
  );
}
