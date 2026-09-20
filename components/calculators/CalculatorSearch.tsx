"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useMemo, useState } from "react";
import {
  calculators,
  type CalculatorRecord,
} from "@/data/calculators";

type CalculatorSearchProps = {
  currentHref?: string;
  category?: CalculatorRecord["category"];
  placeholder?: string;
  maxResults?: number;
  compact?: boolean;
};

export default function CalculatorSearch({
  currentHref,
  category,
  placeholder = "Search calculators...",
  maxResults = 8,
  compact = false,
}: CalculatorSearchProps) {
  const pathname = usePathname();
  const activeHref = currentHref ?? pathname;
  const searchInputId = useId();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return [];
    }

    return calculators
      .filter((calculator) => calculator.href !== activeHref)
      .filter((calculator) => {
        if (category && calculator.category !== category) {
          return false;
        }

        const searchableText = [
          calculator.title,
          calculator.description ?? "",
          calculator.category,
          calculator.subcategory ?? "",
          ...calculator.keywords,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalized);
      })
      .slice(0, maxResults);
  }, [query, activeHref, category, maxResults]);

  const showResults = query.trim().length > 0;

  return (
    <section
      className={
        compact
          ? "rounded-2xl border border-[#263041] bg-[#0B0F19]/95 p-4"
          : "rounded-2xl border border-[#1F2937] bg-[#0B0F19]/95 p-5 shadow-[0_18px_60px_-40px_rgba(0,0,0,0.65)] sm:p-6"
      }
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F97316]">
          Find a calculator
        </p>

        {!compact ? (
          <>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
              Search Numeravo tools
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#A0AEC0]">
              Search by project, material, measurement, cost, or calculator name.
            </p>
          </>
        ) : null}
      </div>

      <div className={compact ? "mt-3" : "mt-5"}>
        <label htmlFor={searchInputId} className="sr-only">
          Search calculators
        </label>

        <input
          id={searchInputId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full rounded-xl border border-[#2A3545] bg-[#090D14] px-4 py-3 text-base text-white outline-none transition placeholder:text-[#6B7280] focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
        />
      </div>

      {showResults ? (
        <div className="mt-4">
          {results.length > 0 ? (
            <ul className="space-y-2">
              {results.map((calculator) => (
                <li key={calculator.id}>
                  <Link
                    href={calculator.href}
                    className="block rounded-xl border border-[#1F2937] bg-[#111827] px-4 py-3 transition hover:border-[#F97316]/70 hover:bg-[#151D2A] focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">
                          {calculator.title}
                        </p>

                        {calculator.description ? (
                          <p className="mt-1 text-sm leading-5 text-[#A0AEC0]">
                            {calculator.description}
                          </p>
                        ) : null}
                      </div>

                      <span
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-[#F97316]"
                      >
                        →
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border border-[#1F2937] bg-[#111827] px-4 py-3 text-sm text-[#A0AEC0]">
              No matching calculators found.
            </p>
          )}
        </div>
      ) : null}
    </section>
  );
}
