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
import { formatCurrency, formatPercent } from "../utils/formatters";

export default function AccountantAdvisor({ financials, currency = "$" }) {
  const [showSim, setShowSim] = useState(false);
  const [targetProfit, setTargetProfit] = useState(10000);

  const isLoss = financials.netProfit < 0;
  const isProfit = financials.netProfit > 0;
  const deficit = Math.abs(financials.netProfit);

  // Calculation for target
  const gapToTarget = Math.max(0, targetProfit - financials.netProfit);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 shadow-md relative overflow-hidden">
      
      {/* Background subtle glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Virtual Accountant Diagnostics
              </h2>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                isLoss 
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              }`}>
                {financials.statusMessage}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Automated ledger analysis for your software apps and client services
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowSim(!showSim)}
          className="flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg border border-indigo-500/20 transition self-start sm:self-auto"
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>{showSim ? "Hide Calculator" : "Profit Goal Calculator"}</span>
        </button>
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
                className={`p-4 rounded-xl border transition ${
                  isAlert
                    ? "bg-rose-950/20 border-rose-500/30 text-rose-200"
                    : isWarning
                    ? "bg-amber-950/20 border-amber-500/30 text-amber-200"
                    : isSuccess
                    ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                    : "bg-slate-800/50 border-slate-700/60 text-slate-200"
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
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {note.message}
                    </p>
                    {note.action && (
                      <div className="pt-1.5 flex items-center space-x-1 text-[11px] font-medium text-indigo-300">
                        <ArrowRight className="w-3 h-3 text-indigo-400" />
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
        <div className="mt-5 p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Coins className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white">Target Profit Scenario Planner</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400">Target Net:</span>
              <div className="relative">
                <span className="absolute left-2 top-1 text-slate-400 text-xs">{currency}</span>
                <input
                  type="number"
                  value={targetProfit}
                  onChange={(e) => setTargetProfit(Number(e.target.value) || 0)}
                  className="bg-slate-900 border border-slate-700 rounded-md pl-5 pr-2 py-0.5 text-xs text-white w-24 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-1">Current Standing</span>
              <span className={`font-bold ${isLoss ? "text-rose-400" : "text-emerald-400"}`}>
                {formatCurrency(financials.netProfit, currency)}
              </span>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-1">Gap to Target</span>
              <span className="font-bold text-amber-300">
                {formatCurrency(gapToTarget, currency)}
              </span>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-1">What It Takes</span>
              <span className="text-slate-300 leading-tight block">
                {gapToTarget === 0
                  ? "Target already achieved! 🎯"
                  : `1 client project at ${formatCurrency(gapToTarget, currency)} or ~${Math.ceil(gapToTarget / 20)} new $20/mo SaaS users.`}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
