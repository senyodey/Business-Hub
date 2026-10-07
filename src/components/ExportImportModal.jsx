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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Backup & Data Portability
            </h2>
            <p className="text-xs text-slate-400">
              Your data is 100% yours. Download or restore anytime.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          
          {importStatus && (
            <div className={`p-3 rounded-xl border flex items-center space-x-2 ${
              importStatus.success
                ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                : "bg-rose-950/20 border-rose-500/30 text-rose-300"
            }`}>
              {importStatus.success ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
              <span>{importStatus.message}</span>
            </div>
          )}

          {/* 1. Download JSON Backup */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-white flex items-center space-x-1.5">
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Full System JSON Backup</span>
            </h3>
            <p className="text-slate-400 text-[11px]">
              Downloads your complete database (clients, apps, transactions, and settings) as an offline file.
            </p>
            <button
              onClick={() => onExportJSON(data)}
              className="w-full mt-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Download Backup File (.json)
            </button>
          </div>

          {/* 2. Restore JSON Backup */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-white flex items-center space-x-1.5">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Restore from Backup File</span>
            </h3>
            <p className="text-slate-400 text-[11px]">
              Upload a previously downloaded `.json` backup file to restore all your business data.
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
              className="w-full mt-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold py-2 rounded-lg transition"
            >
              Select & Restore Backup File
            </button>
          </div>

          {/* 3. Export CSV */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-white flex items-center space-x-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export Ledger to CSV</span>
            </h3>
            <p className="text-slate-400 text-[11px]">
              Spreadsheet format for Excel, Google Sheets, or sending to an external accountant.
            </p>
            <button
              onClick={() => onExportCSV(data.transactions)}
              className="w-full mt-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold py-2 rounded-lg transition"
            >
              Download Transactions (.csv)
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
