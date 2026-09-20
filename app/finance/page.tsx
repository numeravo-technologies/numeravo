import Link from "next/link";
import CategoryPageShell from "@/components/categories/CategoryPageShell";

const calculators = [
  {
    title: "Compound Interest Calculator",
    description:
      "Estimate future balance, recurring contributions, compound interest earned, contribution growth, and long-term savings scenarios.",
    href: "/finance/compound-interest-calculator",
    status: "Live",
  },
  {
    title: "Loan Calculator",
    description:
      "Calculate monthly payments, total interest, total borrowing cost, payoff time, extra-payment savings, and an amortization schedule.",
    href: "/finance/loan-calculator",
    status: "Live",
  },
  {
    title: "Mortgage Calculator",
    description:
      "Estimate principal, interest, property taxes, homeowners insurance, HOA dues, PMI, cash needed, payoff time, and extra-payment savings.",
    href: "/finance/mortgage-calculator",
    status: "Live",
  },
  {
    title: "Auto Loan Calculator",
    description:
      "Estimate a car payment, amount financed, trade equity, sales tax, rebates, fees, total interest, and extra-payment savings.",
    href: "/finance/auto-loan-calculator",
    status: "Live",
  },
  {
    title: "Credit Card Payoff Calculator",
    description:
      "Estimate payoff time, target monthly payments, total interest, minimum-payment comparisons, and savings from paying more.",
    href: "/finance/credit-card-payoff-calculator",
    status: "Live",
  },
  {
    title: "Savings Calculator",
    description:
      "Calculate required monthly savings, future balances, goal progress, compound growth, inflation-adjusted value, and contribution scenarios.",
    href: "/finance/savings-calculator",
    status: "Live",
  },
];

export const metadata = {
  title: "Finance Calculators | Loans, Interest, Mortgage & Savings",
  description:
    "Use Numeravo finance calculators to estimate compound interest, loan payments, mortgage costs, auto financing, credit-card payoff, savings, and personal finance planning numbers.",
  alternates: {
    canonical: "https://numeravo.com/finance",
  },
  openGraph: {
    title: "Finance Calculators | Numeravo",
    description:
      "Calculate compound interest, loans, mortgages, auto financing, credit-card payoff, savings, and personal finance numbers with Numeravo.",
    url: "https://numeravo.com/finance",
    siteName: "Numeravo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finance Calculators | Numeravo",
    description:
      "Fast finance calculators for loans, interest, mortgages, auto financing, credit-card payoff, and savings.",
  },
};

const calculatorGroups = [
  {
    title: "Borrowing & Debt",
    description:
      "Compare loan payments, mortgage costs, auto financing, debt payoff time, and total interest.",
    calculators: calculators.filter((calculator) =>
      [
        "/finance/loan-calculator",
        "/finance/mortgage-calculator",
        "/finance/auto-loan-calculator",
        "/finance/credit-card-payoff-calculator",
      ].includes(calculator.href),
    ),
  },
  {
    title: "Saving & Growth",
    description:
      "Plan savings goals, recurring contributions, compound growth, and future balances.",
    calculators: calculators.filter((calculator) =>
      [
        "/finance/compound-interest-calculator",
        "/finance/savings-calculator",
      ].includes(calculator.href),
    ),
  },
];

const financeCollectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Numeravo Finance Calculators",
  url: "https://numeravo.com/finance",
  description:
    "Finance calculators for compound interest, loans, mortgages, auto financing, credit-card payoff, savings, and personal finance planning.",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: calculators.length,
    itemListElement: calculators.map((calculator, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: calculator.title,
      url: `https://numeravo.com${calculator.href}`,
    })),
  },
};

export default function FinancePage() {
  return (
    <CategoryPageShell theme="finance">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(financeCollectionSchema).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <section className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#22C55E]">
            Finance Calculators
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Finance calculators for smarter money decisions.
          </h1>

          <p className="mt-6 text-lg leading-8 text-[#A0AEC0]">
            Plan loans, savings, interest, mortgages, auto financing, and debt payoff
            with practical finance calculators.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#1F2937] bg-[#121826] p-5">
            <p className="text-sm text-[#A0AEC0]">Borrow</p>
            <p className="mt-2 font-semibold text-white">
              Payments and total cost
            </p>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#121826] p-5">
            <p className="text-sm text-[#A0AEC0]">Pay down debt</p>
            <p className="mt-2 font-semibold text-white">
              Payoff time and interest
            </p>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#121826] p-5">
            <p className="text-sm text-[#A0AEC0]">Build savings</p>
            <p className="mt-2 font-semibold text-white">
              Goals and compound growth
            </p>
          </div>
        </div>

        <div className="mt-14 space-y-12">
          {calculatorGroups.map((group) => (
            <section key={group.title}>
              <div className="mb-5 max-w-3xl">
                <div className="mb-3 h-1.5 w-10 rounded-full bg-[#22C55E]" />
                <h2 className="text-2xl font-bold text-white">
                  {group.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#A0AEC0]">
                  {group.description}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {group.calculators.map((calculator) => (
                  <Link
                    key={calculator.href}
                    href={calculator.href}
                    className="group rounded-2xl border border-[#1F2937] bg-[#121826] p-6 transition hover:-translate-y-1 hover:border-[#22C55E]"
                  >
                    <div className="mb-4 h-2 w-12 rounded-full bg-[#22C55E]" />

                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-semibold text-white">
                        {calculator.title}
                      </h3>

                      <span className="rounded-full border border-[#1F2937] px-3 py-1 text-xs text-[#A0AEC0]">
                        {calculator.status}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-[#A0AEC0]">
                      {calculator.description}
                    </p>

                    <p className="mt-5 text-sm font-semibold text-[#22C55E]">
                      Open calculator →
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </CategoryPageShell>
  );
}
