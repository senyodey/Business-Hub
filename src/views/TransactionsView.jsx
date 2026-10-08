import React, { useState } from "react";
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Trash2,
  Download
} from "lucide-react";
import { formatCurrency, formatDate } from "../utils/formatters";

export default function TransactionsView({
  transactions = [],
  currency = "GH₵",
  onOpenTransactionModal,
  onEditTransaction,
  onDeleteTransaction,
  onToggleStatus,
  onExportCSV,
}) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStream, setFilterStream] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Filtering
  const filtered = transactions.filter((t) => {
    const matchesSearch =
      (t.description || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.sourceName || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.category || "").toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === "ALL" || t.type === filterType;
    const matchesStream = filterStream === "ALL" || t.stream === filterStream;
    const matchesStatus = filterStatus === "ALL" || t.status === filterStatus;

    return matchesSearch && matchesType && matchesStream && matchesStatus;
  });

  // Calculate filtered totals
  const totalFilteredIncome = filtered
    .filter((t) => t.type === "income" && (t.status === "Paid" || !t.status))
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalFilteredExpenses = filtered
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const filteredNet = totalFilteredIncome - totalFilteredExpenses;

  return (
    <div className="space-y-6">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Financial Ledger & Transactions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            Every transaction in and out, with instant autocomputed net profit impact
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onExportCSV(filtered, currency)}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-sm"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => onOpenTransactionModal("income")}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>+ Income</span>
          </button>

          <button
            onClick={() => onOpenTransactionModal("expense")}
            className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>+ Expense</span>
          </button>
        </div>
      </div>

      {/* 2. Filtered Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-slate-400 text-xs font-medium block mb-1">Filtered Inflow</span>
          <span className="text-xl font-bold text-emerald-400 tracking-tight tabular-nums block">
            +{formatCurrency(totalFilteredIncome, currency)}
          </span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-slate-400 text-xs font-medium block mb-1">Filtered Outflow</span>
          <span className="text-xl font-bold text-rose-400 tracking-tight tabular-nums block">
            -{formatCurrency(totalFilteredExpenses, currency)}
          </span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-slate-400 text-xs font-medium block mb-1">Filtered Net Standing</span>
          <span className={`text-xl font-bold tracking-tight tabular-nums block ${filteredNet >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {formatCurrency(filteredNet, currency)}
          </span>
        </div>
      </div>

      {/* 3. Search and Multi-filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search description, customer name, software product, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 shadow-inner"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 sm:pb-0">
            {/* Type Filter */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
              <span className="text-slate-400 text-[11px] px-1 font-semibold">Type:</span>
              {["ALL", "income", "expense"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-bold text-xs transition ${
                    filterType === t 
                      ? "bg-indigo-600 text-white shadow-sm" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Stream Filter */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
              <span className="text-slate-400 text-[11px] px-1 font-semibold">Stream:</span>
              {["ALL", "client", "app"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStream(s)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs transition ${
                    filterStream === s 
                      ? "bg-indigo-600 text-white shadow-sm" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {s === "ALL" ? "All" : s === "client" ? "Clients" : "Apps"}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
              <span className="text-slate-400 text-[11px] px-1 font-semibold">Status:</span>
              {["ALL", "Paid", "Pending"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs transition ${
                    filterStatus === st 
                      ? "bg-indigo-600 text-white shadow-sm" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <span className="text-slate-400 text-xs font-medium shrink-0">
            Showing <strong className="text-white">{filtered.length}</strong> of {transactions.length} entries
          </span>
        </div>
      </div>

      {/* 4. Ledger Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Source / Party</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((tx) => {
                const isInc = tx.type === "income";
                const isPaid = tx.status === "Paid";

                return (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap font-medium">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        isInc 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {isInc ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                      {tx.sourceName || "General"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap font-medium">
                      {tx.category || "General"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-[200px] truncate" title={tx.description}>
                      {tx.description || "—"}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => onToggleStatus(tx.id)}
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${
                          isPaid
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20"
                        }`}
                        title="Click to toggle status"
                      >
                        {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{tx.status}</span>
                      </button>
                    </td>
                    <td className={`py-3.5 px-4 text-right font-bold tabular-nums whitespace-nowrap ${
                      isInc ? "text-emerald-400" : "text-rose-400"
                    }`}>
                      {isInc ? "+" : "-"}{formatCurrency(tx.amount, currency)}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => onEditTransaction(tx)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                          title="Edit transaction"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTransaction(tx.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    No transactions match your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
