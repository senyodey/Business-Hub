import React from "react";
import { 
  Building2, 
  PlusCircle, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  HelpCircle,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { formatCurrency, formatPercent } from "../utils/formatters";

export default function Navbar({ 
  business = {}, 
  financials = {}, 
  selectedPeriod, 
  setSelectedPeriod, 
  onOpenTransactionModal,
  onOpenBackupModal,
  onOpenHelpModal,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) {
  const isLoss = (financials.netProfit || 0) < 0;
  const isProfit = (financials.netProfit || 0) > 0;
  const currency = business.currency || "GH₵";

  return (
    <header className="sticky top-0 z-30 bg-[#090d19]/80 backdrop-blur-xl border-b border-white/[0.07] shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Left: Mobile Menu Toggle + Logo & Business Identity */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5 shrink-0">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-white/5 transition focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-indigo-400" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Brand Icon Emblem */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20 shrink-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>

            {/* Brand Title */}
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-white tracking-tight text-sm sm:text-base truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
                  {business.name || "Business Hub"}
                </span>
                <span className="hidden sm:inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 font-semibold whitespace-nowrap">
                  <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                  <span>Financial Hub</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block truncate font-medium">
                {business.tagline || "Apps & Client Services Management"}
              </p>
            </div>
          </div>

          {/* Center: Live Financial Standing Pill */}
          <div className="hidden sm:flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/[0.08] shadow-inner shrink-0">
            {isLoss ? (
              <div className="flex items-center space-x-1.5 text-rose-400 text-xs font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline text-rose-300/80">Operating at a Loss:</span>
                <span className="font-bold">{formatCurrency(financials.netProfit, currency)}</span>
              </div>
            ) : isProfit ? (
              <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline text-emerald-300/80">Profitable:</span>
                <span className="font-bold">{formatCurrency(financials.netProfit, currency)}</span>
                <span className="hidden lg:inline text-emerald-400/80 font-normal">({formatPercent(financials.profitMargin)} margin)</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-semibold">
                <span>At Break-even</span>
              </div>
            )}
          </div>

          {/* Right Controls: Date Filter & Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            
            {/* Period Selector */}
            <div className="relative flex items-center">
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none hidden xs:block" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-[11px] sm:text-xs font-semibold pl-2.5 xs:pl-8 pr-7 py-2 rounded-xl border border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer transition appearance-none shadow-sm"
                aria-label="Filter time period"
              >
                <option value="ALL">All Time</option>
                <option value="2026">Year 2026</option>
                <option value="2026-10">October 2026</option>
                <option value="2026-09">September 2026</option>
                <option value="2026-08">August 2026</option>
                <option value="2026-07">July 2026</option>
                <option value="2025">Year 2025</option>
              </select>
            </div>

            {/* Quick Add Transaction */}
            <button
              onClick={onOpenTransactionModal}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs font-bold px-3 sm:px-3.5 py-2 rounded-xl shadow-md shadow-indigo-600/25 active:scale-95 transition shrink-0"
              title="Record an income or expense"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden md:inline">Record Entry</span>
            </button>

            {/* Help & Guide Button */}
            <button
              onClick={onOpenHelpModal}
              title="Help & Non-Accountant Guide"
              className="flex items-center space-x-1.5 p-2 sm:px-2.5 sm:py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl transition shrink-0 font-medium"
            >
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span className="hidden lg:inline text-xs font-semibold">Guide</span>
            </button>

            {/* Backup / Export */}
            <button
              onClick={onOpenBackupModal}
              title="Backup & Export Data"
              className="p-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-white/[0.08] transition shrink-0 shadow-sm"
            >
              <Download className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
