import React from "react";
import FinancialSummaryCards from "../components/FinancialSummaryCards";
import AccountantAdvisor from "../components/AccountantAdvisor";
import ChartsSection from "../components/ChartsSection";
import { 
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
  business = {},
  financials = {},
  transactions = [],
  _clients = [],
  _apps = [],
  onOpenTransactionModal,
  onOpenClientModal,
  onOpenAppModal,
  onOpenHelpModal,
  onUpdateTransactionStatus,
  setActiveView,
}) {
  const currency = business.currency || "GH₵";
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-7">
      
      {/* 1. Top Headline & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Financial Health & Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Real-time standing for apps, clients, and operating margins
          </p>
        </div>

        {/* 2x2 grid on mobile, flex on desktop */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenTransactionModal("income")}
            className="flex items-center justify-center space-x-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 hover:scale-[1.02] shadow-sm"
          >
            <ArrowUpRight className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>+ Income</span>
          </button>
          
          <button
            onClick={() => onOpenTransactionModal("expense")}
            className="flex items-center justify-center space-x-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 hover:scale-[1.02] shadow-sm"
          >
            <ArrowDownRight className="w-4 h-4 text-rose-400 shrink-0" />
            <span>+ Expense</span>
          </button>

          <button
            onClick={onOpenClientModal}
            className="flex items-center justify-center space-x-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-white/[0.08] px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 hover:scale-[1.02] shadow-sm"
          >
            <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>+ Customer</span>
          </button>

          <button
            onClick={onOpenAppModal}
            className="flex items-center justify-center space-x-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-white/[0.08] px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 hover:scale-[1.02] shadow-sm"
          >
            <AppWindow className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>+ App</span>
          </button>
        </div>
      </div>

      {/* 2. Core Financial Cards (Gross, Expenses, Net Profit/Loss, Tax Reserve) */}
      <FinancialSummaryCards
        financials={financials}
        currency={currency}
        taxRate={business.taxRate}
        onOpenHelpModal={onOpenHelpModal}
      />

      {/* 3. Virtual Accountant Advice & Health Analysis */}
      <AccountantAdvisor
        financials={financials}
        currency={currency}
        onOpenHelpModal={onOpenHelpModal}
      />

      {/* 4. Visual Financial Charts (Inflow vs Outflow, Profit Curve, Categorical Split) */}
      <ChartsSection
        financials={financials}
        currency={currency}
      />

      {/* 5. Recent Activity & Fast Invoicing Status */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-5 sm:p-6 shadow-lg shadow-black/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-tight">
              Recent Transactions
            </h3>
            <p className="text-xs text-slate-400 font-medium">Latest entries affecting your bottom-line</p>
          </div>

          <button
            onClick={() => setActiveView("transactions")}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1 transition"
          >
            <span>View Full Ledger</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
          <table className="w-full min-w-[620px] text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 font-bold uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="py-3 px-3.5 rounded-l-xl">Date</th>
                <th className="py-3 px-3.5">Type</th>
                <th className="py-3 px-3.5">Source / Customer</th>
                <th className="py-3 px-3.5">Category</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5 text-right">Amount</th>
                <th className="py-3 px-3.5 text-center rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {recentTransactions.map((tx) => {
                const isInc = tx.type === "income";
                const isPaid = tx.status === "Paid";

                return (
                  <tr key={tx.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 px-3.5 text-slate-400 whitespace-nowrap font-medium">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        isInc 
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                          : "bg-rose-500/15 text-rose-400 border border-rose-500/25"
                      }`}>
                        {isInc ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5 font-bold text-white whitespace-nowrap">
                      {tx.sourceName || "General"}
                    </td>
                    <td className="py-3.5 px-3.5 text-slate-400 whitespace-nowrap font-medium">
                      {tx.category || "—"}
                    </td>
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isPaid
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/15 text-amber-300 border border-amber-500/20"
                      }`}>
                        {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{tx.status}</span>
                      </span>
                    </td>
                    <td className={`py-3.5 px-3.5 text-right font-extrabold whitespace-nowrap ${
                      isInc ? "text-emerald-400" : "text-rose-400"
                    }`}>
                      {isInc ? "+" : "-"}{formatCurrency(tx.amount, currency)}
                    </td>
                    <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                      {!isPaid && (
                        <button
                          onClick={() => onUpdateTransactionStatus(tx.id, "Paid")}
                          className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-[11px] px-3 py-1 rounded-xl font-bold transition shadow-sm"
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
