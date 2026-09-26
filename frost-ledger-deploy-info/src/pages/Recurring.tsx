import { useState, useEffect, useCallback } from 'react'
import { Repeat, Plus, Calendar, Trash2, Pencil, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/PageHeader'
import Modal from '../components/Modal'
import { LoadingState, EmptyState } from '../components/States'
import type { RecurringTransaction, Account, Category } from '../types/database'

export default function Recurring() {
  const { user } = useAuth()
  const [recurring, setRecurring] = useState<RecurringTransaction[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<RecurringTransaction | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ description: '', amount: '', type: 'expense' as 'income' | 'expense', frequency: 'monthly' as 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly', next_date: '', category_id: '', account_id: '', active: true })

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const [recRes, acctRes, catRes] = await Promise.all([
      supabase.from('recurring_transactions').select('*, category:categories(*), account:accounts(*)').eq('user_id', user.id).order('next_date'),
      supabase.from('accounts').select('*').eq('user_id', user.id),
      supabase.from('categories').select('*').eq('user_id', user.id).order('sort_order'),
    ])
    setRecurring(recRes.data ?? [])
    setAccounts(acctRes.data ?? [])
    setCategories(catRes.data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchData() }, [fetchData])

  const openCreate = () => { setEditing(null); setForm({ description: '', amount: '', type: 'expense', frequency: 'monthly', next_date: new Date().toISOString().slice(0, 10), category_id: '', account_id: '', active: true }); setModalOpen(true) }
  const openEdit = (r: RecurringTransaction) => { setEditing(r); setForm({ description: r.description, amount: String(r.amount), type: r.type, frequency: r.frequency, next_date: r.next_date, category_id: r.category_id ?? '', account_id: r.account_id ?? '', active: r.active }); setModalOpen(true) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    const record = { user_id: user.id, description: form.description, amount: parseFloat(form.amount) || 0, type: form.type, frequency: form.frequency, next_date: form.next_date, category_id: form.category_id || null, account_id: form.account_id || null, active: form.active }
    if (editing) await supabase.from('recurring_transactions').update(record).eq('id', editing.id)
    else await supabase.from('recurring_transactions').insert(record)
    setSaving(false); setModalOpen(false); fetchData()
  }

  const handleDelete = async (id: string) => { await supabase.from('recurring_transactions').delete().eq('id', id); fetchData() }
  const toggleActive = async (r: RecurringTransaction) => { await supabase.from('recurring_transactions').update({ active: !r.active }).eq('id', r.id); fetchData() }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader title="Recurring Allocations" subtitle="Scheduled and repeating financial commitments" icon={Repeat} action={<button className="fp-btn-primary" onClick={openCreate}><Plus className="w-4 h-4" /> Add Recurring</button>} />
      {loading ? <LoadingState /> : <div className="fp-panel overflow-hidden">{recurring.length === 0 ? <EmptyState title="No recurring transactions" message="Schedule repeating transactions like rent, utilities, or subscriptions." action={<button className="fp-btn-primary mt-2" onClick={openCreate}><Plus className="w-4 h-4" /> Add Recurring</button>} /> : <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-frost-border bg-frost-panel2/50"><th className="text-left px-4 py-3 fp-section-title font-semibold">Name</th><th className="text-left px-4 py-3 fp-section-title font-semibold">Frequency</th><th className="text-left px-4 py-3 fp-section-title font-semibold">Next Date</th><th className="text-right px-4 py-3 fp-section-title font-semibold">Amount</th><th className="text-center px-4 py-3 fp-section-title font-semibold">Status</th><th className="text-center px-4 py-3 fp-section-title font-semibold">Actions</th></tr></thead><tbody>{recurring.map((r) => <tr key={r.id} className="border-b border-frost-border/50 hover:bg-frost-panel2/50 transition-colors"><td className="px-4 py-3 text-frost-text font-medium">{r.description}</td><td className="px-4 py-3 text-frost-text2 capitalize">{r.frequency}</td><td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 text-frost-text3 font-mono text-xs"><Calendar className="w-3.5 h-3.5" /> {r.next_date}</span></td><td className={`px-4 py-3 text-right font-mono ${r.type === 'income' ? 'text-frost-success' : 'text-frost-text2'}`}>{r.type === 'income' ? '+' : '-'}${Number(r.amount).toFixed(2)}</td><td className="px-4 py-3 text-center"><button onClick={() => toggleActive(r)}>{r.active ? <span className="fp-badge-success">Active</span> : <span className="fp-badge-warn">Paused</span>}</button></td><td className="px-4 py-3"><div className="flex items-center justify-center gap-1"><button onClick={() => openEdit(r)} className="p-1.5 rounded hover:bg-frost-panel2 text-frost-text3 hover:text-frost-accent"><Pencil className="w-3.5 h-3.5" /></button><button onClick={() => handleDelete(r.id)} className="p-1.5 rounded hover:bg-frost-danger/10 text-frost-text3 hover:text-frost-danger"><Trash2 className="w-3.5 h-3.5" /></button></div></td></tr>)}</tbody></table></div>}</div>}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Recurring' : 'New Recurring'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="fp-label">Description</label><input className="fp-input" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Rent — Shelter" /></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="fp-label">Amount</label><input className="fp-input" type="number" step="0.01" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" /></div><div><label className="fp-label">Type</label><select className="fp-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'income' | 'expense' })}><option value="expense">Expense</option><option value="income">Income</option></select></div></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="fp-label">Frequency</label><select className="fp-input" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value as 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly' })}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="biweekly">Biweekly</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="yearly">Yearly</option></select></div><div><label className="fp-label">Next Date</label><input className="fp-input" type="date" required value={form.next_date} onChange={(e) => setForm({ ...form, next_date: e.target.value })} /></div></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="fp-label">Category</label><select className="fp-input" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}><option value="">— None —</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div><label className="fp-label">Account</label><select className="fp-input" value={form.account_id} onChange={(e) => setForm({ ...form, account_id: e.target.value })}><option value="">— None —</option>{accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div></div>
          <div className="flex gap-2 pt-2"><button type="submit" disabled={saving} className="fp-btn-primary flex-1">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button><button type="button" onClick={() => setModalOpen(false)} className="fp-btn"><X className="w-4 h-4" /> Cancel</button></div>
        </form>
      </Modal>
    </div>
  )
}