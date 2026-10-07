import React, { useState } from "react";
import { 
  Receipt, 
  Search, 
  Plus, 
  Filter, 
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
  currency = "$",
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
          <p className="text-xs sm:text-sm text-slate-400">
            Every dollar in and out, with instant autocomputed net profit impact
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onExportCSV(filtered)}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-medium transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => onOpenTransactionModal("income")}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+ Income</span>
          </button>

          <button
            onClick={() => onOpenTransactionModal("expense")}
            className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md shadow-rose-600/20 transition"
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>+ Expense</span>
          </button>
        </div>
      </div>

      {/* 2. Filtered Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <span className="text-slate-400 text-xs block mb-1">Filtered Inflow</span>
          <span className="text-lg font-bold text-emerald-400">
            +{formatCurrency(totalFilteredIncome, currency)}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <span className="text-slate-400 text-xs block mb-1">Filtered Outflow</span>
          <span className="text-lg font-bold text-rose-400">
            -{formatCurrency(totalFilteredExpenses, currency)}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <span className="text-slate-400 text-xs block mb-1">Filtered Net Standing</span>
          <span className={`text-lg font-bold ${filteredNet >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {formatCurrency(filteredNet, currency)}
          </span>
        </div>
      </div>

      {/* 3. Search and Multi-filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search description, customer name, software product, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Type Filter */}
          <div className="flex items-center space-x-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[11px]">Type:</span>
            {["ALL", "income", "expense"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2 py-0.5 rounded capitalize ${
                  filterType === t ? "bg-indigo-600 text-white font-medium" : "text-slate-400 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Stream Filter */}
          <div className="flex items-center space-x-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[11px]">Stream:</span>
            {["ALL", "client", "app"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStream(s)}
                className={`px-2 py-0.5 rounded ${
                  filterStream === s ? "bg-indigo-600 text-white font-medium" : "text-slate-400 hover:text-white"
                }`}
              >
                {s === "ALL" ? "All" : s === "client" ? "Clients" : "Apps"}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[11px]">Status:</span>
            {["ALL", "Paid", "Pending"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2 py-0.5 rounded ${
                  filterStatus === st ? "bg-indigo-600 text-white font-medium" : "text-slate-400 hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <span className="text-slate-500 text-xs ml-auto">
            Showing {filtered.length} of {transactions.length} entries
          </span>
        </div>
      </div>

      {/* 4. Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
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
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                        isInc
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {isInc ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                      {tx.sourceName || (tx.stream === "app" ? "App Asset" : "General")}
                    </td>
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                      {tx.category || "General"}
                    </td>
                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate" title={tx.description}>
                      {tx.description || "—"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        onClick={() => onToggleStatus(tx.id)}
                        className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition cursor-pointer hover:opacity-80 ${
                          isPaid
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                        title="Click to toggle status"
                      >
                        {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{tx.status}</span>
                      </button>
                    </td>
                    <td className={`py-3 px-4 text-right font-bold whitespace-nowrap ${
                      isInc ? "text-emerald-400" : "text-rose-400"
                    }`}>
                      {isInc ? "+" : "-"}{formatCurrency(tx.amount, currency)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => onEditTransaction(tx)}
                          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTransaction(tx.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-xs">
            No transactions found matching your filters.
          </div>
        )}
      </div>

    </div>
  );
}
