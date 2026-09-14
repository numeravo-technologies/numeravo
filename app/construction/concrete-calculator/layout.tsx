import type { Metadata } from "next";
import type { ReactNode } from "react";

const url = "https://numeravo.com/construction/concrete-calculator";

export const metadata: Metadata = {
  title: "Concrete Calculator | Yards, Bags, Slabs & Cost",
  description:
    "Calculate concrete volume, cubic yards, cubic meters, bags, waste, and estimated material cost for slabs, footings, piers, walls, stairs, curbs, and other projects.",
  alternates: {
    canonical: url,
  },
  openGraph: {
    title: "Concrete Calculator | Yards, Bags, Slabs & Cost",
    description:
      "Estimate concrete volume, waste, bags, and material cost for slabs, footings, piers, walls, stairs, curbs, and other concrete projects.",
    url,
    siteName: "Numeravo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Concrete Calculator | Numeravo",
    description:
      "Estimate concrete yards, meters, bags, waste, and material cost for common concrete projects.",
  },
};

export default function ConcreteCalculatorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
