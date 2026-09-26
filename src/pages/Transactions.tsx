import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftRight, Plus, Search, Trash2, Pencil, ChevronUp, ChevronDown, Filter, X, Calendar, Wallet, Tag, CreditCard } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/PageHeader'
import ConfirmDialog from '../components/ConfirmDialog'
import DeploymentInfo from '../components/DeploymentInfo'
import { LoadingState, EmptyState } from '../components/States'
import type { Transaction, Account, Category } from '../types/database'

type SortField = 'date' | 'amount' | 'description'
type SortDir = 'asc' | 'desc'

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'Cash', credit_card: 'Credit Card', debit_card: 'Debit Card',
  bank_transfer: 'Bank Transfer', check: 'Check', mobile_payment: 'Mobile Payment', other: 'Other',
}

export default function Transactions() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterAccount, setFilterAccount] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    const [txRes, acctRes, catRes] = await Promise.all([
      supabase.from('transactions').select('*, category:categories(*), account:accounts(*)').eq('user_id', user.id).order('date', { ascending: false }),
      supabase.from('accounts').select('*').eq('user_id', user.id),
      supabase.from('categories').select('*').eq('user_id', user.id).order('sort_order'),
    ])
    if (txRes.error) setError(txRes.error.message)
    setTransactions(txRes.data ?? [])
    setAccounts(acctRes.data ?? [])
    setCategories(catRes.data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchData() }, [fetchData])

  const filteredSorted = useMemo(() => {
    let result = [...transactions]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(t => t.description.toLowerCase().includes(q) || t.subcategory?.toLowerCase().includes(q) || t.notes?.toLowerCase().includes(q) || t.category?.name?.toLowerCase().includes(q))
    }
    if (filterType !== 'all') result = result.filter(t => t.type === filterType)
    if (filterCategory !== 'all') result = result.filter(t => t.category_id === filterCategory)
    if (filterAccount !== 'all') result = result.filter(t => t.account_id === filterAccount)
    result.sort((a, b) => { let cmp = 0; if (sortField === 'date') cmp = new Date(a.date).getTime() - new Date(b.date).getTime(); else if (sortField === 'amount') cmp = Number(a.amount) - Number(b.amount); else if (sortField === 'description') cmp = a.description.localeCompare(b.description); return sortDir === 'asc' ? cmp : -cmp })
    return result
  }, [transactions, search, filterType, filterCategory, filterAccount, sortField, sortDir])

  const toggleSort = (field: SortField) => { if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortField(field); setSortDir('desc') } }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    const { error: err } = await supabase.from('transactions').delete().eq('id', deleteId)
    setDeleting(false)
    if (err) setError(err.message)
    else { setDeleteId(null); fetchData() }
  }

  const activeFilters = (filterType !== 'all' ? 1 : 0) + (filterCategory !== 'all' ? 1 : 0) + (filterAccount !== 'all' ? 1 : 0)
  const clearFilters = () => { setFilterType('all'); setFilterCategory('all'); setFilterAccount('all'); setSearch('') }
  const SortIcon = ({ field }: { field: SortField }) => { if (sortField !== field) return <ChevronUp className="w-3 h-3 opacity-30" />; return sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-frost-accent" /> : <ChevronDown className="w-3 h-3 text-frost-accent" /> }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader title="Transaction Ledger" subtitle="All financial movements across your accounts" icon={ArrowLeftRight} action={<button className="fp-btn-primary" onClick={() => navigate('/transactions/new')}><Plus className="w-4 h-4" /> Add Transaction</button>} />
      <div className="fp-panel p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-frost-text3" /><input className="fp-input pl-10" placeholder="Search by description, category, notes..." value={search} onChange={(e) => setSearch(e.target.value)} />{search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-frost-text3 hover:text-frost-text"><X className="w-4 h-4" /></button>}</div>
        <button onClick={() => setShowFilters(v => !v)} className="fp-btn relative"><Filter className="w-4 h-4" /> Filters{activeFilters > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-frost-accent text-frost-bg text-[10px] font-bold flex items-center justify-center">{activeFilters}</span>}</button>
        {activeFilters > 0 && <button onClick={clearFilters} className="fp-btn"><X className="w-4 h-4" /> Clear</button>}
      </div>
      {showFilters && <div className="fp-panel p-4 grid grid-cols-1 sm:grid-cols-3 gap-3"><div><label className="fp-label">Type</label><select className="fp-input" value={filterType} onChange={(e) => setFilterType(e.target.value)}><option value="all">All Types</option><option value="income">Income</option><option value="expense">Expense</option><option value="transfer">Transfer</option></select></div><div><label className="fp-label">Category</label><select className="fp-input" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}><option value="all">All Categories</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div><label className="fp-label">Account</label><select className="fp-input" value={filterAccount} onChange={(e) => setFilterAccount(e.target.value)}><option value="all">All Accounts</option>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div></div>}
      {error && <div className="fp-panel p-4 border-frost-danger/30 flex items-center justify-between"><p className="text-sm text-frost-danger">{error}</p><button onClick={() => setError(null)} className="text-frost-text3 hover:text-frost-text"><X className="w-4 h-4" /></button></div>}
      {loading ? <LoadingState /> : <div className="fp-panel overflow-hidden">{filteredSorted.length === 0 ? <EmptyState title={search || activeFilters > 0 ? "No matching transactions" : "No transactions yet"} message={search || activeFilters > 0 ? "Try adjusting your search or filters." : "Add your first transaction to start tracking."} action={search || activeFilters > 0 ? <button className="fp-btn mt-2" onClick={clearFilters}>Clear Filters</button> : <button className="fp-btn-primary mt-2" onClick={() => navigate('/transactions/new')}><Plus className="w-4 h-4" /> Add Transaction</button>} /> : <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-frost-border bg-frost-panel2/50"><th className="text-left px-4 py-3"><button onClick={() => toggleSort('date')} className="flex items-center gap-1 fp-section-title font-semibold hover:text-frost-accent"><Calendar className="w-3 h-3" /> Date <SortIcon field="date" /></button></th><th className="text-left px-4 py-3"><button onClick={() => toggleSort('description')} className="flex items-center gap-1 fp-section-title font-semibold hover:text-frost-accent">Description <SortIcon field="description" /></button></th><th className="text-left px-4 py-3 fp-section-title font-semibold"><Tag className="w-3 h-3 inline mr-1" /> Category</th><th className="text-left px-4 py-3 fp-section-title font-semibold"><CreditCard className="w-3 h-3 inline mr-1" /> Payment</th><th className="text-left px-4 py-3 fp-section-title font-semibold"><Wallet className="w-3 h-3 inline mr-1" /> Account</th><th className="text-right px-4 py-3"><button onClick={() => toggleSort('amount')} className="flex items-center gap-1 ml-auto fp-section-title font-semibold hover:text-frost-accent">Amount <SortIcon field="amount" /></button></th><th className="text-center px-4 py-3 fp-section-title font-semibold">Actions</th></tr></thead><tbody>{filteredSorted.map((t) => <tr key={t.id} className="border-b border-frost-border/50 hover:bg-frost-panel2/50 transition-colors"><td className="px-4 py-3 text-frost-text3 font-mono text-xs whitespace-nowrap">{t.date}</td><td className="px-4 py-3"><div className="text-frost-text">{t.description}</div>{t.subcategory && <div className="text-xs text-frost-text3">{t.subcategory}</div>}</td><td className="px-4 py-3"><span className="fp-badge-accent">{t.category?.name ?? '—'}</span></td><td className="px-4 py-3 text-frost-text2 text-xs">{t.payment_method ? PAYMENT_METHOD_LABELS[t.payment_method] ?? t.payment_method : '—'}</td><td className="px-4 py-3 text-frost-text2">{t.account?.name ?? '—'}</td><td className={`px-4 py-3 text-right font-mono font-medium whitespace-nowrap ${t.type === 'income' ? 'text-frost-success' : 'text-frost-text2'}`}>{t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}</td><td className="px-4 py-3"><div className="flex items-center justify-center gap-1"><button onClick={() => navigate('/transactions/new', { state: { editId: t.id } })} className="p-1.5 rounded hover:bg-frost-panel2 text-frost-text3 hover:text-frost-accent" title="Edit"><Pencil className="w-3.5 h-3.5" /></button><button onClick={() => setDeleteId(t.id)} className="p-1.5 rounded hover:bg-frost-danger/10 text-frost-text3 hover:text-frost-danger" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button></div></td></tr>)}</tbody></table></div>}</div>}
      {!loading && filteredSorted.length > 0 && <div className="fp-panel p-4 flex flex-wrap items-center gap-4 text-sm"><span className="text-frost-text3">{filteredSorted.length} transaction{filteredSorted.length !== 1 ? 's' : ''}</span><span className="text-frost-border2">·</span><span className="text-frost-success font-mono">+${filteredSorted.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0).toFixed(2)} income</span><span className="text-frost-border2">·</span><span className="text-frost-text2 font-mono">-${filteredSorted.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0).toFixed(2)} expense</span></div>}
      <DeploymentInfo />
      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Transaction" message="Are you sure you want to delete this transaction? This action cannot be undone." confirmLabel="Delete" danger loading={deleting} />
    </div>
  )
}