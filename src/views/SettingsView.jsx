import React, { useState } from "react";
import { 
  Save, 
  RotateCcw, 
  Download, 
  CheckCircle2, 
  HelpCircle,
  Users,
  Plus,
  Trash2,
  Briefcase,
  ShieldCheck
} from "lucide-react";

export default function SettingsView({
  business = {},
  onSaveSettings,
  onResetDemo,
  onOpenBackupModal,
  onOpenHelpModal = () => {},
  workspaces = [],
  activeWorkspaceId = "default",
  onSwitchWorkspace = () => {},
  onCreateWorkspace = () => {},
  onDeleteWorkspace = () => {},
}) {
  const [formData, setFormData] = useState({
    name: business.name || "",
    tagline: business.tagline || "",
    currency: business.currency || "GH₵",
    taxRate: business.taxRate !== undefined ? business.taxRate : 25,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newWsInput, setNewWsInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCreateWorkspace = (e) => {
    e.preventDefault();
    if (newWsInput.trim()) {
      onCreateWorkspace(newWsInput.trim());
      setNewWsInput("");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Business Settings & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            Set your business name, currency (Ghana Cedis), tax reserve rate, and profiles
          </p>
        </div>

        <button
          onClick={() => onOpenHelpModal("glossary")}
          className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 px-3.5 py-2 rounded-xl text-xs font-semibold transition self-start sm:self-auto shadow-sm"
        >
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span>User Help Guide</span>
        </button>
      </div>

      {/* 2. Main Settings Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white tracking-tight">
            Company Identity
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Appears on printable financial statements, invoices, and reports
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Business / Enterprise Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g. Accra Tech Studio"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Tagline / Business Description
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g. Software Products & Client Services"
            />
          </div>
        </div>

        <div className="border-b border-slate-800 pb-3 pt-2">
          <h2 className="text-sm font-bold text-white tracking-tight">
            Financial & Tax Rules
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Choose your currency symbol and recommended tax savings percentage
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Primary Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value="GH₵">GH₵ (Ghana Cedis - GHS)</option>
              <option value="₵">₵ (Cedis Symbol)</option>
              <option value="$">$ (USD - US Dollars)</option>
              <option value="£">£ (GBP - British Pounds)</option>
              <option value="€">€ (EUR - Euros)</option>
              <option value="₦">₦ (NGN - Nigerian Naira)</option>
              <option value="₹">₹ (INR - Indian Rupee)</option>
              <option value="¥">¥ (JPY / CNY)</option>
              <option value="R$">R$ (BRL - Brazilian Real)</option>
              <option value="CHF">CHF (Swiss Franc)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Recommended Tax Reserve Rate (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="50"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none pr-8"
              />
              <span className="absolute right-3 top-2 text-slate-400 font-bold">%</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              The portal automatically calculates and sets aside this percentage from your net profit for taxes.
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-sm transition active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>

          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Preferences saved successfully!</span>
            </span>
          )}
        </div>

      </form>

      {/* 3. Multi-Workspace Profiles Manager */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                Workspaces & Business Profiles
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Create separate profiles for multiple businesses or different team members
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenHelpModal("multi-user")}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            How it works (?)
          </button>
        </div>

        {/* Existing workspaces */}
        <div className="space-y-2">
          {workspaces.map((w) => {
            const isActive = w.id === activeWorkspaceId;
            return (
              <div
                key={w.id}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs transition ${
                  isActive
                    ? "bg-slate-950 border-indigo-500/50 text-white"
                    : "bg-slate-950 border-slate-800 text-slate-300"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Briefcase className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                  <span className="font-semibold">{w.name}</span>
                  {isActive && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-bold border border-indigo-500/20">
                      Active
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {!isActive && (
                    <button
                      onClick={() => onSwitchWorkspace(w.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-medium transition"
                    >
                      Switch to this
                    </button>
                  )}
                  {workspaces.length > 1 && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete workspace "${w.name}" and all its records?`)) {
                          onDeleteWorkspace(w.id);
                        }
                      }}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                      title="Delete workspace"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add new workspace */}
        <form onSubmit={handleCreateWorkspace} className="flex items-center gap-2 pt-1 text-xs">
          <input
            type="text"
            placeholder="New workspace name (e.g. Second Business, Partner Ledger)..."
            value={newWsInput}
            onChange={(e) => setNewWsInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-white font-medium px-4 py-2 rounded-xl border border-slate-700 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Profile</span>
          </button>
        </form>
      </div>

      {/* 4. Data Safety & Backup (Non-Technical, Clean Business Language) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <div className="flex items-center space-x-2 text-white font-bold text-sm mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Data Security & Offline Backup</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All your financial records are saved privately on your device. You can download an offline backup anytime or restore your records if you switch computers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={onOpenBackupModal}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Backup / Restore Records</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm("Reset active workspace back to demo dataset? Any custom entries will be replaced.")) {
                onResetDemo();
              }
            }}
            className="flex items-center space-x-2 bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 border border-rose-800/40 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

    </div>
  );
}
