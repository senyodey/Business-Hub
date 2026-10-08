import React, { useState } from "react";
import { Printer } from "lucide-react";
import { formatCurrency, formatPercent } from "../utils/formatters";
import { calculateYearlyStanding } from "../services/accountantEngine";

export default function ReportsView({
  transactions = [],
  business = {},
}) {
  const currency = business.currency || "GH₵";
  const yearlyStanding = calculateYearlyStanding(transactions);

  const [selectedYear, setSelectedYear] = useState(2026);

  // Filter transactions for chosen year to build monthly P&L
  const yearTransactions = transactions.filter((t) => {
    return t.date && parseInt(t.date.substring(0, 4), 10) === selectedYear;
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Build matrix for all 12 months
  const monthlyPL = monthNames.map((name, idx) => {
    const monthNum = idx + 1;
    const mStr = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
    const ymPrefix = `${selectedYear}-${mStr}`;

    const monthTxs = yearTransactions.filter((t) => t.date && t.date.startsWith(ymPrefix));
    const revenue = monthTxs
      .filter((t) => t.type === "income" && (t.status === "Paid" || !t.status))
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);

    const expenses = monthTxs
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);

    const net = revenue - expenses;
    const margin = revenue > 0 ? (net / revenue) * 100 : 0;
    const tax = Math.max(0, net * ((business.taxRate || 25) / 100));

    return {
      month: name,
      monthNum,
      revenue,
      expenses,
      net,
      margin: Math.round(margin * 10) / 10,
      taxReserve: Math.round(tax),
      hasData: monthTxs.length > 0,
    };
  });

  // Year totals
  const yearTotalRevenue = monthlyPL.reduce((s, m) => s + m.revenue, 0);
  const yearTotalExpenses = monthlyPL.reduce((s, m) => s + m.expenses, 0);
  const yearTotalNet = yearTotalRevenue - yearTotalExpenses;
  const yearAvgMargin = yearTotalRevenue > 0 ? (yearTotalNet / yearTotalRevenue) * 100 : 0;
  const yearTotalTaxReserve = Math.max(0, yearTotalNet * ((business.taxRate || 25) / 100));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Reports & Fiscal Statement
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Tax Ready
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            Formal profit and loss ledger, annual performance audit, and estimated tax reserves
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="bg-slate-900 text-slate-200 text-xs font-semibold pl-3 pr-8 py-2 rounded-xl border border-slate-700/80 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-sm"
            >
              <option value={2026}>Fiscal Year 2026</option>
              <option value={2025}>Fiscal Year 2025</option>
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Statement Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm print:bg-white print:text-black print:border-none print:shadow-none space-y-6">
        
        {/* Printable Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 print:border-gray-300 pb-5 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-bold text-white print:text-gray-900 tracking-tight">
                {business.name || "Business Enterprise"}
              </h2>
              <span className="hidden print:inline text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-800 border border-gray-300">
                Official Statement
              </span>
            </div>
            <p className="text-xs text-slate-400 print:text-gray-600 mt-0.5">
              Annual Profit & Loss (P&L) Statement • Fiscal Year {selectedYear}
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-1">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              yearTotalNet >= 0 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 print:bg-emerald-50 print:text-emerald-700" 
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20 print:bg-rose-50 print:text-rose-700"
            }`}>
              {yearTotalNet >= 0 ? "Profitable Fiscal Year" : "Operating Deficit"}
            </span>
            <p className="text-[11px] text-slate-500 print:text-gray-500">
              Generated: {new Date().toLocaleDateString(undefined, { dateStyle: "long" })}
            </p>
          </div>
        </div>

        {/* Annual Executive Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 print:grid-cols-4">
          <div className="bg-slate-950/60 print:bg-gray-50 p-3.5 sm:p-4 rounded-xl border border-slate-800 print:border-gray-200">
            <span className="text-[10px] sm:text-[11px] text-slate-400 print:text-gray-600 uppercase font-semibold">
              Total Revenue
            </span>
            <div className="text-base sm:text-lg font-bold tabular-nums text-white print:text-gray-900 mt-1">
              {formatCurrency(yearTotalRevenue, currency)}
            </div>
            <span className="text-[10px] text-emerald-400 block mt-0.5 font-medium">Gross Inflows</span>
          </div>

          <div className="bg-slate-950/60 print:bg-gray-50 p-3.5 sm:p-4 rounded-xl border border-slate-800 print:border-gray-200">
            <span className="text-[10px] sm:text-[11px] text-slate-400 print:text-gray-600 uppercase font-semibold">
              Total Expenses
            </span>
            <div className="text-base sm:text-lg font-bold tabular-nums text-rose-400 print:text-rose-700 mt-1">
              {formatCurrency(yearTotalExpenses, currency)}
            </div>
            <span className="text-[10px] text-rose-400/80 block mt-0.5 font-medium">Operating Overhead</span>
          </div>

          <div className="bg-slate-950/60 print:bg-gray-50 p-3.5 sm:p-4 rounded-xl border border-slate-800 print:border-gray-200">
            <span className="text-[10px] sm:text-[11px] text-slate-400 print:text-gray-600 uppercase font-semibold">
              Net Bottom-Line
            </span>
            <div className={`text-base sm:text-lg font-bold tabular-nums mt-1 ${
              yearTotalNet >= 0 ? "text-emerald-400 print:text-emerald-700" : "text-rose-400 print:text-rose-700"
            }`}>
              {formatCurrency(yearTotalNet, currency)}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">{formatPercent(yearAvgMargin)} margin</span>
          </div>

          <div className="bg-slate-950/60 print:bg-gray-50 p-3.5 sm:p-4 rounded-xl border border-slate-800 print:border-gray-200">
            <span className="text-[10px] sm:text-[11px] text-slate-400 print:text-gray-600 uppercase font-semibold">
              Tax Reserve ({business.taxRate || 25}%)
            </span>
            <div className="text-base sm:text-lg font-bold tabular-nums text-amber-400 print:text-amber-800 mt-1">
              {formatCurrency(yearTotalTaxReserve, currency)}
            </div>
            <span className="text-[10px] text-amber-400/80 block mt-0.5 font-medium">Estimated Set-Aside</span>
          </div>
        </div>

        {/* 12-Month Detailed P&L Breakdown Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white print:text-gray-900 tracking-tight">
              Monthly Financial Performance Ledger ({selectedYear})
            </h3>
            <span className="text-[11px] text-slate-400 print:text-gray-500 font-medium">
              12 Months Analyzed
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-gray-200">
            <table className="w-full min-w-[650px] text-left text-xs">
              <thead className="bg-slate-950/80 print:bg-gray-100 text-slate-400 print:text-gray-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800 print:border-gray-200">
                <tr>
                  <th className="py-2.5 px-4">Month</th>
                  <th className="py-2.5 px-4 text-right">Gross Revenue</th>
                  <th className="py-2.5 px-4 text-right">Operating Costs</th>
                  <th className="py-2.5 px-4 text-right">Net Profit / Loss</th>
                  <th className="py-2.5 px-4 text-right">Profit Margin</th>
                  <th className="py-2.5 px-4 text-right">Tax Reserve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-gray-200 text-slate-300 print:text-gray-900">
                {monthlyPL.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-800/20 transition print:hover:bg-transparent">
                    <td className="py-2.5 px-4 font-semibold text-white print:text-gray-900">
                      {row.month}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums font-semibold text-emerald-400 print:text-emerald-700">
                      {formatCurrency(row.revenue, currency)}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums font-semibold text-rose-400 print:text-rose-700">
                      {formatCurrency(row.expenses, currency)}
                    </td>
                    <td className={`py-2.5 px-4 text-right tabular-nums font-bold ${
                      row.net >= 0 ? "text-emerald-400 print:text-emerald-700" : "text-rose-400 print:text-rose-700"
                    }`}>
                      {formatCurrency(row.net, currency)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium">
                      {row.revenue > 0 ? (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${row.net >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                          {formatPercent(row.margin)}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-amber-400 print:text-amber-800">
                      {row.taxReserve > 0 ? formatCurrency(row.taxReserve, currency) : "—"}
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-slate-950/90 font-bold border-t-2 border-slate-700 print:bg-gray-100 text-white print:text-gray-900">
                  <td className="py-3 px-4 uppercase text-xs tracking-wider">Full Year Total</td>
                  <td className="py-3 px-4 text-right tabular-nums text-emerald-400 print:text-emerald-700">
                    {formatCurrency(yearTotalRevenue, currency)}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-rose-400 print:text-rose-700">
                    {formatCurrency(yearTotalExpenses, currency)}
                  </td>
                  <td className={`py-3 px-4 text-right tabular-nums ${yearTotalNet >= 0 ? "text-emerald-400 print:text-emerald-700" : "text-rose-400 print:text-rose-700"}`}>
                    {formatCurrency(yearTotalNet, currency)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold">
                      {formatPercent(yearAvgMargin)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-amber-400 print:text-amber-800">
                    {formatCurrency(yearTotalTaxReserve, currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 2. Multi-Year Historical Performance Standing */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm print:hidden space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">
            Multi-Year Historical Business Standing
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Compare fiscal health year-over-year as your software assets and client base expand
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {yearlyStanding.map((y) => (
            <div
              key={y.year}
              className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-white">Year {y.year}</span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  y.isProfitable 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}>
                  {y.isProfitable ? `Profitable (+${y.margin}%)` : `Operating Loss (-${Math.abs(y.margin)}%)`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Revenue</span>
                  <span className="font-bold text-emerald-400 text-sm tabular-nums block mt-0.5">
                    {formatCurrency(y.revenue, currency)}
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Expenses</span>
                  <span className="font-bold text-rose-400 text-sm tabular-nums block mt-0.5">
                    {formatCurrency(y.expenses, currency)}
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">SaaS Products</span>
                  <span className="font-bold text-indigo-400 text-sm tabular-nums block mt-0.5">
                    {formatCurrency(y.appRevenue, currency)}
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Client Contracts</span>
                  <span className="font-bold text-cyan-400 text-sm tabular-nums block mt-0.5">
                    {formatCurrency(y.clientRevenue, currency)}
                  </span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Net Return:</span>
                <span className={`font-bold tabular-nums text-sm ${y.isProfitable ? "text-emerald-400" : "text-rose-400"}`}>
                  {formatCurrency(y.net, currency)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
