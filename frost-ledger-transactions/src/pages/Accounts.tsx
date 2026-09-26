import { useState, useEffect, useCallback } from 'react'
import { Landmark, Plus, CreditCard, Banknote, PiggyBank, Trash2, Pencil, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/PageHeader'
import Modal from '../components/Modal'
import { LoadingState, EmptyState } from '../components/States'
import type { Account } from '../types/database'

const typeIcons: Record<string, typeof CreditCard> = { checking: CreditCard, savings: PiggyBank, cash: Banknote, credit: CreditCard }

export default function Accounts() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Account | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'checking' as 'checking' | 'savings' | 'cash' | 'credit', balance: '', institution: '', account_number: '' })

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase.from('accounts').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setAccounts(data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchData() }, [fetchData])

  const openCreate = () => { setEditing(null); setForm({ name: '', type: 'checking', balance: '', institution: '', account_number: '' }); setModalOpen(true) }
  const openEdit = (a: Account) => { setEditing(a); setForm({ name: a.name, type: a.type, balance: String(a.balance), institution: a.institution ?? '', account_number: a.account_number ?? '' }); setModalOpen(true) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    const record = { user_id: user.id, name: form.name, type: form.type, balance: parseFloat(form.balance) || 0, institution: form.institution || null, account_number: form.account_number || null }
    if (editing) await supabase.from('accounts').update(record).eq('id', editing.id)
    else await supabase.from('accounts').insert(record)
    setSaving(false); setModalOpen(false); fetchData()
  }

  const handleDelete = async (id: string) => { await supabase.from('accounts').delete().eq('id', id); fetchData() }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader title="Accounts" subtitle="Your financial institutions and cash positions" icon={Landmark} action={<button className="fp-btn-primary" onClick={openCreate}><Plus className="w-4 h-4" /> Add Account</button>} />
      {loading ? <LoadingState /> : accounts.length === 0 ? <EmptyState title="No accounts yet" message="Add your first account to start tracking balances." action={<button className="fp-btn-primary mt-2" onClick={openCreate}><Plus className="w-4 h-4" /> Add Account</button>} /> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{accounts.map((a) => { const Icon = typeIcons[a.type] ?? CreditCard; return <div key={a.id} className="fp-panel p-5 relative overflow-hidden group"><div className="absolute -top-8 -right-8 w-32 h-32 bg-frost-radial opacity-40 group-hover:opacity-60 transition-opacity" /><div className="flex items-start justify-between mb-4 relative"><div className="w-10 h-10 rounded-md bg-frost-panel2 border border-frost-border flex items-center justify-center"><Icon className="w-5 h-5 text-frost-accent" /></div><div className="flex items-center gap-1"><span className="fp-badge-accent uppercase">{a.type}</span><button onClick={() => openEdit(a)} className="p-1 rounded hover:bg-frost-panel2 text-frost-text3 hover:text-frost-accent"><Pencil className="w-3.5 h-3.5" /></button><button onClick={() => handleDelete(a.id)} className="p-1 rounded hover:bg-frost-danger/10 text-frost-text3 hover:text-frost-danger"><Trash2 className="w-3.5 h-3.5" /></button></div></div><h3 className="text-sm font-semibold text-frost-text mb-1">{a.name}</h3><p className="text-xs text-frost-text3 font-mono mb-3">{a.account_number ?? a.institution ?? '—'}</p><p className="text-2xl font-bold text-frost-text font-mono">${Number(a.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p></div> })}</div>}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Account' : 'New Account'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="fp-label">Account Name</label><input className="fp-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Checking" /></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="fp-label">Type</label><select className="fp-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'checking' | 'savings' | 'cash' | 'credit' })}><option value="checking">Checking</option><option value="savings">Savings</option><option value="cash">Cash</option><option value="credit">Credit</option></select></div><div><label className="fp-label">Balance</label><input className="fp-input" type="number" step="0.01" required value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} placeholder="0.00" /></div></div>
          <div><label className="fp-label">Institution</label><input className="fp-input" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="e.g. Frost Bank" /></div>
          <div><label className="fp-label">Account Number (masked)</label><input className="fp-input" value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value })} placeholder="•••• 4291" /></div>
          <div className="flex gap-2 pt-2"><button type="submit" disabled={saving} className="fp-btn-primary flex-1">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button><button type="button" onClick={() => setModalOpen(false)} className="fp-btn"><X className="w-4 h-4" /> Cancel</button></div>
        </form>
      </Modal>
    </div>
  )
}