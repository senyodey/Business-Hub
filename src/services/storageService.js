import { INITIAL_DATA } from "./initialData";

const STORAGE_KEY = "biz_portal_data_v1";

class StorageService {
  constructor() {
    this.apiAvailable = null;
  }

  // Check if Express backend is running
  async checkBackend() {
    if (this.apiAvailable !== null) return this.apiAvailable;
    try {
      const res = await fetch("/api/health", { method: "GET", signal: AbortSignal.timeout(1200) });
      if (res.ok) {
        this.apiAvailable = true;
        return true;
      }
    } catch {
      // Backend not running (e.g. running on Netlify/Vercel static deploy)
    }
    this.apiAvailable = false;
    return false;
  }

  // Load all portal data
  async loadData() {
    const hasBackend = await this.checkBackend();

    if (hasBackend) {
      try {
        const res = await fetch("/api/data");
        if (res.ok) {
          const remoteData = await res.json();
          // Backup locally as well
          localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
          return remoteData;
        }
      } catch (err) {
        console.warn("Express backend read failed, falling back to local storage:", err);
      }
    }

    // Local storage fallback (Netlify / Vercel static deployment)
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Corrupted local storage data, re-initializing:", e);
      }
    }

    // First time init: save initial seed data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  // Save all portal data
  async saveData(data) {
    // Always persist to localStorage for instant client responsiveness
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    const hasBackend = await this.checkBackend();
    if (hasBackend) {
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

  // Reset to initial demo data
  async resetToDemo() {
    localStorage.removeItem(STORAGE_KEY);
    return this.saveData(JSON.parse(JSON.stringify(INITIAL_DATA)));
  }

  // Export as JSON backup file
  exportJSON(data) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    const dateStr = new Date().toISOString().split("T")[0];
    downloadAnchor.setAttribute("download", `business-backup-${dateStr}.json`);
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
  exportCSV(transactions = []) {
    const headers = ["ID", "Date", "Type", "Stream", "Category", "Source / Client", "Amount", "Status", "Description"];
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
