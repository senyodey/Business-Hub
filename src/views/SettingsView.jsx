import React, { useState } from "react";
import { 
  Building2, 
  Coins, 
  Percent, 
  Save, 
  RotateCcw, 
  Upload, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Globe, 
  Terminal,
  Server
} from "lucide-react";

export default function SettingsView({
  business = {},
  onSaveSettings,
  onResetDemo,
  onOpenBackupModal,
}) {
  const [formData, setFormData] = useState({
    name: business.name || "",
    tagline: business.tagline || "",
    currency: business.currency || "$",
    taxRate: business.taxRate || 25,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* 1. Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Business Settings & Accounting Rules
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Configure currency symbol, tax reserve percentage, and free deployment settings
        </p>
      </div>

      {/* 2. Main Settings Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-sm font-bold text-white tracking-tight">
            Company Identity
          </h2>
          <p className="text-xs text-slate-400">
            Used on printable reports and executive dashboards
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Business / Studio Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g. Apex Software & Design"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Tagline / Business Nature
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g. Digital Apps & Client Web Engineering"
            />
          </div>
        </div>

        <div className="border-b border-slate-800 pb-4 pt-2">
          <h2 className="text-sm font-bold text-white tracking-tight">
            Accountant Rules
          </h2>
          <p className="text-xs text-slate-400">
            Set your preferred currency symbol and automated tax quarantine percentage
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Currency Symbol
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="$">$ (USD / CAD / AUD)</option>
              <option value="€">€ (EUR)</option>
              <option value="£">£ (GBP)</option>
              <option value="₦">₦ (NGN)</option>
              <option value="₹">₹ (INR)</option>
              <option value="¥">¥ (JPY / CNY)</option>
              <option value="R$">R$ (BRL)</option>
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
              The accountant advisor will automatically calculate and withhold this % from your net profit.
            </span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>

          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings successfully saved!</span>
            </span>
          )}
        </div>

      </form>

      {/* 3. Free Hosting Deployment Guide (Netlify & Vercel) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold text-white tracking-tight">
            How to Host 100% Free on Netlify or Vercel
          </h2>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          This portal has zero mandatory external database server fees. All your data persists seamlessly in your browser with full backup/restore and can sync to the included Node.js API whenever running locally.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-emerald-400 flex items-center space-x-1.5">
              <span>Option A: Deploy to Netlify (Free)</span>
            </span>
            <p className="text-slate-400 text-[11px]">
              Included `netlify.toml` automatically configures single-page redirects. Push to GitHub and connect repository to Netlify for automatic zero-cost deployment.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-cyan-400 flex items-center space-x-1.5">
              <span>Option B: Deploy to Vercel (Free)</span>
            </span>
            <p className="text-slate-400 text-[11px]">
              Included `vercel.json` provides instant zero-config routing. Run `npx vercel` or import from GitHub on Vercel's free hobby tier.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Data Management & Backup */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">
            Data Safety, Backup & Reset
          </h2>
          <p className="text-xs text-slate-400">
            Export JSON files for safe offline backups or restore from a previous save
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={onOpenBackupModal}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Backup / Restore JSON</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm("Reset all data back to initial demo dataset? Any custom entries will be replaced.")) {
                onResetDemo();
              }
            }}
            className="flex items-center space-x-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-semibold px-4 py-2 rounded-xl transition"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

    </div>
  );
}
