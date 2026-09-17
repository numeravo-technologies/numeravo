import Link from "next/link";

import { getRelatedCalculators } from "@/data/calculators";

type RelatedCalculatorsProps = {
  calculatorId: string;
  limit?: number;
  title?: string;
};

export default function RelatedCalculators({
  calculatorId,
  limit = 6,
  title = "Related construction calculators",
}: RelatedCalculatorsProps) {
  const related = getRelatedCalculators(calculatorId, limit);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
      <h2 className="text-2xl font-bold text-white">{title}</h2>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((calculator) => (
          <Link
            key={calculator.id}
            href={calculator.href}
            className="rounded-2xl border border-[#1F2937] bg-[#0B0F19] p-4 transition hover:border-[#F97316]/80 hover:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
          >
            <p className="font-semibold text-white">
              {calculator.title}
            </p>

            {calculator.description ? (
              <p className="mt-2 text-sm leading-6 text-[#A0AEC0]">
                {calculator.description}
              </p>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
