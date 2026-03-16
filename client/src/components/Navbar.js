import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"

export default function Navbar({ onSearch, searchValue, onExport }) {
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">💰 FinTrack</span>
        <div className="navbar-links">
          <Link to="/" className={isActive("/") ? "nav-link active" : "nav-link"}>Overview</Link>
          <Link to="/transactions" className={isActive("/transactions") ? "nav-link active" : "nav-link"}>Transactions</Link>
          <Link to="/budgets" className={isActive("/budgets") ? "nav-link active" : "nav-link"}>Budgets</Link>
        </div>
      </div>

      <div className="navbar-right">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={e => onSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <button className="icon-btn" onClick={onExport} title="Export CSV">⬇</button>
        <button className="icon-btn" onClick={toggle} title="Toggle theme">
          {dark ? "☀️" : "🌙"}
        </button>

        <div className="user-menu">
          <span className="user-name">{user?.name}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>
    </nav>
  )
}
