import React, { useState, useEffect } from "react";
import { X, Users, Mail, Phone, Building, Briefcase, DollarSign } from "lucide-react";

export default function ClientModal({
  isOpen,
  onClose,
  onSave,
  editItem = null,
  currency = "$",
}) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    serviceType: "Custom Web Application",
    status: "Active",
    budget: "",
    notes: "",
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        ...editItem,
        budget: editItem.budget ? editItem.budget.toString() : "",
      });
    } else {
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        serviceType: "Custom Web Application",
        status: "Active",
        budget: "",
        notes: "",
      });
    }
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Customer name is required.");
      return;
    }

    onSave({
      ...formData,
      budget: formData.budget ? parseFloat(formData.budget) : 0,
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
              {editItem ? "Edit Customer Profile" : "Add New Customer"}
            </h2>
            <p className="text-xs text-slate-400">
              Save contact information and project deliverables
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
                Contact Person Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Sarah Jenkins"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                placeholder="e.g. Horizon Dental Care"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="client@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Service Type
              </label>
              <input
                type="text"
                placeholder="e.g. Web App, Booking Portal"
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Relationship Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Active">Active Project</option>
                <option value="Lead">Lead / Prospect</option>
                <option value="Completed">Completed Client</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Estimated Contract / Budget ({currency})
            </label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Notes & Requirements
            </label>
            <textarea
              rows={2}
              placeholder="Details on scope, deliverables, or payment milestones..."
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
              {editItem ? "Update Customer" : "Save Customer"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
