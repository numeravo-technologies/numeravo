import Link from "next/link";

import { getNextStepCalculators } from "@/data/calculators";

type CalculatorNextStepsProps = {
  calculatorId: string;
  limit?: number;
  title?: string;
  description?: string;
};

export default function CalculatorNextSteps({
  calculatorId,
  limit = 8,
  title = "Next steps for this job",
  description = "Continue planning the project with the calculations that commonly come next. Use only the steps that apply to your scope.",
}: CalculatorNextStepsProps) {
  const nextSteps = getNextStepCalculators(calculatorId, limit);

  if (nextSteps.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 rounded-3xl border border-[#3A2A20] bg-[#121826] p-6 md:p-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#F97316]">
          Project workflow
        </p>

        <h2 className="mt-3 text-2xl font-bold text-white">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-7 text-[#A0AEC0]">
          {description}
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {nextSteps.map((calculator, index) => (
          <Link
            key={calculator.id}
            href={calculator.href}
            className="group rounded-2xl border border-[#1F2937] bg-[#0B0F19] p-4 transition hover:border-[#F97316]/80 hover:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#F97316]">
                Step {index + 1}
              </span>

              <span className="text-[#6B7280] transition group-hover:translate-x-1 group-hover:text-[#F97316]">
                →
              </span>
            </div>

            <h3 className="mt-3 font-semibold text-white">
              {calculator.title}
            </h3>

            {calculator.description ? (
              <p className="mt-2 text-sm leading-6 text-[#A0AEC0]">
                {calculator.description}
              </p>
            ) : null}
          </Link>
        ))}
      </div>

      <p className="mt-5 text-xs leading-5 text-[#6B7280]">
        These are planning options, not a statement that every item is required
        for every concrete project.
      </p>
    </section>
  );
}
