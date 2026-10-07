import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  AppWindow, 
  Receipt, 
  FileSpreadsheet, 
  Settings, 
  ShieldCheck,
  HelpCircle,
  X,
  Plus,
  Briefcase,
  ChevronRight
} from "lucide-react";

export default function Sidebar({ 
  activeView, 
  setActiveView, 
  counts = {}, 
  _business = {},
  isMobileMenuOpen = false,
  setIsMobileMenuOpen = () => {},
  onOpenHelpModal = () => {},
  workspaces = [],
  activeWorkspaceId = "default",
  onSwitchWorkspace = () => {},
  onCreateWorkspace = () => {},
}) {
  const [showNewWsInput, setShowNewWsInput] = useState(false);
  const [newWsName, setNewWsName] = useState("");

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

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    setIsMobileMenuOpen(false);
  };

  const handleCreateWsSubmit = (e) => {
    e.preventDefault();
    if (newWsName.trim()) {
      onCreateWorkspace(newWsName.trim());
      setNewWsName("");
      setShowNewWsInput(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      <div className="p-4 space-y-4">
        
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between lg:hidden pb-3 border-b border-white/[0.08]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-indigo-500/20">
              BH
            </div>
            <span className="font-bold text-white text-sm">Navigation</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Switcher Card */}
        <div className="bg-slate-900/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/[0.08] shadow-sm space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold flex items-center space-x-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span>Workspace</span>
            </span>
            <button
              onClick={() => setShowNewWsInput(!showNewWsInput)}
              className="text-indigo-400 hover:text-indigo-300 font-bold text-[11px] flex items-center space-x-0.5 transition"
              title="Add another workspace profile"
            >
              <Plus className="w-3 h-3" />
              <span>New</span>
            </button>
          </div>

          {!showNewWsInput ? (
            <select
              value={activeWorkspaceId}
              onChange={(e) => onSwitchWorkspace(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-inner"
            >
              {workspaces.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          ) : (
            <form onSubmit={handleCreateWsSubmit} className="space-y-1.5 animate-in fade-in">
              <input
                type="text"
                autoFocus
                placeholder="Workspace name..."
                value={newWsName}
                onChange={(e) => setNewWsName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex justify-end space-x-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setShowNewWsInput(false)}
                  className="px-2 py-0.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-sm"
                >
                  Create
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Navigation Items */}
        <div className="space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500/20 via-indigo-500/10 to-transparent text-white font-semibold border-l-2 border-indigo-500 shadow-sm"
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-1.5 rounded-lg transition ${
                    isActive 
                      ? "bg-indigo-500/20 text-indigo-300 shadow-sm shadow-indigo-500/20" 
                      : "text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800/60"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-xs sm:text-sm ${isActive ? "text-white font-bold" : "font-medium"}`}>
                      {item.label}
                    </div>
                    <div className="text-[11px] text-slate-400 leading-none mt-0.5 font-normal">
                      {item.description}
                    </div>
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        : "bg-slate-800/80 text-slate-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Help & Guide Center Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenHelpModal();
            }}
            className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900/60 hover:from-indigo-900/40 hover:to-slate-800/80 text-indigo-300 border border-indigo-500/25 transition-all shadow-sm group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/20">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white group-hover:text-indigo-200">
                  Help & Guide
                </div>
                <div className="text-[10px] text-slate-400">
                  Accounting in plain English
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-indigo-400/60 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition" />
          </button>
        </div>

      </div>

      {/* Footer / Protected Trust Badge */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="p-3 rounded-2xl bg-slate-900/40 border border-white/[0.06] backdrop-blur-sm">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Private & Protected</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Your financial ledger is saved securely on your device. You can export a backup anytime.
          </p>
        </div>

        <div className="mt-3 text-center text-[10px] text-slate-400">
          &copy; {new Date().getFullYear()} Cleeric Senyo Dey
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#090d19]/80 backdrop-blur-xl border-r border-white/[0.06] flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Drawer Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide-out Drawer */}
          <aside className="relative w-72 max-w-[85vw] bg-[#090d19] border-r border-white/[0.08] h-full z-50 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
