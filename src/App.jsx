import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DashboardView from "./views/DashboardView";
import ClientsView from "./views/ClientsView";
import AppsView from "./views/AppsView";
import TransactionsView from "./views/TransactionsView";
import ReportsView from "./views/ReportsView";
import SettingsView from "./views/SettingsView";

import TransactionModal from "./components/TransactionModal";
import ClientModal from "./components/ClientModal";
import AppModal from "./components/AppModal";
import ExportImportModal from "./components/ExportImportModal";
import HelpModal from "./components/HelpModal";
import InvoiceModal from "./components/InvoiceModal";

import { storage } from "./services/storageService";
import { calculateFinancials } from "./services/accountantEngine";
import { INITIAL_DATA } from "./services/initialData";

export default function App() {
  const [data, setData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(true);

  // Active view navigation
  const [activeView, setActiveView] = useState("dashboard");

  // Mobile menu drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Workspaces / Multi-Profile state
  const [workspaces, setWorkspaces] = useState(() => storage.getWorkspaces());
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(() => storage.getActiveWorkspaceId());

  // Time period filter
  const [selectedPeriod, setSelectedPeriod] = useState("ALL");

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txInitialType, setTxInitialType] = useState("income");
  const [editingTx, setEditingTx] = useState(null);

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  const [invoiceClient, setInvoiceClient] = useState(null);

  // Help Modal state
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [helpInitialTab, setHelpInitialTab] = useState("glossary");

  // Initial load
  useEffect(() => {
    async function init() {
      try {
        const loaded = await storage.loadData();
        if (loaded) {
          setData(loaded);
        }
      } catch (err) {
        console.error("Failed to load initial data:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [activeWorkspaceId]);

  // Compute period filters for the accountant engine
  let filterYear = null;
  let filterMonth = null;
  if (selectedPeriod !== "ALL") {
    if (selectedPeriod.length === 4) {
      filterYear = parseInt(selectedPeriod, 10);
    } else if (selectedPeriod.includes("-")) {
      const [y, m] = selectedPeriod.split("-");
      filterYear = parseInt(y, 10);
      filterMonth = parseInt(m, 10);
    }
  }

  // Live Accountant autocomputations
  const financials = calculateFinancials({
    transactions: data.transactions || [],
    taxRate: data.business?.taxRate || 25,
    filterYear,
    filterMonth,
    currency: data.business?.currency || "GH₵",
  });

  // Data persistence helper
  const updateData = async (newData) => {
    setData(newData);
    await storage.saveData(newData);
  };

  // Workspace handlers
  const handleSwitchWorkspace = async (id) => {
    storage.setActiveWorkspaceId(id);
    setActiveWorkspaceId(id);
    setLoading(true);
    const loaded = await storage.loadData();
    if (loaded) setData(loaded);
    setLoading(false);
  };

  const handleCreateWorkspace = (name) => {
    const created = storage.createWorkspace(name);
    setWorkspaces(storage.getWorkspaces());
    setActiveWorkspaceId(created.id);
  };

  const handleDeleteWorkspace = (id) => {
    try {
      const updated = storage.deleteWorkspace(id);
      setWorkspaces(updated);
      setActiveWorkspaceId(storage.getActiveWorkspaceId());
    } catch (e) {
      alert(e.message);
    }
  };

  // Help modal opener
  const handleOpenHelpModal = (tab = "glossary") => {
    setHelpInitialTab(tab);
    setIsHelpModalOpen(true);
  };

  // Transaction Handlers
  const handleOpenTransactionModal = (type = "income") => {
    setEditingTx(null);
    setTxInitialType(type);
    setIsTxModalOpen(true);
  };

  const handleEditTransaction = (tx) => {
    setEditingTx(tx);
    setIsTxModalOpen(true);
  };

  const handleSaveTransaction = async (formData) => {
    let updatedTxList = [...(data.transactions || [])];
    if (editingTx) {
      updatedTxList = updatedTxList.map((t) => (t.id === editingTx.id ? { ...formData, id: t.id } : t));
    } else {
      const newTx = {
        ...formData,
        id: `tx-${Date.now()}`,
      };
      updatedTxList = [newTx, ...updatedTxList];
    }
    await updateData({ ...data, transactions: updatedTxList });
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction entry?")) {
      const updatedTxList = (data.transactions || []).filter((t) => t.id !== id);
      await updateData({ ...data, transactions: updatedTxList });
    }
  };

  const handleToggleStatus = async (id) => {
    const updatedTxList = (data.transactions || []).map((t) => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === "Paid" ? "Pending" : "Paid",
        };
      }
      return t;
    });
    await updateData({ ...data, transactions: updatedTxList });
  };

  const handleUpdateTransactionStatus = async (id, newStatus) => {
    const updatedTxList = (data.transactions || []).map((t) => {
      if (t.id === id) {
        return { ...t, status: newStatus };
      }
      return t;
    });
    await updateData({ ...data, transactions: updatedTxList });
  };

  // Client Handlers
  const handleOpenClientModal = () => {
    setEditingClient(null);
    setIsClientModalOpen(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setIsClientModalOpen(true);
  };

  const handleSaveClient = async (formData) => {
    let updatedClients = [...(data.clients || [])];
    if (editingClient) {
      updatedClients = updatedClients.map((c) => (c.id === editingClient.id ? { ...formData, id: c.id } : c));
    } else {
      const newClient = {
        ...formData,
        id: `client-${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
      };
      updatedClients = [...updatedClients, newClient];
    }
    await updateData({ ...data, clients: updatedClients });
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm("Delete this customer? This will not delete past transactions.")) {
      const updatedClients = (data.clients || []).filter((c) => c.id !== id);
      await updateData({ ...data, clients: updatedClients });
    }
  };

  const handleAddTransactionForClient = (client) => {
    setEditingTx(null);
    setTxInitialType("income");
    setIsTxModalOpen(true);
  };

  // Invoice Handlers
  const handleRecordInvoice = async (invoiceTx) => {
    const newTx = { ...invoiceTx, id: `tx-${Date.now()}` };
    await updateData({ ...data, transactions: [newTx, ...(data.transactions || [])] });
  };

  // App Handlers
  const handleOpenAppModal = () => {
    setEditingApp(null);
    setIsAppModalOpen(true);
  };

  const handleEditApp = (app) => {
    setEditingApp(app);
    setIsAppModalOpen(true);
  };

  const handleSaveApp = async (formData) => {
    let updatedApps = [...(data.apps || [])];
    if (editingApp) {
      updatedApps = updatedApps.map((a) => (a.id === editingApp.id ? { ...formData, id: a.id } : a));
    } else {
      const newApp = {
        ...formData,
        id: `app-${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
      };
      updatedApps = [...updatedApps, newApp];
    }
    await updateData({ ...data, apps: updatedApps });
  };

  const handleDeleteApp = async (id) => {
    if (window.confirm("Delete this software app from tracking?")) {
      const updatedApps = (data.apps || []).filter((a) => a.id !== id);
      await updateData({ ...data, apps: updatedApps });
    }
  };

  const handleAddTransactionForApp = (app) => {
    setEditingTx(null);
    setTxInitialType("income");
    setIsTxModalOpen(true);
  };

  // Settings Handlers
  const handleSaveSettings = async (settings) => {
    await updateData({
      ...data,
      business: {
        ...data.business,
        ...settings,
      },
    });
  };

  const handleResetDemo = async () => {
    const fresh = await storage.resetToDemo();
    setData(fresh);
  };

  const handleImportJSON = async (jsonText) => {
    const imported = await storage.importJSON(jsonText);
    setData(imported);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading Business Portal...</span>
        </div>
      </div>
    );
  }

  const counts = {
    clients: (data.clients || []).length,
    apps: (data.apps || []).length,
    transactions: (data.transactions || []).length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Header Navigation */}
      <Navbar
        business={data.business || {}}
        financials={financials}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        onOpenTransactionModal={() => handleOpenTransactionModal("income")}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenHelpModal={handleOpenHelpModal}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* 2. Main Layout (Sidebar + Content View) */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row min-h-0">
        {/* Responsive Sidebar (Desktop persistent, Mobile slide-in drawer) */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          counts={counts}
          business={data.business || {}}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onOpenHelpModal={handleOpenHelpModal}
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          onSwitchWorkspace={handleSwitchWorkspace}
          onCreateWorkspace={handleCreateWorkspace}
        />

        {/* Dynamic View Area */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          {activeView === "dashboard" && (
            <DashboardView
              business={data.business || {}}
              financials={financials}
              transactions={data.transactions || []}
              clients={data.clients || []}
              apps={data.apps || []}
              onOpenTransactionModal={handleOpenTransactionModal}
              onOpenClientModal={handleOpenClientModal}
              onOpenAppModal={handleOpenAppModal}
              onOpenHelpModal={handleOpenHelpModal}
              onUpdateTransactionStatus={handleUpdateTransactionStatus}
              setActiveView={setActiveView}
            />
          )}

          {activeView === "clients" && (
            <ClientsView
              clients={data.clients || []}
              transactions={data.transactions || []}
              currency={data.business?.currency || "$"}
              onOpenClientModal={handleOpenClientModal}
              onEditClient={handleEditClient}
              onDeleteClient={handleDeleteClient}
              onAddTransactionForClient={handleAddTransactionForClient}
              onGenerateInvoice={setInvoiceClient}
            />
          )}

          {activeView === "apps" && (
            <AppsView
              apps={data.apps || []}
              transactions={data.transactions || []}
              currency={data.business?.currency || "$"}
              onOpenAppModal={handleOpenAppModal}
              onEditApp={handleEditApp}
              onDeleteApp={handleDeleteApp}
              onAddTransactionForApp={handleAddTransactionForApp}
            />
          )}

          {activeView === "transactions" && (
            <TransactionsView
              transactions={data.transactions || []}
              currency={data.business?.currency || "$"}
              onOpenTransactionModal={handleOpenTransactionModal}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onToggleStatus={handleToggleStatus}
              onExportCSV={(list, curr) => storage.exportCSV(list, curr)}
            />
          )}

          {activeView === "reports" && (
            <ReportsView
              transactions={data.transactions || []}
              business={data.business || {}}
              financials={financials}
            />
          )}

          {activeView === "settings" && (
            <SettingsView
              business={data.business || {}}
              onSaveSettings={handleSaveSettings}
              onResetDemo={handleResetDemo}
              onOpenBackupModal={() => setIsBackupModalOpen(true)}
              onOpenHelpModal={handleOpenHelpModal}
              workspaces={workspaces}
              activeWorkspaceId={activeWorkspaceId}
              onSwitchWorkspace={handleSwitchWorkspace}
              onCreateWorkspace={handleCreateWorkspace}
              onDeleteWorkspace={handleDeleteWorkspace}
            />
          )}
        </main>
      </div>

      {/* Footer with Copyright */}
      <footer className="border-t border-slate-800 py-5 px-4 text-center text-xs text-slate-400 bg-[#0d131f]">
        <p className="flex items-center justify-center space-x-1.5 flex-wrap">
          <span>&copy; {new Date().getFullYear()}</span>
          <span className="font-bold text-slate-200">Cleeric Senyo Dey</span>
          <span>• Business Hub & Financial Portal. All rights reserved.</span>
        </p>
      </footer>

      {/* 3. Global Action Modals */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSave={handleSaveTransaction}
        clients={data.clients || []}
        apps={data.apps || []}
        initialType={txInitialType}
        editItem={editingTx}
        currency={data.business?.currency || "$"}
      />

      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSave={handleSaveClient}
        editItem={editingClient}
        currency={data.business?.currency || "$"}
      />

      <AppModal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
        onSave={handleSaveApp}
        editItem={editingApp}
        currency={data.business?.currency || "$"}
      />

      <InvoiceModal
        isOpen={!!invoiceClient}
        onClose={() => setInvoiceClient(null)}
        onRecordToLedger={handleRecordInvoice}
        client={invoiceClient}
        business={data.business || {}}
      />

      <ExportImportModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        data={data}
        onExportJSON={(d) => storage.exportJSON(d)}
        onImportJSON={handleImportJSON}
        onExportCSV={(txs, curr) => storage.exportCSV(txs, curr)}
      />

      {/* 4. Plain-English Help & Guide Modal */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        initialTab={helpInitialTab}
      />
    </div>
  );
}
