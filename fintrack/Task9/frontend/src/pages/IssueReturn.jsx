import { useState, useEffect, useCallback } from 'react'
import { issuesAPI, booksAPI, membersAPI } from '../api'
import { useToast } from '../context/ToastContext'
import { EmptyState } from '../components/UI'

function isOverdue(dueDate) {
  return new Date() > new Date(dueDate)
}

export default function IssueReturn() {
  const toast = useToast()
  const [issues, setIssues] = useState([])
  const [books, setBooks] = useState([])
  const [members, setMembers] = useState([])
  const [tab, setTab] = useState('issue')
  const [form, setForm] = useState({ memberId: '', bookId: '' })
  const [loading, setLoading] = useState(false)

  const load = useCallback(() => {
    issuesAPI.getAll().then(r => setIssues([...r.data].reverse())).catch(() => {})
    booksAPI.getAll().then(r => setBooks(r.data)).catch(() => {})
    membersAPI.getAll().then(r => setMembers(r.data)).catch(() => {})
  }, [])

  useEffect(() => { load() }, [load])

  async function handleIssue(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await issuesAPI.issue(form)
      toast('Book issued! Due in 14 days.', 'success')
      setForm({ memberId: '', bookId: '' }); load()
    } catch (err) { toast(err.response?.data?.error || err.message, 'error') }
    setLoading(false)
  }

  async function handleReturn(id) {
    try {
      const r = await issuesAPI.return(id)
      const fine = r.data.fine > 0 ? ` Fine: Rs ${r.data.fine}` : ''
      toast(`Returned successfully!${fine}`, 'success'); load()
    } catch (err) { toast(err.response?.data?.error || err.message, 'error') }
  }

  const activeIssues = issues.filter(i => i.status === 'issued')
  const returnedIssues = issues.filter(i => i.status === 'returned')
  const selectedBook = books.find(b => b.id === form.bookId)

  const dueDate = (() => {
    const d = new Date(); d.setDate(d.getDate() + 14)
    return d.toISOString().split('T')[0]
  })()

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">Issue & Return</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-mono mt-1">
            // {activeIssues.length} active · {returnedIssues.length} returned
          </p>
        </div>
        <div className="flex gap-2">
          {['issue', 'records'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`btn ${tab === t ? 'btn-primary' : 'btn-secondary'}`}>
              {t === 'issue' ? '📤 Issue Book' : '📋 All Records'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'issue' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Issue Form */}
          <div className="card p-6">
            <h2 className="text-base font-bold text-slate-700 dark:text-slate-200 mb-6">Issue a Book</h2>
            <form onSubmit={handleIssue} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Select Member *</label>
                <select required className="input-field" value={form.memberId} onChange={e => setForm(p => ({ ...p, memberId: e.target.value }))}>
                  <option value="">Choose a member...</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.id} — {m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Select Book *</label>
                <select required className="input-field" value={form.bookId} onChange={e => setForm(p => ({ ...p, bookId: e.target.value }))}>
                  <option value="">Choose a book...</option>
                  {books.map(b => (
                    <option key={b.id} value={b.id} disabled={b.available === 0}>
                      {b.id} — {b.title} ({b.available} available)
                    </option>
                  ))}
                </select>
              </div>

            
              {selectedBook && (
                <div className="bg-slate-50 dark:bg-surface-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700/60 space-y-1.5 font-mono text-sm">
                  <div className="text-slate-600 dark:text-slate-300">📚 {selectedBook.title}</div>
                  <div className="text-slate-500 dark:text-slate-400">✍️  {selectedBook.author}</div>
                  <div className={selectedBook.available > 0 ? 'text-emerald-500' : 'text-red-500'}>
                    {selectedBook.available > 0 ? `✅ ${selectedBook.available} available` : '❌ Not available'}
                  </div>
                  <div className="text-slate-400 dark:text-slate-500">📅 Due: {dueDate}</div>
                  <div className="text-slate-400 dark:text-slate-500">💸 Fine if late: Rs 10/day</div>
                </div>
              )}

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '⏳ Processing...' : '📤 Issue Book'}
              </button>
            </form>
          </div>

        
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-slate-700 dark:text-slate-200">Currently Issued</h2>
              <span className="badge badge-blue">{activeIssues.length}</span>
            </div>
            <div className="overflow-y-auto max-h-96">
              {activeIssues.length === 0 ? (
                <EmptyState icon="📋" text="No active issues" />
              ) : (
                <table className="w-full">
                  <thead>
                    <tr>
                      {['Member','Book','Due',''].map(h => <th key={h} className="table-th">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {activeIssues.map(i => (
                      <tr key={i.id} className="hover:bg-slate-50 dark:hover:bg-surface-800/40 transition-colors">
                        <td className="table-td text-sm text-slate-600 dark:text-slate-300">{i.memberName}</td>
                        <td className="table-td text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[120px] truncate">{i.bookTitle}</td>
                        <td className="table-td">
                          <span className={`badge text-[10px] ${isOverdue(i.dueDate) ? 'badge-red' : 'badge-green'}`}>
                            {isOverdue(i.dueDate) ? '⚠ OVERDUE' : i.dueDate}
                          </span>
                        </td>
                        <td className="table-td">
                          <button className="btn btn-success btn-sm" onClick={() => handleReturn(i.id)}>Return</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'records' && (
        <div className="card p-6">
          <h2 className="text-base font-bold text-slate-700 dark:text-slate-200 mb-5">All Issue Records</h2>
          {issues.length === 0 ? (
            <EmptyState icon="📋" text="No records yet" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    {['Member','Book','Issue Date','Due Date','Return Date','Status','Fine'].map(h => (
                      <th key={h} className="table-th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {issues.map(i => (
                    <tr key={i.id} className="hover:bg-slate-50 dark:hover:bg-surface-800/40 transition-colors">
                      <td className="table-td text-slate-700 dark:text-slate-200">{i.memberName}</td>
                      <td className="table-td font-semibold text-slate-700 dark:text-slate-200">{i.bookTitle}</td>
                      <td className="table-td font-mono text-xs text-slate-400">{i.issueDate}</td>
                      <td className="table-td font-mono text-xs">
                        <span className={i.status === 'issued' && isOverdue(i.dueDate) ? 'text-red-500 font-bold' : 'text-slate-400'}>
                          {i.dueDate}
                        </span>
                      </td>
                      <td className="table-td font-mono text-xs text-slate-400">{i.returnDate || '—'}</td>
                      <td className="table-td">
                        <span className={`badge ${
                          i.status === 'issued'
                            ? isOverdue(i.dueDate) ? 'badge-red' : 'badge-blue'
                            : 'badge-green'
                        }`}>
                          {i.status === 'issued' && isOverdue(i.dueDate) ? 'OVERDUE' : i.status}
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
      )}
    </div>
  )
}
