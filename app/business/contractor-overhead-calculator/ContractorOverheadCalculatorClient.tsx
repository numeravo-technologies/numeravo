"use client";

import { useMemo, useState } from "react";

type Expense = { id: number; name: string; monthly: number };

const defaults: Expense[] = [
  { id: 1, name: "Office and shop rent", monthly: 2500 },
  { id: 2, name: "Office and management payroll", monthly: 6500 },
  { id: 3, name: "Insurance", monthly: 1800 },
  { id: 4, name: "Vehicles and equipment", monthly: 2200 },
  { id: 5, name: "Software, phones, and internet", monthly: 750 },
  { id: 6, name: "Marketing and professional fees", monthly: 1250 },
];

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const preciseMoney = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

export default function ContractorOverheadCalculatorClient() {
  const [expenses, setExpenses] = useState<Expense[]>(defaults);
  const [annualRevenue, setAnnualRevenue] = useState(1200000);
  const [billableHours, setBillableHours] = useState(12000);
  const [jobs, setJobs] = useState(120);
  const [directCost, setDirectCost] = useState(780000);
  const [targetProfit, setTargetProfit] = useState(12);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const monthlyOverhead = expenses.reduce((sum, item) => sum + Math.max(0, item.monthly || 0), 0);
    const annualOverhead = monthlyOverhead * 12;
    const overheadRateRevenue = annualRevenue > 0 ? (annualOverhead / annualRevenue) * 100 : 0;
    const overheadRateDirectCost = directCost > 0 ? (annualOverhead / directCost) * 100 : 0;
    const overheadPerHour = billableHours > 0 ? annualOverhead / billableHours : 0;
    const overheadPerJob = jobs > 0 ? annualOverhead / jobs : 0;
    const breakEvenRevenue = directCost + annualOverhead;
    const denominator = 1 - targetProfit / 100;
    const targetRevenue = denominator > 0 ? (directCost + annualOverhead) / denominator : 0;
    const revenueGap = targetRevenue - annualRevenue;
    return { monthlyOverhead, annualOverhead, overheadRateRevenue, overheadRateDirectCost, overheadPerHour, overheadPerJob, breakEvenRevenue, targetRevenue, revenueGap };
  }, [expenses, annualRevenue, billableHours, jobs, directCost, targetProfit]);

  function updateExpense(id: number, field: "name" | "monthly", value: string) {
    setExpenses((current) => current.map((item) => item.id === id ? { ...item, [field]: field === "monthly" ? Number(value) : value } : item));
  }

  function addExpense() {
    setExpenses((current) => [...current, { id: Date.now(), name: "Other overhead", monthly: 0 }]);
  }

  function removeExpense(id: number) {
    setExpenses((current) => current.filter((item) => item.id !== id));
  }

  function reset() {
    setExpenses(defaults);
    setAnnualRevenue(1200000);
    setBillableHours(12000);
    setJobs(120);
    setDirectCost(780000);
    setTargetProfit(12);
    setCopied(false);
  }

  function summary() {
    return [
      "Numeravo Contractor Overhead Calculator",
      `Monthly overhead: ${preciseMoney.format(result.monthlyOverhead)}`,
      `Annual overhead: ${preciseMoney.format(result.annualOverhead)}`,
      `Overhead as a percentage of revenue: ${number.format(result.overheadRateRevenue)}%`,
      `Overhead markup on direct cost: ${number.format(result.overheadRateDirectCost)}%`,
      `Overhead per billable hour: ${preciseMoney.format(result.overheadPerHour)}`,
      `Overhead per job: ${preciseMoney.format(result.overheadPerJob)}`,
      `Revenue required for target profit: ${preciseMoney.format(result.targetRevenue)}`,
    ].join("\n");
  }

  async function copyResults() {
    await navigator.clipboard.writeText(summary());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function downloadCsv() {
    const rows = [
      ["Numeravo Contractor Overhead Calculator"],
      [],
      ["Monthly overhead expenses"],
      ["Expense", "Monthly amount", "Annual amount"],
      ...expenses.map((item) => [item.name, item.monthly.toFixed(2), (item.monthly * 12).toFixed(2)]),
      [],
      ["Result", "Value"],
      ["Monthly overhead", result.monthlyOverhead.toFixed(2)],
      ["Annual overhead", result.annualOverhead.toFixed(2)],
      ["Overhead percent of revenue", result.overheadRateRevenue.toFixed(2)],
      ["Overhead markup on direct cost", result.overheadRateDirectCost.toFixed(2)],
      ["Overhead per billable hour", result.overheadPerHour.toFixed(2)],
      ["Overhead per job", result.overheadPerJob.toFixed(2)],
      ["Target revenue", result.targetRevenue.toFixed(2)],
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    link.download = "contractor-overhead-calculation.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
      <div className="space-y-6">
        <Panel title="Monthly overhead expenses" subtitle="Include recurring business costs that cannot be assigned directly to one job.">
          <div className="space-y-3">
            {expenses.map((item) => (
              <div key={item.id} className="grid gap-3 rounded-2xl border border-[#1F2937] bg-[#0B0F19] p-4 sm:grid-cols-[1fr_170px_auto] sm:items-end">
                <Field label="Expense">
                  <input value={item.name} onChange={(event) => updateExpense(item.id, "name", event.target.value)} className={inputClass} aria-label="Overhead expense name" />
                </Field>
                <Field label="Monthly cost">
                  <NumberInput value={item.monthly} onChange={(value) => updateExpense(item.id, "monthly", value)} />
                </Field>
                <button type="button" onClick={() => removeExpense(item.id)} className="rounded-xl border border-[#374151] px-4 py-3 text-sm font-semibold text-[#A0AEC0] hover:border-red-400 hover:text-red-300">Remove</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addExpense} className="mt-4 rounded-xl border border-[#06B6D4] px-4 py-3 font-semibold text-[#22D3EE] hover:bg-[#083344]">Add overhead expense</button>
        </Panel>

        <Panel title="Business activity" subtitle="Use annual figures from the same reporting period.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Annual revenue"><NumberInput value={annualRevenue} onChange={(value) => setAnnualRevenue(Number(value))} /></Field>
            <Field label="Annual direct job costs"><NumberInput value={directCost} onChange={(value) => setDirectCost(Number(value))} /></Field>
            <Field label="Annual billable hours"><NumberInput value={billableHours} onChange={(value) => setBillableHours(Number(value))} /></Field>
            <Field label="Jobs per year"><NumberInput value={jobs} onChange={(value) => setJobs(Number(value))} /></Field>
            <Field label="Target net profit margin (%)"><NumberInput value={targetProfit} onChange={(value) => setTargetProfit(Number(value))} step="0.1" /></Field>
          </div>
        </Panel>
      </div>

      <aside className="h-fit rounded-3xl border border-[#164E63] bg-[#121826] p-6 lg:sticky lg:top-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#22D3EE]">Overhead summary</p>
        <div className="mt-4 rounded-2xl bg-[#0B0F19] p-5">
          <p className="text-sm text-[#A0AEC0]">Annual overhead</p>
          <p className="mt-2 text-4xl font-bold text-white">{money.format(result.annualOverhead)}</p>
          <p className="mt-2 text-sm text-[#718096]">{preciseMoney.format(result.monthlyOverhead)} per month</p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <Result label="Overhead % of revenue" value={`${number.format(result.overheadRateRevenue)}%`} />
          <Result label="Markup on direct cost" value={`${number.format(result.overheadRateDirectCost)}%`} />
          <Result label="Overhead per hour" value={preciseMoney.format(result.overheadPerHour)} />
          <Result label="Overhead per job" value={preciseMoney.format(result.overheadPerJob)} />
        </div>

        <div className="mt-5 space-y-3 border-t border-[#1F2937] pt-5">
          <Threshold label="Estimated break-even revenue" value={money.format(result.breakEvenRevenue)} />
          <Threshold label={`Revenue for ${number.format(targetProfit)}% target profit`} value={money.format(result.targetRevenue)} />
          <Threshold label={result.revenueGap > 0 ? "Additional revenue required" : "Revenue above target"} value={money.format(Math.abs(result.revenueGap))} accent={result.revenueGap > 0 ? "warning" : "good"} />
        </div>

        <p className="mt-5 rounded-xl border border-[#374151] p-4 text-sm leading-6 text-[#A0AEC0]">
          Overhead is not the same as profit. Your prices must recover direct costs and overhead before generating profit.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={copyResults} className="rounded-xl bg-[#06B6D4] px-4 py-3 font-semibold text-[#06202A] hover:bg-[#22D3EE]">{copied ? "Copied" : "Copy results"}</button>
          <button type="button" onClick={downloadCsv} className="rounded-xl border border-[#374151] px-4 py-3 font-semibold hover:border-[#22D3EE]">Download CSV</button>
          <button type="button" onClick={() => window.print()} className="rounded-xl border border-[#374151] px-4 py-3 font-semibold hover:border-[#22D3EE]">Print</button>
          <button type="button" onClick={reset} className="rounded-xl border border-[#374151] px-4 py-3 font-semibold text-[#A0AEC0] hover:border-[#22D3EE]">Reset</button>
        </div>
      </aside>
    </section>
  );
}

const inputClass = "w-full rounded-xl border border-[#374151] bg-[#121826] px-4 py-3 text-white outline-none transition placeholder:text-[#4B5563] focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20";

function NumberInput({ value, onChange, step = "1" }: { value: number; onChange: (value: string) => void; step?: string }) {
  return <input type="number" min="0" step={step} value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} />;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium text-[#CBD5E1]">{label}</span>{children}</label>;
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8"><h2 className="text-xl font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-[#A0AEC0]">{subtitle}</p><div className="mt-5">{children}</div></section>;
}

function Result({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-[#1F2937] bg-[#0B0F19] p-4"><p className="text-xs uppercase tracking-wide text-[#718096]">{label}</p><p className="mt-2 text-xl font-bold text-white">{value}</p></div>;
}

function Threshold({ label, value, accent }: { label: string; value: string; accent?: "warning" | "good" }) {
  const color = accent === "warning" ? "text-amber-300" : accent === "good" ? "text-emerald-300" : "text-white";
  return <div className="flex items-center justify-between gap-4"><span className="text-sm text-[#A0AEC0]">{label}</span><strong className={color}>{value}</strong></div>;
}
