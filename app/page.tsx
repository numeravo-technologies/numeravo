import Link from "next/link";

export const metadata = {
  title: "Practical Calculators for Construction, Business & Finance",
  description:
    "Free practical calculators for construction, contractor pricing, business, finance, conversions, and everyday decisions.",
  alternates: {
    canonical: "https://numeravo.com",
  },
  openGraph: {
    title: "Numeravo | Practical Calculators for Construction, Business & Finance",
    description:
      "Free practical calculators for construction, contractor pricing, business, finance, conversions, and everyday decisions.",
    url: "https://numeravo.com",
    siteName: "Numeravo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Numeravo | Practical Calculators",
    description:
      "Free practical calculators for construction, business, finance, conversions, and everyday decisions.",
  },
};

const categories = [
  {
    title: "Construction Calculators",
    href: "/construction",
    accent: "bg-[#F97316]",
    description:
      "Concrete, gravel, rebar, flatwork, demolition, delivery, pumping, labor, and project cost calculators.",
  },
  {
    title: "Finance Calculators",
    href: "/finance",
    accent: "bg-[#22C55E]",
    description:
      "Loans, mortgages, savings, compound interest, auto financing, credit-card payoff, and personal finance calculators.",
  },
  {
    title: "Student Calculators",
    href: "/student",
    accent: "bg-[#8B5CF6]",
    description:
      "Student-focused tools and calculators as the Numeravo academic library expands.",
  },
  {
    title: "Unit Converters",
    href: "/converters",
    accent: "bg-[#3B82F6]",
    description:
      "Fast everyday converters for measurements, units, quantities, and practical calculations.",
  },
  {
    title: "Business Tools",
    href: "/business",
    accent: "bg-[#06B6D4]",
    description:
      "Contractor pricing, estimates, overhead, labor burden, hourly rates, profit, margin, markup, and business planning calculators.",
  },
  {
    title: "All Tools",
    href: "/tools",
    accent: "bg-[#EAB308]",
    description:
      "Browse the full Numeravo tool library across every calculator category.",
  },
];

export default function HomePage() {
  return (
    <main
      className="min-h-screen bg-[#0B0F19] px-6 py-16 text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(59,130,246,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.10) 1px, transparent 1px), radial-gradient(circle at 50% 0%, rgba(59,130,246,0.20), transparent 40rem)",
        backgroundSize: "32px 32px, 32px 32px, auto",
      }}
    >
      <section className="mx-auto flex max-w-6xl flex-col items-start gap-10">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">
            Numeravo
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Practical calculators for real-world decisions.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#A0AEC0]">
            Calculate construction quantities, project costs, contractor pricing,
            business numbers, loans, savings, conversions, and everyday decisions
            with focused tools built to keep the inputs and results understandable.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/construction"
              className="rounded-2xl bg-[#F97316] px-6 py-4 text-center text-sm font-bold text-[#0B0F19] transition hover:bg-orange-300"
            >
              Explore Construction Calculators
            </Link>
            <Link
              href="/tools"
              className="rounded-2xl border border-[#1F2937] bg-[#121826] px-6 py-4 text-center text-sm font-bold text-white transition hover:border-[#3B82F6] hover:text-[#93C5FD]"
            >
              View All Tools
            </Link>
          </div>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group rounded-2xl border border-[#1F2937] bg-[#121826] p-6 transition hover:-translate-y-1 hover:border-[#3B82F6] hover:shadow-2xl hover:shadow-blue-950/30"
            >
              <div className={`mb-4 h-2 w-12 rounded-full ${category.accent}`} />
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold">{category.title}</h2>
                <span className="text-[#A0AEC0] transition group-hover:translate-x-1 group-hover:text-white">
                  →
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#A0AEC0]">
                {category.description}
              </p>
            </Link>
          ))}
        </div>

        <section className="w-full">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3B82F6]">
              Practical by design
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Built for real calculations and better planning.
            </h2>

            <p className="mt-5 leading-7 text-[#A0AEC0]">
              Numeravo organizes practical calculators around the decisions people
              actually need to make. Construction tools help estimate materials,
              quantities, project costs, labor, concrete, rebar, gravel, roofing,
              framing, and other job-planning inputs. Business calculators support
              contractor pricing, estimates, overhead, labor burden, profit, margin,
              markup, and hourly-rate decisions.
            </p>

            <p className="mt-4 leading-7 text-[#A0AEC0]">
              Finance calculators cover common planning questions such as loan
              payments, mortgages, auto financing, savings, compound interest, and
              credit-card payoff. Each calculator is designed to keep the inputs,
              assumptions, and results understandable so you can review the numbers
              instead of relying on a single unexplained answer.
            </p>

            <p className="mt-4 leading-7 text-[#A0AEC0]">
              Calculator results are intended for planning and comparison. Actual
              project costs, material requirements, financing terms, taxes, codes,
              and professional requirements can vary, so important decisions should
              be verified against current project documents, supplier information,
              local requirements, or qualified professional advice when appropriate.
            </p>
          </div>
        </section>

        <section className="w-full rounded-3xl border border-[#F97316]/30 bg-[#121826] p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F97316]">
                Featured category
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Calculate the job. Price the work.
              </h2>

              <p className="mt-4 leading-7 text-[#A0AEC0]">
                Construction is Numeravo&apos;s deepest calculator library, connecting
                material quantities, project scope, delivery, labor, reinforcement,
                finishing, and cost planning.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/construction"
                  className="rounded-xl bg-[#F97316] px-5 py-3 text-center text-sm font-semibold text-[#0B0F19] transition hover:bg-orange-300"
                >
                  Explore Construction
                </Link>

                <Link
                  href="/construction/project/concrete-slab-equipment-pad"
                  className="rounded-xl border border-[#2A3444] bg-[#0B0F19] px-5 py-3 text-center text-sm font-semibold text-white transition hover:border-[#F97316]"
                >
                  Start a Concrete Project
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Calculate", "Materials, quantities, dimensions, and requirements"],
                ["Plan", "Connect the major scopes of a construction project"],
                ["Price", "Estimate delivery, labor, finishing, and project costs"],
                ["Compare", "Review assumptions and evaluate project options"],
              ].map(([title, description]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-[#1F2937] bg-[#0B0F19] p-5"
                >
                  <div className="mb-3 h-1.5 w-9 rounded-full bg-[#F97316]" />
                  <p className="font-semibold text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#A0AEC0]">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
