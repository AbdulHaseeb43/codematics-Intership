import { useState, useEffect } from "react"
import api from "../utils/api"
import { getCurrentMonthYear } from "../utils/helpers"

export function useBudgets() {
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)

  const { month, year } = getCurrentMonthYear()

  useEffect(() => {
    api.get("/budgets", { params: { month, year } })
      .then(res => setBudgets(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [month, year])

  const saveBudget = async (category, amount) => {
    const res = await api.post("/budgets", { category, amount, month, year })
    setBudgets(prev => {
      const exists = prev.find(b => b.category === category)
      if (exists) return prev.map(b => b.category === category ? res.data : b)
      return [...prev, res.data]
    })
  }

  const getBudgetForCategory = (category) => {
    return parseFloat(budgets.find(b => b.category === category)?.amount || 0)
  }

  return { budgets, loading, saveBudget, getBudgetForCategory }
}
