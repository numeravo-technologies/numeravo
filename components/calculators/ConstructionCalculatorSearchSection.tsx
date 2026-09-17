"use client";

import CalculatorSearch from "./CalculatorSearch";

export default function ConstructionCalculatorSearchSection() {
  return (
    <div className="mt-8">
      <CalculatorSearch
        category="construction"
        placeholder="Search construction calculators..."
      />
    </div>
  );
}
