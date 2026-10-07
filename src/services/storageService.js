import { INITIAL_DATA } from "./initialData";

const LEGACY_STORAGE_KEY = "biz_portal_data_v1";
const WORKSPACES_KEY = "biz_portal_workspaces_v2";
const ACTIVE_WORKSPACE_KEY = "biz_portal_active_ws_v2";

class StorageService {
  constructor() {
    this.apiAvailable = null;
  }

  // Workspaces / Multi-Profile Management
  getWorkspaces() {
    try {
      const raw = localStorage.getItem(WORKSPACES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Failed to read workspaces:", e);
    }
    const defaultWs = [{ id: "default", name: "Primary Business" }];
    try {
      localStorage.setItem(WORKSPACES_KEY, JSON.stringify(defaultWs));
    } catch {}
    return defaultWs;
  }

  getActiveWorkspaceId() {
    try {
      const active = localStorage.getItem(ACTIVE_WORKSPACE_KEY);
      const workspaces = this.getWorkspaces();
      if (active && workspaces.some((w) => w.id === active)) {
        return active;
      }
    } catch {}
    return "default";
  }

  setActiveWorkspaceId(id) {
    try {
      localStorage.setItem(ACTIVE_WORKSPACE_KEY, id);
    } catch {}
  }

  createWorkspace(name) {
    const workspaces = this.getWorkspaces();
    const newId = `ws_${Date.now()}`;
    const newWs = { id: newId, name: name.trim() || `Workspace ${workspaces.length + 1}` };
    const updated = [...workspaces, newWs];
    localStorage.setItem(WORKSPACES_KEY, JSON.stringify(updated));
    // Initialize workspace with template
    const template = JSON.parse(JSON.stringify(INITIAL_DATA));
    template.business.name = newWs.name;
    template.transactions = []; // fresh ledger for new workspace
    localStorage.setItem(this.getStorageKey(newId), JSON.stringify(template));
    this.setActiveWorkspaceId(newId);
    return newWs;
  }

  deleteWorkspace(id) {
    let workspaces = this.getWorkspaces();
    if (workspaces.length <= 1) {
      throw new Error("Cannot delete the only remaining workspace.");
    }
    workspaces = workspaces.filter((w) => w.id !== id);
    localStorage.setItem(WORKSPACES_KEY, JSON.stringify(workspaces));
    localStorage.removeItem(this.getStorageKey(id));
    if (this.getActiveWorkspaceId() === id) {
      this.setActiveWorkspaceId(workspaces[0].id);
    }
    return workspaces;
  }

  getStorageKey(workspaceId = null) {
    const wsId = workspaceId || this.getActiveWorkspaceId();
    return `biz_portal_data_${wsId}`;
  }

  // Check if Express backend is running (safely checks content-type to avoid Netlify SPA catch-all HTML false positive)
  async checkBackend() {
    if (this.apiAvailable !== null) return this.apiAvailable;
    try {
      const res = await fetch("/api/health", { method: "GET", signal: AbortSignal.timeout(1200) });
      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.includes("application/json")) {
        const json = await res.json();
        if (json && json.status === "ok") {
          this.apiAvailable = true;
          return true;
        }
      }
    } catch {
      // Backend not running (e.g. running on Netlify/Vercel static deploy)
    }
    this.apiAvailable = false;
    return false;
  }

  // Load all portal data for active workspace
  async loadData() {
    const hasBackend = await this.checkBackend();
    const storageKey = this.getStorageKey();

    // In local backend mode for primary workspace, sync with Express API
    if (hasBackend && this.getActiveWorkspaceId() === "default") {
      try {
        const res = await fetch("/api/data");
        const contentType = res.headers.get("content-type") || "";
        if (res.ok && contentType.includes("application/json")) {
          const remoteData = await res.json();
          localStorage.setItem(storageKey, JSON.stringify(remoteData));
          return remoteData;
        }
      } catch (err) {
        console.warn("Express backend read failed, falling back to local storage:", err);
      }
    }

    // Local storage fallback (Netlify / Vercel static deployment or other workspaces)
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Corrupted local storage data, checking legacy:", e);
      }
    }

    // Check legacy v1 key for backward compatibility
    if (this.getActiveWorkspaceId() === "default") {
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy) {
        try {
          const parsed = JSON.parse(legacy);
          localStorage.setItem(storageKey, JSON.stringify(parsed));
          return parsed;
        } catch {}
      }
    }

    // First time init: save initial seed data
    localStorage.setItem(storageKey, JSON.stringify(INITIAL_DATA));
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  // Save all portal data for active workspace
  async saveData(data) {
    const storageKey = this.getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(data));

    const hasBackend = await this.checkBackend();
    if (hasBackend && this.getActiveWorkspaceId() === "default") {
      try {
        await fetch("/api/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } catch (err) {
        console.warn("Backend sync failed:", err);
      }
    }
    return data;
  }

  // Reset active workspace to initial demo data
  async resetToDemo() {
    const storageKey = this.getStorageKey();
    localStorage.removeItem(storageKey);
    return this.saveData(JSON.parse(JSON.stringify(INITIAL_DATA)));
  }

  // Export as JSON backup file
  exportJSON(data) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    const dateStr = new Date().toISOString().split("T")[0];
    const wsName = (data.business?.name || "business").toLowerCase().replace(/[^a-z0-9]/g, "-");
    downloadAnchor.setAttribute("download", `${wsName}-backup-${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // Import JSON backup
  async importJSON(jsonText) {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.transactions || !parsed.clients) {
        throw new Error("Invalid backup format: missing transactions or clients");
      }
      return await this.saveData(parsed);
    } catch (err) {
      throw new Error(`Failed to import data: ${err.message}`);
    }
  }

  // Export transactions to CSV
  exportCSV(transactions = [], currency = "$") {
    const headers = ["ID", "Date", "Type", "Stream", "Category", "Source / Client", `Amount (${currency})`, "Status", "Description"];
    const rows = transactions.map((t) => [
      `"${t.id || ""}"`,
      `"${t.date || ""}"`,
      `"${t.type || ""}"`,
      `"${t.stream || ""}"`,
      `"${t.category || ""}"`,
      `"${(t.sourceName || "").replace(/"/g, '""')}"`,
      `"${t.amount || 0}"`,
      `"${t.status || ""}"`,
      `"${(t.description || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const dateStr = new Date().toISOString().split("T")[0];
    link.setAttribute("download", `transactions-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}

export const storage = new StorageService();
