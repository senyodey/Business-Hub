import React from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  PiggyBank, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  PieChart
} from "lucide-react";
import { formatCurrency, formatPercent } from "../utils/formatters";

export default function FinancialSummaryCards({ financials, currency = "$", taxRate = 25 }) {
  const isLoss = financials.netProfit < 0;
  const isProfit = financials.netProfit > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Gross Revenue */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition relative overflow-hidden shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Gross Revenue</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {formatCurrency(financials.totalRevenue, currency)}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <span>Apps: <strong className="text-slate-200">{formatCurrency(financials.appRevenue, currency)}</strong></span>
          <span>Clients: <strong className="text-slate-200">{formatCurrency(financials.clientRevenue, currency)}</strong></span>
        </div>
      </div>

      {/* 2. Total Expenses */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition relative overflow-hidden shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Operating Expenses</span>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {formatCurrency(financials.totalExpenses, currency)}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <span>Cost Ratio: <strong className="text-slate-200">
            {financials.totalRevenue > 0 ? `${Math.round((financials.totalExpenses / financials.totalRevenue) * 100)}% of revenue` : "N/A"}
          </strong></span>
          <span>{financials.transactionCount} entries</span>
        </div>
      </div>

      {/* 3. Net Profit / Net Loss (The Autocomputed Accountant Standing) */}
      <div className={`rounded-2xl p-5 border transition relative overflow-hidden shadow-sm ${
        isLoss
          ? "bg-rose-950/20 border-rose-500/40"
          : isProfit
          ? "bg-emerald-950/20 border-emerald-500/40"
          : "bg-slate-900 border-slate-800"
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {isLoss ? "Net Deficit (Loss)" : "Net Profit"}
          </span>
          <div className={`px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center space-x-1 ${
            isLoss 
              ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
          }`}>
            {isLoss ? (
              <>
                <AlertTriangle className="w-3 h-3" />
                <span>Running at Loss</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3" />
                <span>Profitable</span>
              </>
            )}
          </div>
        </div>

        <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${
          isLoss ? "text-rose-400" : "text-emerald-400"
        }`}>
          {formatCurrency(financials.netProfit, currency)}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
          <span className="text-slate-400">Profit Margin:</span>
          <span className={`font-semibold ${isLoss ? "text-rose-400" : "text-emerald-400"}`}>
            {formatPercent(financials.profitMargin)}
          </span>
        </div>
      </div>

      {/* 4. Accountant Tax Reserve & Take-Home */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition relative overflow-hidden shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Accountant Tax Reserve</span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <PiggyBank className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-amber-300 tracking-tight">
          {formatCurrency(financials.taxReserve, currency)}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <span>Reserve Rate: <strong className="text-slate-200">{taxRate}%</strong></span>
          <span>Take-home: <strong className="text-emerald-300">{formatCurrency(financials.distributableProfit, currency)}</strong></span>
        </div>
      </div>

    </div>
  );
}
