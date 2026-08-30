"use client";

import { useMemo, useState } from "react";

type Item = { id: number; name: string; amount: string; taxable: boolean };
type CalculationMode = "add" | "inclusive";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 3 });

const toNumber = (value: string) => Math.max(0, Number(value) || 0);

export default function SalesTaxCalculatorClient() {
  const [calculationMode, setCalculationMode] = useState<CalculationMode>("add");
  const [transactionType, setTransactionType] = useState("Customer sale");
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "Taxable product or service", amount: "100", taxable: true },
    { id: 2, name: "Non-taxable item", amount: "0", taxable: false },
  ]);
  const [stateRate, setStateRate] = useState("6.25");
  const [countyRate, setCountyRate] = useState("1");
  const [cityRate, setCityRate] = useState("1");
  const [specialRate, setSpecialRate] = useState("0");
  const [discount, setDiscount] = useState("0");
  const [shipping, setShipping] = useState("0");
  const [shippingTaxable, setShippingTaxable] = useState(false);

  const result = useMemo(() => {
    const rate = toNumber(stateRate) + toNumber(countyRate) + toNumber(cityRate) + toNumber(specialRate);
    const rateDecimal = rate / 100;
    const taxableSubtotal = items.filter((item) => item.taxable).reduce((sum, item) => sum + toNumber(item.amount), 0);
    const nonTaxableSubtotal = items.filter((item) => !item.taxable).reduce((sum, item) => sum + toNumber(item.amount), 0);
    const itemSubtotal = taxableSubtotal + nonTaxableSubtotal;
    const discountApplied = Math.min(toNumber(discount), itemSubtotal);
    const discountRatio = itemSubtotal > 0 ? discountApplied / itemSubtotal : 0;
    const taxableAfterDiscount = taxableSubtotal * (1 - discountRatio);
    const nonTaxableAfterDiscount = nonTaxableSubtotal * (1 - discountRatio);
    const shippingAmount = toNumber(shipping);

    if (calculationMode === "inclusive") {
      const taxableInclusive = taxableAfterDiscount + (shippingTaxable ? shippingAmount : 0);
      const taxableBase = rateDecimal > 0 ? taxableInclusive / (1 + rateDecimal) : taxableInclusive;
      const tax = taxableInclusive - taxableBase;
      const nonTaxableTotal = nonTaxableAfterDiscount + (shippingTaxable ? 0 : shippingAmount);
      const finalTotal = taxableInclusive + nonTaxableTotal;
      const preTaxTotal = taxableBase + nonTaxableTotal;
      return { rate, taxableSubtotal, nonTaxableSubtotal, itemSubtotal, discountApplied, taxableBase, tax, preTaxTotal, finalTotal, effectiveRate: preTaxTotal > 0 ? (tax / preTaxTotal) * 100 : 0 };
    }

    const taxableBase = taxableAfterDiscount + (shippingTaxable ? shippingAmount : 0);
    const tax = taxableBase * rateDecimal;
    const preTaxTotal = itemSubtotal - discountApplied + shippingAmount;
    return { rate, taxableSubtotal, nonTaxableSubtotal, itemSubtotal, discountApplied, taxableBase, tax, preTaxTotal, finalTotal: preTaxTotal + tax, effectiveRate: preTaxTotal > 0 ? (tax / preTaxTotal) * 100 : 0 };
  }, [calculationMode, items, stateRate, countyRate, cityRate, specialRate, discount, shipping, shippingTaxable]);

  const updateItem = (id: number, field: keyof Item, value: string | boolean) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const addItem = () => setItems((current) => [...current, { id: Date.now(), name: `Line item ${current.length + 1}`, amount: "0", taxable: true }]);
  const removeItem = (id: number) => setItems((current) => current.length > 1 ? current.filter((item) => item.id !== id) : current);

  const summary = () => [
    "Numeravo Sales Tax Calculator",
    `Calculation: ${calculationMode === "add" ? "Add tax" : "Extract included tax"}`,
    `Transaction: ${transactionType}`,
    `Combined tax rate: ${number.format(result.rate)}%`,
    `Taxable base: ${money.format(result.taxableBase)}`,
    `Sales tax: ${money.format(result.tax)}`,
    `Pre-tax total: ${money.format(result.preTaxTotal)}`,
    `Final total: ${money.format(result.finalTotal)}`,
  ].join("\n");

  const copyResults = async () => navigator.clipboard?.writeText(summary());

  const downloadCsv = () => {
    const rows = [
      ["Numeravo Sales Tax Calculator"],
      ["Line item", "Amount", "Taxable"],
      ...items.map((item) => [item.name, toNumber(item.amount).toFixed(2), item.taxable ? "Yes" : "No"]),
      [],
      ["Combined tax rate", `${result.rate.toFixed(3)}%`],
      ["Taxable base", result.taxableBase.toFixed(2)],
      ["Sales tax", result.tax.toFixed(2)],
      ["Pre-tax total", result.preTaxTotal.toFixed(2)],
      ["Final total", result.finalTotal.toFixed(2)],
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "numeravo-sales-tax-calculation.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setCalculationMode("add"); setTransactionType("Customer sale");
    setItems([{ id: 1, name: "Taxable product or service", amount: "100", taxable: true }, { id: 2, name: "Non-taxable item", amount: "0", taxable: false }]);
    setStateRate("6.25"); setCountyRate("1"); setCityRate("1"); setSpecialRate("0");
    setDiscount("0"); setShipping("0"); setShippingTaxable(false);
  };

  const invalidRate = result.rate >= 100;

  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-[1.08fr_.92fr]">
      <div className="rounded-3xl border border-[#1F2937] bg-[#121826] p-5 sm:p-7">
        <div className="flex flex-wrap gap-2">
          <ModeButton active={calculationMode === "add"} onClick={() => setCalculationMode("add")}>Add tax</ModeButton>
          <ModeButton active={calculationMode === "inclusive"} onClick={() => setCalculationMode("inclusive")}>Extract included tax</ModeButton>
        </div>

        <div className="mt-6">
          <Label text="Transaction type" hint="Use this label to distinguish tax collected on a sale from tax estimated on a business purchase." />
          <select value={transactionType} onChange={(event) => setTransactionType(event.target.value)} className="mt-2 w-full rounded-xl border border-[#374151] bg-[#0B0F19] px-4 py-3 text-white outline-none focus:border-[#22D3EE]">
            <option>Customer sale</option><option>Business purchase</option>
          </select>
        </div>

        <div className="mt-7 flex items-center justify-between gap-4">
          <div><h2 className="text-xl font-bold">Line items</h2><p className="mt-1 text-sm text-[#A0AEC0]">Mark each item taxable or non-taxable.</p></div>
          <button onClick={addItem} className="rounded-xl border border-[#22D3EE] px-4 py-2 text-sm font-semibold text-[#22D3EE] hover:bg-[#042F3A]">Add item</button>
        </div>

        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="grid gap-3 rounded-2xl border border-[#1F2937] bg-[#0B0F19] p-4 sm:grid-cols-[1fr_150px_auto]">
              <input aria-label="Item name" value={item.name} onChange={(event) => updateItem(item.id, "name", event.target.value)} className="rounded-xl border border-[#374151] bg-[#121826] px-3 py-2.5 text-white outline-none focus:border-[#22D3EE]" />
              <div className="relative"><span className="absolute left-3 top-2.5 text-[#718096]">$</span><input aria-label={`${item.name} amount`} inputMode="decimal" value={item.amount} onChange={(event) => updateItem(item.id, "amount", event.target.value)} className="w-full rounded-xl border border-[#374151] bg-[#121826] py-2.5 pl-7 pr-3 text-white outline-none focus:border-[#22D3EE]" /></div>
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={item.taxable} onChange={(event) => updateItem(item.id, "taxable", event.target.checked)} className="h-4 w-4 accent-[#06B6D4]" />Taxable</label>
                <button onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`} className="text-xl text-[#718096] hover:text-white">×</button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-8 text-xl font-bold">Tax-rate components</h2>
        <p className="mt-1 text-sm leading-6 text-[#A0AEC0]">Enter the rates that apply to this transaction. Numeravo does not look up or determine the correct jurisdiction or rate.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <PercentInput label="State rate" value={stateRate} setValue={setStateRate} />
          <PercentInput label="County rate" value={countyRate} setValue={setCountyRate} />
          <PercentInput label="City/local rate" value={cityRate} setValue={setCityRate} />
          <PercentInput label="Special-district rate" value={specialRate} setValue={setSpecialRate} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <MoneyInput label="Order discount" hint="Allocated proportionally across taxable and non-taxable line items." value={discount} setValue={setDiscount} />
          <MoneyInput label="Shipping or delivery" hint="Taxability varies by jurisdiction and transaction." value={shipping} setValue={setShipping} />
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-[#1F2937] bg-[#0B0F19] p-4 text-sm"><input type="checkbox" checked={shippingTaxable} onChange={(event) => setShippingTaxable(event.target.checked)} className="h-4 w-4 accent-[#06B6D4]" />Treat shipping or delivery as taxable</label>
      </div>

      <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-3xl border border-[#164E63] bg-[#082F49] p-6 sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#22D3EE]">{calculationMode === "add" ? "Customer total" : "Tax included in total"}</p>
          <p className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{money.format(calculationMode === "add" ? result.finalTotal : result.tax)}</p>
          <p className="mt-3 text-sm leading-6 text-[#BAE6FD]">Combined rate: {number.format(result.rate)}% across the rate components you entered.</p>
        </div>

        {invalidRate && <Notice title="Check the combined rate">The entered components total 100% or more. Confirm that each component is a percentage and is not duplicated.</Notice>}
        {result.taxableBase === 0 && result.itemSubtotal > 0 && <Notice title="No taxable base">Every entered item is marked non-taxable and shipping is not taxable, so estimated tax is $0.</Notice>}

        <div className="rounded-3xl border border-[#1F2937] bg-[#121826] p-6">
          <h2 className="text-xl font-bold">Calculation summary</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <ResultCard label="Item subtotal" value={money.format(result.itemSubtotal)} />
            <ResultCard label="Discount applied" value={money.format(result.discountApplied)} />
            <ResultCard label="Taxable base" value={money.format(result.taxableBase)} />
            <ResultCard label="Sales tax" value={money.format(result.tax)} />
            <ResultCard label="Pre-tax total" value={money.format(result.preTaxTotal)} />
            <ResultCard label="Effective tax rate" value={`${number.format(result.effectiveRate)}%`} />
          </div>
          <div className="mt-5 rounded-2xl border border-[#164E63] bg-[#0B0F19] p-5"><p className="text-sm text-[#A0AEC0]">Final total</p><p className="mt-1 text-3xl font-bold text-[#22D3EE]">{money.format(result.finalTotal)}</p></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button onClick={copyResults} className="rounded-xl bg-[#06B6D4] px-4 py-3 font-semibold text-[#07111F] hover:bg-[#22D3EE]">Copy results</button>
            <button onClick={downloadCsv} className="rounded-xl border border-[#374151] px-4 py-3 font-semibold hover:border-[#22D3EE]">Download CSV</button>
            <button onClick={() => window.print()} className="rounded-xl border border-[#374151] px-4 py-3 font-semibold hover:border-[#22D3EE]">Print summary</button>
            <button onClick={reset} className="rounded-xl border border-[#374151] px-4 py-3 font-semibold text-[#A0AEC0] hover:border-[#22D3EE] hover:text-white">Reset calculator</button>
          </div>
        </div>

        <div className="rounded-2xl border border-[#7C2D12] bg-[#431407]/40 p-5 text-sm leading-6 text-[#FED7AA]">
          <p className="font-semibold text-white">Important tax limitation</p>
          <p className="mt-2">This calculator estimates arithmetic from your inputs. It does not determine nexus, registration duties, sourcing, item taxability, exemptions, the correct rate, filing obligations, or legal compliance.</p>
        </div>
      </div>
    </section>
  );
}

function ModeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button onClick={onClick} className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${active ? "bg-[#06B6D4] text-[#07111F]" : "border border-[#374151] text-[#A0AEC0] hover:border-[#22D3EE] hover:text-white"}`}>{children}</button>; }
function Label({ text, hint }: { text: string; hint?: string }) { return <label className="block text-sm font-semibold text-white">{text}{hint && <span title={hint} className="ml-2 cursor-help text-[#718096]">ⓘ</span>}</label>; }
function PercentInput({ label, value, setValue }: { label: string; value: string; setValue: (value: string) => void }) { return <div><Label text={label} /><div className="relative mt-2"><input aria-label={label} inputMode="decimal" value={value} onChange={(event) => setValue(event.target.value)} className="w-full rounded-xl border border-[#374151] bg-[#0B0F19] px-4 py-3 pr-9 text-white outline-none focus:border-[#22D3EE]" /><span className="absolute right-4 top-3 text-[#718096]">%</span></div></div>; }
function MoneyInput({ label, hint, value, setValue }: { label: string; hint: string; value: string; setValue: (value: string) => void }) { return <div><Label text={label} hint={hint} /><div className="relative mt-2"><span className="absolute left-4 top-3 text-[#718096]">$</span><input aria-label={label} inputMode="decimal" value={value} onChange={(event) => setValue(event.target.value)} className="w-full rounded-xl border border-[#374151] bg-[#0B0F19] py-3 pl-8 pr-4 text-white outline-none focus:border-[#22D3EE]" /></div></div>; }
function ResultCard({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-[#1F2937] bg-[#0B0F19] p-4"><p className="text-xs uppercase tracking-[.12em] text-[#718096]">{label}</p><p className="mt-2 text-xl font-bold">{value}</p></div>; }
function Notice({ title, children }: { title: string; children: React.ReactNode }) { return <div className="rounded-2xl border border-[#854D0E] bg-[#422006]/50 p-5 text-sm leading-6 text-[#FDE68A]"><p className="font-semibold text-white">{title}</p><p className="mt-1">{children}</p></div>; }
