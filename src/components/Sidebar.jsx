import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  AppWindow, 
  Receipt, 
  FileSpreadsheet, 
  Settings, 
  ShieldCheck,
  TrendingUp,
  Coins
} from "lucide-react";

export default function Sidebar({ activeView, setActiveView, counts = {}, business }) {
  const navItems = [
    {
      id: "dashboard",
      label: "Accountant Pulse",
      description: "P&L & Health Advisor",
      icon: LayoutDashboard,
    },
    {
      id: "clients",
      label: "Customers & CRM",
      description: "Contacts & Projects",
      icon: Users,
      badge: counts.clients,
    },
    {
      id: "apps",
      label: "My Apps & SaaS",
      description: "Digital Products",
      icon: AppWindow,
      badge: counts.apps,
    },
    {
      id: "transactions",
      label: "Transactions Ledger",
      description: "Income & Expenses",
      icon: Receipt,
      badge: counts.transactions,
    },
    {
      id: "reports",
      label: "Financial Statements",
      description: "Annual P&L & Taxes",
      icon: FileSpreadsheet,
    },
    {
      id: "settings",
      label: "Business Settings",
      description: "Currency & Tax Rate",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Management
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition group ${
                isActive
                  ? "bg-indigo-600/15 text-indigo-300 font-medium border border-indigo-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-5 h-5 transition ${
                    isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />
                <div>
                  <div className={`text-sm ${isActive ? "text-white font-semibold" : ""}`}>
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-500 leading-none">
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    isActive
                      ? "bg-indigo-500/20 text-indigo-300"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Status Card */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Data Protected</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Free Netlify/Vercel static deploy with persistent local & API storage.
          </p>
        </div>
      </div>
    </aside>
  );
}
