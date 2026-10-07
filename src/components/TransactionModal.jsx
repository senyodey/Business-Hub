import React, { useState, useEffect } from "react";
import { X, ArrowUpRight, ArrowDownRight, DollarSign, Calendar, Tag, FileText } from "lucide-react";
import { formatCurrency } from "../utils/formatters";

export default function TransactionModal({
  isOpen,
  onClose,
  onSave,
  clients = [],
  apps = [],
  initialType = "income",
  editItem = null,
  currency = "$",
}) {
  const [formData, setFormData] = useState({
    type: "income",
    stream: "client",
    clientId: "",
    appId: "",
    sourceName: "",
    category: "Client Milestone",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    status: "Paid",
    description: "",
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        ...editItem,
        amount: editItem.amount ? editItem.amount.toString() : "",
      });
    } else {
      setFormData({
        type: initialType || "income",
        stream: initialType === "income" ? "client" : "general",
        clientId: clients.length > 0 ? clients[0].id : "",
        appId: apps.length > 0 ? apps[0].id : "",
        sourceName: clients.length > 0 ? clients[0].company || clients[0].name : "",
        category: initialType === "income" ? "Client Milestone" : "Hosting & Cloud",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        status: "Paid",
        description: "",
      });
    }
  }, [editItem, initialType, isOpen]);

  if (!isOpen) return null;

  const isIncome = formData.type === "income";

  const handleTypeChange = (newType) => {
    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: newType === "income" ? "Client Milestone" : "Hosting & Cloud",
      stream: newType === "income" ? "client" : "general",
    }));
  };

  const handleClientChange = (cId) => {
    const sel = clients.find((c) => c.id === cId);
    setFormData((prev) => ({
      ...prev,
      clientId: cId,
      sourceName: sel ? sel.company || sel.name : "",
    }));
  };

  const handleAppChange = (aId) => {
    const sel = apps.find((a) => a.id === aId);
    setFormData((prev) => ({
      ...prev,
      appId: aId,
      sourceName: sel ? sel.name : "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(formData.amount);
    if (isNaN(num) || num <= 0) {
      alert("Please enter a valid amount greater than zero.");
      return;
    }

    onSave({
      ...formData,
      amount: num,
    });
    onClose();
  };

  const incomeCategories = [
    "Client Milestone",
    "Retainer",
    "App Subscription",
    "Consulting & Advisory",
    "Website Maintenance",
    "Custom Feature Addon",
    "Other Income",
  ];

  const expenseCategories = [
    "Hosting & Cloud",
    "AI & APIs",
    "Software Tools",
    "Contractors",
    "Marketing & Ads",
    "Hardware & Equipment",
    "Domains & SSL",
    "Banking & Stripe Fees",
    "Other Overhead",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              {editItem ? "Edit Transaction Entry" : "Record Financial Entry"}
            </h2>
            <p className="text-xs text-slate-400">
              Autocomputes your profit and loss standing in real time
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          {/* Income vs Expense Selector */}
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg font-bold transition ${
                isIncome
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Income (Inflow)</span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange("expense")}
              className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg font-bold transition ${
                !isIncome
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>Expense (Cost)</span>
            </button>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Amount ({currency})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">{currency}</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-7 pr-3 py-2 text-white font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Transaction Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Stream & Linked Entity (if income) */}
          {isIncome ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Revenue Stream
                </label>
                <select
                  value={formData.stream}
                  onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="client">Client Work / Agency</option>
                  <option value="app">My Apps / SaaS Product</option>
                  <option value="other">General / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {formData.stream === "client" ? "Select Customer" : formData.stream === "app" ? "Select App" : "Source Name"}
                </label>
                {formData.stream === "client" && clients.length > 0 ? (
                  <select
                    value={formData.clientId}
                    onChange={(e) => handleClientChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">-- Choose Customer --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company || c.name}
                      </option>
                    ))}
                  </select>
                ) : formData.stream === "app" && apps.length > 0 ? (
                  <select
                    value={formData.appId}
                    onChange={(e) => handleAppChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">-- Choose App --</option>
                    {apps.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="e.g. Acme Client or Product"
                    value={formData.sourceName}
                    onChange={(e) => setFormData({ ...formData, sourceName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Expense Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {expenseCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Vendor / Cost Allocation
                </label>
                <input
                  type="text"
                  placeholder="e.g. AWS, OpenAI API, Figma, Freelancer"
                  value={formData.sourceName}
                  onChange={(e) => setFormData({ ...formData, sourceName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {isIncome && (
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {incomeCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Payment Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Paid">Paid / Settled</option>
                <option value="Pending">Pending / Unpaid Invoice</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Description / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. October monthly retainer or AWS invoice"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Live Impact Preview */}
          {formData.amount && Number(formData.amount) > 0 && (
            <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
              isIncome 
                ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                : "bg-rose-950/20 border-rose-500/30 text-rose-300"
            }`}>
              <span>Accountant Ledger Impact:</span>
              <strong className="font-bold">
                {isIncome ? `+${formatCurrency(formData.amount, currency)} to Revenue` : `-${formatCurrency(formData.amount, currency)} to Net Profit`}
              </strong>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl font-bold text-white transition shadow-md ${
                isIncome ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              {editItem ? "Save Changes" : isIncome ? "Record Income" : "Record Expense"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
