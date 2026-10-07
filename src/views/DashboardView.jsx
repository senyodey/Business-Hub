import React from "react";
import FinancialSummaryCards from "../components/FinancialSummaryCards";
import AccountantAdvisor from "../components/AccountantAdvisor";
import ChartsSection from "../components/ChartsSection";
import { 
  PlusCircle, 
  Users, 
  AppWindow, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Clock, 
  ExternalLink 
} from "lucide-react";
import { formatCurrency, formatDate } from "../utils/formatters";

export default function DashboardView({
  business,
  financials,
  transactions,
  clients,
  apps,
  onOpenTransactionModal,
  onOpenClientModal,
  onOpenAppModal,
  onUpdateTransactionStatus,
  setActiveView,
}) {
  const currency = business.currency || "$";
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* 1. Top Headline & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Financial Health & Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time standing for apps, clients, and operating margins
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenTransactionModal("income")}
            className="flex items-center space-x-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Add Income</span>
          </button>
          
          <button
            onClick={() => onOpenTransactionModal("expense")}
            className="flex items-center space-x-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
            <span>+ Add Expense</span>
          </button>

          <button
            onClick={onOpenClientModal}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>+ Client</span>
          </button>

          <button
            onClick={onOpenAppModal}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            <AppWindow className="w-3.5 h-3.5 text-indigo-400" />
            <span>+ App</span>
          </button>
        </div>
      </div>

      {/* 2. Core Financial Cards (Gross, Expenses, Net Profit/Loss, Tax Reserve) */}
      <FinancialSummaryCards
        financials={financials}
        currency={currency}
        taxRate={business.taxRate}
      />

      {/* 3. Virtual Accountant Advice & Health Analysis */}
      <AccountantAdvisor
        financials={financials}
        currency={currency}
      />

      {/* 4. Visual Financial Charts (Inflow vs Outflow, Profit Curve, Categorical Split) */}
      <ChartsSection
        financials={financials}
        currency={currency}
      />

      {/* 5. Recent Activity & Fast Invoicing Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Recent Transactions
            </h3>
            <p className="text-xs text-slate-400">Latest entries affecting your bottom-line</p>
          </div>

          <button
            onClick={() => setActiveView("transactions")}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-1"
          >
            <span>View All Ledger</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Source / Customer</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {recentTransactions.map((tx) => {
                const isInc = tx.type === "income";
                const isPaid = tx.status === "Paid";

                return (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                        isInc 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {isInc ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-white whitespace-nowrap">
                      {tx.sourceName || "General"}
                    </td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      {tx.category || "—"}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        isPaid
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{tx.status}</span>
                      </span>
                    </td>
                    <td className={`py-3 px-3 text-right font-bold whitespace-nowrap ${
                      isInc ? "text-emerald-400" : "text-rose-400"
                    }`}>
                      {isInc ? "+" : "-"}{formatCurrency(tx.amount, currency)}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {!isPaid && (
                        <button
                          onClick={() => onUpdateTransactionStatus(tx.id, "Paid")}
                          className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-[11px] px-2.5 py-1 rounded font-medium transition"
                          title="Mark this invoice as collected"
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
