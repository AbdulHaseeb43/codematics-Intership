import { useState, useEffect, useCallback } from "react"
import api from "../utils/api"

export function useTransactions(filters) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true)
      const params = {}
      if (filters?.category && filters.category !== "all") params.category = filters.category
      if (filters?.from) params.from = filters.from
      if (filters?.to) params.to = filters.to
      if (filters?.search) params.search = filters.search

      const res = await api.get("/transactions", { params })
      setTransactions(res.data)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load transactions")
    } finally {
      setLoading(false)
    }
  }, [filters?.category, filters?.from, filters?.to, filters?.search])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const addTransaction = async (data) => {
    const res = await api.post("/transactions", data)
    setTransactions(prev => [res.data, ...prev])
    return res.data
  }

  const updateTransaction = async (id, data) => {
    const res = await api.put(`/transactions/${id}`, data)
    setTransactions(prev => prev.map(t => t.id === id ? res.data : t))
    return res.data
  }

  const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`)
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions
  }
}
