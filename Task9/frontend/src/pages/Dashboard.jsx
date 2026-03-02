import { useState, useEffect } from 'react'
import { statsAPI, issuesAPI } from '../api'

function StatCard({ label, value, icon, valueClass = '' }) {
  return (
    <div className="stat-card">
      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono mb-2">
        {label}
      </div>
      <div className={`text-4xl font-black tracking-tight ${valueClass || 'text-slate-800 dark:text-white'}`}>
        {value}
      </div>
      <div className="absolute right-5 top-5 text-3xl opacity-10 dark:opacity-15 select-none">{icon}</div>
    </div>
  )
}

function isOverdue(dueDate) {
  return new Date() > new Date(dueDate)
}

export default function Dashboard() {
  const [stats, setStats] = useState({})
  const [recent, setRecent] = useState([])

  useEffect(() => {
    statsAPI.get().then(r => setStats(r.data)).catch(() => {})
    issuesAPI.getAll().then(r => setRecent([...r.data].reverse().slice(0, 6))).catch(() => {})
  }, [])

  return (
    <div>

      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-mono mt-1">// library.overview</p>
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500 font-mono bg-slate-100 dark:bg-surface-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          {new Date().toDateString()}
        </div>
      </div>

   
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Books"      value={stats.totalBooks     ?? '—'} icon="📚" />
        <StatCard label="Members"          value={stats.totalMembers   ?? '—'} icon="👥" />
        <StatCard label="Active Issues"    value={stats.activeIssues   ?? '—'} icon="📋" valueClass="text-brand-500 dark:text-brand-400" />
        <StatCard label="Available Books"  value={stats.availableBooks ?? '—'} icon="✅" valueClass="text-emerald-500" />
        <StatCard label="Overdue"          value={stats.overdueIssues  ?? '—'} icon="⚠"  valueClass="text-red-500" />
        <StatCard label="Fines (Rs)"       value={stats.totalFinesCollected ?? 0} icon="💰" valueClass="text-amber-500" />
      </div>

    
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-700 dark:text-slate-200">Recent Transactions</h2>
          <span className="text-xs text-slate-400 font-mono">last 6 records</span>
        </div>
        {recent.length === 0 ? (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500">
            <div className="text-4xl mb-3 opacity-30">📋</div>
            <p className="text-sm font-medium">No transactions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {['Member','Book','Issue Date','Due Date','Status','Fine'].map(h => (
                    <th key={h} className="table-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(i => (
                  <tr key={i.id} className="hover:bg-slate-50 dark:hover:bg-surface-800/50 transition-colors">
                    <td className="table-td font-medium text-slate-700 dark:text-slate-200">{i.memberName}</td>
                    <td className="table-td text-slate-600 dark:text-slate-300">{i.bookTitle}</td>
                    <td className="table-td text-slate-400 dark:text-slate-500 font-mono text-xs">{i.issueDate}</td>
                    <td className="table-td text-slate-400 dark:text-slate-500 font-mono text-xs">{i.dueDate}</td>
                    <td className="table-td">
                      <span className={`badge ${i.status === 'issued' ? 'badge-blue' : 'badge-green'}`}>
                        {i.status}
                      </span>
                    </td>
                    <td className={`table-td font-mono text-xs font-bold ${i.fine > 0 ? 'text-red-500' : 'text-slate-400 dark:text-slate-600'}`}>
                      {i.fine > 0 ? `Rs ${i.fine}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
