import { useState, useEffect, useCallback } from 'react'
import { LayoutDashboard, TrendingUp, TrendingDown, Wallet, Snowflake, Flame, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/PageHeader'
import { LoadingState, EmptyState } from '../components/States'
import DeploymentInfo from '../components/DeploymentInfo'
import type { Transaction, Account, SavingsGoal, Budget } from '../types/database'

export default function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const [txRes, acctRes, goalRes, budRes] = await Promise.all([
      supabase.from('transactions').select('*, category:categories(*), account:accounts(*)').eq('user_id', user.id).order('date', { ascending: false }).limit(5),
      supabase.from('accounts').select('*').eq('user_id', user.id),
      supabase.from('savings_goals').select('*').eq('user_id', user.id),
      supabase.from('budgets').select('*, category:categories(*)').eq('user_id', user.id),
    ])
    setTransactions(txRes.data ?? [])
    setAccounts(acctRes.data ?? [])
    setGoals(goalRes.data ?? [])
    setBudgets(budRes.data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchData() }, [fetchData])
  if (loading) return <div className="max-w-7xl mx-auto"><LoadingState message="Scanning the frozen horizon..." /></div>

  const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance), 0)
  const now = new Date()
  const monthTransactions = transactions.filter(t => { const d = new Date(t.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() })
  const monthlyIncome = monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const monthlyExpenses = monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const netSavings = monthlyIncome - monthlyExpenses
  const stats = [
    { label: 'Total Balance', value: `$${totalBalance.toFixed(2)}`, icon: Wallet },
    { label: 'Monthly Income', value: `$${monthlyIncome.toFixed(2)}`, icon: TrendingUp },
    { label: 'Monthly Expenses', value: `$${monthlyExpenses.toFixed(2)}`, icon: TrendingDown },
    { label: 'Net Savings', value: `$${netSavings.toFixed(2)}`, icon: Snowflake },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader title="Command Center" subtitle="Overview of your financial survival status" icon={LayoutDashboard} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => { const Icon = s.icon; return <div key={s.label} className="fp-panel p-4 relative overflow-hidden"><div className="absolute top-0 right-0 w-20 h-20 bg-frost-radial opacity-50" /><div className="flex items-center justify-between mb-3 relative"><span className="fp-section-title">{s.label}</span><Icon className="w-4 h-4 text-frost-text3" /></div><div className="text-2xl font-bold text-frost-text font-mono">{s.value}</div></div> })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 fp-panel p-5"><div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold text-frost-text">Recent Transactions</h3></div>{transactions.length === 0 ? <EmptyState title="No transactions yet" message="Add your first transaction to start tracking your survival resources." /> : <div className="space-y-1">{transactions.map((t) => <div key={t.id} className="flex items-center gap-3 py-2.5 px-3 rounded-md hover:bg-frost-panel2 transition-colors"><div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold ${t.type === 'income' ? 'bg-frost-success/10 text-frost-success' : 'bg-frost-danger/10 text-frost-danger'}`}>{t.type === 'income' ? '↑' : '↓'}</div><div className="flex-1 min-w-0"><p className="text-sm text-frost-text truncate">{t.description}</p><p className="text-xs text-frost-text3">{t.category?.name ?? 'Uncategorized'} · {t.date}</p></div><span className={`text-sm font-mono font-medium ${t.type === 'income' ? 'text-frost-success' : 'text-frost-text2'}`}>{t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}</span></div>)}</div>}</div>
        <div className="fp-panel p-5"><div className="flex items-center gap-2 mb-4"><Flame className="w-4 h-4 text-ember" /><h3 className="text-sm font-semibold text-frost-text">Budget Health</h3></div>{budgets.length === 0 ? <EmptyState title="No budgets set" message="Create budgets to track your spending limits." /> : <div className="space-y-4">{budgets.slice(0, 5).map((b) => { const pct = b.allocated > 0 ? Math.min(Math.round((Number(b.spent) / Number(b.allocated)) * 100), 100) : 0; return <div key={b.id}><div className="flex justify-between text-xs mb-1"><span className="text-frost-text2">{b.category?.name ?? 'Unknown'}</span><span className="text-frost-text3 font-mono">{pct}%</span></div><div className="h-2 bg-frost-bg rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${pct >= 90 ? 'bg-frost-danger' : 'bg-frost-accent'}`} style={{ width: `${pct}%` }} /></div></div> })}</div>}</div>
      </div>
      {goals.length > 0 && <div className="fp-panel p-5"><h3 className="text-sm font-semibold text-frost-text mb-4">Savings Goals Progress</h3><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{goals.slice(0, 4).map((g) => { const pct = g.target_amount > 0 ? Math.min(Math.round((Number(g.current_amount) / Number(g.target_amount)) * 100), 100) : 0; const done = Number(g.current_amount) >= Number(g.target_amount); return <div key={g.id} className="fp-panel-2 p-3"><div className="flex items-center gap-2 mb-2">{done ? <Snowflake className="w-4 h-4 text-frost-accent text-glow" /> : <Plus className="w-4 h-4 text-frost-text3" />}<span className="text-xs text-frost-text2 truncate">{g.name}</span></div><p className="text-sm font-mono text-frost-text mb-1">${Number(g.current_amount).toFixed(0)} / ${Number(g.target_amount).toFixed(0)}</p><div className="h-1.5 bg-frost-bg rounded-full overflow-hidden"><div className={`h-full rounded-full ${done ? 'bg-frost-success' : 'bg-frost-accent'}`} style={{ width: `${pct}%` }} /></div></div> })}</div></div>}
      <DeploymentInfo />
    </div>
  )
}