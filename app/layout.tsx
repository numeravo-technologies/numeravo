import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://numeravo.com"),
  title: {
    default: "Numeravo | Practical Calculators for Construction, Business & Finance",
    template: "%s | Numeravo",
  },
  description:
    "Free practical calculators for construction, contractor pricing, business, finance, conversions, and everyday decisions.",
  applicationName: "Numeravo",
  authors: [{ name: "Numeravo Technologies LLC" }],
  creator: "Numeravo Technologies LLC",
  publisher: "Numeravo Technologies LLC",
  openGraph: {
    type: "website",
    siteName: "Numeravo",
    title: "Numeravo | Practical Calculators for Construction, Business & Finance",
    description:
      "Free practical calculators for construction, contractor pricing, business, finance, conversions, and everyday decisions.",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Numeravo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Numeravo | Practical Calculators",
    description:
      "Free practical calculators for construction, business, finance, conversions, and everyday decisions.",
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Numeravo",
  url: "https://numeravo.com",
  description:
    "Practical calculators for construction, contractor pricing, business, finance, conversions, and everyday decisions.",
  publisher: {
    "@type": "Organization",
    name: "Numeravo Technologies LLC",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Numeravo Technologies LLC",
  url: "https://numeravo.com",
  brand: {
    "@type": "Brand",
    name: "Numeravo",
  },
  logo: "https://numeravo.com/icon.png",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
        />
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}