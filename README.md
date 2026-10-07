# 💼 Business Hub & Financial Portal

A modern, responsive business portal engineered for software developers, agencies, and business owners who **run their own digital apps** and **build custom websites/apps for clients**, designed specifically so that **non-accountants can understand every single financial metric**.

Features a **modern frosted-glass dashboard UI**, native **Ghana Cedis (`GH₵`)** support, and an automated accountant advisory engine. Built with **React (Vite)** and **Tailwind CSS**, ready for **100% free serverless hosting on Netlify or Vercel**.

---

## 🌟 Core Features

### 1. 📖 Non-Accountant Help Center & Plain-English Guide
- **Zero Jargon**: Explains Gross Revenue, Operating Expenses, Net Profit/Loss, Profit Margins, Tax Reserves, and Take-Home in everyday plain English.
- **Interactive Search**: Search any financial term or concept right inside the portal.
- **Contextual Tooltips & Guidance**: Click any `(?)` badge across cards and diagnostics to immediately learn what a metric means and how it helps your bottom-line.

### 2. 📱 Fully Responsive Mobile & Desktop Design
- **Mobile Navigation Drawer**: Tap the mobile hamburger menu for quick access to all views and tools.
- **Touch-Friendly Controls**: 2x2 quick-action buttons on mobile, adaptive financial cards, and scrollable transaction tables.
- **Adaptive Charts & Cards**: Recharts graphs scale dynamically on any phone, tablet, laptop, or ultrawide desktop monitor.
- **Keyboard-Safe Scrollable Modals**: Modals never get cut off on mobile devices or short screens.

### 3. 👥 Multi-User & Workspace Profiles
- **Different People on the Same Site**: When hosted on Netlify, each visitor/device gets their own private, isolated browser ledger.
- **Multi-Workspace Switcher**: Create multiple workspaces/profiles (e.g., Client Agency, SaaS App Studio, Partner) and switch between them in 1 click.
- **Collaborating with Partners & Accountants**: Export your complete state as a JSON backup or CSV spreadsheet to share with business partners or tax accountants.

### 4. 🧠 Automated Accountant Engine
- **Instant Profit & Loss (P&L)**: Real-time calculation of Gross Revenue, Operating Expenses, Net Profit/Loss, and Profit Margin %.
- **Deficit / Loss Warnings**: Clear alert banners and badges when monthly or yearly expenses exceed incoming cash flow.
- **Accountant Tax Reserve**: Recommends quarantining an estimated tax withholding (e.g. 25%) so you never face a surprise year-end tax bill.
- **Virtual Accountant Diagnostics**: Automated actionable insights (uncollected client milestones, high infrastructure cost ratios, SaaS recurring revenue strength).
- **Profit Goal & Breakeven Simulator**: Calculate what it will take to reach your target monthly take-home profit.

### 5. 👥 Customer Management & CRM
- Track client contacts: Name, Company, Email, Phone, Project Service, Status (Active, Lead, Completed), and Notes.
- **Autocomputed Client Standing**: Automatically computes total paid-to-date, project budget, and outstanding balances.
- **1-Click Billing**: Record milestone payments or retainers directly from any customer's profile card.

### 6. 🚀 My Apps & Digital Products
- Track your proprietary SaaS products, mobile apps, or web tools.
- Monitor active user counts, subscription prices, recurring MRR, and dedicated cloud/API expenses per product.
- Identify which software asset generates your highest profit margin.

### 7. 💳 Real-time Financial Ledger
- Track all Income (milestones, retainers, app subscriptions) and Expenses (cloud hosting, AI APIs, contractors, tools).
- Multi-dimensional filters: Filter by Year, Month, Stream (Apps vs Clients), Category, and Status (Paid vs Pending).
- 1-click toggle for marking invoices as **Paid** or **Pending**.

### 8. 📑 Financial Reports & Multi-Year Standing
- **Annual Matrix**: Historical performance comparison across years (e.g., 2026 vs 2025).
- **12-Month P&L Statement**: Month-by-month financial statement with print/PDF support.
- **Export to CSV**: Download full spreadsheets ready for Excel or tax filing.

---

## ❓ Frequently Asked Questions

### Can different people use it?
**Yes, in 3 distinct ways:**
1. **Private Individual Instances (Zero Setup)**: When hosted on Netlify or Vercel, every visitor has their own completely private ledger saved in their device's browser (`localStorage`). Person A cannot see Person B's data.
2. **Multi-Workspace Profiles**: You can create separate workspace profiles (e.g., "Main Business", "Partner Workspace", "Side Project") right from the sidebar and switch between them seamlessly.
3. **Sharing with a Partner or Accountant**: Export a `.json` backup file or `.csv` spreadsheet and send it to your partner or accountant. They can click "Restore from Backup" and immediately see your exact records.
4. **Live Simultaneous Cloud Collaboration**: If you want multiple team members editing the same data simultaneously from different computers, you can connect the frontend to a free serverless cloud database like **Supabase** (PostgreSQL) or **Firebase**.

### If I can't host the server side on Netlify, what options do I have? Can it work serverless?
**Yes! It works 100% serverless by default:**
1. **Netlify Serverless (Recommended - Zero Cost)**:
   - The portal runs entirely client-side using browser persistence. You **do not need any server** to use this portal!
   - Simply connect your GitHub repository to Netlify using the included `netlify.toml`. All calculations, P&L reporting, CSV exports, and backups run serverless for $0/month.
2. **If you WANT to host the Node.js Express server (`server/server.js`)**:
   - **Render.com**: Offers a 100% free web service tier that connects directly to your GitHub repository and runs Node.js/Express.
   - **Railway.app**: Free/hobby credits to deploy Node.js containers.
   - **Fly.io**: Free/low-cost microVMs for running Express APIs.
   - **Vercel**: Deploy the frontend serverless with the included `vercel.json`.

---

## 🚀 Getting Started Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Vite frontend:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

3. *(Optional)* Start the Node.js / Express backend:
   ```bash
   npm run server
   ```
   Runs on `http://localhost:5000`. The Vite frontend automatically proxies API calls when available.
