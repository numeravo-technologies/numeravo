import type { Metadata } from "next";
import Link from "next/link";
import ConcreteFormworkCalculatorClient from "./ConcreteFormworkCalculatorClient";
import CalculatorPageShell from "../../../components/calculators/CalculatorPageShell";

export const metadata: Metadata = {
  title: "Concrete Formwork Calculator | Forms, Stakes & Cost",
  description:
    "Estimate concrete form boards, stakes, bracing, screws, form oil, labor, material cost, and total formwork cost for slabs, patios, driveways, pads, and footings.",
  alternates: {
    canonical: "https://numeravo.com/construction/concrete-formwork-calculator",
  },
  openGraph: {
    title: "Concrete Formwork Calculator",
    description:
      "Estimate concrete form boards, stakes, bracing, fasteners, form oil, labor, and total formwork cost.",
    url: "https://numeravo.com/construction/concrete-formwork-calculator",
    siteName: "Numeravo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Concrete Formwork Calculator",
    description:
      "Calculate form boards, stakes, bracing, screws, form oil, labor, and concrete formwork cost.",
  },
};

export default function ConcreteFormworkCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Concrete Formwork Calculator",
    applicationCategory: "ConstructionApplication",
    operatingSystem: "Web",
    url: "https://numeravo.com/construction/concrete-formwork-calculator",
    description:
      "Estimate concrete formwork materials, form boards, stakes, bracing, fasteners, form oil, labor, and total formwork cost.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do you calculate concrete formwork?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Concrete formwork is usually estimated from the perimeter or linear feet of the pour, board length, number of form runs, stake spacing, bracing spacing, fasteners, form release, and labor.",
        },
      },
      {
        "@type": "Question",
        name: "How many stakes do I need for concrete forms?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A common planning method is to divide the form perimeter by the stake spacing, then round up and add extra stakes for corners, joints, and weak areas.",
        },
      },
      {
        "@type": "Question",
        name: "What affects concrete formwork cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Formwork cost depends on perimeter length, form height, board type, board reuse, stake spacing, bracing, fasteners, form oil, labor rate, and jobsite complexity.",
        },
      },
      {
        "@type": "Question",
        name: "Can form boards be reused?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Many form boards can be reused if they are cleaned, oiled, stripped carefully, and not damaged during the pour.",
        },
      },
    ],
  };

  return (
    <CalculatorPageShell showBottomSearch={false}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />


        <div className="mb-8">
          <Link
            href="/construction"
            className="text-sm font-medium text-[#F97316] hover:underline"
          >
            ← Back to Construction Calculators
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#F97316]">
              Concrete Formwork Project
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Plan and price your concrete formwork.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#A0AEC0]">
              Estimate form boards, stakes, bracing, fasteners, form oil, labor,
              material cost, and total formwork cost. Use the connected project workflow
              for the full concrete job, or calculate formwork here by itself.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/construction/project/concrete-slab-equipment-pad"
                className="rounded-xl bg-[#F97316] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#fb8a3c]"
              >
                Start Concrete Project
              </Link>

              <a
                href="#formwork-calculator"
                className="rounded-xl border border-[#2A3444] bg-[#121826] px-5 py-3 text-center text-sm font-semibold text-white transition hover:border-[#F97316]"
              >
                Calculate Only
              </a>

              <Link
                href="/construction"
                className="rounded-xl border border-[#1F2937] px-5 py-3 text-center text-sm font-semibold text-[#A0AEC0] transition hover:border-[#F97316] hover:text-white"
              >
                Browse Construction Calculators
              </Link>
            </div>


            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#1F2937] bg-[#121826] p-4">
                <p className="text-sm text-[#A0AEC0]">Calculates</p>
                <p className="mt-1 font-semibold text-white">Linear feet</p>
              </div>
              <div className="rounded-2xl border border-[#1F2937] bg-[#121826] p-4">
                <p className="text-sm text-[#A0AEC0]">Includes</p>
                <p className="mt-1 font-semibold text-white">Stakes & bracing</p>
              </div>
              <div className="rounded-2xl border border-[#1F2937] bg-[#121826] p-4">
                <p className="text-sm text-[#A0AEC0]">Output</p>
                <p className="mt-1 font-semibold text-white">Total cost</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#1F2937] bg-[#121826] p-6 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white">Common formwork items</h2>
            <div className="mt-5 space-y-3">
              <QuickRow label="Form boards" value="2x4, 2x6, 2x8" />
              <QuickRow label="Stake spacing" value="2–4 ft" />
              <QuickRow label="Bracing spacing" value="4–8 ft" />
              <QuickRow label="Labor" value="Layout + setup" />
            </div>
            <p className="mt-4 text-xs leading-5 text-[#A0AEC0]">
              Use this as a planning estimate. Final formwork needs depend on
              concrete depth, soil conditions, layout, reinforcement, and finish requirements.
            </p>
          </div>
        </div>


        <section className="mt-8 rounded-3xl border border-[#1F2937] bg-[#121826] p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F97316]">
                Connected project workflow
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Build the full concrete job scope
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#A0AEC0]">
                Move through the major project scopes without losing sight of the full job.
              </p>
            </div>

            <Link
              href="/construction/project/concrete-slab-equipment-pad"
              className="rounded-xl bg-[#F97316] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#fb8a3c]"
            >
              Start Concrete Project
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-9">
            {[
              "Concrete",
              "Base",
              "Reinforcement",
              "Formwork",
              "Delivery",
              "Pumping",
              "Labor",
              "Finishing",
              "Joints",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-xl border border-[#1F2937] bg-[#0B0F19] px-3 py-3 text-center"
              >
                <p className="text-xs font-semibold text-[#F97316]">
                  {index + 1}
                </p>
                <p className="mt-1 text-xs font-medium text-white">{step}</p>
              </div>
            ))}
          </div>
        </section>


        <div id="formwork-calculator" className="mt-10 scroll-mt-28">
          <ConcreteFormworkCalculatorClient />
        </div>

        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          <InfoCard
            title="Estimate form boards"
            text="Calculate board count from perimeter length, board length, number of form runs, and waste allowance."
          />
          <InfoCard
            title="Plan stakes and bracing"
            text="Estimate stakes, braces, and fasteners based on spacing rules and jobsite complexity."
          />
          <InfoCard
            title="Calculate formwork cost"
            text="Estimate material cost, labor cost, form release cost, and total concrete formwork cost."
          />
        </section>

        <section className="mt-12 rounded-3xl border border-[#1F2937] bg-[#121826] p-6">
          <h2 className="text-2xl font-semibold text-white">
            How concrete formwork is estimated
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[#A0AEC0]">
            <p>
              Concrete formwork starts with the total perimeter or linear feet of
              the pour. A simple rectangular slab uses the outside perimeter, while
              footings, steps, thickened edges, or multiple pours may require
              additional form runs.
            </p>
            <p>
              Form boards hold the wet concrete in place until it sets. Stakes,
              bracing, screws, and layout labor help keep the forms straight,
              level, and strong enough to resist concrete pressure during placement.
            </p>
            <p>
              Formwork cost can become significant on small jobs because setup
              labor, layout time, and material handling do not always scale directly
              with concrete volume.
            </p>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-[#1F2937] bg-[#121826] p-6">
          <h2 className="text-2xl font-semibold text-white">Formwork planning table</h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-[#1F2937]">
            <div className="grid grid-cols-3 bg-[#0B0F19] px-4 py-3 text-sm font-semibold text-white">
              <span>Project type</span>
              <span>Typical forms</span>
              <span>Planning note</span>
            </div>
            <ProjectRow project="Slab or pad" forms="Perimeter forms" note="Often 2x4 or 2x6 boards" />
            <ProjectRow project="Driveway" forms="Long edge forms" note="More stakes and alignment work" />
            <ProjectRow project="Footing" forms="Two-sided forms" note="May need multiple form runs" />
            <ProjectRow project="Thickened edge" forms="Deeper boards" note="May require stronger bracing" />
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-[#1F2937] bg-[#121826] p-6">
          <h2 className="text-2xl font-semibold text-white">
            Concrete formwork calculator FAQs
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Faq
              question="What size boards are used for concrete forms?"
              answer="Common flatwork forms use 2x4, 2x6, or 2x8 boards depending on slab thickness, edge depth, and required form height."
            />
            <Faq
              question="How far apart should concrete form stakes be?"
              answer="Many jobs use stakes every 2 to 4 feet, with closer spacing at corners, curves, soft soil, or deeper forms."
            />
            <Faq
              question="Do concrete forms need bracing?"
              answer="Bracing helps keep forms straight and prevents movement during the pour. Deeper forms, long runs, and soft ground usually need more bracing."
            />
            <Faq
              question="Should I include labor in formwork cost?"
              answer="Yes. Layout, staking, leveling, bracing, stripping, and cleanup can represent a large share of total formwork cost."
            />
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-[#1F2937] bg-[#121826] p-6">
          <h2 className="text-2xl font-semibold text-white">Related concrete calculators</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <RelatedLink href="/construction/concrete-labor-cost-calculator" label="Concrete Labor Cost Calculator" />
            <RelatedLink href="/construction/concrete-cost-calculator" label="Concrete Cost Calculator" />
            <RelatedLink href="/construction/concrete-slab-calculator" label="Concrete Slab Calculator" />
            <RelatedLink href="/construction/concrete-pad-calculator" label="Concrete Pad Calculator" />
            <RelatedLink href="/construction/concrete-patio-calculator" label="Concrete Patio Calculator" />
            <RelatedLink href="/construction/concrete-driveway-calculator" label="Concrete Driveway Calculator" />
            <RelatedLink href="/construction/concrete-footing-calculator" label="Concrete Footing Calculator" />
            <RelatedLink href="/construction/concrete-wall-calculator" label="Concrete Wall Calculator" />
            <RelatedLink href="/construction/concrete-waste-calculator" label="Concrete Waste Calculator" />
            <RelatedLink href="/construction/concrete-yard-calculator" label="Concrete Yard Calculator" />
            <RelatedLink href="/construction/rebar-calculator" label="Rebar Calculator" />
            <RelatedLink href="/construction/wire-mesh-calculator" label="Wire Mesh Calculator" />
            <RelatedLink href="/construction/concrete-expansion-joint-spacing" label="Concrete Expansion Joint Spacing" />
            <RelatedLink href="/construction/concrete-control-joint-spacing" label="Concrete Control Joint Spacing" />
          </div>
        </section>
    </CalculatorPageShell>
  );
}

function QuickRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#1F2937] bg-[#0B0F19] px-4 py-3">
      <span className="text-sm text-[#A0AEC0]">{label}</span>
      <span className="text-right text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#1F2937] bg-[#121826] p-6">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-4 text-sm leading-6 text-[#A0AEC0]">{text}</p>
    </div>
  );
}

function ProjectRow({
  project,
  forms,
  note,
}: {
  project: string;
  forms: string;
  note: string;
}) {
  return (
    <div className="grid grid-cols-3 border-t border-[#1F2937] px-4 py-3 text-sm text-[#A0AEC0]">
      <span className="font-semibold text-white">{project}</span>
      <span>{forms}</span>
      <span>{note}</span>
    </div>
  );
}

function Faq({ question, answer }: { question: string; answer: string }) {
  return (
    <div>
      <h3 className="font-semibold text-white">{question}</h3>
      <p className="mt-2 text-sm leading-6 text-[#A0AEC0]">{answer}</p>
    </div>
  );
}

function RelatedLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-[#1F2937] bg-[#0B0F19] px-4 py-3 text-sm font-semibold text-white transition hover:border-[#F97316]"
    >
      {label}
    </Link>
  );
}
