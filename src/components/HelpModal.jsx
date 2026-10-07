import React, { useState } from "react";
import {
  X,
  BookOpen,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  PiggyBank,
  Users,
  Search,
  CheckCircle2,
  Lightbulb,
  Laptop,
  FileSpreadsheet,
  Download,
  Lock
} from "lucide-react";

export default function HelpModal({ isOpen, onClose, initialTab = "glossary" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const glossaryItems = [
    {
      term: "Gross Revenue (Cash Inflow)",
      short: "Total money collected before paying any bills or expenses.",
      detail:
        "Every single cedi or dollar paid by clients or subscribers goes into your Gross Revenue. If a client pays you GH₵ 5,000 and your app brings in GH₵ 1,200 this month, your gross revenue is GH₵ 6,200.",
      icon: TrendingUp,
      color: "emerald",
      tag: "Income",
    },
    {
      term: "Operating Expenses (Cash Outflow)",
      short: "The money you spend to keep your business running.",
      detail:
        "Includes hosting bills, software subscriptions, office supplies, internet, domain renewals, contractor payments, and bank transaction fees.",
      icon: TrendingDown,
      color: "rose",
      tag: "Cost",
    },
    {
      term: "Net Profit (or Deficit / Loss)",
      short: "The bottom line: what is actually left over.",
      detail:
        "Calculated as Revenue minus Expenses. If Revenue is GH₵ 6,200 and Expenses are GH₵ 1,800, your Net Profit is +GH₵ 4,400 (Green / Profitable). If your expenses were higher than your revenue, you operated at a Net Loss (Red / Deficit).",
      icon: DollarSign,
      color: "indigo",
      tag: "Bottom Line",
    },
    {
      term: "Profit Margin (%)",
      short: "The percentage of every cedi earned that you keep as profit.",
      detail:
        "Formula: (Net Profit ÷ Revenue) × 100. A 70% profit margin means for every GH₵ 100 your business earns, you keep GH₵ 70 and spent GH₵ 30 on operations. High margins mean a lean, profitable business.",
      icon: CheckCircle2,
      color: "cyan",
      tag: "Efficiency",
    },
    {
      term: "Accountant Tax Reserve",
      short: "Money to set aside in a separate account for taxes.",
      detail:
        "Taxes are calculated on your net profit. This portal automatically calculates your recommended tax reserve (e.g. 25% of net profit) so you never get hit with an unexpected tax bill at the end of the year.",
      icon: PiggyBank,
      color: "amber",
      tag: "Safety",
    },
    {
      term: "Take-Home (Distributable Profit)",
      short: "The safe amount you can withdraw into your personal pocket.",
      detail:
        "Net Profit minus your Tax Reserve. This is the safe amount you can transfer to your personal bank or mobile money account without risking unpaid business bills or missing tax funds.",
      icon: ShieldCheck,
      color: "emerald",
      tag: "Owner Pay",
    },
    {
      term: "Paid vs. Pending Status",
      short: "Cash in the bank vs. unpaid invoices.",
      detail:
        "Marking a transaction 'Paid' means the money has landed in your bank or MoMo. 'Pending' means an invoice was issued or work is in progress, but you haven't received payment yet. You can toggle this anytime with one click.",
      icon: CheckCircle2,
      color: "purple",
      tag: "Cashflow",
    },
    {
      term: "Revenue Streams (Clients vs Apps)",
      short: "Tracking services versus software products.",
      detail:
        "Clients: Income earned doing custom client projects, agency services, or consulting. Apps: Recurring revenue generated from digital products, web subscriptions, and digital tools.",
      icon: Laptop,
      color: "blue",
      tag: "Model",
    },
  ];

  const filteredGlossary = glossaryItems.filter(
    (item) =>
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.short.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Business & Accounting Guide
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                  Plain English
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Understand your numbers, manage client invoices, and track your business health
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-4 sm:px-5 border-b border-slate-800 bg-slate-950/40 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab("glossary")}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeTab === "glossary"
                ? "border-indigo-500 text-indigo-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Accounting in Plain English</span>
          </button>

          <button
            onClick={() => setActiveTab("how-to")}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeTab === "how-to"
                ? "border-indigo-500 text-indigo-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>How to Use This Portal</span>
          </button>

          <button
            onClick={() => setActiveTab("multi-user")}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeTab === "multi-user"
                ? "border-indigo-500 text-indigo-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Sharing & Multiple Users</span>
          </button>

          <button
            onClick={() => setActiveTab("safety")}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeTab === "safety"
                ? "border-indigo-500 text-indigo-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Privacy & Data Safety</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-300">
          
          {/* TAB 1: PLAIN ENGLISH GLOSSARY */}
          {activeTab === "glossary" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search any term (e.g. Gross Revenue, Tax Reserve, Profit Margin)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <span className="text-[11px] text-slate-400 shrink-0">
                  Showing {filteredGlossary.length} key terms
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredGlossary.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.term}
                      className="bg-slate-950/60 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 space-y-2 transition shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                            <Icon className="w-4 h-4" />
                          </div>
                          <h3 className="font-bold text-white text-xs">{item.term}</h3>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-slate-200 font-medium text-[11px]">{item.short}</p>
                      <p className="text-slate-400 text-[11px] leading-relaxed pt-1 border-t border-slate-800/80">
                        {item.detail}
                      </p>
                    </div>
                  );
                })}
              </div>

              {filteredGlossary.length === 0 && (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No terms found matching "{searchQuery}".
                </div>
              )}
            </div>
          )}

          {/* TAB 2: HOW TO USE THE PORTAL */}
          {activeTab === "how-to" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
                <h3 className="font-bold text-indigo-300 text-sm mb-1">
                  Simple Bookkeeping Without An Accountant
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  You don't need any complex spreadsheet formulas. Just log the money you receive and the money you spend. The portal handles all the math, profit analysis, and tax estimation automatically!
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">1</span>
                    <span>Recording Income (When You Get Paid)</span>
                  </div>
                  <p className="text-slate-400 pl-7 text-[11px] leading-relaxed">
                    Click <strong>"+ Income"</strong> or <strong>"Add Entry"</strong> at the top. Enter the amount in Cedis, select the client or app, and choose whether the cash has been received (Paid) or is pending payment. The portal updates your revenue and profit standing in real time!
                  </p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center space-x-2 text-rose-400 font-bold">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-xs">2</span>
                    <span>Logging Operating Expenses (When You Spend Money)</span>
                  </div>
                  <p className="text-slate-400 pl-7 text-[11px] leading-relaxed">
                    Click <strong>"+ Expense"</strong> whenever you pay for servers, software tools, equipment, transport, contractors, or bank charges. Categorize it so the charts can show you where your money is going.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center space-x-2 text-indigo-400 font-bold">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs">3</span>
                    <span>Managing Customers & Invoicing</span>
                  </div>
                  <p className="text-slate-400 pl-7 text-[11px] leading-relaxed">
                    Go to <strong>"Customers & CRM"</strong>. Add your clients with their contact details and agreed project budget. When you record income for a client, the card automatically shows how much they have paid and how much balance is remaining.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">4</span>
                    <span>Tracking Digital Apps & Products</span>
                  </div>
                  <p className="text-slate-400 pl-7 text-[11px] leading-relaxed">
                    Go to <strong>"My Apps & SaaS"</strong>. Add your software applications, active users, and subscription fees to see which digital product is generating the highest net return.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">5</span>
                    <span>Printing Official Financial Statements</span>
                  </div>
                  <p className="text-slate-400 pl-7 text-[11px] leading-relaxed">
                    Go to <strong>"Financial Statements"</strong>. View your complete 12-month annual Profit & Loss statement and click <strong>"Print Statement"</strong> to generate a clean PDF statement for banks or investors.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SHARING & MULTIPLE USERS */}
          {activeTab === "multi-user" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-white font-bold text-sm">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>Can Different People Use This Portal?</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  <strong>Yes, absolutely!</strong> Here is how different people can use it seamlessly:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 text-xs">Private Devices (Separate Users)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Automatic</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    When someone opens this website on their phone or computer, they get their own <strong>100% private financial ledger</strong>. Person A cannot see Person B's numbers, keeping your data confidential.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-400 text-xs">Multiple Business Profiles</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">Built-in</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    If two people share the same computer, or if you run multiple businesses (e.g. Agency Services and a Shop/App), you can create and switch between separate profiles in the <strong>Sidebar</strong> with 1 click.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400 text-xs">Sending Backups to Partners</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">1-Click</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Click <strong>"Backup"</strong> in the top navbar to download your full backup file. You can email or WhatsApp it to your business partner. They click "Restore" to view your exact records.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 text-xs">Sharing with an Accountant</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">Spreadsheet</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Click <strong>"Export CSV"</strong> in the transactions ledger to download a spreadsheet file that opens directly in Microsoft Excel, Google Sheets, or any accountant's software.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRIVACY & DATA SAFETY */}
          {activeTab === "safety" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-white font-bold text-sm">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Your Data Privacy & Protection</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Your business finances are sensitive. Here is how this portal protects your records:
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>100% Private to Your Device</span>
                  </div>
                  <p className="text-slate-400 pl-6 text-[11px] leading-relaxed">
                    All your financial data is saved privately inside your browser. No external companies, ad trackers, or third parties have access to your bank numbers, customer names, or profit records.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center space-x-2 text-indigo-400 font-bold">
                    <Download className="w-4 h-4 shrink-0" />
                    <span>How to Keep Safe Backups</span>
                  </div>
                  <p className="text-slate-400 pl-6 text-[11px] leading-relaxed">
                    Once a week or after entering major transactions, click <strong>"Backup"</strong> in the top navigation bar. Download the backup file and save it to your Google Drive, email it to yourself, or keep it on a USB drive. If you ever buy a new phone or computer, you can restore all your data in 2 seconds.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                    <FileSpreadsheet className="w-4 h-4 shrink-0" />
                    <span>Exporting to Excel or Google Sheets</span>
                  </div>
                  <p className="text-slate-400 pl-6 text-[11px] leading-relaxed">
                    In the <strong>Transactions Ledger</strong>, click <strong>"Export CSV"</strong> anytime to get an organized spreadsheet of all your income, expenses, dates, and amounts in Ghana Cedis.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 text-[11px] text-center sm:text-left">
            Have questions about an accounting term? Click any <span className="text-indigo-400 font-semibold">(?)</span> icon in the portal.
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
          >
            Got It, Back to Portal
          </button>
        </div>

      </div>
    </div>
  );
}
