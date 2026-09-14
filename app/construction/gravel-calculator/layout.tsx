import type { Metadata } from "next";
import type { ReactNode } from "react";

const url = "https://numeravo.com/construction/gravel-calculator";

export const metadata: Metadata = {
  title: "Gravel Calculator | Tons, Yards, Depth & Cost",
  description:
    "Calculate gravel volume, cubic yards, tons, tonnes, depth, waste, and estimated material cost for driveways, bases, paths, patios, drainage, and landscaping.",
  alternates: {
    canonical: url,
  },
  openGraph: {
    title: "Gravel Calculator | Tons, Yards, Depth & Cost",
    description:
      "Estimate gravel volume, weight, depth, waste, and material cost for driveways, bases, paths, patios, drainage, and landscaping.",
    url,
    siteName: "Numeravo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gravel Calculator | Numeravo",
    description:
      "Estimate gravel yards, tons, depth, waste, and material cost for common projects.",
  },
};

export default function GravelCalculatorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
