import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { formatCompactCurrency, formatCurrency } from "../utils/formatters";

const STREAM_COLORS = ["#6366f1", "#10b981"];
const EXPENSE_COLORS = ["#f43f5e", "#fb923c", "#38bdf8", "#a855f7", "#eab308", "#64748b"];

export default function ChartsSection({ financials, currency = "$" }) {
  // 1. Prepare Monthly Data for Bar & Area Charts
  const monthlyData = (financials.monthlyBreakdown || []).map((m) => {
    // Format YYYY-MM to readable label
    const [y, monthNum] = m.monthKey.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = monthNames[parseInt(monthNum, 10) - 1] || m.monthKey;
    const label = `${monthName} '${y.slice(2)}`;

    return {
      name: label,
      revenue: m.revenue,
      expenses: m.expenses,
      net: m.net,
      margin: m.margin,
    };
  });

  // 2. Prepare Stream Data for Pie Chart
  const streamData = [
    { name: "Client Work", value: financials.clientRevenue || 0 },
    { name: "My Apps / SaaS", value: financials.appRevenue || 0 },
  ].filter((d) => d.value > 0);

  // 3. Prepare Expense Breakdown for Category Chart
  const expenseData = Object.entries(financials.expensesByCategory || {})
    .map(([cat, val]) => ({ name: cat, value: val }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. Monthly Revenue vs Expenses Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Cashflow: Inflow vs Outflow
            </h3>
            <p className="text-xs text-slate-400">Monthly Revenue vs Operating Costs</p>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>
              <span className="text-slate-300">Revenue</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block"></span>
              <span className="text-slate-300">Expenses</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => formatCompactCurrency(val, currency)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                  formatter={(val) => [formatCurrency(val, currency)]}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-xs">
              No monthly data to render
            </div>
          )}
        </div>
      </div>

      {/* 2. Net Profit Trajectory Area Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Net Profit Standing Over Time
            </h3>
            <p className="text-xs text-slate-400">Monthly bottom-line trajectory (take-home base)</p>
          </div>
        </div>

        <div className="h-64 w-full">
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => formatCompactCurrency(val, currency)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                  formatter={(val) => [formatCurrency(val, currency), "Net Profit"]}
                />
                <Area
                  type="monotone"
                  dataKey="net"
                  stroke="#818cf8"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#profitGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-xs">
              No historical trend available
            </div>
          )}
        </div>
      </div>

      {/* 3. Revenue Stream Breakdown Donut */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Revenue by Stream
          </h3>
          <p className="text-xs text-slate-400">Apps vs Client Development Services</p>
        </div>

        <div className="h-56 w-full flex items-center justify-center">
          {streamData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={streamData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {streamData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STREAM_COLORS[index % STREAM_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                  formatter={(val) => [formatCurrency(val, currency)]}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-slate-500 text-xs">No revenue data for this period</div>
          )}
        </div>
      </div>

      {/* 4. Expense Categories Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Where Did Your Money Go?
          </h3>
          <p className="text-xs text-slate-400">Expense breakdown by category</p>
        </div>

        <div className="space-y-3">
          {expenseData.length > 0 ? (
            expenseData.map((item, idx) => {
              const pct = financials.totalExpenses > 0
                ? Math.round((item.value / financials.totalExpenses) * 100)
                : 0;
              const color = EXPENSE_COLORS[idx % EXPENSE_COLORS.length];

              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{item.name}</span>
                    <span className="text-slate-400">
                      {formatCurrency(item.value, currency)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-slate-500 text-xs py-8 text-center">
              No expenses recorded for this period
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
