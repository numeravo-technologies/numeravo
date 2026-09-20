import CalculatorSearch from "./CalculatorSearch";

export default function ConstructionTopSearch() {
  return (
    <div className="border-b border-[#1F2937] bg-[#090D14]">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <CalculatorSearch
          category="construction"
          placeholder="Find a construction calculator..."
          maxResults={6}
          compact
        />
      </div>
    </div>
  );
}
