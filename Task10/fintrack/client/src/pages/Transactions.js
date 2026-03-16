import { useState } from "react"
import { useTransactions } from "../hooks/useTransactions"
import { useDebounce } from "../hooks/useDebounce"
import TransactionModal from "../components/TransactionModal"
import { getCategoryById, CATEGORIES } from "../utils/categories"
import { formatCurrency, formatDate, exportToCSV } from "../utils/helpers"
import { showToast } from "../components/Toast"

export default function Transactions() {
  const [searchRaw, setSearchRaw] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterFrom, setFilterFrom] = useState("")
  const [filterTo, setFilterTo] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingTx, setEditingTx] = useState(null)

  const search = useDebounce(searchRaw, 300)

  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } = useTransactions({
    category: filterCategory,
    from: filterFrom,
    to: filterTo,
    search
  })

  const handleSave = async (formData) => {
    if (editingTx) {
      await updateTransaction(editingTx.id, formData)
      showToast("Transaction updated ✓")
    } else {
      await addTransaction(formData)
      showToast("Transaction added ✓")
    }
    setShowModal(false)
    setEditingTx(null)
  }

  const handleEdit = (tx) => {
    setEditingTx(tx)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    await deleteTransaction(id)
    showToast("Transaction deleted")
  }

  const clearFilters = () => {
    setFilterCategory("all")
    setFilterFrom("")
    setFilterTo("")
    setSearchRaw("")
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Transactions</h1>
        <div className="page-actions">
          <button className="btn-secondary" onClick={() => exportToCSV(transactions)}>⬇ Export CSV</button>
          <button className="btn-primary" onClick={() => { setEditingTx(null); setShowModal(true) }}>+ Add Transaction</button>
        </div>
      </div>

      <div className="card filters-bar">
        <div className="field">
          <label>Category</label>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>From</label>
          <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} />
        </div>

        <div className="field">
          <label>To</label>
          <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)} />
        </div>

        <button className="btn-secondary" onClick={clearFilters}>Clear</button>
      </div>

      <div className="card">
        <div className="list-header">
          <span className="result-count">{transactions.length} result{transactions.length !== 1 ? "s" : ""}</span>
        </div>

        {transactions.length === 0 ? (
          <div className="empty-state">📭 No transactions found</div>
        ) : (
          <div className="transaction-list">
            {transactions.map(tx => {
              const cat = getCategoryById(tx.category)
              return (
                <div key={tx.id} className="transaction-row">
                  <span className="tx-icon">{cat.icon}</span>
                  <div className="tx-info">
                    <span className="tx-description">{tx.description}</span>
                    <span className="tx-meta">{cat.label} · {formatDate(tx.date)}</span>
                  </div>
                  <span className="tx-amount">-{formatCurrency(tx.amount)}</span>
                  <button className="icon-btn" onClick={() => handleEdit(tx)}>✏️</button>
                  <button className="icon-btn danger" onClick={() => handleDelete(tx.id)}>🗑</button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showModal && (
        <TransactionModal
          existing={editingTx}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingTx(null) }}
        />
      )}
    </div>
  )
}
