import { useState, useEffect, useCallback } from 'react'
import { booksAPI } from '../api'
import { useToast } from '../context/ToastContext'
import { Modal, ConfirmModal, EmptyState, SearchBar, FormGroup } from '../components/UI'

const CATEGORIES = ['Fiction','Non-Fiction','Programming','Computer Science','Mathematics','History','Science','Literature','Other']

const EMPTY_FORM = { title: '', author: '', category: '', quantity: 1 }

export default function Books() {
  const toast = useToast()
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)   
  const [confirm, setConfirm] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)

  const load = useCallback(() => {
    booksAPI.getAll(search).then(r => setBooks(r.data)).catch(() => {})
  }, [search])

  useEffect(() => { load() }, [load])

  function f(key, val) { setForm(p => ({ ...p, [key]: val })) }

  function openAdd() { setForm(EMPTY_FORM); setModal('add') }
  function openEdit(b) { setForm({ title: b.title, author: b.author, category: b.category, quantity: b.quantity }); setModal(b) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      if (modal === 'add') {
        await booksAPI.create(form)
        toast('Book added successfully!', 'success')
      } else {
        await booksAPI.update(modal.id, form)
        toast('Book updated!', 'success')
      }
      setModal(null); load()
    } catch (err) { toast(err.response?.data?.error || err.message, 'error') }
    setLoading(false)
  }

  async function handleDelete(id) {
    try {
      await booksAPI.delete(id)
      toast('Book deleted', 'success'); load()
    } catch (err) { toast(err.response?.data?.error || err.message, 'error') }
    setConfirm(null)
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">Books</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-mono mt-1">// {books.length} records</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Book</button>
      </div>

      <div className="card p-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by title, author, ID, or category..." />

        {books.length === 0 ? (
          <EmptyState icon="📚" text="No books found" sub="Add your first book to get started" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {['ID','Title','Author','Category','Qty','Available','Actions'].map(h => (
                    <th key={h} className="table-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {books.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-surface-800/40 transition-colors">
                    <td className="table-td font-mono text-xs text-brand-500 dark:text-brand-400 font-semibold">{b.id}</td>
                    <td className="table-td font-semibold text-slate-700 dark:text-slate-200">{b.title}</td>
                    <td className="table-td text-slate-500 dark:text-slate-400">{b.author}</td>
                    <td className="table-td"><span className="badge badge-blue">{b.category}</span></td>
                    <td className="table-td font-mono text-slate-600 dark:text-slate-300">{b.quantity}</td>
                    <td className="table-td">
                      <span className={`badge ${b.available === 0 ? 'badge-red' : b.available < 2 ? 'badge-yellow' : 'badge-green'}`}>
                        {b.available}
                      </span>
                    </td>
                    <td className="table-td">
                      <div className="flex gap-2">
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(b)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setConfirm(b.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

   
      {modal && (
        <Modal
          title={modal === 'add' ? 'Add New Book' : `Edit — ${modal.title}`}
          onClose={() => setModal(null)}
          footer={<>
            <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? '⏳ Saving...' : modal === 'add' ? 'Add Book' : 'Update Book'}
            </button>
          </>}
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <FormGroup label="Book Title *" full>
              <input className="input-field" required value={form.title} onChange={e => f('title', e.target.value)} placeholder="Enter book title" />
            </FormGroup>
            <FormGroup label="Author *">
              <input className="input-field" required value={form.author} onChange={e => f('author', e.target.value)} placeholder="Author name" />
            </FormGroup>
            <FormGroup label="Category *">
              <select className="input-field" required value={form.category} onChange={e => f('category', e.target.value)}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Quantity *" full>
              <input className="input-field" type="number" min="1" required value={form.quantity} onChange={e => f('quantity', e.target.value)} />
            </FormGroup>
          </form>
        </Modal>
      )}

      {confirm && <ConfirmModal
        msg="Are you sure you want to delete this book? Books with active issues cannot be deleted."
        onConfirm={() => handleDelete(confirm)}
        onCancel={() => setConfirm(null)}
      />}
    </div>
  )
}
