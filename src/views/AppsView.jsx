import React from "react";
import { 
  AppWindow, 
  Plus, 
  Users, 
  TrendingUp, 
  ExternalLink, 
  DollarSign, 
  Edit3, 
  Trash2, 
  Cpu, 
  CheckCircle2,
  Server
} from "lucide-react";
import { formatCurrency, formatPercent } from "../utils/formatters";

export default function AppsView({
  apps = [],
  transactions = [],
  currency = "$",
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
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            My Apps & Digital Products
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Track user base, subscription payouts, and cloud costs per software asset
          </p>
        </div>

        <button
          onClick={onOpenAppModal}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md shadow-indigo-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New App</span>
        </button>
      </div>

      {/* 2. Top Summary KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block mb-1">Total Digital Apps</span>
          <span className="text-xl font-bold text-white">{apps.length} products</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block mb-1">Combined Active User Base</span>
          <span className="text-xl font-bold text-indigo-400">
            {totalUsers.toLocaleString()} users
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block mb-1">Total App Revenue Generated</span>
          <span className="text-xl font-bold text-emerald-400">
            {formatCurrency(totalAppRevenue, currency)}
          </span>
        </div>
      </div>

      {/* 3. Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {enrichedApps.map((app) => {
          const isAppProfitable = app.netProfit >= 0;

          return (
            <div
              key={app.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                      {app.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base tracking-tight flex items-center space-x-1.5">
                        <span>{app.name}</span>
                        {app.url && (
                          <a
                            href={app.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-500 hover:text-indigo-400 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </h3>
                      <span className="text-xs text-slate-400">{app.type || "SaaS App"}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {app.status || "Active"}
                  </span>
                </div>

                {/* Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] uppercase">Active Users</span>
                    <span className="font-bold text-white text-sm">
                      {(app.activeUsers || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] uppercase">Pricing Plan</span>
                    <span className="font-bold text-indigo-300 text-sm">
                      {app.monthlyPrice ? `${currency}${app.monthlyPrice}/mo` : "Free / Freemium"}
                    </span>
                  </div>
                </div>

                {/* Financial Standing of App */}
                <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Inflow:</span>
                    <span className="font-semibold text-emerald-400">
                      +{formatCurrency(app.revenue, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dedicated Costs:</span>
                    <span className="font-semibold text-rose-400">
                      -{formatCurrency(app.expenses, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-300 font-medium">Net Return:</span>
                    <span className={`font-bold ${isAppProfitable ? "text-emerald-400" : "text-rose-400"}`}>
                      {formatCurrency(app.netProfit, currency)} ({formatPercent(app.margin)})
                    </span>
                  </div>
                </div>

                {app.notes && (
                  <p className="mt-2.5 text-[11px] text-slate-400 italic">
                    "{app.notes}"
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onAddTransactionForApp(app)}
                  className="flex items-center space-x-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1.5 rounded-lg border border-emerald-500/20 transition"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>+ Payout</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onEditApp(app)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                    title="Edit App"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteApp(app.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
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
          <div className="col-span-3 text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
            No apps added yet. Click "+ Add New App" above to track your software products.
          </div>
        )}
      </div>

    </div>
  );
}
