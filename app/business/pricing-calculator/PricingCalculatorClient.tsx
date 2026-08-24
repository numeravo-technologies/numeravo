"use client";

import { useMemo, useState } from "react";

type Inputs = {
  projectName: string;
  pricingMode: "product" | "service" | "wholesale";
  calculationMode: "target" | "reverse";
  proposedPrice: number;
  materials: number;
  laborHours: number;
  laborRate: number;
  equipment: number;
  subcontractors: number;
  shipping: number;
  otherCosts: number;
  contingencyPercent: number;
  overheadPercent: number;
  targetMarginPercent: number;
  processingPercent: number;
  processingFixed: number;
  salesTaxPercent: number;
  discountPercent: number;
  quantity: number;
};

const defaults: Inputs = {
  projectName: "Example project",
  pricingMode: "service",
  calculationMode: "target",
  proposedPrice: 8000,
  materials: 2400,
  laborHours: 32,
  laborRate: 65,
  equipment: 350,
  subcontractors: 0,
  shipping: 175,
  otherCosts: 125,
  contingencyPercent: 5,
  overheadPercent: 12,
  targetMarginPercent: 25,
  processingPercent: 2.9,
  processingFixed: 0.3,
  salesTaxPercent: 0,
  discountPercent: 5,
  quantity: 1,
};

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const percent = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

export default function PricingCalculatorClient() {
  const [inputs, setInputs] = useState<Inputs>(defaults);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const labor = inputs.laborHours * inputs.laborRate;
    const directCost =
      inputs.materials +
      labor +
      inputs.equipment +
      inputs.subcontractors +
      inputs.shipping +
      inputs.otherCosts;
    const contingency = directCost * (inputs.contingencyPercent / 100);
    const costWithContingency = directCost + contingency;
    const overhead = costWithContingency * (inputs.overheadPercent / 100);
    const totalCost = costWithContingency + overhead;
    const feeRate = inputs.processingPercent / 100;
    const targetMarginRate = inputs.targetMarginPercent / 100;
    const denominator = 1 - feeRate - targetMarginRate;
    const valid =
      totalCost >= 0 &&
      inputs.quantity > 0 &&
      denominator > 0 &&
      feeRate >= 0 &&
      feeRate < 1;
    const targetPrice = valid
      ? (totalCost + inputs.processingFixed) / denominator
      : 0;
    const sellingPrice = inputs.calculationMode === "reverse" ? inputs.proposedPrice : targetPrice;
    const processingFee = sellingPrice * feeRate + inputs.processingFixed;
    const profit = sellingPrice - totalCost - processingFee;
    const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
    const markup = totalCost > 0 ? (profit / totalCost) * 100 : 0;
    const salesTax = sellingPrice * (inputs.salesTaxPercent / 100);
    const customerTotal = sellingPrice + salesTax;
    const breakEvenPrice =
      feeRate < 1 ? (totalCost + inputs.processingFixed) / (1 - feeRate) : 0;
    const maximumDiscount =
      sellingPrice > 0
        ? Math.max(0, (1 - breakEvenPrice / sellingPrice) * 100)
        : 0;
    const discountedPrice = sellingPrice * (1 - inputs.discountPercent / 100);
    const discountedFee = discountedPrice * feeRate + inputs.processingFixed;
    const discountedProfit = discountedPrice - totalCost - discountedFee;
    const discountedMargin =
      discountedPrice > 0 ? (discountedProfit / discountedPrice) * 100 : 0;
    const quantity = Math.max(0, inputs.quantity);
    const maximumAllowableCost = Math.max(
      0,
      sellingPrice * (1 - targetMarginRate - feeRate) - inputs.processingFixed,
    );
    const targetAchieved = margin + 0.005 >= inputs.targetMarginPercent;

    const scenario = (label: string, marginPercent: number) => {
      const scenarioDenominator = 1 - feeRate - marginPercent / 100;
      const price = scenarioDenominator > 0
        ? (totalCost + inputs.processingFixed) / scenarioDenominator
        : 0;
      const fee = price * feeRate + inputs.processingFixed;
      const scenarioProfit = price - totalCost - fee;
      return { label, marginPercent, price, profit: scenarioProfit };
    };

    const scenarios = [
      scenario("Competitive", Math.max(0, inputs.targetMarginPercent - 5)),
      scenario("Standard", inputs.targetMarginPercent),
      scenario("Premium", Math.min(95, inputs.targetMarginPercent + 10)),
    ];

    return {
      labor,
      directCost,
      contingency,
      overhead,
      totalCost,
      sellingPrice,
      targetPrice,
      processingFee,
      profit,
      margin,
      markup,
      salesTax,
      customerTotal,
      breakEvenPrice,
      maximumDiscount,
      discountedPrice,
      discountedProfit,
      discountedMargin,
      quantityRevenue: sellingPrice * quantity,
      quantityProfit: profit * quantity,
      maximumAllowableCost,
      targetAchieved,
      scenarios,
      valid,
    };
  }, [inputs]);

  function update(key: keyof Inputs, raw: string) {
    const value = Number(raw);
    setInputs((current) => ({
      ...current,
      [key]: Number.isFinite(value) ? Math.max(0, value) : 0,
    }));
  }

  function updateText(key: "projectName" | "pricingMode" | "calculationMode", value: string) {
    setInputs((current) => ({ ...current, [key]: value } as Inputs));
  }

  async function copyResults() {
    const lines = [
      "Numeravo Business Pricing Calculator",
      `Pricing summary: ${inputs.projectName || "Untitled item or project"}`,
      `Pricing mode: ${inputs.pricingMode}`,
      `Total estimated cost: ${usd.format(result.totalCost)}`,
      `Recommended selling price: ${usd.format(result.sellingPrice)}`,
      `Customer total with tax: ${usd.format(result.customerTotal)}`,
      `Estimated profit: ${usd.format(result.profit)}`,
      `Profit margin: ${percent.format(result.margin)}%`,
      `Markup on cost: ${percent.format(result.markup)}%`,
      `Break-even price: ${usd.format(result.breakEvenPrice)}`,
      `Maximum estimated discount: ${percent.format(result.maximumDiscount)}%`,
      `Calculation method: ${inputs.calculationMode === "target" ? "Target-margin price" : "Proposed-price analysis"}`,
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function downloadCsv() {
    const rows = [
      ["Metric", "Value"],
      ["Project or item", inputs.projectName],
      ["Pricing mode", inputs.pricingMode],
      ["Materials", inputs.materials],
      ["Labor", result.labor],
      ["Equipment", inputs.equipment],
      ["Subcontractors", inputs.subcontractors],
      ["Shipping", inputs.shipping],
      ["Other costs", inputs.otherCosts],
      ["Contingency", result.contingency],
      ["Overhead", result.overhead],
      ["Total estimated cost", result.totalCost],
      ["Recommended selling price", result.sellingPrice],
      ["Processing fee", result.processingFee],
      ["Estimated profit", result.profit],
      ["Profit margin percent", result.margin],
      ["Markup percent", result.markup],
      ["Sales tax", result.salesTax],
      ["Customer total", result.customerTotal],
      ["Break-even price", result.breakEvenPrice],
      ["Maximum discount percent", result.maximumDiscount],
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "numeravo-business-pricing.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
      <div className="rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#22D3EE]">
              Pricing inputs
            </p>
            <h2 className="mt-2 text-2xl font-bold">Build your true cost</h2>
          </div>
          <button
            type="button"
            onClick={() => setInputs(defaults)}
            className="rounded-xl border border-[#374151] px-4 py-2 text-sm font-semibold hover:border-[#06B6D4]"
          >
            Reset calculator
          </button>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-[#CBD5E1]">Product, service, or project name</span>
            <input type="text" value={inputs.projectName} onChange={(event) => updateText("projectName", event.target.value)} className="w-full rounded-xl border border-[#374151] bg-[#0B0F19] px-4 py-3 text-white outline-none focus:border-[#06B6D4]" />
          </label>
          <SelectInput label="Pricing type" value={inputs.pricingMode} onChange={(value) => updateText("pricingMode", value)} options={[{ value: "service", label: "Service or job" }, { value: "product", label: "Product" }, { value: "wholesale", label: "Wholesale or resale" }]} />
          <SelectInput label="Calculation method" value={inputs.calculationMode} onChange={(value) => updateText("calculationMode", value)} options={[{ value: "target", label: "Calculate price from target margin" }, { value: "reverse", label: "Analyze a proposed selling price" }]} />
          {inputs.calculationMode === "reverse" && <MoneyInput label="Proposed selling price" value={inputs.proposedPrice} onChange={(v) => update("proposedPrice", v)} help="Enter the price the market or customer expects, then review the actual margin and allowable cost." />}
          <MoneyInput label="Direct materials and supplies" value={inputs.materials} onChange={(v) => update("materials", v)} help="Items consumed, installed, or resold for this product or job." />
          <MoneyInput label="Equipment and rentals" value={inputs.equipment} onChange={(v) => update("equipment", v)} help="Job-specific equipment, tool rental, or machinery expense." />
          <NumberInput label="Labor hours" value={inputs.laborHours} onChange={(v) => update("laborHours", v)} suffix="hours" step="0.5" />
          <MoneyInput label="Loaded labor rate" value={inputs.laborRate} onChange={(v) => update("laborRate", v)} suffix="per hour" />
          <MoneyInput label="Subcontractors" value={inputs.subcontractors} onChange={(v) => update("subcontractors", v)} help="Outside labor or specialty vendors hired specifically for the work." />
          <MoneyInput label="Shipping and delivery" value={inputs.shipping} onChange={(v) => update("shipping", v)} />
          <MoneyInput label="Other direct costs" value={inputs.otherCosts} onChange={(v) => update("otherCosts", v)} help="Permits, packaging, commissions, or other costs directly caused by the sale." />
          <NumberInput label="Contingency" value={inputs.contingencyPercent} onChange={(v) => update("contingencyPercent", v)} suffix="%" step="0.1" />
          <NumberInput label="Allocated overhead" value={inputs.overheadPercent} onChange={(v) => update("overheadPercent", v)} suffix="%" step="0.1" help="A share of indirect expenses such as office, software, vehicles, insurance, and administration." />
          <NumberInput label="Target profit margin" value={inputs.targetMarginPercent} onChange={(v) => update("targetMarginPercent", v)} suffix="%" step="0.1" />
          <NumberInput label="Processing fee" value={inputs.processingPercent} onChange={(v) => update("processingPercent", v)} suffix="%" step="0.1" />
          <MoneyInput label="Fixed transaction fee" value={inputs.processingFixed} onChange={(v) => update("processingFixed", v)} />
          <NumberInput label="Sales tax" value={inputs.salesTaxPercent} onChange={(v) => update("salesTaxPercent", v)} suffix="%" step="0.01" />
          <NumberInput label="Quantity" value={inputs.quantity} onChange={(v) => update("quantity", v)} suffix="units/jobs" step="1" />
        </div>

        <div className="mt-6 rounded-2xl border border-[#164E63] bg-[#083344]/25 p-5 text-sm leading-6 text-[#BAE6FD]">
          <strong className="text-white">{inputs.pricingMode === "service" ? "Service pricing:" : inputs.pricingMode === "product" ? "Product pricing:" : "Wholesale pricing:"}</strong>{" "}
          {inputs.pricingMode === "service" ? "Include loaded labor, job-specific materials, subcontractors, equipment, risk allowance, and allocated company overhead." : inputs.pricingMode === "product" ? "Include acquisition or production cost, packaging, fulfillment, returns allowance, selling fees, and overhead." : "Include unit acquisition cost, freight, handling, shrinkage, volume discounts, selling fees, and allocated overhead."}
        </div>

        <div className="mt-7 rounded-2xl border border-[#1F2937] bg-[#0B0F19] p-5">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="discount" className="font-semibold">Test a discount</label>
            <span className="text-[#22D3EE]">{percent.format(inputs.discountPercent)}%</span>
          </div>
          <input
            id="discount"
            type="range"
            min="0"
            max="50"
            step="0.5"
            value={inputs.discountPercent}
            onChange={(event) => update("discountPercent", event.target.value)}
            className="mt-4 w-full accent-[#06B6D4]"
          />
        </div>
      </div>

      <div className="space-y-6" aria-live="polite">
        <div className="rounded-3xl border border-[#164E63] bg-[#083344]/40 p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#22D3EE]">{inputs.calculationMode === "target" ? "Recommended price" : "Proposed price analysis"}</p>
          {!result.valid ? (
            <div className="mt-5 rounded-2xl border border-[#7F1D1D] bg-[#450A0A]/40 p-5 text-[#FCA5A5]">
              Target margin plus processing percentage must be less than 100%, and quantity must be greater than zero.
            </div>
          ) : (
            <>
              <p className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{usd.format(result.sellingPrice)}</p>
              <p className="mt-2 text-sm text-[#A0AEC0]">Before separately added sales tax</p>
              <p className="mt-4 rounded-xl border border-[#164E63] bg-[#0B0F19]/60 p-4 text-sm leading-6 text-[#BAE6FD]">At this price, the estimate produces <strong className="text-white">{percent.format(result.margin)}% margin</strong> and <strong className="text-white">{usd.format(result.profit)} profit</strong> after entered costs and processing fees.</p>
              <div className="mt-7 grid grid-cols-2 gap-3">
                <ResultCard label="Total cost" value={usd.format(result.totalCost)} />
                <ResultCard label="Profit" value={usd.format(result.profit)} />
                <ResultCard label="Margin" value={`${percent.format(result.margin)}%`} />
                <ResultCard label="Markup" value={`${percent.format(result.markup)}%`} />
                <ResultCard label="Processing fee" value={usd.format(result.processingFee)} />
                <ResultCard label="Customer total" value={usd.format(result.customerTotal)} />
                {inputs.calculationMode === "reverse" && <ResultCard label="Target-margin price" value={usd.format(result.targetPrice)} />}
                {inputs.calculationMode === "reverse" && <ResultCard label="Maximum cost for target" value={usd.format(result.maximumAllowableCost)} />}
              </div>
            </>
          )}
        </div>

        {result.valid && (
          <>
            <WarningPanel inputs={inputs} result={result} />
            <div className="rounded-3xl border border-[#1F2937] bg-[#121826] p-6">
              <h3 className="text-lg font-bold">Compare pricing positions</h3>
              <p className="mt-2 text-sm leading-6 text-[#A0AEC0]">Compare three margin positions without changing your primary calculation.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {result.scenarios.map((scenario) => <div key={scenario.label} className="rounded-2xl border border-[#1F2937] bg-[#0B0F19] p-4"><p className="text-sm font-semibold text-[#22D3EE]">{scenario.label}</p><p className="mt-2 text-xl font-bold">{usd.format(scenario.price)}</p><p className="mt-2 text-xs leading-5 text-[#A0AEC0]">{percent.format(scenario.marginPercent)}% margin · {usd.format(scenario.profit)} profit</p></div>)}
              </div>
            </div>
            <div className="rounded-3xl border border-[#1F2937] bg-[#121826] p-6">
              <h3 className="text-lg font-bold">Pricing guardrails</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <ResultCard label="Break-even price" value={usd.format(result.breakEvenPrice)} />
                <ResultCard label="Maximum estimated discount" value={`${percent.format(result.maximumDiscount)}%`} />
              </div>
              <p className="mt-4 text-sm leading-6 text-[#A0AEC0]">
                The estimated maximum discount reaches break-even. It leaves no profit buffer and should not be treated as a recommended discount.
              </p>
            </div>

            <div className={`rounded-3xl border p-6 ${result.discountedProfit >= 0 ? "border-[#164E63] bg-[#083344]/30" : "border-[#7F1D1D] bg-[#450A0A]/30"}`}>
              <h3 className="text-lg font-bold">Discount scenario</h3>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <ResultCard label="Discounted price" value={usd.format(result.discountedPrice)} />
                <ResultCard label="Profit after discount" value={usd.format(result.discountedProfit)} />
                <ResultCard label="Margin after discount" value={`${percent.format(result.discountedMargin)}%`} />
              </div>
            </div>

            <div className="rounded-3xl border border-[#1F2937] bg-[#121826] p-6">
              <h3 className="text-lg font-bold">Quantity projection</h3>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <ResultCard label={`${inputs.quantity} unit/job revenue`} value={usd.format(result.quantityRevenue)} />
                <ResultCard label={`${inputs.quantity} unit/job profit`} value={usd.format(result.quantityProfit)} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={copyResults} className="rounded-xl bg-[#06B6D4] px-4 py-3 font-semibold text-[#042F3A] hover:bg-[#22D3EE]">
                {copied ? "Copied" : "Copy results"}
              </button>
              <button type="button" onClick={downloadCsv} className="rounded-xl border border-[#374151] px-4 py-3 font-semibold hover:border-[#06B6D4]">
                Download CSV
              </button>
              <button type="button" onClick={() => window.print()} className="rounded-xl border border-[#374151] px-4 py-3 font-semibold hover:border-[#06B6D4] sm:col-span-2">
                Print pricing summary
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function MoneyInput({ label, value, onChange, suffix, help }: { label: string; value: number; onChange: (value: string) => void; suffix?: string; help?: string }) {
  return <Field label={label} prefix="$" suffix={suffix} help={help}><input type="number" min="0" step="0.01" value={value} onChange={(event) => onChange(event.target.value)} className="w-full bg-transparent py-3 pr-3 text-white outline-none" /></Field>;
}

function NumberInput({ label, value, onChange, suffix, step, help }: { label: string; value: number; onChange: (value: string) => void; suffix: string; step: string; help?: string }) {
  return <Field label={label} suffix={suffix} help={help}><input type="number" min="0" step={step} value={value} onChange={(event) => onChange(event.target.value)} className="w-full bg-transparent py-3 pl-3 text-white outline-none" /></Field>;
}

function Field({ label, prefix, suffix, help, children }: { label: string; prefix?: string; suffix?: string; help?: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 flex items-center gap-2 text-sm font-medium text-[#CBD5E1]">{label}{help && <span title={help} aria-label={help} className="inline-flex h-5 w-5 cursor-help items-center justify-center rounded-full border border-[#374151] text-xs text-[#A0AEC0]">?</span>}</span><span className="flex items-center rounded-xl border border-[#374151] bg-[#0B0F19] focus-within:border-[#06B6D4]">{prefix && <span className="pl-3 text-[#718096]">{prefix}</span>}{children}{suffix && <span className="whitespace-nowrap pr-3 text-sm text-[#718096]">{suffix}</span>}</span></label>;
}

function SelectInput({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium text-[#CBD5E1]">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-[#374151] bg-[#0B0F19] px-3 py-3 text-white outline-none focus:border-[#06B6D4]">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

function WarningPanel({ inputs, result }: { inputs: Inputs; result: { discountedProfit: number; targetAchieved: boolean; totalCost: number; sellingPrice: number; maximumDiscount: number } }) {
  const warnings: string[] = [];
  if (result.totalCost === 0) warnings.push("No costs are entered, so the result is not a reliable business price.");
  if (inputs.discountPercent > result.maximumDiscount) warnings.push("The tested discount pushes this estimate below break-even.");
  if (result.discountedProfit < 0) warnings.push("The discounted scenario produces an estimated loss.");
  if (inputs.calculationMode === "reverse" && !result.targetAchieved) warnings.push("The proposed price does not achieve the selected target margin.");
  if (inputs.salesTaxPercent > 0) warnings.push("Sales tax is shown separately and is not counted as business revenue or profit.");
  if (warnings.length === 0) return <div className="rounded-3xl border border-[#14532D] bg-[#052E16]/30 p-5 text-sm leading-6 text-[#BBF7D0]">No pricing guardrail warnings were triggered by the current inputs.</div>;
  return <div className="rounded-3xl border border-[#92400E] bg-[#451A03]/30 p-5"><h3 className="font-bold text-[#FDE68A]">Review before using this price</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-[#FDE68A]">{warnings.map((warning) => <li key={warning}>• {warning}</li>)}</ul></div>;
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-[#1F2937] bg-[#0B0F19] p-4"><p className="text-xs leading-5 text-[#A0AEC0]">{label}</p><p className="mt-1 break-words font-bold text-white">{value}</p></div>;
}
