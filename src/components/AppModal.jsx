import React, { useState, useEffect } from "react";
import { X, AppWindow, Users, DollarSign, Globe, FileText } from "lucide-react";

export default function AppModal({
  isOpen,
  onClose,
  onSave,
  editItem = null,
  currency = "$",
}) {
  const [formData, setFormData] = useState({
    name: "",
    type: "SaaS Web Application",
    activeUsers: "",
    monthlyPrice: "",
    url: "",
    status: "Active",
    notes: "",
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        ...editItem,
        activeUsers: editItem.activeUsers ? editItem.activeUsers.toString() : "",
        monthlyPrice: editItem.monthlyPrice ? editItem.monthlyPrice.toString() : "",
      });
    } else {
      setFormData({
        name: "",
        type: "SaaS Web Application",
        activeUsers: "",
        monthlyPrice: "",
        url: "",
        status: "Active",
        notes: "",
      });
    }
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("App name is required.");
      return;
    }

    onSave({
      ...formData,
      activeUsers: formData.activeUsers ? parseInt(formData.activeUsers, 10) : 0,
      monthlyPrice: formData.monthlyPrice ? parseFloat(formData.monthlyPrice) : 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              {editItem ? "Edit App / Product" : "Add New App / Product"}
            </h2>
            <p className="text-xs text-slate-400">
              Track software users, subscription fees, and dedicated hosting costs
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                App / Product Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. TaskFlow SaaS"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Product Category
              </label>
              <input
                type="text"
                placeholder="e.g. AI Creative Suite, DevTool"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Active User Count
              </label>
              <input
                type="number"
                placeholder="e.g. 1500"
                value={formData.activeUsers}
                onChange={(e) => setFormData({ ...formData, activeUsers: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Monthly Subscription Fee ({currency})
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 19.00"
                value={formData.monthlyPrice}
                onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Live URL / Website
              </label>
              <input
                type="url"
                placeholder="https://yourapp.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Lifecycle Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Active">Active & Monetizing</option>
                <option value="Beta">Beta Testing</option>
                <option value="In Development">In Development</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Tech Stack & Infrastructure Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Next.js on Vercel, Supabase backend, Stripe billing..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Actions */}
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
              className="px-5 py-2 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md"
            >
              {editItem ? "Update App" : "Save App"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
