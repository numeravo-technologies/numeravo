import type { ReactNode } from "react";

import CalculatorSearch from "./CalculatorSearch";

type CalculatorPageShellProps = {
  children: ReactNode;
  contained?: boolean;
};

export default function CalculatorPageShell({
  children,
  contained = true,
}: CalculatorPageShellProps) {
  return (
    <main
      className="min-h-screen bg-[#090D14] text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(249,115,22,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.035) 1px, transparent 1px), radial-gradient(circle at 50% 0%, rgba(249,115,22,0.10), transparent 34rem)",
        backgroundSize: "32px 32px, 32px 32px, auto",
      }}
    >
      {contained ? (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
          {children}

          <div className="mt-8">
            <CalculatorSearch
              category="construction"
              placeholder="Search construction calculators..."
            />
          </div>
        </div>
      ) : (
        <>
          {children}

          <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 sm:pb-12 lg:pb-16">
            <CalculatorSearch
              category="construction"
              placeholder="Search construction calculators..."
            />
          </div>
        </>
      )}
    </main>
  );
}
