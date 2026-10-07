import React from "react";
import { 
  TrendingUp, 
  CreditCard, 
  PiggyBank, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { formatCurrency, formatPercent } from "../utils/formatters";

export default function FinancialSummaryCards({ 
  financials = {}, 
  currency = "GH₵", 
  taxRate = 25,
  onOpenHelpModal = () => {}
}) {
  const isLoss = (financials.netProfit || 0) < 0;
  const isProfit = (financials.netProfit || 0) > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Gross Revenue */}
      <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-emerald-950/20 border border-white/[0.08] hover:border-emerald-500/40 rounded-3xl p-5 backdrop-blur-xl shadow-lg shadow-black/25 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden flex flex-col justify-between before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-emerald-400/30 before:to-transparent">
        <div>
          <div className="flex items-center justify-between text-slate-400 mb-2.5">
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Gross Revenue</span>
              <button
                onClick={() => onOpenHelpModal("glossary")}
                className="text-slate-500 hover:text-emerald-400 transition"
                title="What is Gross Revenue?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight truncate" title={formatCurrency(financials.totalRevenue, currency)}>
            {formatCurrency(financials.totalRevenue, currency)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Total money collected before bills</p>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 pt-2.5 border-t border-white/[0.06]">
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block"></span>
            <span>Apps: <strong className="text-slate-200">{formatCurrency(financials.appRevenue, currency)}</strong></span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block"></span>
            <span>Clients: <strong className="text-slate-200">{formatCurrency(financials.clientRevenue, currency)}</strong></span>
          </span>
        </div>
      </div>

      {/* 2. Total Expenses */}
      <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-rose-950/20 border border-white/[0.08] hover:border-rose-500/40 rounded-3xl p-5 backdrop-blur-xl shadow-lg shadow-black/25 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden flex flex-col justify-between before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-rose-400/30 before:to-transparent">
        <div>
          <div className="flex items-center justify-between text-slate-400 mb-2.5">
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Operating Expenses</span>
              <button
                onClick={() => onOpenHelpModal("glossary")}
                className="text-slate-500 hover:text-rose-400 transition"
                title="What are Operating Expenses?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/25 flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>

          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight truncate" title={formatCurrency(financials.totalExpenses, currency)}>
            {formatCurrency(financials.totalExpenses, currency)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Servers, tools, & operating costs</p>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 pt-2.5 border-t border-white/[0.06]">
          <span>Cost Ratio: <strong className="text-slate-200">
            {financials.totalRevenue > 0 ? `${Math.round(((financials.totalExpenses || 0) / financials.totalRevenue) * 100)}%` : "0%"}
          </strong></span>
          <span><strong className="text-slate-200">{financials.transactionCount || 0}</strong> entries</span>
        </div>
      </div>

      {/* 3. Net Profit / Net Loss (The Standout Pulse Card) */}
      <div className={`rounded-3xl p-5 backdrop-blur-xl shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden flex flex-col justify-between border ${
        isLoss
          ? "bg-gradient-to-br from-rose-950/40 via-slate-900/80 to-slate-900/90 border-rose-500/40 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-rose-400/50 before:to-transparent"
          : isProfit
          ? "bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-900/90 border-emerald-500/40 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-emerald-400/50 before:to-transparent"
          : "bg-slate-900/80 border-white/[0.08]"
      }`}>
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {isLoss ? "Net Deficit (Loss)" : "Net Profit"}
              </span>
              <button
                onClick={() => onOpenHelpModal("glossary")}
                className="text-slate-500 hover:text-indigo-400 transition"
                title="What is Net Profit?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center space-x-1 shrink-0 ${
              isLoss 
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            }`}>
              {isLoss ? (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  <span>Deficit</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Profitable</span>
                </>
              )}
            </div>
          </div>

          <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight truncate ${
            isLoss ? "text-rose-400" : "text-emerald-400"
          }`} title={formatCurrency(financials.netProfit, currency)}>
            {formatCurrency(financials.netProfit, currency)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Bottom-line take-home before taxes</p>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] pt-2.5 border-t border-white/[0.06]">
          <span className="text-slate-400">Profit Margin:</span>
          <span className={`font-bold flex items-center space-x-0.5 ${isLoss ? "text-rose-400" : "text-emerald-400"}`}>
            {isLoss ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
            <span>{formatPercent(financials.profitMargin)}</span>
          </span>
        </div>
      </div>

      {/* 4. Accountant Tax Reserve */}
      <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-amber-950/20 border border-white/[0.08] hover:border-amber-500/40 rounded-3xl p-5 backdrop-blur-xl shadow-lg shadow-black/25 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden flex flex-col justify-between before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-amber-400/30 before:to-transparent">
        <div>
          <div className="flex items-center justify-between text-slate-400 mb-2.5">
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tax Reserve Buffer</span>
              <button
                onClick={() => onOpenHelpModal("glossary")}
                className="text-slate-500 hover:text-amber-400 transition"
                title="What is Tax Reserve?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25 flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>

          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-tight truncate" title={formatCurrency(financials.taxReserve, currency)}>
            {formatCurrency(financials.taxReserve, currency)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Safe buffer set aside for tax season ({taxRate}%)</p>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 pt-2.5 border-t border-white/[0.06]">
          <span>Take-home:</span>
          <span className="font-bold text-emerald-300">{formatCurrency(financials.distributableProfit, currency)}</span>
        </div>
      </div>

    </div>
  );
}
