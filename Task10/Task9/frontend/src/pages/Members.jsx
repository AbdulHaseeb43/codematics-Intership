import { useState, useEffect, useCallback } from 'react'
import { membersAPI } from '../api'
import { useToast } from '../context/ToastContext'
import { Modal, ConfirmModal, EmptyState, SearchBar, FormGroup } from '../components/UI'

const DEPARTMENTS = ['Computer Science','Software Engineering','Mathematics','Physics','Chemistry','Business Administration','Electrical Engineering','Mechanical Engineering','Other']

const EMPTY_FORM = { name: '', department: '', contact: '', phone: '' }

export default function Members() {
  const toast = useToast()
  const [members, setMembers] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)

  const load = useCallback(() => {
    membersAPI.getAll(search).then(r => setMembers(r.data)).catch(() => {})
  }, [search])

  useEffect(() => { load() }, [load])

  function f(key, val) { setForm(p => ({ ...p, [key]: val })) }
  function openAdd() { setForm(EMPTY_FORM); setModal('add') }
  function openEdit(m) { setForm({ name: m.name, department: m.department, contact: m.contact, phone: m.phone }); setModal(m) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      if (modal === 'add') {
        await membersAPI.create(form)
        toast('Member registered!', 'success')
      } else {
        await membersAPI.update(modal.id, form)
        toast('Member updated!', 'success')
      }
      setModal(null); load()
    } catch (err) { toast(err.response?.data?.error || err.message, 'error') }
    setLoading(false)
  }

  async function handleDelete(id) {
    try {
      await membersAPI.delete(id)
      toast('Member removed', 'success'); load()
    } catch (err) { toast(err.response?.data?.error || err.message, 'error') }
    setConfirm(null)
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">Members</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-mono mt-1">// {members.length} registered</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Register Member</button>
      </div>

      <div className="card p-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, ID, or department..." />

        {members.length === 0 ? (
          <EmptyState icon="👥" text="No members found" sub="Register your first member" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {['ID','Name','Department','Email','Phone','Active Issues','Actions'].map(h => (
                    <th key={h} className="table-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-surface-800/40 transition-colors">
                    <td className="table-td font-mono text-xs text-brand-500 dark:text-brand-400 font-semibold">{m.id}</td>
                    <td className="table-td font-semibold text-slate-700 dark:text-slate-200">{m.name}</td>
                    <td className="table-td"><span className="badge badge-blue">{m.department}</span></td>
                    <td className="table-td text-slate-500 dark:text-slate-400 text-xs">{m.contact}</td>
                    <td className="table-td font-mono text-xs text-slate-400 dark:text-slate-500">{m.phone || '—'}</td>
                    <td className="table-td">
                      <span className={`badge ${m.issuedBooks.length > 0 ? 'badge-yellow' : 'badge-green'}`}>
                        {m.issuedBooks.length} book{m.issuedBooks.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="table-td">
                      <div className="flex gap-2">
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(m)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setConfirm(m.id)}>Delete</button>
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
          title={modal === 'add' ? 'Register New Member' : `Edit — ${modal.name}`}
          onClose={() => setModal(null)}
          footer={<>
            <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? '⏳ Saving...' : modal === 'add' ? 'Register' : 'Update'}
            </button>
          </>}
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <FormGroup label="Full Name *" full>
              <input className="input-field" required value={form.name} onChange={e => f('name', e.target.value)} placeholder="Member's full name" />
            </FormGroup>
            <FormGroup label="Department / Class *">
              <select className="input-field" required value={form.department} onChange={e => f('department', e.target.value)}>
                <option value="">Select department</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Email *">
              <input className="input-field" type="email" required value={form.contact} onChange={e => f('contact', e.target.value)} placeholder="email@university.edu" />
            </FormGroup>
            <FormGroup label="Phone">
              <input className="input-field" value={form.phone} onChange={e => f('phone', e.target.value)} placeholder="03001234567" />
            </FormGroup>
          </form>
        </Modal>
      )}

      {confirm && <ConfirmModal
        msg="Are you sure you want to remove this member? Members with active book issues cannot be deleted."
        onConfirm={() => handleDelete(confirm)}
        onCancel={() => setConfirm(null)}
      />}
    </div>
  )
}
