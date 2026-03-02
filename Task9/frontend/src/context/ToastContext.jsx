import { createContext, useContext, useState, useCallback } from 'react'

const ToastCtx = createContext(null)
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const show = useCallback((msg, type = 'info') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }, [])

  const icons = { success: '✓', error: '✕', info: 'ℹ' }
  const colors = {
    success: 'border-l-emerald-500 text-emerald-600 dark:text-emerald-400',
    error: 'border-l-red-500 text-red-600 dark:text-red-400',
    info: 'border-l-brand-500 text-brand-600 dark:text-brand-400',
  }

  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id}
            className={`animate-toast-in flex items-center gap-3 bg-white dark:bg-surface-850
              border border-slate-200 dark:border-slate-700 border-l-4 ${colors[t.type]}
              rounded-xl px-4 py-3.5 min-w-[280px] shadow-modal text-sm font-medium font-display`}>
            <span className="text-base font-bold">{icons[t.type]}</span>
            <span className="text-slate-700 dark:text-slate-200">{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
