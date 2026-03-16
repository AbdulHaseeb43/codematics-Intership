export const CATEGORIES = [
  { id: "food",          label: "Food & Dining",  icon: "🍔", color: "#f59e0b" },
  { id: "transport",     label: "Transport",       icon: "🚗", color: "#3b82f6" },
  { id: "entertainment", label: "Entertainment",   icon: "🎬", color: "#8b5cf6" },
  { id: "shopping",      label: "Shopping",        icon: "🛍️", color: "#ec4899" },
  { id: "health",        label: "Health",          icon: "💊", color: "#10b981" },
  { id: "utilities",     label: "Utilities",       icon: "⚡", color: "#06b6d4" },
  { id: "housing",       label: "Housing",         icon: "🏠", color: "#f97316" },
  { id: "other",         label: "Other",           icon: "📦", color: "#6b7280" }
]

export const getCategoryById = (id) => {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[7]
}
