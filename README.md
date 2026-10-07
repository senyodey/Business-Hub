# 💼 Business Manager & Virtual Accountant Portal

A business portal engineered for software developers and agency owners who **run their own digital apps** and **build custom websites/apps for clients**.

Built with **React (Vite)**, **Tailwind CSS**, and an **Express REST API**, ready for **100% free hosting on Netlify or Vercel**.

---

## 🌟 Core Features

### 1. 🧠 Automated Accountant Engine
- **Instant Profit & Loss (P&L)**: Real-time calculation of Gross Revenue, Operating Expenses, Net Profit/Loss, and Profit Margin %.
- **Deficit / Loss Warnings**: Clear alert banners and badges when monthly or yearly expenses exceed incoming cash flow.
- **Accountant Tax Reserve**: Recommends quarantining an estimated tax withholding (e.g. 25%) so you never face a surprise year-end tax bill.
- **Virtual Accountant Diagnostics**: Automated actionable insights (uncollected client milestones, high infrastructure cost ratios, SaaS recurring revenue strength).
- **Profit Goal & Breakeven Simulator**: Calculate what it will take to reach your target monthly take-home profit.

### 2. 👥 Customer Management & CRM
- Track client contacts: Name, Company, Email, Phone, Project Service, Status (Active, Lead, Completed), and Notes.
- **Autocomputed Client Standing**: Automatically computes total paid-to-date, project budget, and outstanding balances.
- **1-Click Billing**: Record milestone payments or retainers directly from any customer's profile card.

### 3. 🚀 My Apps & Digital Products
- Track your proprietary SaaS products, mobile apps, or web tools.
- Monitor active user counts, subscription prices, recurring MRR, and dedicated cloud/API expenses per product.
- Identify which software asset generates your highest profit margin.

### 4. 💳 Real-time Financial Ledger
- Track all Income (milestones, retainers, app subscriptions) and Expenses (cloud hosting, AI APIs, contractors, tools).
- Multi-dimensional filters: Filter by Year, Month, Stream (Apps vs Clients), Category, and Status (Paid vs Pending).
- 1-click toggle for marking invoices as **Paid** or **Pending**.

### 5. 📑 Financial Reports & Multi-Year Standing
- **Annual Matrix**: Historical performance comparison across years (e.g., 2026 vs 2025).
- **12-Month P&L Statement**: Month-by-month financial statement with print/PDF support.
- **Tax Deductibles**: Complete visibility into business write-offs.
- **Export to CSV**: Download full spreadsheets ready for Excel or tax filing.

### 6. 🔒 100% Free Hosting & Zero Data Lock-In
- **Netlify & Vercel Ready**: Preconfigured with `netlify.toml` and `vercel.json` for free static hosting.
- **Dual Persistence Architecture**: Works offline or on free static hosts using browser local storage with zero server fees, and automatically synchronizes with the included Express API when running locally.
- **Full Data Portability**: Export your entire database as a JSON backup and restore it with one click anytime.

---

## 🚀 Getting Started

### Local Development

1. Open a terminal in the project directory:
   ```bash
   cd C:\Users\SE_NYO\.gemini\antigravity\scratch\business-portal
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
   Runs on `http://localhost:5000`. The Vite frontend automatically proxies API calls.

---

## 🌐 Deploying 100% Free

### Option A: Deploy to Netlify (Free)
1. Push this folder to a GitHub, GitLab, or Bitbucket repository.
2. Go to [Netlify](https://www.netlify.com/) and click **"Add new site" > "Import an existing project"**.
3. Select your repository. Netlify will automatically detect:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click **Deploy Site**. The included `netlify.toml` handles routing automatically!

### Option B: Deploy to Vercel (Free)
1. Push to GitHub.
2. Go to [Vercel](https://vercel.com/) and click **"Add New..." > "Project"**.
3. Import the repository and click **Deploy**. The included `vercel.json` ensures SPA routes work cleanly.
