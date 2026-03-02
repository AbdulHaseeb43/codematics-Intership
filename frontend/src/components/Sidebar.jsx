const PAGES = [
  { id: 'dashboard', label: 'Dashboard',     icon:   '◈', section: 'Overview' },
  { id: 'books',     label: 'Books',          icon: '📚', section: 'Catalog' },
  { id: 'members',   label: 'Members',        icon: '👥', section: 'Catalog' },
  { id: 'issues',    label: 'Issue & Return', icon: '🔄', section: 'Transactions' },
  { id: 'search',    label: 'Search',         icon: '🔍', section: 'Transactions' },
]

const SECTIONS = [...new Set(PAGES.map(p => p.section))]

export default function Sidebar({ page, setPage, dark, toggleDark }) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-surface-850 border-r border-slate-200 dark:border-slate-700/60 flex flex-col z-30">

    
      <div className="px-6 py-7 border-b border-slate-200 dark:border-slate-700/60">
        <div className="text-xl font-black tracking-tight bg-gradient-to-r from-brand-500 to-violet-500 bg-clip-text text-transparent">
          LibraryOS
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-1">v2.0 // management system</div>
      </div>


      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {SECTIONS.map(sec => (
          <div key={sec} className="mb-5">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest px-3 mb-1.5 font-mono">
              {sec}
            </div>
            {PAGES.filter(p => p.section === sec).map(p => (
              <div key={p.id}
                className={`nav-item mb-0.5 ${page === p.id ? 'active' : ''}`}
                onClick={() => setPage(p.id)}>
                <span className="text-base">{p.icon}</span>
                {p.label}
              </div>
            ))}
          </div>
        ))}
      </nav>

 
      <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
        <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">admin@library</div>
        <button
          onClick={toggleDark}
          className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 
            bg-slate-100 dark:bg-surface-800 hover:border-brand-500 hover:text-brand-500 dark:hover:text-brand-400
            border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 transition-all font-display font-medium">
          {dark ? '☀ Light' : '◑ Dark'}
        </button>
      </div>
    </aside>
  )
}
