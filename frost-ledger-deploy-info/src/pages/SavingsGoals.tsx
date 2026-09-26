import { useState, useEffect, useCallback } from 'react'
import { Target, Plus, Snowflake, Trash2, Pencil, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/PageHeader'
import Modal from '../components/Modal'
import { LoadingState, EmptyState } from '../components/States'
import type { SavingsGoal } from '../types/database'

export default function SavingsGoals() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<SavingsGoal | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', target_amount: '', current_amount: '', deadline: '' })

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase.from('savings_goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setGoals(data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchData() }, [fetchData])

  const openCreate = () => { setEditing(null); setForm({ name: '', target_amount: '', current_amount: '', deadline: '' }); setModalOpen(true) }
  const openEdit = (g: SavingsGoal) => { setEditing(g); setForm({ name: g.name, target_amount: String(g.target_amount), current_amount: String(g.current_amount), deadline: g.deadline ?? '' }); setModalOpen(true) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    const record = { user_id: user.id, name: form.name, target_amount: parseFloat(form.target_amount) || 0, current_amount: parseFloat(form.current_amount) || 0, deadline: form.deadline || null }
    if (editing) await supabase.from('savings_goals').update(record).eq('id', editing.id)
    else await supabase.from('savings_goals').insert(record)
    setSaving(false); setModalOpen(false); fetchData()
  }

  const handleDelete = async (id: string) => { await supabase.from('savings_goals').delete().eq('id', id); fetchData() }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader title="Savings Goals" subtitle="Track progress toward your survival reserves" icon={Target} action={<button className="fp-btn-primary" onClick={openCreate}><Plus className="w-4 h-4" /> New Goal</button>} />
      {loading ? <LoadingState /> : goals.length === 0 ? <EmptyState title="No savings goals" message="Set your first savings goal to start building reserves." action={<button className="fp-btn-primary mt-2" onClick={openCreate}><Plus className="w-4 h-4" /> New Goal</button>} /> : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{goals.map((g) => { const pct = g.target_amount > 0 ? Math.min(Math.round((Number(g.current_amount) / Number(g.target_amount)) * 100), 100) : 0; const done = Number(g.current_amount) >= Number(g.target_amount); return <div key={g.id} className="fp-panel p-5"><div className="flex items-start justify-between mb-4"><div className="flex items-center gap-2">{done ? <Snowflake className="w-5 h-5 text-frost-accent text-glow" /> : <Target className="w-5 h-5 text-frost-text2" />}<h3 className="text-sm font-semibold text-frost-text">{g.name}</h3></div><div className="flex items-center gap-1">{done && <span className="fp-badge-success">Complete</span>}<button onClick={() => openEdit(g)} className="p-1 rounded hover:bg-frost-panel2 text-frost-text3 hover:text-frost-accent"><Pencil className="w-3.5 h-3.5" /></button><button onClick={() => handleDelete(g.id)} className="p-1 rounded hover:bg-frost-danger/10 text-frost-text3 hover:text-frost-danger"><Trash2 className="w-3.5 h-3.5" /></button></div></div><div className="flex items-baseline gap-2 mb-3"><span className="text-2xl font-bold text-frost-text font-mono">${Number(g.current_amount).toLocaleString()}</span><span className="text-sm text-frost-text3 font-mono">/ ${Number(g.target_amount).toLocaleString()}</span></div><div className="h-3 bg-frost-bg rounded-full overflow-hidden mb-2"><div className={`h-full rounded-full transition-all ${done ? 'bg-frost-success' : 'bg-gradient-to-r from-frost-accent2 to-frost-accent'}`} style={{ width: `${pct}%` }} /></div><div className="flex justify-between text-xs"><span className="text-frost-text2">{pct}% saved</span><span className="text-frost-text3 font-mono">{g.deadline ? `Due ${g.deadline}` : 'No deadline'}</span></div></div> })}</div>}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Goal' : 'New Savings Goal'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="fp-label">Goal Name</label><input className="fp-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Emergency Furnace" /></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="fp-label">Target Amount</label><input className="fp-input" type="number" step="0.01" required value={form.target_amount} onChange={(e) => setForm({ ...form, target_amount: e.target.value })} placeholder="5000" /></div><div><label className="fp-label">Current Saved</label><input className="fp-input" type="number" step="0.01" value={form.current_amount} onChange={(e) => setForm({ ...form, current_amount: e.target.value })} placeholder="0" /></div></div>
          <div><label className="fp-label">Deadline</label><input className="fp-input" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
          <div className="flex gap-2 pt-2"><button type="submit" disabled={saving} className="fp-btn-primary flex-1">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button><button type="button" onClick={() => setModalOpen(false)} className="fp-btn"><X className="w-4 h-4" /> Cancel</button></div>
        </form>
      </Modal>
    </div>
  )
}