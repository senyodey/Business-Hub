import React from "react";
import { 
  Plus, 
  ExternalLink, 
  DollarSign, 
  Edit3, 
  Trash2,
  Layers,
  Users,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { formatCurrency, formatPercent } from "../utils/formatters";

export default function AppsView({
  apps = [],
  transactions = [],
  currency = "GH₵",
  onOpenAppModal,
  onEditApp,
  onDeleteApp,
  onAddTransactionForApp,
}) {
  // Autocompute per-app performance
  const enrichedApps = apps.map((app) => {
    const appTx = transactions.filter((t) => t.appId === app.id);
    const revenue = appTx
      .filter((t) => t.type === "income" && (t.status === "Paid" || !t.status))
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const expenses = appTx
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const netProfit = revenue - expenses;
    const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

    return {
      ...app,
      revenue,
      expenses,
      netProfit,
      margin: Math.round(margin * 10) / 10,
    };
  });

  const totalAppRevenue = enrichedApps.reduce((sum, a) => sum + a.revenue, 0);
  const totalUsers = apps.reduce((sum, a) => sum + (Number(a.activeUsers) || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Add App button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Software & Digital Products
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {apps.length} Live
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Track user metrics, monthly subscriptions, and dedicated hosting costs per software asset
          </p>
        </div>

        <button
          onClick={onOpenAppModal}
          className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* 2. Top Summary KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-4 sm:p-5 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
                Total Products
              </span>
              <span className="text-2xl font-black text-white tracking-tight">
                {apps.length}
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">Tracked assets</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Layers className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-4 sm:p-5 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
                Active Users
              </span>
              <span className="text-2xl font-black text-indigo-300 tracking-tight">
                {totalUsers.toLocaleString()}
              </span>
              <span className="text-xs text-indigo-400/80 block mt-0.5">Across all apps</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-4 sm:p-5 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
                Total Product Inflow
              </span>
              <span className="text-2xl font-black text-emerald-400 tracking-tight">
                {formatCurrency(totalAppRevenue, currency)}
              </span>
              <span className="text-xs text-emerald-400/80 block mt-0.5">Recorded payouts</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {enrichedApps.map((app) => {
          const isAppProfitable = app.netProfit >= 0;

          return (
            <div
              key={app.id}
              className="group relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-5 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 text-indigo-300 flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                      {app.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-base tracking-tight flex items-center space-x-1.5 truncate">
                        <span className="truncate">{app.name}</span>
                        {app.url && (
                          <a
                            href={app.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-500 hover:text-indigo-400 transition shrink-0 p-0.5 rounded"
                            title="Visit App Website"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </h3>
                      <span className="text-xs text-slate-400 truncate block mt-0.5">
                        {app.type || "SaaS Web Application"}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    {app.status || "Active"}
                  </span>
                </div>

                {/* Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/[0.05]">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold tracking-wider">
                      Active Users
                    </span>
                    <span className="font-bold text-white text-sm truncate block mt-0.5">
                      {(app.activeUsers || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/[0.05]">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold tracking-wider">
                      Pricing Plan
                    </span>
                    <span className="font-bold text-indigo-300 text-sm truncate block mt-0.5">
                      {app.monthlyPrice ? `${currency} ${app.monthlyPrice}/mo` : "Freemium"}
                    </span>
                  </div>
                </div>

                {/* Financial Standing of App */}
                <div className="mt-3 p-3.5 rounded-2xl bg-slate-950/70 border border-white/[0.05] space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total Inflow:</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      +{formatCurrency(app.revenue, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Dedicated Costs:</span>
                    <span className="font-bold text-rose-400 font-mono">
                      -{formatCurrency(app.expenses, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/[0.06]">
                    <span className="text-slate-300 font-medium">Net Profit:</span>
                    <span className={`font-black font-mono ${isAppProfitable ? "text-emerald-400" : "text-rose-400"}`}>
                      {formatCurrency(app.netProfit, currency)} <span className="text-[11px] font-sans font-semibold">({formatPercent(app.margin)})</span>
                    </span>
                  </div>
                </div>

                {app.notes && (
                  <p className="mt-3 text-[11px] text-slate-400 bg-slate-950/40 p-2 rounded-xl border border-white/[0.03] italic">
                    "{app.notes}"
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <button
                  onClick={() => onAddTransactionForApp(app)}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-300 hover:text-emerald-200 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/20 transition-all duration-200 shrink-0"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>+ Record Payout</span>
                </button>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => onEditApp(app)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition"
                    title="Edit App Details"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteApp(app.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                    title="Delete App"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}

        {apps.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8">
            <div className="w-14 h-14 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-3">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No digital products registered</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Add your SaaS applications, templates, or digital tools to track their users, revenues, and cloud hosting costs.
            </p>
            <button
              onClick={onOpenAppModal}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-2xl transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First App</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
