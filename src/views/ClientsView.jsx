import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Edit3, 
  Trash2, 
  DollarSign, 
  Briefcase
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";

export default function ClientsView({
  clients = [],
  transactions = [],
  currency = "GH₵",
  onOpenClientModal,
  onEditClient,
  onDeleteClient,
  onAddTransactionForClient,
}) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Autocompute client financial standing
  const enrichedClients = clients.map((client) => {
    const clientTx = transactions.filter((t) => t.clientId === client.id && t.type === "income");
    const totalPaid = clientTx
      .filter((t) => t.status === "Paid" || !t.status)
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const totalPending = clientTx
      .filter((t) => t.status === "Pending")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const budget = Number(client.budget) || 0;
    const remainingBalance = Math.max(0, budget - totalPaid);
    const progressPct = budget > 0 ? Math.min(100, Math.round((totalPaid / budget) * 100)) : 0;

    return {
      ...client,
      totalPaid,
      totalPending,
      remainingBalance,
      progressPct,
    };
  });

  // Filter clients
  const filtered = enrichedClients.filter((c) => {
    const matchesSearch =
      (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.company || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.serviceType || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === "ALL" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Summary counts
  const totalBilled = enrichedClients.reduce((sum, c) => sum + c.totalPaid, 0);
  const totalReceivables = enrichedClients.reduce((sum, c) => sum + c.totalPending, 0);

  return (
    <div className="space-y-6">
      
      {/* 1. Header with CRM metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Customers & CRM
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            Manage client contacts, services delivered, and collected revenues
          </p>
        </div>

        <button
          onClick={onOpenClientModal}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* 2. Mini KPI strip for CRM */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs text-slate-400 font-medium block mb-1">Total Client Accounts</span>
          <span className="text-xl font-bold text-white tracking-tight tabular-nums block">{clients.length} accounts</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs text-slate-400 font-medium block mb-1">Total Collected from Clients</span>
          <span className="text-xl font-bold text-emerald-400 tracking-tight tabular-nums block">{formatCurrency(totalBilled, currency)}</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs text-slate-400 font-medium block mb-1">Pending Invoices</span>
          <span className="text-xl font-bold text-amber-400 tracking-tight tabular-nums block">{formatCurrency(totalReceivables, currency)}</span>
        </div>
      </div>

      {/* 3. Search and Status filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search customer name, company, email, or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 shadow-inner"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs overflow-x-auto pb-1 sm:pb-0">
          <span className="text-slate-400 font-semibold shrink-0">Status:</span>
          {["ALL", "Active", "Lead", "Completed"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                filterStatus === st
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filtered.map((client) => {
          const statusColors = {
            Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
            Lead: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
            Completed: "bg-slate-800 text-slate-400 border-slate-700",
          };

          return (
            <div
              key={client.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div>
                {/* Header: Company & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white tracking-tight truncate">
                      {client.company || client.name}
                    </h3>
                    <div className="text-xs font-semibold text-indigo-400 flex items-center space-x-1.5 mt-0.5 truncate">
                      <Briefcase className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{client.serviceType || "Web / App Development"}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                      statusColors[client.status] || statusColors.Active
                    }`}
                  >
                    {client.status || "Active"}
                  </span>
                </div>

                {/* Contact Fields */}
                <div className="mt-4 pt-3.5 border-t border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center text-slate-300 space-x-2">
                    <span className="text-slate-400 font-medium w-16 shrink-0">Contact:</span>
                    <span className="font-semibold text-white truncate">{client.name}</span>
                  </div>

                  {client.email && (
                    <div className="flex items-center text-slate-300 space-x-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <a
                        href={`mailto:${client.email}`}
                        className="text-slate-300 hover:text-indigo-400 hover:underline transition truncate"
                      >
                        {client.email}
                      </a>
                    </div>
                  )}

                  {client.phone && (
                    <div className="flex items-center text-slate-300 space-x-2 truncate">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <a
                        href={`tel:${client.phone}`}
                        className="text-slate-300 hover:text-indigo-400 transition truncate"
                      >
                        {client.phone}
                      </a>
                    </div>
                  )}

                  {client.notes && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-slate-950 text-slate-400 text-[11px] italic border border-slate-800">
                      "{client.notes}"
                    </div>
                  )}
                </div>
              </div>

              {/* Autocomputed Billing Standing & Progress */}
              <div className="pt-3.5 border-t border-slate-800/80 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">Paid to Date</span>
                    <span className="font-bold text-emerald-400 text-sm tabular-nums block mt-0.5">
                      {formatCurrency(client.totalPaid, currency)}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">Project Budget</span>
                    <span className="font-bold text-white text-sm tabular-nums block mt-0.5">
                      {client.budget ? formatCurrency(client.budget, currency) : "Flexible"}
                    </span>
                  </div>
                </div>

                {/* Progress bar if budget exists */}
                {client.budget > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                      <span>Collection Progress</span>
                      <span className="font-bold text-slate-300">{client.progressPct}%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${client.progressPct}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions: Add Income, Edit, Delete */}
                <div className="flex items-center justify-between pt-1 gap-2">
                  <button
                    onClick={() => onAddTransactionForClient(client)}
                    className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/20 transition shadow-sm"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Record Payment</span>
                  </button>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => onEditClient(client)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                      title="Edit Customer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteClient(client.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                      title="Delete Customer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs font-medium">
            No customers match your criteria. Click "+ Add New Customer" above to create one.
          </div>
        )}
      </div>

    </div>
  );
}
