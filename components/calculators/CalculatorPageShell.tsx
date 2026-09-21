import type { ReactNode } from "react";

import CalculatorCanvas, { type CalculatorTheme } from "./CalculatorCanvas";
import CalculatorSearch from "./CalculatorSearch";

type CalculatorPageShellProps = {
  children: ReactNode;
  contained?: boolean;
  showBottomSearch?: boolean;
  theme?: CalculatorTheme;
};

export default function CalculatorPageShell({
  children,
  contained = true,
  showBottomSearch = true,
  theme = "construction",
}: CalculatorPageShellProps) {
  return (
    <CalculatorCanvas theme={theme}>
      {contained ? (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
          {children}

          {showBottomSearch ? (
            <div className="mt-8">
              <CalculatorSearch
                category="construction"
                placeholder="Search construction calculators..."
              />
            </div>
          ) : null}
        </div>
      ) : (
        <>
          {children}

          {showBottomSearch ? (
            <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 sm:pb-12 lg:pb-16">
              <CalculatorSearch
                category="construction"
                placeholder="Search construction calculators..."
              />
            </div>
          ) : null}
        </>
      )}
    </CalculatorCanvas>
  );
}
