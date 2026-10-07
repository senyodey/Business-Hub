/**
 * Business Accountant Engine
 * Computes P&L, margins, tax withholdings, burn rate, and generates
 * actionable financial advisory insights.
 */

export function calculateFinancials({ transactions = [], taxRate = 25, filterYear = null, filterMonth = null }) {
  // Filter transactions based on date criteria
  const filtered = transactions.filter((tx) => {
    if (!tx.date) return false;
    const [yStr, mStr] = tx.date.split("-");
    const y = parseInt(yStr, 10);
    const m = parseInt(mStr, 10);

    if (filterYear && y !== filterYear) return false;
    if (filterMonth && m !== filterMonth) return false;
    return true;
  });

  let totalRevenue = 0;
  let pendingRevenue = 0;
  let totalExpenses = 0;
  let clientRevenue = 0;
  let appRevenue = 0;
  let clientExpenses = 0;
  let appExpenses = 0;

  const expensesByCategory = {};
  const incomeByCategory = {};
  const monthlyDataMap = {};

  filtered.forEach((tx) => {
    const amount = Number(tx.amount) || 0;
    const isPaid = tx.status === "Paid" || !tx.status;

    if (tx.type === "income") {
      if (isPaid) {
        totalRevenue += amount;
        if (tx.stream === "client") clientRevenue += amount;
        else if (tx.stream === "app") appRevenue += amount;
        else clientRevenue += amount; // default stream

        incomeByCategory[tx.category || "General Income"] =
          (incomeByCategory[tx.category || "General Income"] || 0) + amount;
      } else {
        pendingRevenue += amount;
      }
    } else if (tx.type === "expense") {
      totalExpenses += amount;
      const cat = tx.category || "Other";
      expensesByCategory[cat] = (expensesByCategory[cat] || 0) + amount;

      if (tx.stream === "app" || cat === "Hosting & Cloud" || cat === "AI & APIs") {
        appExpenses += amount;
      } else {
        clientExpenses += amount;
      }
    }

    // Accumulate monthly data
    if (tx.date) {
      const ym = tx.date.substring(0, 7); // "YYYY-MM"
      if (!monthlyDataMap[ym]) {
        monthlyDataMap[ym] = {
          monthKey: ym,
          revenue: 0,
          expenses: 0,
          net: 0,
          pending: 0,
        };
      }
      if (tx.type === "income" && isPaid) {
        monthlyDataMap[ym].revenue += amount;
      } else if (tx.type === "income" && !isPaid) {
        monthlyDataMap[ym].pending += amount;
      } else if (tx.type === "expense") {
        monthlyDataMap[ym].expenses += amount;
      }
    }
  });

  // Complete monthly data computations
  const monthlyBreakdown = Object.values(monthlyDataMap)
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
    .map((m) => {
      const net = m.revenue - m.expenses;
      const margin = m.revenue > 0 ? (net / m.revenue) * 100 : 0;
      return {
        ...m,
        net,
        margin: Math.round(margin * 10) / 10,
        isProfitable: net >= 0,
      };
    });

  const netProfit = totalRevenue - totalExpenses;
  const isLoss = netProfit < 0;
  const isProfit = netProfit > 0;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Estimated tax reserve recommended on net positive profits
  const taxReserve = Math.max(0, netProfit * (taxRate / 100));
  const distributableProfit = Math.max(0, netProfit - taxReserve);

  // Status diagnosis
  let financialStatus = "BREAK_EVEN";
  let statusMessage = "Even Balance: Revenue equals expenses exactly.";
  let statusBadge = "neutral";

  if (netProfit < 0) {
    financialStatus = "NET_LOSS";
    statusMessage = `Operating at a Net Loss of ${Math.abs(netProfit).toFixed(2)}`;
    statusBadge = "danger";
  } else if (profitMargin >= 40) {
    financialStatus = "STRONG_PROFIT";
    statusMessage = `Exceptional Margin (${profitMargin.toFixed(1)}%) - High Capital Efficiency`;
    statusBadge = "success";
  } else if (profitMargin >= 20) {
    financialStatus = "HEALTHY_PROFIT";
    statusMessage = `Healthy Profit (${profitMargin.toFixed(1)}% margin) - Sustainable Growth`;
    statusBadge = "success";
  } else if (profitMargin > 0) {
    financialStatus = "SLIM_MARGIN";
    statusMessage = `Tight Margins (${profitMargin.toFixed(1)}%) - Review Variable Overhead`;
    statusBadge = "warning";
  }

  // Generate Accountant Insights & Tips
  const insights = generateAccountantInsights({
    totalRevenue,
    pendingRevenue,
    totalExpenses,
    netProfit,
    profitMargin,
    taxReserve,
    taxRate,
    clientRevenue,
    appRevenue,
    expensesByCategory,
    monthlyBreakdown,
  });

  return {
    totalRevenue,
    pendingRevenue,
    totalExpenses,
    netProfit,
    isLoss,
    isProfit,
    profitMargin: Math.round(profitMargin * 10) / 10,
    taxReserve: Math.round(taxReserve * 100) / 100,
    distributableProfit: Math.round(distributableProfit * 100) / 100,
    financialStatus,
    statusMessage,
    statusBadge,
    clientRevenue,
    appRevenue,
    clientExpenses,
    appExpenses,
    expensesByCategory,
    incomeByCategory,
    monthlyBreakdown,
    insights,
    transactionCount: filtered.length,
  };
}

/**
 * Intelligent Accountant Advice Rules
 */
function generateAccountantInsights(data) {
  const {
    totalRevenue,
    pendingRevenue,
    totalExpenses,
    netProfit,
    profitMargin,
    taxReserve,
    taxRate,
    clientRevenue,
    appRevenue,
    expensesByCategory,
  } = data;

  const notes = [];

  // 1. Loss or Profit Core Assessment
  if (netProfit < 0) {
    const deficit = Math.abs(netProfit);
    notes.push({
      id: "loss-alert",
      type: "alert",
      title: "Deficit Alert: Operating in the Red",
      message: `Your business has spent $${deficit.toLocaleString()} more than it collected for this period. To reach break-even, you need $${deficit.toLocaleString()} in new billings or to reduce non-critical overhead.`,
      action: "Review top expenses or bill out pending deliverables.",
    });
  } else if (profitMargin >= 35) {
    notes.push({
      id: "healthy-margin",
      type: "success",
      title: "Superb Profit Margin",
      message: `Your net margin is ${profitMargin.toFixed(1)}%. You are retaining $${netProfit.toLocaleString()} of your $${totalRevenue.toLocaleString()} gross revenue.`,
      action: "Consider reinvesting part of this surplus into app acquisition channels or reserves.",
    });
  }

  // 2. Tax Withholding Recommendation
  if (taxReserve > 0) {
    notes.push({
      id: "tax-reserve",
      type: "warning",
      title: `Tax Accountant Rule: Set aside ${taxRate}%`,
      message: `You should quarantine approximately $${taxReserve.toLocaleString()} into a separate business tax account now so you are not hit with an unexpected year-end tax bill.`,
      action: `Estimated take-home after tax reserve: $${(netProfit - taxReserve).toLocaleString()}`,
    });
  }

  // 3. Outstanding Accounts Receivable
  if (pendingRevenue > 0) {
    notes.push({
      id: "pending-revenue",
      type: "info",
      title: "Uncollected Cashflow: Invoices Awaiting Payment",
      message: `You have $${pendingRevenue.toLocaleString()} in pending invoices awaiting payment. Collecting these would increase your realized cash by ${pendingRevenue.toLocaleString()}.`,
      action: "Send polite follow-ups to clients with unpaid milestone invoices.",
    });
  }

  // 4. Stream Contribution Analysis (Apps vs Clients)
  if (totalRevenue > 0) {
    const appPct = Math.round((appRevenue / totalRevenue) * 100);
    const clientPct = Math.round((clientRevenue / totalRevenue) * 100);

    if (appPct > 50) {
      notes.push({
        id: "recurring-strength",
        type: "success",
        title: "Product Revenue Dominance",
        message: `Your SaaS & Digital Apps account for ${appPct}% ($${appRevenue.toLocaleString()}) of your revenue. This predictable recurring cashflow insulates you from client drought.`,
        action: "Focus on reducing churn and scaling infrastructure cost-effectively.",
      });
    } else if (clientPct > 60) {
      notes.push({
        id: "client-heavy",
        type: "info",
        title: "Client Services Heavy",
        message: `Client projects comprise ${clientPct}% ($${clientRevenue.toLocaleString()}) of your income. Client work provides quick capital, but SaaS products provide compounding equity.`,
        action: "Allocate a portion of client cashflow toward building and marketing your proprietary apps.",
      });
    }
  }

  // 5. Highest Expense Category Check
  const expenseEntries = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]);
  if (expenseEntries.length > 0) {
    const [topCat, topAmount] = expenseEntries[0];
    const topCatPct = totalExpenses > 0 ? Math.round((topAmount / totalExpenses) * 100) : 0;
    if (topCatPct >= 35) {
      notes.push({
        id: "expense-concentration",
        type: "warning",
        title: `Expense Concentration: ${topCat}`,
        message: `${topCat} makes up ${topCatPct}% ($${topAmount.toLocaleString()}) of all business costs. Ensure this expenditure directly correlates to revenue generation.`,
        action: `Audit ${topCat} subscriptions or negotiate annual/bulk discounts.`,
      });
    }
  }

  return notes;
}

/**
 * Computes Annual Multi-Year Standing Matrix
 */
export function calculateYearlyStanding(transactions = []) {
  const yearsMap = {};

  transactions.forEach((tx) => {
    if (!tx.date) return;
    const year = parseInt(tx.date.substring(0, 4), 10);
    const amount = Number(tx.amount) || 0;
    const isPaid = tx.status === "Paid" || !tx.status;

    if (!yearsMap[year]) {
      yearsMap[year] = {
        year,
        revenue: 0,
        expenses: 0,
        pending: 0,
        clientRevenue: 0,
        appRevenue: 0,
      };
    }

    if (tx.type === "income") {
      if (isPaid) {
        yearsMap[year].revenue += amount;
        if (tx.stream === "app") yearsMap[year].appRevenue += amount;
        else yearsMap[year].clientRevenue += amount;
      } else {
        yearsMap[year].pending += amount;
      }
    } else if (tx.type === "expense") {
      yearsMap[year].expenses += amount;
    }
  });

  return Object.values(yearsMap)
    .sort((a, b) => b.year - a.year)
    .map((y) => {
      const net = y.revenue - y.expenses;
      const margin = y.revenue > 0 ? (net / y.revenue) * 100 : 0;
      return {
        ...y,
        net,
        margin: Math.round(margin * 10) / 10,
        isProfitable: net >= 0,
      };
    });
}
