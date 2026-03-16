import { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { ThemeProvider, useTheme } from "./context/ThemeContext"
import Navbar from "./components/Navbar"
import Toast from "./components/Toast"
import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import Budgets from "./pages/Budgets"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { exportToCSV } from "./utils/helpers"
import "./styles/main.css"

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading">Loading...</div>
  if (!user) return <Navigate to="/login" />
  return children
}

function AppLayout() {
  const { dark } = useTheme()
  const [searchValue, setSearchValue] = useState("")

  return (
    <div className={dark ? "app dark" : "app light"}>
      <Navbar
        searchValue={searchValue}
        onSearch={setSearchValue}
        onExport={() => exportToCSV([])}
      />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
      <Toast />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AppLayout />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
