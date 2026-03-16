import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Members from './pages/Members'
import IssueReturn from './pages/IssueReturn'
import Search from './pages/Search'
import { ToastProvider } from './context/ToastContext'

const PAGES = { dashboard: Dashboard, books: Books, members: Members, issues: IssueReturn, search: Search }

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [dark, setDark] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const PageComponent = PAGES[page]

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-surface-100 dark:bg-surface-900">
        <Sidebar page={page} setPage={setPage} dark={dark} toggleDark={() => setDark(d => !d)} />
        <main className="ml-64 flex-1 p-8 min-h-screen">
          <PageComponent />
        </main>
      </div>
    </ToastProvider>
  )
}
