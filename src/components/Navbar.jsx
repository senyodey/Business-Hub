import React from "react";
import { 
  Building2, 
  PlusCircle, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  HelpCircle,
  Sparkles
} from "lucide-react";
import { formatCurrency, formatPercent } from "../utils/formatters";

export default function Navbar({ 
  business, 
  financials, 
  selectedPeriod, 
  setSelectedPeriod, 
  onOpenTransactionModal,
  onOpenBackupModal,
  availableYears = [2026, 2025]
}) {
  const isLoss = financials.netProfit < 0;
  const isProfit = financials.netProfit > 0;

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Business Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white tracking-tight text-lg">
                  {business.name || "Business Portal"}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                  Accountant Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {business.tagline || "Apps & Client Services Management"}
              </p>
            </div>
          </div>

          {/* Center: Live P&L Status Indicator */}
          <div className="hidden md:flex items-center space-x-3 bg-slate-950/60 px-3.5 py-1.5 rounded-full border border-slate-800">
            {isLoss ? (
              <div className="flex items-center space-x-2 text-rose-400 text-xs font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Operating at a Loss ({formatCurrency(financials.netProfit, business.currency)})</span>
              </div>
            ) : isProfit ? (
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Profitable: {formatCurrency(financials.netProfit, business.currency)} ({formatPercent(financials.profitMargin)} margin)</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold">
                <span>At Break-even (Revenue = Expenses)</span>
              </div>
            )}
          </div>

          {/* Right Controls: Date Filter & Actions */}
          <div className="flex items-center space-x-2.5">
            {/* Period Selector */}
            <div className="relative flex items-center">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-slate-800/90 hover:bg-slate-800 text-slate-200 text-xs font-medium pl-8 pr-7 py-2 rounded-lg border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition appearance-none"
              >
                <option value="ALL">All Time</option>
                <option value="2026">Year 2026</option>
                <option value="2026-10">Current Month (Oct 2026)</option>
                <option value="2026-09">Last Month (Sep 2026)</option>
                <option value="2026-08">August 2026</option>
                <option value="2026-07">July 2026</option>
                <option value="2025">Year 2025</option>
              </select>
            </div>

            {/* Quick Add Transaction */}
            <button
              onClick={onOpenTransactionModal}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs font-medium px-3.5 py-2 rounded-lg shadow-md shadow-indigo-600/20 active:scale-95 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add Entry</span>
            </button>

            {/* Backup / Export */}
            <button
              onClick={onOpenBackupModal}
              title="Backup & Export Data"
              className="p-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
