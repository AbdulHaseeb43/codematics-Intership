
export function Modal({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <div className="animate-slide-up card w-full max-w-lg shadow-modal"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6 pb-0">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h2>
          <button onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="flex gap-3 justify-end px-6 pb-6 -mt-2">{footer}</div>}
      </div>
    </div>
  )
}


export function ConfirmModal({ msg, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onCancel}>
      <div className="animate-slide-up card w-full max-w-sm shadow-modal p-6"
        onClick={e => e.stopPropagation()}>
        <div className="text-3xl mb-4">⚠️</div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">Confirm Action</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{msg}</p>
        <div className="flex gap-3 justify-end">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  )
}


export function EmptyState({ icon, text, sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
      <div className="text-5xl mb-4 opacity-40">{icon}</div>
      <div className="text-base font-semibold">{text}</div>
      {sub && <div className="text-xs mt-1 font-mono">{sub}</div>}
    </div>
  )
}


export function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 dark:bg-surface-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 mb-5">
      <span className="text-slate-400 text-base">🔍</span>
      <input
        className="bg-transparent flex-1 text-sm outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 font-display"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <button onClick={() => onChange('')}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs transition-colors">✕</button>
      )}
    </div>
  )
}


export function FormGroup({ label, children, full }) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}


export function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-slate-200 dark:border-slate-700 border-t-brand-500 rounded-full animate-spin" />
    </div>
  )
}
