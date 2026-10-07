import React, { useState } from "react";
import { 
  FileSpreadsheet, 
  Printer, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Building, 
  FileText,
  DollarSign
} from "lucide-react";
import { formatCurrency, formatPercent } from "../utils/formatters";
import { calculateYearlyStanding } from "../services/accountantEngine";

export default function ReportsView({
  transactions = [],
  business = {},
  financials = {},
}) {
  const currency = business.currency || "$";
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
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Accountant Reports & Annual Standing
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Formal P&L statements, multi-year performance, and tax deductible deductions
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="bg-slate-800 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value={2026}>Statement Year 2026</option>
            <option value={2025}>Statement Year 2025</option>
          </select>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-md transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Statement</span>
          </button>
        </div>
      </div>

      {/* Printable Statement Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm print:bg-white print:text-black print:border-none print:shadow-none space-y-6">
        
        {/* Printable Header */}
        <div className="flex justify-between items-start border-b border-slate-800 print:border-gray-300 pb-5">
          <div>
            <h2 className="text-xl font-bold text-white print:text-gray-900 tracking-tight">
              {business.name || "Business Portal"}
            </h2>
            <p className="text-xs text-slate-400 print:text-gray-600">
              Profit & Loss (P&L) Statement • Fiscal Year {selectedYear}
            </p>
          </div>
          <div className="text-right">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              yearTotalNet >= 0 
                ? "bg-emerald-500/20 text-emerald-400 print:text-green-700" 
                : "bg-rose-500/20 text-rose-400 print:text-red-700"
            }`}>
              {yearTotalNet >= 0 ? "Profitable Year" : "Operating Deficit"}
            </span>
            <p className="text-[11px] text-slate-400 print:text-gray-500 mt-1">
              Generated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Annual Executive Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 print:grid-cols-4">
          <div className="bg-slate-950/60 print:bg-gray-100 p-3.5 rounded-xl border border-slate-800 print:border-gray-200">
            <span className="text-[11px] text-slate-400 print:text-gray-600 uppercase font-semibold">Total Revenue</span>
            <div className="text-lg font-bold text-white print:text-gray-900 mt-0.5">
              {formatCurrency(yearTotalRevenue, currency)}
            </div>
          </div>
          <div className="bg-slate-950/60 print:bg-gray-100 p-3.5 rounded-xl border border-slate-800 print:border-gray-200">
            <span className="text-[11px] text-slate-400 print:text-gray-600 uppercase font-semibold">Total Expenses</span>
            <div className="text-lg font-bold text-rose-400 print:text-red-600 mt-0.5">
              {formatCurrency(yearTotalExpenses, currency)}
            </div>
          </div>
          <div className="bg-slate-950/60 print:bg-gray-100 p-3.5 rounded-xl border border-slate-800 print:border-gray-200">
            <span className="text-[11px] text-slate-400 print:text-gray-600 uppercase font-semibold">Net Bottom-Line</span>
            <div className={`text-lg font-bold mt-0.5 ${yearTotalNet >= 0 ? "text-emerald-400 print:text-green-700" : "text-rose-400 print:text-red-600"}`}>
              {formatCurrency(yearTotalNet, currency)}
            </div>
          </div>
          <div className="bg-slate-950/60 print:bg-gray-100 p-3.5 rounded-xl border border-slate-800 print:border-gray-200">
            <span className="text-[11px] text-slate-400 print:text-gray-600 uppercase font-semibold">Tax Reserve ({business.taxRate || 25}%)</span>
            <div className="text-lg font-bold text-amber-300 print:text-amber-700 mt-0.5">
              {formatCurrency(yearTotalTaxReserve, currency)}
            </div>
          </div>
        </div>

        {/* 12-Month Detailed P&L Breakdown Table */}
        <div>
          <h3 className="text-sm font-bold text-white print:text-gray-900 mb-3">
            Monthly Performance Ledger ({selectedYear})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 print:bg-gray-200 text-slate-400 print:text-gray-700 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Month</th>
                  <th className="py-2.5 px-3 text-right">Gross Revenue</th>
                  <th className="py-2.5 px-3 text-right">Operating Expenses</th>
                  <th className="py-2.5 px-3 text-right">Net Profit / Loss</th>
                  <th className="py-2.5 px-3 text-right">Profit Margin</th>
                  <th className="py-2.5 px-3 text-right">Tax Reserve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-gray-200 text-slate-300 print:text-gray-900">
                {monthlyPL.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-800/30 print:hover:bg-transparent">
                    <td className="py-2.5 px-3 font-medium text-white print:text-gray-900">
                      {row.month}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-emerald-400 print:text-green-700">
                      {formatCurrency(row.revenue, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-rose-400 print:text-red-700">
                      {formatCurrency(row.expenses, currency)}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-bold ${
                      row.net >= 0 ? "text-emerald-400 print:text-green-700" : "text-rose-400 print:text-red-700"
                    }`}>
                      {formatCurrency(row.net, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {row.revenue > 0 ? formatPercent(row.margin) : "—"}
                    </td>
                    <td className="py-2.5 px-3 text-right text-amber-300 print:text-amber-700">
                      {row.taxReserve > 0 ? formatCurrency(row.taxReserve, currency) : "—"}
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-slate-950 font-bold border-t-2 border-slate-700 print:bg-gray-100 text-white print:text-gray-900">
                  <td className="py-3 px-3 uppercase">Full Year Total</td>
                  <td className="py-3 px-3 text-right text-emerald-400 print:text-green-700">
                    {formatCurrency(yearTotalRevenue, currency)}
                  </td>
                  <td className="py-3 px-3 text-right text-rose-400 print:text-red-700">
                    {formatCurrency(yearTotalExpenses, currency)}
                  </td>
                  <td className={`py-3 px-3 text-right ${yearTotalNet >= 0 ? "text-emerald-400 print:text-green-700" : "text-rose-400 print:text-red-700"}`}>
                    {formatCurrency(yearTotalNet, currency)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {formatPercent(yearAvgMargin)}
                  </td>
                  <td className="py-3 px-3 text-right text-amber-300 print:text-amber-700">
                    {formatCurrency(yearTotalTaxReserve, currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 2. Multi-Year Historical Performance Standing */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm print:hidden">
        <h3 className="text-sm font-bold text-white mb-2">
          Multi-Year Historical Business Standing
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Compare your standing year-over-year as your client base and software apps scale
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {yearlyStanding.map((y) => (
            <div
              key={y.year}
              className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-white">Year {y.year}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  y.isProfitable 
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-rose-500/20 text-rose-300"
                }`}>
                  {y.isProfitable ? `Profitable (+${y.margin}%)` : `Loss (-${Math.abs(y.margin)}%)`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block">Total Revenue</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(y.revenue, currency)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Total Expenses</span>
                  <span className="font-semibold text-rose-400">{formatCurrency(y.expenses, currency)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">SaaS App Revenue</span>
                  <span className="font-semibold text-indigo-300">{formatCurrency(y.appRevenue, currency)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Client Project Revenue</span>
                  <span className="font-semibold text-cyan-300">{formatCurrency(y.clientRevenue, currency)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Net Profit / Loss:</span>
                <span className={`font-bold ${y.isProfitable ? "text-emerald-400" : "text-rose-400"}`}>
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
