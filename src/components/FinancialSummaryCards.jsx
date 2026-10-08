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

  // Helper to render currency amounts cleanly with zero truncation
  const renderAmount = (amount, colorClass = "text-white") => {
    const num = Number(amount) || 0;
    const isNegative = num < 0;
    const absFormatted = Math.abs(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return (
      <div className="flex items-baseline space-x-1.5 flex-wrap min-w-0 my-1">
        {isNegative && <span className={`text-base sm:text-lg font-bold ${colorClass}`}>-</span>}
        <span className="text-xs sm:text-sm font-bold text-slate-400 shrink-0 select-none">
          {currency}
        </span>
        <span className={`text-xl sm:text-2xl 2xl:text-[26px] font-black tracking-tight tabular-nums ${colorClass}`}>
          {absFormatted}
        </span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
      
      {/* 1. Gross Revenue */}
      <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-sm transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Gross Revenue</span>
              <button
                onClick={() => onOpenHelpModal("glossary")}
                className="text-slate-500 hover:text-slate-300 transition"
                title="What is Gross Revenue?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          
          {renderAmount(financials.totalRevenue, "text-white")}
          <p className="text-[11px] text-slate-400 font-medium">Total collections across all streams</p>
        </div>

        {/* Breakdown by Apps & Clients in clean micro-cards */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-950/60 rounded-xl px-2.5 py-1.5 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-medium">Apps</span>
            <span className="font-bold text-slate-200 text-xs tabular-nums block mt-0.5">
              {formatCurrency(financials.appRevenue, currency)}
            </span>
          </div>
          <div className="bg-slate-950/60 rounded-xl px-2.5 py-1.5 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-medium">Clients</span>
            <span className="font-bold text-slate-200 text-xs tabular-nums block mt-0.5">
              {formatCurrency(financials.clientRevenue, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Operating Expenses */}
      <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-sm transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Operating Expenses</span>
              <button
                onClick={() => onOpenHelpModal("glossary")}
                className="text-slate-500 hover:text-slate-300 transition"
                title="What are Operating Expenses?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>

          {renderAmount(financials.totalExpenses, "text-rose-400")}
          <p className="text-[11px] text-slate-400 font-medium">Cloud servers, APIs, & tools</p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            Cost Ratio: <strong className="text-slate-200 font-bold">{financials.totalRevenue > 0 ? `${Math.round(((financials.totalExpenses || 0) / financials.totalRevenue) * 100)}%` : "0%"}</strong>
          </span>
          <span className="text-slate-400 text-[11px]">
            <strong className="text-slate-200 font-bold">{financials.transactionCount || 0}</strong> recorded entries
          </span>
        </div>
      </div>

      {/* 3. Net Profit / Net Loss */}
      <div className={`rounded-2xl p-5 shadow-sm transition-all duration-200 flex flex-col justify-between border ${
        isLoss
          ? "bg-slate-900/95 border-rose-500/40"
          : isProfit
          ? "bg-slate-900/95 border-emerald-500/40"
          : "bg-slate-900/90 border-slate-800"
      }`}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {isLoss ? "Net Deficit" : "Net Profit"}
              </span>
              <button
                onClick={() => onOpenHelpModal("glossary")}
                className="text-slate-500 hover:text-slate-300 transition"
                title="What is Net Profit?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center space-x-1 shrink-0 ${
              isLoss 
                ? "bg-rose-500/10 text-rose-300 border border-rose-500/20"
                : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
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

          {renderAmount(financials.netProfit, isLoss ? "text-rose-400" : "text-emerald-400")}
          <p className="text-[11px] text-slate-400 font-medium">Bottom-line take-home before taxes</p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">Net Margin:</span>
          <span className={`font-bold text-xs flex items-center space-x-1 ${isLoss ? "text-rose-400" : "text-emerald-400"}`}>
            {isLoss ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
            <span>{formatPercent(financials.profitMargin)}</span>
          </span>
        </div>
      </div>

      {/* 4. Accountant Tax Reserve */}
      <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-sm transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tax Reserve Buffer</span>
              <button
                onClick={() => onOpenHelpModal("glossary")}
                className="text-slate-500 hover:text-slate-300 transition"
                title="What is Tax Reserve?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>

          {renderAmount(financials.taxReserve, "text-amber-400")}
          <p className="text-[11px] text-slate-400 font-medium">Safe buffer set aside for taxes ({taxRate}%)</p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">Net Take-Home:</span>
          <span className="font-bold text-emerald-400 tabular-nums text-xs">
            {formatCurrency(financials.distributableProfit, currency)}
          </span>
        </div>
      </div>

    </div>
  );
}
