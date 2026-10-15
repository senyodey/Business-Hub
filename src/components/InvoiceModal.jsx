import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Printer, BookOpen, CheckCircle2 } from "lucide-react";
import { formatCurrency, formatDate } from "../utils/formatters";

const today = () => new Date().toISOString().split("T")[0];

const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split("T")[0];
};

const newInvoiceNumber = () => {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `INV-${ymd}-${String(Date.now()).slice(-4)}`;
};

const emptyItem = () => ({ id: `li-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, description: "", quantity: "1", rate: "" });

const escapeHtml = (str) =>
  String(str ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

const round2 = (n) => Math.round(n * 100) / 100;

export default function InvoiceModal({
  isOpen,
  onClose,
  onRecordToLedger,
  client = null,
  business = {},
}) {
  const currency = business.currency || "GH₵";
  const taxRate = business.taxRate !== undefined ? Number(business.taxRate) || 0 : 25;

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState(today());
  const [dueDate, setDueDate] = useState(addDays(today(), 14));
  const [items, setItems] = useState([emptyItem()]);
  const [notes, setNotes] = useState("");
  const [recorded, setRecorded] = useState(false);

  // Reset builder whenever it opens for a client
  useEffect(() => {
    if (isOpen) {
      setInvoiceNumber(newInvoiceNumber());
      setIssueDate(today());
      setDueDate(addDays(today(), 14));
      setItems([{ ...emptyItem(), description: client?.serviceType || "" }]);
      setNotes("");
      setRecorded(false);
    }
  }, [isOpen, client]);

  if (!isOpen || !client) return null;

  // Autocomputed totals
  const lineTotal = (item) => (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
  const subtotal = round2(items.reduce((sum, it) => sum + lineTotal(it), 0));
  const taxAmount = round2(subtotal * (taxRate / 100));
  const total = round2(subtotal + taxAmount);

  const validItems = items.filter((it) => it.description.trim() && lineTotal(it) > 0);

  const updateItem = (id, field, value) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);

  const removeItem = (id) => {
    setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== id) : prev));
  };

  const validate = () => {
    if (validItems.length === 0) {
      alert("Add at least one line item with a description, quantity, and rate.");
      return false;
    }
    return true;
  };

  const handlePrint = () => {
    if (!validate()) return;

    const rows = validItems
      .map(
        (it) => `
        <tr>
          <td>${escapeHtml(it.description)}</td>
          <td class="num">${escapeHtml(it.quantity)}</td>
          <td class="num">${escapeHtml(formatCurrency(it.rate, currency))}</td>
          <td class="num">${escapeHtml(formatCurrency(lineTotal(it), currency))}</td>
        </tr>`
      )
      .join("");

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${escapeHtml(invoiceNumber)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 0; padding: 40px; font-size: 13px; }
  .top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 36px; }
  h1 { font-size: 28px; margin: 0 0 4px; letter-spacing: -0.5px; color: #4f46e5; }
  .biz-name { font-size: 18px; font-weight: 700; margin: 0; }
  .muted { color: #64748b; }
  .meta td { padding: 2px 0 2px 16px; }
  .meta td:first-child { color: #64748b; padding-left: 0; }
  .bill-to { margin-bottom: 28px; }
  .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 700; margin-bottom: 4px; }
  table.items { width: 100%; border-collapse: collapse; }
  table.items th { text-align: left; font-size: 11px; text-transform: uppercase; color: #64748b; border-bottom: 2px solid #e2e8f0; padding: 8px 6px; }
  table.items td { padding: 10px 6px; border-bottom: 1px solid #f1f5f9; }
  .num { text-align: right; white-space: nowrap; }
  table.items th.num { text-align: right; }
  .totals { margin-left: auto; margin-top: 20px; width: 280px; }
  .totals td { padding: 5px 6px; }
  .totals tr.grand td { font-size: 16px; font-weight: 700; border-top: 2px solid #0f172a; padding-top: 10px; }
  .notes { margin-top: 36px; padding: 12px 14px; background: #f8fafc; border-radius: 8px; white-space: pre-wrap; }
  @media print { body { padding: 0; } @page { margin: 18mm; } }
</style>
</head>
<body>
  <div class="top">
    <div>
      <p class="biz-name">${escapeHtml(business.name || "")}</p>
      <div class="muted">${escapeHtml(business.tagline || "")}</div>
    </div>
    <div style="text-align:right">
      <h1>INVOICE</h1>
      <table class="meta" style="margin-left:auto">
        <tr><td>Invoice #</td><td><strong>${escapeHtml(invoiceNumber)}</strong></td></tr>
        <tr><td>Issue date</td><td>${escapeHtml(formatDate(issueDate))}</td></tr>
        <tr><td>Due date</td><td>${escapeHtml(formatDate(dueDate))}</td></tr>
      </table>
    </div>
  </div>

  <div class="bill-to">
    <div class="label">Bill To</div>
    ${client.company ? `<div><strong>${escapeHtml(client.company)}</strong></div>` : ""}
    <div>${escapeHtml(client.name)}</div>
    ${client.email ? `<div class="muted">${escapeHtml(client.email)}</div>` : ""}
    ${client.phone ? `<div class="muted">${escapeHtml(client.phone)}</div>` : ""}
  </div>

  <table class="items">
    <thead>
      <tr><th>Description</th><th class="num">Qty</th><th class="num">Rate</th><th class="num">Amount</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <table class="totals">
    <tr><td class="muted">Subtotal</td><td class="num">${escapeHtml(formatCurrency(subtotal, currency))}</td></tr>
    <tr><td class="muted">Tax (${escapeHtml(taxRate)}%)</td><td class="num">${escapeHtml(formatCurrency(taxAmount, currency))}</td></tr>
    <tr class="grand"><td>Total Due</td><td class="num">${escapeHtml(formatCurrency(total, currency))}</td></tr>
  </table>

  ${notes.trim() ? `<div class="notes"><div class="label">Notes</div>${escapeHtml(notes)}</div>` : ""}

  <script>
    window.onload = function () { window.focus(); window.print(); };
  </script>
</body>
</html>`;

    const win = window.open("", "_blank", "width=900,height=1000");
    if (!win) {
      alert("Pop-up blocked. Please allow pop-ups for this site to print or save the invoice.");
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
  };

  const handleRecord = async () => {
    if (!validate() || recorded) return;

    const summary = validItems.map((it) => it.description.trim()).join(", ");
    await onRecordToLedger({
      type: "income",
      stream: "client",
      clientId: client.id,
      appId: "",
      sourceName: client.company || client.name,
      category: "Client Milestone",
      amount: total,
      date: issueDate,
      status: "Pending",
      invoiceNumber,
      description: `Invoice ${invoiceNumber}: ${summary}`,
    });
    setRecorded(true);
  };

  const inputClass =
    "w-full bg-slate-950/70 border border-white/[0.08] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/[0.1] rounded-3xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/[0.08] bg-slate-950/40 shrink-0">
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
              Invoice Builder
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              Billing {client.company || client.name}
              {client.company && client.name ? ` • ${client.name}` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.05] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-4 text-xs overflow-y-auto flex-1">

          {/* Invoice meta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Invoice Number</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className={`${inputClass} font-mono`}
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Line items */}
          <div className="space-y-2">
            <div className="hidden sm:grid grid-cols-12 gap-2 text-[10px] font-semibold uppercase text-slate-400 px-1">
              <span className="col-span-6">Description</span>
              <span className="col-span-2 text-right">Qty</span>
              <span className="col-span-2 text-right">Rate ({currency})</span>
              <span className="col-span-2 text-right">Amount</span>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-2 items-center bg-slate-950/40 sm:bg-transparent p-2 sm:p-0 rounded-xl border border-slate-800 sm:border-0"
              >
                <input
                  type="text"
                  placeholder="e.g. Landing page design"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  className={`${inputClass} col-span-12 sm:col-span-6`}
                />
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                  className={`${inputClass} col-span-3 sm:col-span-2 text-right font-mono`}
                />
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Rate"
                  value={item.rate}
                  onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                  className={`${inputClass} col-span-4 sm:col-span-2 text-right font-mono`}
                />
                <div className="col-span-5 sm:col-span-2 flex items-center justify-end gap-1">
                  <span className="font-semibold text-white tabular-nums truncate">
                    {formatCurrency(lineTotal(item), currency)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition disabled:opacity-30 disabled:hover:text-slate-500 disabled:hover:bg-transparent shrink-0"
                    title="Remove line item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-xl border border-indigo-500/20 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Line Item</span>
            </button>
          </div>

          {/* Notes + Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/[0.08]">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Notes / Payment Terms</label>
              <textarea
                rows={4}
                placeholder="e.g. Payment via bank transfer or MoMo within 14 days."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2 self-start">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-white font-semibold tabular-nums">{formatCurrency(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax ({taxRate}%)</span>
                <span className="text-white font-semibold tabular-nums">{formatCurrency(taxAmount, currency)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-200 font-bold">Total Due</span>
                <span className="text-emerald-400 font-bold text-base tabular-nums">{formatCurrency(total, currency)}</span>
              </div>
              <p className="text-[10px] text-slate-500 pt-1">
                Tax rate comes from Settings.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 sm:p-5 border-t border-white/[0.08] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 shrink-0 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold border border-slate-700 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
          <button
            type="button"
            onClick={handleRecord}
            disabled={recorded}
            className={`flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl font-bold text-white transition shadow-lg ${
              recorded
                ? "bg-emerald-600/40 shadow-none cursor-default"
                : "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 shadow-indigo-500/25"
            }`}
          >
            {recorded ? <CheckCircle2 className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
            <span>{recorded ? "Recorded as Pending Income" : "Record to Ledger"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
