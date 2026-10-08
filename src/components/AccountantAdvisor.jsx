import React, { useState } from "react";
import { 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle, 
  ArrowRight, 
  Calculator, 
  Lightbulb,
  ShieldAlert,
  Coins
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";

export default function AccountantAdvisor({ financials = {}, currency = "GH₵", onOpenHelpModal = () => {} }) {
  const [showSim, setShowSim] = useState(false);
  const [targetProfit, setTargetProfit] = useState(10000);

  const isLoss = (financials.netProfit || 0) < 0;

  // Calculation for target
  const gapToTarget = Math.max(0, targetProfit - (financials.netProfit || 0));

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm transition-all">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Virtual Accountant Diagnostics
              </h2>
              <span className={`text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                isLoss 
                  ? "bg-rose-500/10 text-rose-300 border border-rose-500/20"
                  : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
              }`}>
                {financials.statusMessage}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Automated financial checkup for your software apps and client services
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => onOpenHelpModal("glossary")}
            className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/60 transition font-medium"
            title="Read accounting guide"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden xs:inline">Guide</span>
          </button>

          <button
            onClick={() => setShowSim(!showSim)}
            className="flex items-center space-x-1.5 text-xs text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-xl border border-indigo-500/25 transition font-semibold"
          >
            <Calculator className="w-3.5 h-3.5 text-indigo-400" />
            <span>{showSim ? "Hide Calculator" : "Profit Goal Calculator"}</span>
          </button>
        </div>
      </div>

      {/* Accountant Advisory Insights Grid */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {financials.insights && financials.insights.length > 0 ? (
          financials.insights.map((note) => {
            const isAlert = note.type === "alert";
            const isWarning = note.type === "warning";
            const isSuccess = note.type === "success";

            return (
              <div
                key={note.id}
                className={`p-4 rounded-xl border transition-all ${
                  isAlert
                    ? "bg-rose-950/20 border-rose-500/25 text-rose-200"
                    : isWarning
                    ? "bg-amber-950/20 border-amber-500/25 text-amber-200"
                    : isSuccess
                    ? "bg-emerald-950/20 border-emerald-500/25 text-emerald-200"
                    : "bg-slate-950/50 border-slate-800 text-slate-200"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5 shrink-0">
                    {isAlert && <ShieldAlert className="w-4 h-4 text-rose-400" />}
                    {isWarning && <AlertCircle className="w-4 h-4 text-amber-400" />}
                    {isSuccess && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                    {note.type === "info" && <Lightbulb className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white tracking-wide">
                      {note.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {note.message}
                    </p>
                    {note.action && (
                      <div className="pt-1.5 flex items-center space-x-1 text-[11px] font-semibold text-indigo-400">
                        <ArrowRight className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>{note.action}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-6 text-slate-400 text-xs">
            Add transactions to unlock personalized accounting advice.
          </div>
        )}
      </div>

      {/* Interactive Breakeven & Profit Goal Calculator Drawer */}
      {showSim && (
        <div className="mt-5 p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3.5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Coins className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white">Target Monthly Profit Simulator</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400 font-medium">Target Net Profit:</span>
              <div className="relative">
                <span className="absolute left-2.5 top-1.5 text-slate-400 text-xs font-bold">{currency}</span>
                <input
                  type="number"
                  value={targetProfit}
                  onChange={(e) => setTargetProfit(Number(e.target.value) || 0)}
                  className="bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-1 text-xs text-white font-bold w-36 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1 text-[11px] font-medium">Current Net Standing</span>
              <span className={`text-base font-extrabold tabular-nums ${isLoss ? "text-rose-400" : "text-emerald-400"}`}>
                {formatCurrency(financials.netProfit, currency)}
              </span>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1 text-[11px] font-medium">Gap to Reach Target</span>
              <span className="text-base font-extrabold text-amber-400 tabular-nums">
                {formatCurrency(gapToTarget, currency)}
              </span>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1 text-[11px] font-medium">Recommended Milestone</span>
              <span className="text-slate-300 leading-snug block font-medium">
                {gapToTarget === 0
                  ? "Target already achieved! 🎯"
                  : `1 client project at ${formatCurrency(gapToTarget, currency)} or ~${Math.ceil(gapToTarget / 50)} new ${currency} 50/mo subscribers.`}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
