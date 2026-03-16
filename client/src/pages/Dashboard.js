import { useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"
import { useTransactions } from "../hooks/useTransactions"
import { useBudgets } from "../hooks/useBudgets"
import { useTheme } from "../context/ThemeContext"
import StatCard from "../components/StatCard"
import ProgressBar from "../components/ProgressBar"
import { CATEGORIES } from "../utils/categories"
import { formatCurrency } from "../utils/helpers"

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

export default function Dashboard() {
  const { transactions, loading } = useTransactions({})
  const { getBudgetForCategory } = useBudgets()
  const { dark } = useTheme()

  const gridColor = dark ? "#30363d" : "#e2e8f0"
  const mutedColor = dark ? "#8b949e" : "#64748b"
  const tooltipBg = dark ? "#161b22" : "#ffffff"
  const tooltipBorder = dark ? "#30363d" : "#e2e8f0"

  const now = new Date()

  const currentMonthTxs = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }, [transactions])

  const totalSpent = useMemo(() =>
    currentMonthTxs.reduce((sum, t) => sum + parseFloat(t.amount), 0),
    [currentMonthTxs]
  )

  const totalBudget = useMemo(() =>
    CATEGORIES.reduce((sum, c) => sum + getBudgetForCategory(c.id), 0),
    [getBudgetForCategory]
  )

  const spendByCategory = useMemo(() => {
    const map = {}
    currentMonthTxs.forEach(t => {
      map[t.category] = (map[t.category] || 0) + parseFloat(t.amount)
    })
    return map
  }, [currentMonthTxs])

  const pieData = CATEGORIES
    .filter(c => spendByCategory[c.id] > 0)
    .map(c => ({ name: c.label, value: spendByCategory[c.id], color: c.color }))

  const trendData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
      const spent = transactions
        .filter(t => {
          const td = new Date(t.date)
          return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear()
        })
        .reduce((s, t) => s + parseFloat(t.amount), 0)
      return { month: MONTHS[d.getMonth()], spent: Math.round(spent), budget: totalBudget }
    })
  }, [transactions, totalBudget])

  const budgetComparisonData = CATEGORIES.map(c => ({
    name: c.icon + " " + c.label.split(" ")[0],
    budget: getBudgetForCategory(c.id),
    spent: spendByCategory[c.id] || 0
  }))

  const overBudgetAlerts = CATEGORIES.filter(c => {
    const spent = spendByCategory[c.id] || 0
    const budget = getBudgetForCategory(c.id)
    return budget > 0 && spent / budget >= 0.8
  })

  const utilizationPercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="page">
      {overBudgetAlerts.length > 0 && (
        <div className="alerts">
          {overBudgetAlerts.map(c => {
            const pct = Math.round((spendByCategory[c.id] / getBudgetForCategory(c.id)) * 100)
            return (
              <div key={c.id} className={pct >= 100 ? "alert alert-danger" : "alert alert-warning"}>
                ⚠️ <strong>{c.icon} {c.label}</strong> — {pct >= 100 ? "Budget exceeded!" : `${pct}% used`}
              </div>
            )
          })}
        </div>
      )}

      <div className="stats-grid">
        <StatCard label="Total Spent" value={formatCurrency(totalSpent)} color="var(--danger)" />
        <StatCard label="Total Budget" value={formatCurrency(totalBudget)} color="var(--accent)" />
        <StatCard
          label="Remaining"
          value={formatCurrency(totalBudget - totalSpent)}
          color={totalBudget - totalSpent >= 0 ? "var(--success)" : "var(--danger)"}
        />
        <StatCard label="Transactions" value={currentMonthTxs.length} color="var(--text)" sub="this month" />
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Monthly Budget Utilization</span>
          <span style={{ color: utilizationPercent >= 100 ? "var(--danger)" : utilizationPercent >= 80 ? "var(--warning)" : "var(--success)", fontWeight: 700 }}>
            {utilizationPercent.toFixed(1)}%
          </span>
        </div>
        <ProgressBar
          percent={utilizationPercent}
          color={utilizationPercent >= 100 ? "var(--danger)" : utilizationPercent >= 80 ? "var(--warning)" : "var(--success)"}
        />
      </div>

      <div className="charts-row">
        <div className="card">
          <div className="card-title">6-Month Spending Trend</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: mutedColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: mutedColor }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 8, fontSize: 12 }}
                formatter={v => formatCurrency(v)}
              />
              <Area type="monotone" dataKey="spent" stroke="var(--accent)" fill="url(#spentGradient)" strokeWidth={2} name="Spent" />
              <Area type="monotone" dataKey="budget" stroke={mutedColor} fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="Budget" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title">Spending by Category</div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 8, fontSize: 12 }}
                  formatter={v => formatCurrency(v)}
                />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">📭 No spending this month</div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Budget vs Actual by Category</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={budgetComparisonData} margin={{ top: 5, right: 5, bottom: 40, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: mutedColor }} axisLine={false} tickLine={false} angle={-35} textAnchor="end" interval={0} />
            <YAxis tick={{ fontSize: 11, fill: mutedColor }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 8, fontSize: 12 }}
              formatter={v => formatCurrency(v)}
            />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            <Bar dataKey="budget" fill="var(--accent-muted)" radius={[4,4,0,0]} name="Budget" />
            <Bar dataKey="spent" fill="var(--accent)" radius={[4,4,0,0]} name="Spent" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
