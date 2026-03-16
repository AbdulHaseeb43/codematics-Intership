import { useState } from 'react'
import { booksAPI, membersAPI } from '../api'
import { EmptyState } from '../components/UI'

export default function Search() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('books')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    try {
      const r = type === 'books'
        ? await booksAPI.getAll(query)
        : await membersAPI.getAll(query)
      setResults(r.data)
      setSearched(true)
    } catch { setResults([]) }
    setLoading(false)
  }

  function handleTypeChange(t) {
    setType(t); setResults([]); setSearched(false); setQuery('')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">Search</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 font-mono mt-1">// real-time catalog search</p>
      </div>

   
      <div className="card p-6 mb-6">
        <form onSubmit={handleSearch} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Search Query</label>
            <input
              className="input-field"
              autoFocus
              value={query}
              onChange={e => { setQuery(e.target.value); if (!e.target.value) { setResults([]); setSearched(false) } }}
              placeholder={type === 'books' ? 'Search by title, author, ID, or category...' : 'Search by name, ID, or department...'}
            />
          </div>
          <div className="w-44">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Search In</label>
            <select className="input-field" value={type} onChange={e => handleTypeChange(e.target.value)}>
              <option value="books">📚 Books</option>
              <option value="members">👥 Members</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳' : '🔍 Search'}
          </button>
        </form>
      </div>

    
      {searched && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-700 dark:text-slate-200">Results</h2>
            <span className="text-xs text-slate-400 font-mono">
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </span>
          </div>

          {results.length === 0 ? (
            <EmptyState icon="🔍" text="No results found" sub="Try a different search term" />
          ) : type === 'books' ? (
            <table className="w-full">
              <thead>
                <tr>
                  {['ID','Title','Author','Category','Qty','Available'].map(h => (
                    <th key={h} className="table-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-surface-800/40 transition-colors">
                    <td className="table-td font-mono text-xs text-brand-500 dark:text-brand-400 font-semibold">{b.id}</td>
                    <td className="table-td font-semibold text-slate-700 dark:text-slate-200">{b.title}</td>
                    <td className="table-td text-slate-500 dark:text-slate-400">{b.author}</td>
                    <td className="table-td"><span className="badge badge-blue">{b.category}</span></td>
                    <td className="table-td font-mono text-slate-500">{b.quantity}</td>
                    <td className="table-td">
                      <span className={`badge ${b.available === 0 ? 'badge-red' : b.available < 2 ? 'badge-yellow' : 'badge-green'}`}>
                        {b.available}/{b.quantity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  {['ID','Name','Department','Email','Phone','Active Issues'].map(h => (
                    <th key={h} className="table-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-surface-800/40 transition-colors">
                    <td className="table-td font-mono text-xs text-brand-500 dark:text-brand-400 font-semibold">{m.id}</td>
                    <td className="table-td font-semibold text-slate-700 dark:text-slate-200">{m.name}</td>
                    <td className="table-td"><span className="badge badge-blue">{m.department}</span></td>
                    <td className="table-td text-xs text-slate-500 dark:text-slate-400">{m.contact}</td>
                    <td className="table-td font-mono text-xs text-slate-400">{m.phone || '—'}</td>
                    <td className="table-td">
                      <span className={`badge ${m.issuedBooks.length > 0 ? 'badge-yellow' : 'badge-green'}`}>
                        {m.issuedBooks.length}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
