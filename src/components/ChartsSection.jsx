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

export default function ChartsSection({ financials = {}, currency = "GH₵" }) {
  // 1. Prepare Monthly Data for Bar & Area Charts
  const monthlyData = (financials.monthlyBreakdown || []).map((m) => {
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
      
      {/* 1. Monthly Revenue vs Expenses Bar Chart */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-5 shadow-lg shadow-black/20 min-w-0 flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-tight">
              Cashflow: Inflow vs Outflow
            </h3>
            <p className="text-xs text-slate-400 font-medium">Monthly Revenue vs Operating Costs</p>
          </div>
          <div className="flex items-center space-x-3 text-xs font-semibold">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400/50"></span>
              <span className="text-slate-300">Revenue</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block shadow-sm shadow-rose-400/50"></span>
              <span className="text-slate-300">Expenses</span>
            </div>
          </div>
        </div>

        <div className="h-60 sm:h-64 w-full min-w-0">
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="barRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="barExpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={1} />
                    <stop offset="100%" stopColor="#e11d48" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.25} vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => formatCompactCurrency(val, currency)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b101d",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "1rem",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                    color: "#f8fafc",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                  formatter={(val) => [formatCurrency(val, currency)]}
                />
                <Bar dataKey="revenue" fill="url(#barRevGrad)" radius={[6, 6, 0, 0]} name="Revenue" />
                <Bar dataKey="expenses" fill="url(#barExpGrad)" radius={[6, 6, 0, 0]} name="Expenses" />
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
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-5 shadow-lg shadow-black/20 min-w-0 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-tight">
              Net Profit Trajectory Over Time
            </h3>
            <p className="text-xs text-slate-400 font-medium">Monthly bottom-line growth (take-home base)</p>
          </div>
        </div>

        <div className="h-60 sm:h-64 w-full min-w-0">
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.25} vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => formatCompactCurrency(val, currency)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b101d",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "1rem",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                    color: "#f8fafc",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                  formatter={(val) => [formatCurrency(val, currency), "Net Profit"]}
                />
                <Area
                  type="monotone"
                  dataKey="net"
                  stroke="#818cf8"
                  strokeWidth={3}
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
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-5 shadow-lg shadow-black/20 min-w-0 flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="text-sm font-extrabold text-white tracking-tight">
            Revenue by Stream
          </h3>
          <p className="text-xs text-slate-400 font-medium">Software Products vs Client Development Services</p>
        </div>

        <div className="h-56 w-full flex items-center justify-center min-w-0">
          {streamData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={streamData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {streamData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STREAM_COLORS[index % STREAM_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b101d",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "1rem",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                  formatter={(val) => [formatCurrency(val, currency)]}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-slate-500 text-xs">No revenue data for this period</div>
          )}
        </div>
      </div>

      {/* 4. Expense Categories Breakdown */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-5 shadow-lg shadow-black/20 min-w-0 flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="text-sm font-extrabold text-white tracking-tight">
            Where Did Your Money Go?
          </h3>
          <p className="text-xs text-slate-400 font-medium">Expense breakdown across operational categories</p>
        </div>

        <div className="space-y-3.5">
          {expenseData.length > 0 ? (
            expenseData.map((item, idx) => {
              const pct = (financials.totalExpenses || 0) > 0
                ? Math.round((item.value / financials.totalExpenses) * 100)
                : 0;
              const color = EXPENSE_COLORS[idx % EXPENSE_COLORS.length];

              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-200 font-semibold truncate mr-2">{item.name}</span>
                    <span className="text-slate-400 font-medium shrink-0">
                      {formatCurrency(item.value, currency)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-950/70 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/[0.05]">
                    <div
                      className="h-full rounded-full transition-all duration-500 shadow-sm"
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
