import React, { useRef, useState } from "react";
import { X, Download, Upload, FileSpreadsheet, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function ExportImportModal({
  isOpen,
  onClose,
  data,
  onExportJSON,
  onImportJSON,
  onExportCSV,
}) {
  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        await onImportJSON(text);
        setImportStatus({ success: true, message: "Backup successfully restored!" });
        setTimeout(() => {
          onClose();
          setImportStatus(null);
        }, 1500);
      } catch (err) {
        setImportStatus({ success: false, message: err.message || "Failed to parse backup JSON file." });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/[0.1] rounded-3xl w-full max-w-md shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/[0.08] bg-slate-950/40 shrink-0">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
              Backup & Data Portability
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Your data is 100% private to your device. Download or restore anytime.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.05] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 text-xs overflow-y-auto flex-1">
          
          {importStatus && (
            <div className={`p-3.5 rounded-2xl border flex items-center space-x-2.5 ${
              importStatus.success
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                : "bg-rose-500/10 border-rose-500/20 text-rose-300"
            }`}>
              {importStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />}
              <span className="font-medium">{importStatus.message}</span>
            </div>
          )}

          {/* 1. Download JSON Backup */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/[0.06] space-y-2">
            <h3 className="font-bold text-white flex items-center space-x-2">
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Full System Offline Backup</span>
            </h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Downloads your complete business workspace (clients, apps, transactions, settings) as an offline file. Perfect for sharing with a partner or keeping safe copies.
            </p>
            <button
              onClick={() => onExportJSON(data)}
              className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 transition active:scale-[0.98]"
            >
              Download Backup File (.json)
            </button>
          </div>

          {/* 2. Restore JSON Backup */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/[0.06] space-y-2">
            <h3 className="font-bold text-white flex items-center space-x-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Restore from Backup File</span>
            </h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Upload a previously downloaded <code className="text-indigo-300 font-mono">.json</code> backup file to restore all your business data seamlessly.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="w-full mt-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/[0.08] font-bold py-2.5 rounded-xl transition active:scale-[0.98]"
            >
              Select & Restore Backup File
            </button>
          </div>

          {/* 3. Export CSV */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/[0.06] space-y-2">
            <h3 className="font-bold text-white flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export Ledger to Excel / CSV</span>
            </h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Spreadsheet format for Excel, Google Sheets, or sending directly to an accountant or tax advisor.
            </p>
            <button
              onClick={() => onExportCSV(data.transactions, data.business?.currency || "GH₵")}
              className="w-full mt-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 font-bold py-2.5 rounded-xl transition active:scale-[0.98]"
            >
              Download Transactions (.csv)
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
