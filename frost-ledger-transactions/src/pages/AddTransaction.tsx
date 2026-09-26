import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeftRight, Save, X, Loader2, AlertCircle, ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/PageHeader'
import type { Account, Category, TransactionType, PaymentMethod } from '../types/database'

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Cash' }, { value: 'credit_card', label: 'Credit Card' }, { value: 'debit_card', label: 'Debit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' }, { value: 'check', label: 'Check' }, { value: 'mobile_payment', label: 'Mobile Payment' }, { value: 'other', label: 'Other' },
]

interface FormData { type: TransactionType; amount: string; date: string; description: string; category_id: string; subcategory: string; payment_method: PaymentMethod; account_id: string; notes: string }
interface FormErrors { amount?: string; description?: string; category_id?: string; account_id?: string; date?: string }

export default function AddTransaction() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const editId = (location.state as { editId?: string })?.editId
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [form, setForm] = useState<FormData>({ type: 'expense', amount: '', date: new Date().toISOString().slice(0, 10), description: '', category_id: '', subcategory: '', payment_method: 'cash', account_id: '', notes: '' })

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const [acctRes, catRes] = await Promise.all([
      supabase.from('accounts').select('*').eq('user_id', user.id).order('name'),
      supabase.from('categories').select('*').eq('user_id', user.id).order('sort_order'),
    ])
    setAccounts(acctRes.data ?? [])
    setCategories(catRes.data ?? [])
    if (editId) {
      const { data: tx } = await supabase.from('transactions').select('*').eq('id', editId).single()
      if (tx) setForm({ type: tx.type, amount: String(Math.abs(Number(tx.amount))), date: tx.date, description: tx.description, category_id: tx.category_id ?? '', subcategory: tx.subcategory ?? '', payment_method: (tx.payment_method as PaymentMethod) ?? 'cash', account_id: tx.account_id ?? '', notes: tx.notes ?? '' })
    }
    setLoading(false)
  }, [user, editId])

  useEffect(() => { fetchData() }, [fetchData])

  const validate = (): boolean => {
    const e: FormErrors = {}
    const amount = parseFloat(form.amount)
    if (!form.amount || isNaN(amount) || amount <= 0) e.amount = 'Enter a valid amount greater than 0'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.category_id) e.category_id = 'Select a category'
    if (!form.account_id) e.account_id = 'Select an account'
    if (!form.date) e.date = 'Date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!user || !validate()) return
    setSaving(true)
    const record = { user_id: user.id, type: form.type, amount: Math.abs(parseFloat(form.amount)), description: form.description.trim(), date: form.date, category_id: form.category_id, subcategory: form.subcategory.trim() || null, payment_method: form.payment_method, account_id: form.account_id, notes: form.notes.trim() || null }
    const { error: err } = editId ? await supabase.from('transactions').update(record).eq('id', editId) : await supabase.from('transactions').insert(record)
    setSaving(false)
    if (err) setError(err.message)
    else navigate('/transactions')
  }

  const filteredCategories = categories.filter(c => form.type === 'income' ? c.type === 'income' : c.type === 'expense')

  if (loading) return <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-20 gap-3"><Loader2 className="w-8 h-8 text-frost-accent animate-spin" /><p className="text-sm text-frost-text2">Loading form data...</p></div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader title={editId ? 'Edit Transaction' : 'Add Transaction'} subtitle={editId ? 'Update transaction details' : 'Record a new income or expense'} icon={ArrowLeftRight} action={<button onClick={() => navigate('/transactions')} className="fp-btn"><ArrowLeft className="w-4 h-4" /> Back</button>} />
      <form onSubmit={handleSubmit} className="fp-panel p-6 space-y-5">
        <div><label className="fp-label">Transaction Type</label><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setForm({ ...form, type: 'expense', category_id: '' })} className={`flex items-center justify-center gap-2 py-2.5 rounded-md border transition-all ${form.type === 'expense' ? 'bg-frost-danger/15 border-frost-danger/40 text-frost-danger' : 'bg-frost-panel2 border-frost-border text-frost-text3 hover:text-frost-text2'}`}><TrendingDown className="w-4 h-4" /> Expense</button><button type="button" onClick={() => setForm({ ...form, type: 'income', category_id: '' })} className={`flex items-center justify-center gap-2 py-2.5 rounded-md border transition-all ${form.type === 'income' ? 'bg-frost-success/15 border-frost-success/40 text-frost-success' : 'bg-frost-panel2 border-frost-border text-frost-text3 hover:text-frost-text2'}`}><TrendingUp className="w-4 h-4" /> Income</button></div></div>
        <div><label className="fp-label">Amount</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-frost-text3 font-mono">$</span><input type="number" step="0.01" min="0" className={`fp-input pl-7 ${errors.amount ? 'border-frost-danger/50' : ''}`} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" /></div>{errors.amount && <p className="text-xs text-frost-danger mt-1">{errors.amount}</p>}</div>
        <div><label className="fp-label">Description</label><input className={`fp-input ${errors.description ? 'border-frost-danger/50' : ''}`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Coal Supply Co." />{errors.description && <p className="text-xs text-frost-danger mt-1">{errors.description}</p>}</div>
        <div><label className="fp-label">Date</label><input type="date" className={`fp-input ${errors.date ? 'border-frost-danger/50' : ''}`} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />{errors.date && <p className="text-xs text-frost-danger mt-1">{errors.date}</p>}</div>
        <div className="grid grid-cols-2 gap-4"><div><label className="fp-label">Category</label><select className={`fp-input ${errors.category_id ? 'border-frost-danger/50' : ''}`} value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}><option value="">Select...</option>{filteredCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>{errors.category_id && <p className="text-xs text-frost-danger mt-1">{errors.category_id}</p>}</div><div><label className="fp-label">Subcategory</label><input className="fp-input" value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} placeholder="Optional" /></div></div>
        <div className="grid grid-cols-2 gap-4"><div><label className="fp-label">Payment Method</label><select className="fp-input" value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value as PaymentMethod })}>{PAYMENT_METHODS.map((pm) => <option key={pm.value} value={pm.value}>{pm.label}</option>)}</select></div><div><label className="fp-label">Account</label><select className={`fp-input ${errors.account_id ? 'border-frost-danger/50' : ''}`} value={form.account_id} onChange={(e) => setForm({ ...form, account_id: e.target.value })}><option value="">Select...</option>{accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>{errors.account_id && <p className="text-xs text-frost-danger mt-1">{errors.account_id}</p>}</div></div>
        <div><label className="fp-label">Notes</label><textarea className="fp-input" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes..." /></div>
        {error && <div className="flex items-start gap-2 p-3 rounded-md bg-frost-danger/10 border border-frost-danger/30"><AlertCircle className="w-4 h-4 text-frost-danger shrink-0 mt-0.5" /><p className="text-xs text-frost-danger">{error}</p></div>}
        <div className="flex gap-3 pt-2"><button type="submit" disabled={saving} className="fp-btn-primary flex-1">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? 'Saving...' : editId ? 'Update Transaction' : 'Add Transaction'}</button><button type="button" onClick={() => navigate('/transactions')} className="fp-btn"><X className="w-4 h-4" /> Cancel</button></div>
      </form>
    </div>
  )
}