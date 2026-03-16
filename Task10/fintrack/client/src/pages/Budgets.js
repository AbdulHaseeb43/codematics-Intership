import { useState, useMemo } from "react"
import { useBudgets } from "../hooks/useBudgets"
import { useTransactions } from "../hooks/useTransactions"
import { CATEGORIES } from "../utils/categories"
import { formatCurrency } from "../utils/helpers"
import ProgressBar from "../components/ProgressBar"
import { showToast } from "../components/Toast"

export default function Budgets() {
  const { loading, saveBudget, getBudgetForCategory } = useBudgets()
  const { transactions } = useTransactions({})
  const [editingCategory, setEditingCategory] = useState(null)
  const [inputValue, setInputValue] = useState("")

  const now = new Date()

  const spendByCategory = useMemo(() => {
    const map = {}
    transactions
      .filter(t => {
        const d = new Date(t.date)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      })
      .forEach(t => {
        map[t.category] = (map[t.category] || 0) + parseFloat(t.amount)
      })
    return map
  }, [transactions])

  const startEditing = (category, currentAmount) => {
    setEditingCategory(category)
    setInputValue(currentAmount.toString())
  }

  const saveEdit = async (category) => {
    const amount = parseFloat(inputValue) || 0
    await saveBudget(category, amount)
    setEditingCategory(null)
    showToast("Budget updated ✓")
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Monthly Budgets</h1>
          <p className="page-subtitle">Click any budget amount to edit it</p>
        </div>
      </div>

      <div className="budgets-grid">
        {CATEGORIES.map(c => {
          const spent = spendByCategory[c.id] || 0
          const budget = getBudgetForCategory(c.id)
          const percent = budget > 0 ? (spent / budget) * 100 : 0
          const isOver = spent > budget && budget > 0
          const isWarning = !isOver && percent >= 80
          const barColor = isOver ? "var(--danger)" : isWarning ? "var(--warning)" : c.color

          return (
            <div key={c.id} className="card budget-card">
              <div className="budget-card-header">
                <div className="budget-cat-info">
                  <span className="budget-icon">{c.icon}</span>
                  <div>
                    <div className="budget-cat-name">{c.label}</div>
                    <div className="budget-spent">Spent: {formatCurrency(spent)}</div>
                  </div>
                </div>

                <div className="budget-amount-area">
                  {editingCategory === c.id ? (
                    <input
                      type="number"
                      min="0"
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onBlur={() => saveEdit(c.id)}
                      onKeyDown={e => e.key === "Enter" && saveEdit(c.id)}
                      className="budget-input"
                      autoFocus
                    />
                  ) : (
                    <button className="budget-amount-btn" onClick={() => startEditing(c.id, budget)}>
                      {formatCurrency(budget)}<span className="per-month">/mo</span>
                    </button>
                  )}
                  {isOver && (
                    <div className="over-budget-label">Over by {formatCurrency(spent - budget)}</div>
                  )}
                </div>
              </div>

              <ProgressBar percent={percent} color={barColor} />

              <div className="budget-footer">
                <span className="budget-percent">{percent.toFixed(0)}% used</span>
                <span className="budget-remaining">{formatCurrency(Math.max(0, budget - spent))} left</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
