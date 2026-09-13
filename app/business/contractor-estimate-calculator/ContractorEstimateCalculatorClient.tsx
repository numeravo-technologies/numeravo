"use client";

import { useMemo, useState } from "react";

type CostGroup = "Materials" | "Labor" | "Equipment" | "Subcontractors" | "Other";
type LineItem = { id: number; group: CostGroup; description: string; quantity: number; unitCost: number };

const starterItems: LineItem[] = [
  { id: 1, group: "Materials", description: "Materials", quantity: 1, unitCost: 2500 },
  { id: 2, group: "Labor", description: "Crew labor", quantity: 40, unitCost: 45 },
  { id: 3, group: "Equipment", description: "Equipment rental", quantity: 1, unitCost: 450 },
];

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const preciseMoney = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
const percent = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

export default function ContractorEstimateCalculatorClient() {
  const [items, setItems] = useState<LineItem[]>(starterItems);
  const [overheadRate, setOverheadRate] = useState(10);
  const [contingencyRate, setContingencyRate] = useState(5);
  const [markupRate, setMarkupRate] = useState(20);
  const [taxRate, setTaxRate] = useState(8.25);
  const [taxableRate, setTaxableRate] = useState(100);
  const [depositRate, setDepositRate] = useState(25);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + Math.max(0, item.quantity) * Math.max(0, item.unitCost), 0);
    const overhead = subtotal * Math.max(0, overheadRate) / 100;
    const contingency = subtotal * Math.max(0, contingencyRate) / 100;
    const estimatedCost = subtotal + overhead + contingency;
    const markup = estimatedCost * Math.max(0, markupRate) / 100;
    const priceBeforeTax = estimatedCost + markup;
    const taxableAmount = priceBeforeTax * Math.min(100, Math.max(0, taxableRate)) / 100;
    const tax = taxableAmount * Math.max(0, taxRate) / 100;
    const customerTotal = priceBeforeTax + tax;
    const grossProfit = priceBeforeTax - estimatedCost;
    const grossMargin = priceBeforeTax > 0 ? grossProfit / priceBeforeTax * 100 : 0;
    const deposit = customerTotal * Math.min(100, Math.max(0, depositRate)) / 100;
    const balanceDue = customerTotal - deposit;
    return { subtotal, overhead, contingency, estimatedCost, markup, priceBeforeTax, taxableAmount, tax, customerTotal, grossProfit, grossMargin, deposit, balanceDue };
  }, [items, overheadRate, contingencyRate, markupRate, taxRate, taxableRate, depositRate]);

  function updateItem(id: number, field: keyof LineItem, value: string) {
    setItems((current) => current.map((item) => item.id === id
      ? { ...item, [field]: field === "quantity" || field === "unitCost" ? Number(value) : value }
      : item));
  }

  function addItem() {
    setItems((current) => [...current, { id: Date.now(), group: "Materials", description: "", quantity: 1, unitCost: 0 }]);
  }

  function removeItem(id: number) {
    setItems((current) => current.length === 1 ? current : current.filter((item) => item.id !== id));
  }

  function resultText() {
    return [
      "Numeravo Contractor Estimate Calculator",
      `Direct cost: ${money.format(result.subtotal)}`,
      `Estimated project cost: ${money.format(result.estimatedCost)}`,
      `Price before tax: ${money.format(result.priceBeforeTax)}`,
      `Estimated tax: ${money.format(result.tax)}`,
      `Customer total: ${money.format(result.customerTotal)}`,
      `Estimated gross profit: ${money.format(result.grossProfit)}`,
      `Estimated gross margin: ${percent.format(result.grossMargin)}%`,
      `Deposit: ${money.format(result.deposit)}`,
      `Balance due: ${money.format(result.balanceDue)}`,
    ].join("\n");
  }

  async function copyResults() {
    await navigator.clipboard.writeText(resultText());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function downloadCsv() {
    const rows: (string | number)[][] = [
      ["Numeravo Contractor Estimate Calculator"],
      ["Category", "Description", "Quantity", "Unit cost", "Line total"],
      ...items.map((item) => [item.group, item.description, item.quantity, item.unitCost.toFixed(2), (item.quantity * item.unitCost).toFixed(2)]),
      [],
      ["Metric", "Value"],
      ["Direct cost", result.subtotal.toFixed(2)],
      ["Overhead", result.overhead.toFixed(2)],
      ["Contingency", result.contingency.toFixed(2)],
      ["Estimated project cost", result.estimatedCost.toFixed(2)],
      ["Markup", result.markup.toFixed(2)],
      ["Price before tax", result.priceBeforeTax.toFixed(2)],
      ["Estimated tax", result.tax.toFixed(2)],
      ["Customer total", result.customerTotal.toFixed(2)],
      ["Estimated gross profit", result.grossProfit.toFixed(2)],
      ["Estimated gross margin (%)", result.grossMargin.toFixed(2)],
      ["Deposit", result.deposit.toFixed(2)],
      ["Balance due", result.balanceDue.toFixed(2)],
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "numeravo-contractor-estimate.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    setItems(starterItems);
    setOverheadRate(10); setContingencyRate(5); setMarkupRate(20);
    setTaxRate(8.25); setTaxableRate(100); setDepositRate(25); setCopied(false);
  }

  return (
    <section className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,.65fr)]">
      <div className="space-y-6">
        <Panel title="Estimate line items">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="grid gap-3 rounded-2xl border border-[#1F2937] bg-[#0B0F19] p-4 md:grid-cols-[1fr_1.5fr_.65fr_.85fr_auto] md:items-end">
                <Field label="Category">
                  <select value={item.group} onChange={(event) => updateItem(item.id, "group", event.target.value)} className={inputClass}>
                    {(["Materials", "Labor", "Equipment", "Subcontractors", "Other"] as CostGroup[]).map((group) => <option key={group}>{group}</option>)}
                  </select>
                </Field>
                <Field label="Description"><input value={item.description} onChange={(event) => updateItem(item.id, "description", event.target.value)} className={inputClass} placeholder="Line item" /></Field>
                <Field label="Quantity"><input type="number" min="0" step="any" value={item.quantity} onChange={(event) => updateItem(item.id, "quantity", event.target.value)} className={inputClass} /></Field>
                <Field label="Unit cost ($)"><input type="number" min="0" step="any" value={item.unitCost} onChange={(event) => updateItem(item.id, "unitCost", event.target.value)} className={inputClass} /></Field>
                <button type="button" onClick={() => removeItem(item.id)} disabled={items.length === 1} className="rounded-xl border border-[#374151] px-4 py-3 text-sm font-semibold text-[#A0AEC0] hover:border-red-400 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40">Remove</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addItem} className="mt-4 rounded-xl border border-[#06B6D4] px-4 py-3 font-semibold text-[#22D3EE] hover:bg-[#083344]">Add line item</button>
        </Panel>

        <Panel title="Pricing adjustments">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <NumberField label="Overhead (%)" value={overheadRate} onChange={setOverheadRate} />
            <NumberField label="Contingency (%)" value={contingencyRate} onChange={setContingencyRate} />
            <NumberField label="Markup (%)" value={markupRate} onChange={setMarkupRate} />
            <NumberField label="Sales tax rate (%)" value={taxRate} onChange={setTaxRate} />
            <NumberField label="Taxable share (%)" value={taxableRate} onChange={setTaxableRate} max={100} />
            <NumberField label="Deposit (%)" value={depositRate} onChange={setDepositRate} max={100} />
          </div>
        </Panel>
      </div>

      <aside className="h-fit rounded-3xl border border-[#164E63] bg-[#0E1827] p-6 xl:sticky xl:top-6">
        <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#22D3EE]">Estimate summary</p>
        <p className="mt-3 text-sm text-[#A0AEC0]">Estimated customer total</p>
        <p className="mt-1 text-4xl font-bold text-white">{money.format(result.customerTotal)}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <Result label="Direct cost" value={preciseMoney.format(result.subtotal)} />
          <Result label="Overhead" value={preciseMoney.format(result.overhead)} />
          <Result label="Contingency" value={preciseMoney.format(result.contingency)} />
          <Result label="Estimated project cost" value={preciseMoney.format(result.estimatedCost)} />
          <Result label="Markup" value={preciseMoney.format(result.markup)} />
          <Result label="Price before tax" value={preciseMoney.format(result.priceBeforeTax)} />
          <Result label="Estimated tax" value={preciseMoney.format(result.tax)} />
          <Result label="Estimated gross profit" value={preciseMoney.format(result.grossProfit)} />
          <Result label="Estimated gross margin" value={`${percent.format(result.grossMargin)}%`} />
          <Result label="Deposit" value={preciseMoney.format(result.deposit)} />
          <Result label="Balance due" value={preciseMoney.format(result.balanceDue)} />
        </div>
        <div className="mt-6 flex flex-wrap gap-3 print:hidden">
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

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-[#1F2937] bg-[#121826] p-5 md:p-6"><h2 className="mb-5 text-xl font-bold text-white">{title}</h2>{children}</section>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium text-[#CBD5E1]">{label}</span>{children}</label>;
}
function NumberField({ label, value, onChange, max }: { label: string; value: number; onChange: (value: number) => void; max?: number }) {
  return <Field label={label}><input type="number" min="0" max={max} step="any" value={value} onChange={(event) => onChange(Number(event.target.value))} className={inputClass} /></Field>;
}
function Result({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-xl border border-[#1F2937] bg-[#121826] px-4 py-3"><span className="text-sm text-[#A0AEC0]">{label}</span><strong className="text-right text-white">{value}</strong></div>;
}
