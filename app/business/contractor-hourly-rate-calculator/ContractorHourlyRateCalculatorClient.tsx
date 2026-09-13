"use client";

import { useMemo, useState } from "react";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const percent = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

type Inputs = {
  hourlyWage: number;
  laborBurdenRate: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  billablePercent: number;
  annualOverhead: number;
  overheadAllocationPercent: number;
  targetMargin: number;
  paymentProcessingRate: number;
};

const defaults: Inputs = {
  hourlyWage: 30,
  laborBurdenRate: 35,
  hoursPerWeek: 40,
  weeksPerYear: 52,
  billablePercent: 70,
  annualOverhead: 120000,
  overheadAllocationPercent: 25,
  targetMargin: 30,
  paymentProcessingRate: 3,
};

export default function ContractorHourlyRateCalculatorClient() {
  const [values, setValues] = useState(defaults);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hourlyWage = Math.max(0, values.hourlyWage);

    const laborBurdenRate =
      Math.max(0, values.laborBurdenRate) / 100;

    const paidHours =
      Math.max(0, values.hoursPerWeek) *
      Math.max(0, values.weeksPerYear);

    const billablePercent =
      Math.max(0, Math.min(100, values.billablePercent)) / 100;

    const billableHours = paidHours * billablePercent;

    const annualBaseWages = hourlyWage * paidHours;

    const annualLaborBurden =
      annualBaseWages * laborBurdenRate;

    const annualLaborCost =
      annualBaseWages + annualLaborBurden;

    const overheadAllocationPercent =
      Math.max(0, Math.min(100, values.overheadAllocationPercent)) / 100;

    const allocatedOverhead =
      Math.max(0, values.annualOverhead) *
      overheadAllocationPercent;

    const annualCostRequirement =
      annualLaborCost + allocatedOverhead;

    const costPerPaidHour =
      paidHours > 0
        ? annualCostRequirement / paidHours
        : 0;

    const costPerBillableHour =
      billableHours > 0
        ? annualCostRequirement / billableHours
        : 0;

    const targetMargin =
      Math.max(0, Math.min(99.99, values.targetMargin)) / 100;

    const rateBeforePaymentFees =
      costPerBillableHour / (1 - targetMargin);

    const paymentProcessingRate =
      Math.max(0, Math.min(99.99, values.paymentProcessingRate)) / 100;

    const recommendedHourlyRate =
      rateBeforePaymentFees / (1 - paymentProcessingRate);

    const annualRevenueTarget =
      recommendedHourlyRate * billableHours;

    const annualPaymentFees =
      annualRevenueTarget * paymentProcessingRate;

    const annualGrossProfit =
      annualRevenueTarget -
      annualPaymentFees -
      annualCostRequirement;

    const effectiveMargin =
      annualRevenueTarget > 0
        ? (annualGrossProfit / annualRevenueTarget) * 100
        : 0;

    const overheadPerBillableHour =
      billableHours > 0
        ? allocatedOverhead / billableHours
        : 0;

    const laborCostPerBillableHour =
      billableHours > 0
        ? annualLaborCost / billableHours
        : 0;

    return {
      paidHours,
      billableHours,
      annualBaseWages,
      annualLaborBurden,
      annualLaborCost,
      allocatedOverhead,
      annualCostRequirement,
      costPerPaidHour,
      costPerBillableHour,
      laborCostPerBillableHour,
      overheadPerBillableHour,
      rateBeforePaymentFees,
      recommendedHourlyRate,
      annualRevenueTarget,
      annualPaymentFees,
      annualGrossProfit,
      effectiveMargin,
    };
  }, [values]);

  const set = (key: keyof Inputs, value: number) => {
    setValues((current) => ({
      ...current,
      [key]: Number.isFinite(value) ? value : 0,
    }));
  };

  const summary = [
    "Numeravo Contractor Hourly Rate Calculator",
    `Recommended hourly rate: ${money.format(result.recommendedHourlyRate)}`,
    `Cost per billable hour: ${money.format(result.costPerBillableHour)}`,
    `Rate before payment fees: ${money.format(result.rateBeforePaymentFees)}`,
    `Annual billable hours: ${percent.format(result.billableHours)}`,
    `Annual revenue target: ${money.format(result.annualRevenueTarget)}`,
    `Annual cost requirement: ${money.format(result.annualCostRequirement)}`,
  ].join("\n");

  async function copyResults() {
    await navigator.clipboard.writeText(summary);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1600);
  }

  function downloadCsv() {
    const rows = [
      ["Numeravo Contractor Hourly Rate Calculator"],
      ["Metric", "Value"],
      ["Hourly wage", values.hourlyWage.toFixed(2)],
      ["Labor burden rate", values.laborBurdenRate.toFixed(2)],
      ["Annual paid hours", result.paidHours.toFixed(2)],
      ["Annual billable hours", result.billableHours.toFixed(2)],
      ["Annual base wages", result.annualBaseWages.toFixed(2)],
      ["Annual labor burden", result.annualLaborBurden.toFixed(2)],
      ["Annual labor cost", result.annualLaborCost.toFixed(2)],
      ["Allocated annual overhead", result.allocatedOverhead.toFixed(2)],
      ["Annual cost requirement", result.annualCostRequirement.toFixed(2)],
      ["Labor cost per billable hour", result.laborCostPerBillableHour.toFixed(2)],
      ["Overhead per billable hour", result.overheadPerBillableHour.toFixed(2)],
      ["Total cost per billable hour", result.costPerBillableHour.toFixed(2)],
      ["Rate before payment fees", result.rateBeforePaymentFees.toFixed(2)],
      ["Recommended hourly rate", result.recommendedHourlyRate.toFixed(2)],
      ["Annual revenue target", result.annualRevenueTarget.toFixed(2)],
      ["Annual payment processing fees", result.annualPaymentFees.toFixed(2)],
      ["Annual gross profit after payment fees", result.annualGrossProfit.toFixed(2)],
    ];

    const csv = rows
      .map((row) =>
        row
          .map(
            (cell) =>
              `"${String(cell).replaceAll('"', '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], {
        type: "text/csv;charset=utf-8",
      })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "contractor-hourly-rate.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
      <div className="rounded-3xl border border-[#1F2937] bg-[#121826] p-6 md:p-8">
        <h2 className="text-2xl font-bold">Hourly rate inputs</h2>

        <p className="mt-2 text-sm leading-6 text-[#A0AEC0]">
          Enter labor cost, overhead, billable utilization, and your target
          margin to estimate a sustainable hourly billing rate.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field
            label="Hourly wage"
            value={values.hourlyWage}
            onChange={(v) => set("hourlyWage", v)}
            prefix="$"
          />

          <Field
            label="Labor burden rate"
            value={values.laborBurdenRate}
            onChange={(v) => set("laborBurdenRate", v)}
            suffix="%"
          />

          <Field
            label="Paid hours per week"
            value={values.hoursPerWeek}
            onChange={(v) => set("hoursPerWeek", v)}
          />

          <Field
            label="Working weeks per year"
            value={values.weeksPerYear}
            onChange={(v) => set("weeksPerYear", v)}
          />

          <Field
            label="Billable utilization"
            value={values.billablePercent}
            onChange={(v) => set("billablePercent", v)}
            suffix="%"
          />

          <Field
            label="Total annual business overhead"
            value={values.annualOverhead}
            onChange={(v) => set("annualOverhead", v)}
            prefix="$"
          />

          <Field
            label="Overhead allocated to this worker"
            value={values.overheadAllocationPercent}
            onChange={(v) => set("overheadAllocationPercent", v)}
            suffix="%"
          />

          <Field
            label="Target profit margin"
            value={values.targetMargin}
            onChange={(v) => set("targetMargin", v)}
            suffix="%"
          />

          <Field
            label="Payment processing rate"
            value={values.paymentProcessingRate}
            onChange={(v) => set("paymentProcessingRate", v)}
            suffix="%"
          />
        </div>
      </div>

      <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-3xl border border-[#155E75] bg-gradient-to-br from-[#0E2734] to-[#121826] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#22D3EE]">
            Recommended hourly rate
          </p>

          <p className="mt-3 text-4xl font-bold">
            {money.format(result.recommendedHourlyRate)}
            <span className="text-lg text-[#A0AEC0]">
              {" "}
              / billable hour
            </span>
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Result
              label="Cost per billable hour"
              value={money.format(result.costPerBillableHour)}
            />

            <Result
              label="Labor cost per billable hour"
              value={money.format(result.laborCostPerBillableHour)}
            />

            <Result
              label="Overhead per billable hour"
              value={money.format(result.overheadPerBillableHour)}
            />

            <Result
              label="Rate before payment fees"
              value={money.format(result.rateBeforePaymentFees)}
            />

            <Result
              label="Annual billable hours"
              value={percent.format(result.billableHours)}
            />

            <Result
              label="Annual revenue target"
              value={money.format(result.annualRevenueTarget)}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-[#1F2937] bg-[#121826] p-6">
          <h3 className="font-semibold">Annual pricing breakdown</h3>

          <div className="mt-4 space-y-3 text-sm">
            <Line
              label="Base wages"
              value={result.annualBaseWages}
            />

            <Line
              label="Labor burden"
              value={result.annualLaborBurden}
            />

            <Line
              label="Total labor cost"
              value={result.annualLaborCost}
            />

            <Line
              label="Allocated overhead"
              value={result.allocatedOverhead}
            />

            <Line
              label="Annual cost requirement"
              value={result.annualCostRequirement}
            />

            <Line
              label="Payment processing fees"
              value={result.annualPaymentFees}
            />

            <Line
              label="Annual gross profit after fees"
              value={result.annualGrossProfit}
            />
          </div>

          <div className="mt-4 rounded-xl border border-[#1F2937] bg-[#0B0F19] p-4">
            <p className="text-xs uppercase tracking-wide text-[#718096]">
              Effective gross margin
            </p>

            <p className="mt-2 text-xl font-semibold">
              {percent.format(result.effectiveMargin)}%
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copyResults}
              className="rounded-xl bg-[#06B6D4] px-4 py-3 font-semibold text-[#06202A] hover:bg-[#22D3EE]"
            >
              {copied ? "Copied" : "Copy results"}
            </button>

            <button
              type="button"
              onClick={downloadCsv}
              className="rounded-xl border border-[#374151] px-4 py-3 font-semibold hover:border-[#22D3EE]"
            >
              Download CSV
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-xl border border-[#374151] px-4 py-3 font-semibold hover:border-[#22D3EE]"
            >
              Print
            </button>

            <button
              type="button"
              onClick={() => setValues(defaults)}
              className="rounded-xl border border-[#374151] px-4 py-3 font-semibold text-[#A0AEC0] hover:border-[#22D3EE]"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#CBD5E1]">
        {label}
      </span>

      <span className="flex items-center rounded-xl border border-[#374151] bg-[#0B0F19] focus-within:border-[#22D3EE] focus-within:ring-2 focus-within:ring-[#22D3EE]/20">
        {prefix && (
          <span className="pl-4 text-[#718096]">{prefix}</span>
        )}

        <input
          type="number"
          min="0"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.valueAsNumber)}
          className="w-full bg-transparent px-3 py-3 text-white outline-none"
        />

        {suffix && (
          <span className="pr-4 text-[#718096]">{suffix}</span>
        )}
      </span>
    </label>
  );
}

function Result({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#1F2937] bg-[#0B0F19]/70 p-4">
      <p className="text-xs uppercase tracking-wide text-[#718096]">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}

function Line({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#1F2937] pb-3">
      <span className="text-[#A0AEC0]">{label}</span>
      <strong>{money.format(value)}</strong>
    </div>
  );
}
