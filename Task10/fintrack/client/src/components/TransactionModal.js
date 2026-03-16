import { useState, useEffect } from "react"
import { CATEGORIES } from "../utils/categories"

export default function TransactionModal({ existing, onSave, onClose }) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "food",
    date: new Date().toISOString().split("T")[0]
  })

  useEffect(() => {
    if (existing) {
      setForm({
        description: existing.description,
        amount: existing.amount,
        category: existing.category,
        date: existing.date.split("T")[0]
      })
    }
  }, [existing])

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = () => {
    if (!form.description.trim() || !form.amount || !form.date) return
    onSave({ ...form, amount: parseFloat(form.amount) })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{existing ? "Edit Transaction" : "New Transaction"}</h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label>Description</label>
            <input
              type="text"
              value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="e.g. Grocery run"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Amount ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={e => set("amount", e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="field">
              <label>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => set("date", e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={e => set("category", e.target.value)}>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit}>
            {existing ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  )
}
