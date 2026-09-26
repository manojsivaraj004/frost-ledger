import { useState, useEffect, useCallback } from 'react'
import { Wallet, Plus, Trash2, Pencil, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/PageHeader'
import Modal from '../components/Modal'
import { LoadingState, EmptyState } from '../components/States'
import type { Budget, Category } from '../types/database'

export default function BudgetPage() {
  const { user } = useAuth()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Budget | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ category_id: '', allocated: '', period: 'monthly' as 'weekly' | 'monthly' | 'quarterly' | 'yearly' })

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const [budRes, catRes] = await Promise.all([
      supabase.from('budgets').select('*, category:categories(*)').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('categories').select('*').eq('user_id', user.id).eq('type', 'expense').order('sort_order'),
    ])
    setBudgets(budRes.data ?? [])
    setCategories(catRes.data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchData() }, [fetchData])

  const openCreate = () => { setEditing(null); setForm({ category_id: '', allocated: '', period: 'monthly' }); setModalOpen(true) }
  const openEdit = (b: Budget) => { setEditing(b); setForm({ category_id: b.category_id, allocated: String(b.allocated), period: b.period }); setModalOpen(true) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !form.category_id) return
    setSaving(true)
    const record = { user_id: user.id, category_id: form.category_id, allocated: parseFloat(form.allocated) || 0, spent: editing?.spent ?? 0, period: form.period }
    if (editing) await supabase.from('budgets').update(record).eq('id', editing.id)
    else await supabase.from('budgets').insert(record)
    setSaving(false); setModalOpen(false); fetchData()
  }

  const handleDelete = async (id: string) => { await supabase.from('budgets').delete().eq('id', id); fetchData() }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader title="Resource Budget" subtitle="Allocate and track your monthly spending categories" icon={Wallet} action={<button className="fp-btn-primary" onClick={openCreate}><Plus className="w-4 h-4" /> Add Budget</button>} />
      {loading ? <LoadingState /> : budgets.length === 0 ? <EmptyState title="No budgets set" message="Create budgets to track your spending limits per category." action={<button className="fp-btn-primary mt-2" onClick={openCreate}><Plus className="w-4 h-4" /> Add Budget</button>} /> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{budgets.map((b) => { const pct = b.allocated > 0 ? Math.min(Math.round((Number(b.spent) / Number(b.allocated)) * 100), 100) : 0; const over = pct >= 90; return <div key={b.id} className="fp-panel p-5"><div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-frost-text">{b.category?.name ?? 'Unknown'}</h3><div className="flex items-center gap-1"><span className={`fp-badge ${over ? 'fp-badge-danger' : 'fp-badge-accent'}`}>{pct}%</span><button onClick={() => openEdit(b)} className="p-1 rounded hover:bg-frost-panel2 text-frost-text3 hover:text-frost-accent"><Pencil className="w-3.5 h-3.5" /></button><button onClick={() => handleDelete(b.id)} className="p-1 rounded hover:bg-frost-danger/10 text-frost-text3 hover:text-frost-danger"><Trash2 className="w-3.5 h-3.5" /></button></div></div><div className="flex items-baseline gap-2 mb-3"><span className="text-xl font-bold text-frost-text font-mono">${Number(b.spent).toFixed(0)}</span><span className="text-sm text-frost-text3 font-mono">/ ${Number(b.allocated).toFixed(0)}</span></div><div className="h-2.5 bg-frost-bg rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${over ? 'bg-frost-danger' : 'bg-frost-accent'}`} style={{ width: `${pct}%` }} /></div><p className="text-xs text-frost-text3 mt-2 capitalize">{b.period}</p></div> })}</div>}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Budget' : 'New Budget'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="fp-label">Category</label><select className="fp-input" required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}><option value="">Select category...</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div><label className="fp-label">Allocated Amount</label><input className="fp-input" type="number" step="0.01" required value={form.allocated} onChange={(e) => setForm({ ...form, allocated: e.target.value })} placeholder="0.00" /></div>
          <div><label className="fp-label">Period</label><select className="fp-input" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value as 'weekly' | 'monthly' | 'quarterly' | 'yearly' })}><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="yearly">Yearly</option></select></div>
          <div className="flex gap-2 pt-2"><button type="submit" disabled={saving} className="fp-btn-primary flex-1">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button><button type="button" onClick={() => setModalOpen(false)} className="fp-btn"><X className="w-4 h-4" /> Cancel</button></div>
        </form>
      </Modal>
    </div>
  )
}