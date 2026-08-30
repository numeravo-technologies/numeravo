"use client";

import { useMemo, useState } from "react";

type CostKey = "labor" | "materials" | "equipment" | "subcontractors" | "permits" | "other";
type CostRow = { key: CostKey; label: string; estimated: number; actual: number };

const initialCosts: CostRow[] = [
  { key: "labor", label: "Labor", estimated: 18000, actual: 19250 },
  { key: "materials", label: "Materials", estimated: 24000, actual: 25750 },
  { key: "equipment", label: "Equipment and rentals", estimated: 3500, actual: 3900 },
  { key: "subcontractors", label: "Subcontractors", estimated: 9000, actual: 9000 },
  { key: "permits", label: "Permits and inspections", estimated: 1200, actual: 1350 },
  { key: "other", label: "Other direct costs", estimated: 800, actual: 1100 },
];

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const percent = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const n = (value: number) => (Number.isFinite(value) && value > 0 ? value : 0);

export default function ContractorJobProfitCalculatorClient() {
  const [projectName, setProjectName] = useState("Commercial renovation");
  const [quotedPrice, setQuotedPrice] = useState(85000);
  const [changeOrders, setChangeOrders] = useState(4500);
  const [revenueCollected, setRevenueCollected] = useState(70000);
  const [targetMargin, setTargetMargin] = useState(25);
  const [overheadRate, setOverheadRate] = useState(10);
  const [contingencyRate, setContingencyRate] = useState(5);
  const [feeRate, setFeeRate] = useState(2.9);
  const [fixedFee, setFixedFee] = useState(0.3);
  const [costs, setCosts] = useState<CostRow[]>(initialCosts);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const contractRevenue = n(quotedPrice) + n(changeOrders);
    const estimatedDirect = costs.reduce((sum, row) => sum + n(row.estimated), 0);
    const actualDirect = costs.reduce((sum, row) => sum + n(row.actual), 0);
    const estimatedOverhead = estimatedDirect * n(overheadRate) / 100;
    const actualOverhead = actualDirect * n(overheadRate) / 100;
    const estimatedContingency = estimatedDirect * n(contingencyRate) / 100;
    const estimatedFee = contractRevenue * n(feeRate) / 100 + (contractRevenue > 0 ? n(fixedFee) : 0);
    const actualFee = n(revenueCollected) * n(feeRate) / 100 + (revenueCollected > 0 ? n(fixedFee) : 0);
    const estimatedCost = estimatedDirect + estimatedOverhead + estimatedContingency + estimatedFee;
    const actualCost = actualDirect + actualOverhead + actualFee;
    const estimatedProfit = contractRevenue - estimatedCost;
    const actualProfit = contractRevenue - actualCost;
    const estimatedMargin = contractRevenue > 0 ? estimatedProfit / contractRevenue * 100 : 0;
    const actualMargin = contractRevenue > 0 ? actualProfit / contractRevenue * 100 : 0;
    const costVariance = actualCost - estimatedCost;
    const profitVariance = actualProfit - estimatedProfit;
    const outstanding = Math.max(contractRevenue - n(revenueCollected), 0);
    const marginRate = Math.min(Math.max(n(targetMargin) / 100, 0), 0.99);
    const feeDecimal = Math.min(Math.max(n(feeRate) / 100, 0), 0.99);
    const denominator = 1 - marginRate - feeDecimal;
    const targetPrice = denominator > 0
      ? (estimatedDirect + estimatedOverhead + estimatedContingency + n(fixedFee)) / denominator
      : 0;
    const breakEvenRevenue = feeDecimal < 1
      ? (actualDirect + actualOverhead + n(fixedFee)) / (1 - feeDecimal)
      : 0;
    return { contractRevenue, estimatedDirect, actualDirect, estimatedOverhead, actualOverhead, estimatedContingency, estimatedFee, actualFee, estimatedCost, actualCost, estimatedProfit, actualProfit, estimatedMargin, actualMargin, costVariance, profitVariance, outstanding, targetPrice, breakEvenRevenue };
  }, [quotedPrice, changeOrders, revenueCollected, targetMargin, overheadRate, contingencyRate, feeRate, fixedFee, costs]);

  const updateCost = (key: CostKey, field: "estimated" | "actual", value: number) => {
    setCosts(rows => rows.map(row => row.key === key ? { ...row, [field]: value } : row));
  };

  const summary = () => [
    "Numeravo Contractor Job Profit Calculator",
    `Project: ${projectName || "Untitled project"}`,
    `Contract revenue: ${money.format(result.contractRevenue)}`,
    `Estimated total cost: ${money.format(result.estimatedCost)}`,
    `Actual total cost: ${money.format(result.actualCost)}`,
    `Estimated profit: ${money.format(result.estimatedProfit)} (${percent.format(result.estimatedMargin)}%)`,
    `Actual profit: ${money.format(result.actualProfit)} (${percent.format(result.actualMargin)}%)`,
    `Cost variance: ${money.format(result.costVariance)}`,
    `Profit variance: ${money.format(result.profitVariance)}`,
    `Outstanding revenue: ${money.format(result.outstanding)}`,
    `Required price for ${percent.format(targetMargin)}% margin: ${money.format(result.targetPrice)}`,
    `Break-even revenue: ${money.format(result.breakEvenRevenue)}`,
  ].join("\n");

  const copySummary = async () => {
    await navigator.clipboard.writeText(summary());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const downloadCsv = () => {
    const rows = [
      ["Numeravo Contractor Job Profit Calculator"],
      ["Project", projectName],
      [],
      ["Cost category", "Estimated", "Actual", "Variance"],
      ...costs.map(row => [row.label, row.estimated.toFixed(2), row.actual.toFixed(2), (row.actual - row.estimated).toFixed(2)]),
      ["Allocated overhead", result.estimatedOverhead.toFixed(2), result.actualOverhead.toFixed(2), (result.actualOverhead - result.estimatedOverhead).toFixed(2)],
      ["Contingency reserve", result.estimatedContingency.toFixed(2), "0.00", (-result.estimatedContingency).toFixed(2)],
      ["Payment fees", result.estimatedFee.toFixed(2), result.actualFee.toFixed(2), (result.actualFee - result.estimatedFee).toFixed(2)],
      ["Total cost", result.estimatedCost.toFixed(2), result.actualCost.toFixed(2), result.costVariance.toFixed(2)],
      [],
      ["Contract revenue", result.contractRevenue.toFixed(2)],
      ["Revenue collected", n(revenueCollected).toFixed(2)],
      ["Outstanding revenue", result.outstanding.toFixed(2)],
      ["Estimated profit", result.estimatedProfit.toFixed(2)],
      ["Actual profit", result.actualProfit.toFixed(2)],
      ["Estimated margin", `${result.estimatedMargin.toFixed(2)}%`],
      ["Actual margin", `${result.actualMargin.toFixed(2)}%`],
      ["Required target-margin price", result.targetPrice.toFixed(2)],
      ["Break-even revenue", result.breakEvenRevenue.toFixed(2)],
    ];
    const csv = rows.map(row => row.map(value => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "contractor-job-profit-analysis.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setProjectName("Commercial renovation"); setQuotedPrice(85000); setChangeOrders(4500);
    setRevenueCollected(70000); setTargetMargin(25); setOverheadRate(10);
    setContingencyRate(5); setFeeRate(2.9); setFixedFee(0.3);
    setCosts(initialCosts);
  };

  const loss = result.actualProfit < 0;
  const overBudget = result.costVariance > 0;

  return (
    <section className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,.85fr)]">
      <div className="space-y-6">
        <Panel title="Project and revenue">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Project name" value={projectName} onChange={setProjectName} />
            <NumberInput label="Original quoted price" value={quotedPrice} onChange={setQuotedPrice} prefix="$" />
            <NumberInput label="Approved change orders" value={changeOrders} onChange={setChangeOrders} prefix="$" />
            <NumberInput label="Revenue collected" value={revenueCollected} onChange={setRevenueCollected} prefix="$" />
          </div>
        </Panel>

        <Panel title="Estimated versus actual direct costs">
          <div className="overflow-x-auto">
            <div className="min-w-[620px]">
              <div className="grid grid-cols-[1fr_150px_150px_120px] gap-3 border-b border-[#1F2937] pb-3 text-xs font-semibold uppercase tracking-wider text-[#718096]">
                <span>Cost category</span><span>Estimated</span><span>Actual</span><span>Variance</span>
              </div>
              {costs.map(row => {
                const variance = n(row.actual) - n(row.estimated);
                return <div key={row.key} className="grid grid-cols-[1fr_150px_150px_120px] items-center gap-3 border-b border-[#1F2937] py-3 last:border-0">
                  <span className="font-medium">{row.label}</span>
                  <CompactNumber value={row.estimated} onChange={value => updateCost(row.key, "estimated", value)} />
                  <CompactNumber value={row.actual} onChange={value => updateCost(row.key, "actual", value)} />
                  <span className={variance > 0 ? "text-amber-300" : variance < 0 ? "text-emerald-300" : "text-[#A0AEC0]"}>{money.format(variance)}</span>
                </div>;
              })}
            </div>
          </div>
        </Panel>

        <Panel title="Overhead, contingency, fees, and target">
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput label="Overhead allocation" value={overheadRate} onChange={setOverheadRate} suffix="%" help="Applied to direct job costs." />
            <NumberInput label="Estimated contingency" value={contingencyRate} onChange={setContingencyRate} suffix="%" help="Reserve included in the estimate." />
            <NumberInput label="Payment fee rate" value={feeRate} onChange={setFeeRate} suffix="%" />
            <NumberInput label="Fixed payment fee" value={fixedFee} onChange={setFixedFee} prefix="$" />
            <NumberInput label="Target profit margin" value={targetMargin} onChange={setTargetMargin} suffix="%" help="Used to calculate the required selling price." />
          </div>
          {targetMargin + feeRate >= 100 && <p role="alert" className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">Target margin plus percentage fees must be less than 100% to calculate a required price.</p>}
        </Panel>
      </div>

      <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
        <div className="rounded-3xl border border-[#164E63] bg-gradient-to-br from-[#0E2633] to-[#121826] p-6 shadow-2xl shadow-cyan-950/20">
          <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#22D3EE]">Actual job performance</p>
          <p className={`mt-3 text-4xl font-bold ${loss ? "text-rose-300" : "text-white"}`}>{money.format(result.actualProfit)}</p>
          <p className="mt-2 text-[#A0AEC0]">Actual profit · {percent.format(result.actualMargin)}% margin</p>
          <div className={`mt-5 rounded-2xl border p-4 ${loss ? "border-rose-500/40 bg-rose-500/10 text-rose-200" : overBudget ? "border-amber-500/40 bg-amber-500/10 text-amber-200" : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"}`}>
            <p className="font-semibold">{loss ? "Job is currently unprofitable" : overBudget ? "Costs are above estimate" : "Costs are at or below estimate"}</p>
            <p className="mt-1 text-sm opacity-90">{loss ? "Review unbilled change orders, remaining costs, and contract recovery options." : `Cost variance: ${money.format(result.costVariance)}.`}</p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <ResultCard label="Contract revenue" value={money.format(result.contractRevenue)} />
            <ResultCard label="Revenue collected" value={money.format(n(revenueCollected))} />
            <ResultCard label="Outstanding" value={money.format(result.outstanding)} />
            <ResultCard label="Actual total cost" value={money.format(result.actualCost)} />
            <ResultCard label="Estimated profit" value={money.format(result.estimatedProfit)} sub={`${percent.format(result.estimatedMargin)}% margin`} />
            <ResultCard label="Profit variance" value={money.format(result.profitVariance)} tone={result.profitVariance < 0 ? "bad" : "good"} />
          </div>
        </div>

        <Panel title="Pricing thresholds">
          <div className="space-y-3">
            <Threshold label="Required price for target margin" value={money.format(result.targetPrice)} detail={`${percent.format(targetMargin)}% target margin`} />
            <Threshold label="Break-even revenue" value={money.format(result.breakEvenRevenue)} detail="Based on actual costs and fees" />
            <Threshold label="Estimated contingency reserve" value={money.format(result.estimatedContingency)} detail="Included in estimated total cost" />
          </div>
        </Panel>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={copySummary} className="rounded-xl bg-[#06B6D4] px-4 py-3 font-bold text-[#042F3A] hover:bg-[#22D3EE]">{copied ? "Copied" : "Copy summary"}</button>
          <button onClick={downloadCsv} className="rounded-xl border border-[#374151] px-4 py-3 font-semibold hover:border-[#22D3EE]">Download CSV</button>
          <button onClick={() => window.print()} className="rounded-xl border border-[#374151] px-4 py-3 font-semibold hover:border-[#22D3EE]">Print analysis</button>
          <button onClick={reset} className="rounded-xl border border-[#374151] px-4 py-3 font-semibold text-[#A0AEC0] hover:border-[#22D3EE] hover:text-white">Reset calculator</button>
        </div>
        <p className="text-xs leading-5 text-[#718096]">Estimates exclude income taxes and financing costs. Actual job profitability requires complete, accurate cost and revenue records.</p>
      </aside>
    </section>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-[#1F2937] bg-[#121826] p-5 sm:p-6"><h2 className="text-xl font-bold">{title}</h2><div className="mt-5">{children}</div></section>;
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium text-[#CBD5E1]">{label}</span><input value={value} onChange={event => onChange(event.target.value)} className="w-full rounded-xl border border-[#374151] bg-[#0B0F19] px-4 py-3 outline-none focus:border-[#22D3EE]" /></label>;
}

function NumberInput({ label, value, onChange, prefix, suffix, help }: { label: string; value: number; onChange: (value: number) => void; prefix?: string; suffix?: string; help?: string }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium text-[#CBD5E1]">{label}</span><div className="flex rounded-xl border border-[#374151] bg-[#0B0F19] focus-within:border-[#22D3EE]">{prefix && <span className="px-3 py-3 text-[#718096]">{prefix}</span>}<input type="number" min="0" step="any" value={value} onChange={event => onChange(Number(event.target.value))} className="min-w-0 flex-1 bg-transparent px-3 py-3 outline-none" />{suffix && <span className="px-3 py-3 text-[#718096]">{suffix}</span>}</div>{help && <span className="mt-1 block text-xs text-[#718096]">{help}</span>}</label>;
}

function CompactNumber({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return <div className="flex rounded-lg border border-[#374151] bg-[#0B0F19] focus-within:border-[#22D3EE]"><span className="py-2 pl-3 text-[#718096]">$</span><input aria-label="Cost amount" type="number" min="0" step="any" value={value} onChange={event => onChange(Number(event.target.value))} className="min-w-0 w-full bg-transparent px-2 py-2 outline-none" /></div>;
}

function ResultCard({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "good" | "bad" }) {
  const color = tone === "good" ? "text-emerald-300" : tone === "bad" ? "text-rose-300" : "text-white";
  return <div className="rounded-2xl border border-[#1F2937] bg-[#0B0F19]/70 p-4"><p className="text-xs uppercase tracking-wider text-[#718096]">{label}</p><p className={`mt-2 text-lg font-bold ${color}`}>{value}</p>{sub && <p className="mt-1 text-xs text-[#A0AEC0]">{sub}</p>}</div>;
}

function Threshold({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-2xl border border-[#1F2937] bg-[#0B0F19] p-4"><div className="flex items-start justify-between gap-4"><p className="font-medium">{label}</p><p className="font-bold text-[#22D3EE]">{value}</p></div><p className="mt-2 text-xs text-[#718096]">{detail}</p></div>;
}
