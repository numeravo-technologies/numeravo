"use client";

import { useMemo, useState } from "react";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const percent = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

type Inputs = {
  hourlyWage: number; hoursPerWeek: number; weeksPerYear: number; billablePercent: number;
  payrollTaxRate: number; workersCompRate: number; unemploymentRate: number;
  healthInsuranceAnnual: number; retirementAnnual: number; paidTimeOffHours: number;
  trainingAnnual: number; toolsAnnual: number; otherAnnual: number; targetMargin: number;
};

const defaults: Inputs = {
  hourlyWage: 28, hoursPerWeek: 40, weeksPerYear: 52, billablePercent: 75,
  payrollTaxRate: 7.65, workersCompRate: 6, unemploymentRate: 1.5,
  healthInsuranceAnnual: 7200, retirementAnnual: 1200, paidTimeOffHours: 120,
  trainingAnnual: 600, toolsAnnual: 1800, otherAnnual: 500, targetMargin: 30,
};

export default function ContractorLaborBurdenCalculatorClient() {
  const [values, setValues] = useState(defaults);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const paidHours = Math.max(0, values.hoursPerWeek * values.weeksPerYear);
    const productiveHours = Math.max(0, paidHours - values.paidTimeOffHours);
    const billableHours = productiveHours * Math.max(0, Math.min(100, values.billablePercent)) / 100;
    const baseWages = Math.max(0, values.hourlyWage) * paidHours;
    const payrollTaxes = baseWages * Math.max(0, values.payrollTaxRate) / 100;
    const workersComp = baseWages * Math.max(0, values.workersCompRate) / 100;
    const unemployment = baseWages * Math.max(0, values.unemploymentRate) / 100;
    const fixedBenefits = Math.max(0, values.healthInsuranceAnnual) + Math.max(0, values.retirementAnnual);
    const indirectCosts = Math.max(0, values.trainingAnnual) + Math.max(0, values.toolsAnnual) + Math.max(0, values.otherAnnual);
    const annualEmployerCost = baseWages + payrollTaxes + workersComp + unemployment + fixedBenefits + indirectCosts;
    const laborBurden = annualEmployerCost - baseWages;
    const burdenRate = baseWages > 0 ? laborBurden / baseWages * 100 : 0;
    const trueHourlyCost = paidHours > 0 ? annualEmployerCost / paidHours : 0;
    const costPerBillableHour = billableHours > 0 ? annualEmployerCost / billableHours : 0;
    const margin = Math.max(0, Math.min(99.99, values.targetMargin)) / 100;
    const recommendedBillingRate = costPerBillableHour / (1 - margin);
    return { paidHours, productiveHours, billableHours, baseWages, payrollTaxes, workersComp, unemployment, fixedBenefits, indirectCosts, annualEmployerCost, laborBurden, burdenRate, trueHourlyCost, costPerBillableHour, recommendedBillingRate };
  }, [values]);

  const set = (key: keyof Inputs, value: number) => setValues((current) => ({ ...current, [key]: Number.isFinite(value) ? value : 0 }));
  const summary = [
    "Numeravo Contractor Labor Burden Calculator",
    `Annual employer cost: ${money.format(result.annualEmployerCost)}`,
    `Labor burden: ${money.format(result.laborBurden)} (${percent.format(result.burdenRate)}%)`,
    `Cost per billable hour: ${money.format(result.costPerBillableHour)}`,
    `Recommended billing rate: ${money.format(result.recommendedBillingRate)}`,
  ].join("\n");

  async function copyResults() { await navigator.clipboard.writeText(summary); setCopied(true); window.setTimeout(() => setCopied(false), 1600); }
  function downloadCsv() {
    const rows = [["Numeravo Contractor Labor Burden Calculator"], ["Metric", "Value"], ["Annual base wages", result.baseWages.toFixed(2)], ["Annual labor burden", result.laborBurden.toFixed(2)], ["Labor burden rate", result.burdenRate.toFixed(2)], ["Annual employer cost", result.annualEmployerCost.toFixed(2)], ["Paid hours", result.paidHours.toFixed(2)], ["Billable hours", result.billableHours.toFixed(2)], ["True hourly cost", result.trueHourlyCost.toFixed(2)], ["Cost per billable hour", result.costPerBillableHour.toFixed(2)], ["Recommended billing rate", result.recommendedBillingRate.toFixed(2)]];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "contractor-labor-burden.csv"; link.click(); URL.revokeObjectURL(url);
  }

  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
      <div className="rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
        <h2 className="text-2xl font-bold">Employee cost inputs</h2>
        <p className="mt-2 text-sm leading-6 text-[#A0AEC0]">Enter one employee’s wages, employer-paid costs, and expected billable utilization.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Hourly wage" value={values.hourlyWage} onChange={(v) => set("hourlyWage", v)} prefix="$" />
          <Field label="Paid hours per week" value={values.hoursPerWeek} onChange={(v) => set("hoursPerWeek", v)} />
          <Field label="Working weeks per year" value={values.weeksPerYear} onChange={(v) => set("weeksPerYear", v)} />
          <Field label="Billable utilization" value={values.billablePercent} onChange={(v) => set("billablePercent", v)} suffix="%" />
          <Field label="Employer payroll taxes" value={values.payrollTaxRate} onChange={(v) => set("payrollTaxRate", v)} suffix="%" />
          <Field label="Workers’ compensation" value={values.workersCompRate} onChange={(v) => set("workersCompRate", v)} suffix="%" />
          <Field label="Unemployment taxes" value={values.unemploymentRate} onChange={(v) => set("unemploymentRate", v)} suffix="%" />
          <Field label="Paid time off hours" value={values.paidTimeOffHours} onChange={(v) => set("paidTimeOffHours", v)} />
          <Field label="Health insurance per year" value={values.healthInsuranceAnnual} onChange={(v) => set("healthInsuranceAnnual", v)} prefix="$" />
          <Field label="Retirement contribution per year" value={values.retirementAnnual} onChange={(v) => set("retirementAnnual", v)} prefix="$" />
          <Field label="Training per year" value={values.trainingAnnual} onChange={(v) => set("trainingAnnual", v)} prefix="$" />
          <Field label="Tools and PPE per year" value={values.toolsAnnual} onChange={(v) => set("toolsAnnual", v)} prefix="$" />
          <Field label="Other employee costs per year" value={values.otherAnnual} onChange={(v) => set("otherAnnual", v)} prefix="$" />
          <Field label="Target profit margin" value={values.targetMargin} onChange={(v) => set("targetMargin", v)} suffix="%" />
        </div>
      </div>

      <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-3xl border border-[#155E75] bg-gradient-to-br from-[#0E2734] to-[#121826] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#22D3EE]">Fully burdened labor cost</p>
          <p className="mt-3 text-4xl font-bold">{money.format(result.costPerBillableHour)}<span className="text-lg text-[#A0AEC0]"> / billable hour</span></p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Result label="Annual employer cost" value={money.format(result.annualEmployerCost)} />
            <Result label="Annual labor burden" value={money.format(result.laborBurden)} />
            <Result label="Labor burden rate" value={`${percent.format(result.burdenRate)}%`} />
            <Result label="True cost per paid hour" value={money.format(result.trueHourlyCost)} />
            <Result label="Annual billable hours" value={percent.format(result.billableHours)} />
            <Result label="Recommended billing rate" value={money.format(result.recommendedBillingRate)} />
          </div>
        </div>
        <div className="rounded-3xl border border-[#1F2937] bg-[#121826] p-6">
          <h3 className="font-semibold">Annual cost breakdown</h3>
          <div className="mt-4 space-y-3 text-sm"><Line label="Base wages" value={result.baseWages} /><Line label="Payroll taxes" value={result.payrollTaxes} /><Line label="Workers’ compensation" value={result.workersComp} /><Line label="Unemployment taxes" value={result.unemployment} /><Line label="Insurance and retirement" value={result.fixedBenefits} /><Line label="Training, tools, and other" value={result.indirectCosts} /></div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={copyResults} className="rounded-xl bg-[#06B6D4] px-4 py-3 font-semibold text-[#06202A] hover:bg-[#22D3EE]">{copied ? "Copied" : "Copy results"}</button>
            <button type="button" onClick={downloadCsv} className="rounded-xl border border-[#374151] px-4 py-3 font-semibold hover:border-[#22D3EE]">Download CSV</button>
            <button type="button" onClick={() => window.print()} className="rounded-xl border border-[#374151] px-4 py-3 font-semibold hover:border-[#22D3EE]">Print</button>
            <button type="button" onClick={() => setValues(defaults)} className="rounded-xl border border-[#374151] px-4 py-3 font-semibold text-[#A0AEC0] hover:border-[#22D3EE]">Reset</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, prefix, suffix }: { label: string; value: number; onChange: (value: number) => void; prefix?: string; suffix?: string }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium text-[#CBD5E1]">{label}</span><span className="flex items-center rounded-xl border border-[#374151] bg-[#0B0F19] focus-within:border-[#22D3EE] focus-within:ring-2 focus-within:ring-[#22D3EE]/20">{prefix && <span className="pl-4 text-[#718096]">{prefix}</span>}<input type="number" min="0" step="any" value={value} onChange={(e) => onChange(e.target.valueAsNumber)} className="w-full bg-transparent px-3 py-3 text-white outline-none" />{suffix && <span className="pr-4 text-[#718096]">{suffix}</span>}</span></label>;
}
function Result({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-[#1F2937] bg-[#0B0F19]/70 p-4"><p className="text-xs uppercase tracking-wide text-[#718096]">{label}</p><p className="mt-2 text-xl font-semibold">{value}</p></div>; }
function Line({ label, value }: { label: string; value: number }) { return <div className="flex justify-between gap-4 border-b border-[#1F2937] pb-3"><span className="text-[#A0AEC0]">{label}</span><strong>{money.format(value)}</strong></div>; }
