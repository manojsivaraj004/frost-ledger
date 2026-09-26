import { useState, useEffect, useCallback, useMemo } from 'react'
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/PageHeader'
import { LoadingState, EmptyState } from '../components/States'
import type { Transaction } from '../types/database'

export default function Reports() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase.from('transactions').select('*, category:categories(*)').eq('user_id', user.id).order('date', { ascending: true })
    setTransactions(data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchData() }, [fetchData])

  const monthlyData = useMemo(() => {
    const map = new Map<string, { income: number; expenses: number }>()
    transactions.forEach((t) => { const d = new Date(t.date); const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; const entry = map.get(key) ?? { income: 0, expenses: 0 }; if (t.type === 'income') entry.income += Number(t.amount); else if (t.type === 'expense') entry.expenses += Number(t.amount); map.set(key, entry) })
    return Array.from(map.entries()).slice(-9).map(([key, val]) => ({ label: key.slice(5) + '/' + key.slice(2, 4), ...val }))
  }, [transactions])

  const catBreakdown = useMemo(() => {
    const map = new Map<string, number>()
    transactions.filter(t => t.type === 'expense').forEach((t) => { const cat = t.category?.name ?? 'Uncategorized'; map.set(cat, (map.get(cat) ?? 0) + Number(t.amount)) })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6)
  }, [transactions])

  const avgIncome = monthlyData.length > 0 ? monthlyData.reduce((s, m) => s + m.income, 0) / monthlyData.length : 0
  const avgExpenses = monthlyData.length > 0 ? monthlyData.reduce((s, m) => s + m.expenses, 0) / monthlyData.length : 0
  const savingsRate = avgIncome > 0 ? ((avgIncome - avgExpenses) / avgIncome) * 100 : 0
  const maxVal = Math.max(...monthlyData.map(m => Math.max(m.income, m.expenses)), 1)

  if (loading) return <div className="max-w-7xl mx-auto"><LoadingState message="Analyzing data..." /></div>

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader title="Reports & Analysis" subtitle="Financial trends and spending breakdowns" icon={BarChart3} />
      {transactions.length === 0 ? <EmptyState title="No data to analyze" message="Add transactions to see reports and spending trends." /> : <>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><div className="fp-panel p-4"><div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-frost-success" /><span className="fp-section-title">Avg Monthly Income</span></div><p className="text-2xl font-bold text-frost-text font-mono">${avgIncome.toFixed(0)}</p></div><div className="fp-panel p-4"><div className="flex items-center gap-2 mb-2"><TrendingDown className="w-4 h-4 text-frost-danger" /><span className="fp-section-title">Avg Monthly Expenses</span></div><p className="text-2xl font-bold text-frost-text font-mono">${avgExpenses.toFixed(0)}</p></div><div className="fp-panel p-4"><div className="flex items-center gap-2 mb-2"><BarChart3 className="w-4 h-4 text-frost-accent" /><span className="fp-section-title">Savings Rate</span></div><p className="text-2xl font-bold text-frost-accent font-mono">{savingsRate.toFixed(1)}%</p></div></div>
        {monthlyData.length > 0 && <div className="fp-panel p-5"><h3 className="text-sm font-semibold text-frost-text mb-4">Income vs Expenses</h3><div className="flex items-end justify-between gap-2 h-48">{monthlyData.map((m) => <div key={m.label} className="flex-1 flex flex-col items-center gap-1"><div className="w-full flex items-end justify-center gap-1 h-40"><div className="w-3 rounded-t bg-gradient-to-t from-frost-accent2 to-frost-accent transition-all" style={{ height: `${(m.income / maxVal) * 100}%` }} title={`Income: $${m.income}`} /><div className="w-3 rounded-t bg-gradient-to-t from-frost-danger/60 to-frost-danger transition-all" style={{ height: `${(m.expenses / maxVal) * 100}%` }} title={`Expenses: $${m.expenses}`} /></div><span className="text-[10px] text-frost-text3 font-mono">{m.label}</span></div>)}</div><div className="flex items-center justify-center gap-6 mt-4"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-frost-accent" /><span className="text-xs text-frost-text2">Income</span></div><div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-frost-danger" /><span className="text-xs text-frost-text2">Expenses</span></div></div></div>}
        {catBreakdown.length > 0 && <div className="fp-panel p-5"><h3 className="text-sm font-semibold text-frost-text mb-4">Spending by Category</h3><div className="space-y-3">{catBreakdown.map(([cat, amt]) => { const maxCat = Math.max(...catBreakdown.map(c => c[1]), 1); return <div key={cat} className="flex items-center gap-3"><span className="text-sm text-frost-text2 w-24 shrink-0 truncate">{cat}</span><div className="flex-1 h-2.5 bg-frost-bg rounded-full overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-frost-accent2 to-frost-accent" style={{ width: `${(amt / maxCat) * 100}%` }} /></div><span className="text-sm text-frost-text3 font-mono w-16 text-right">${amt.toFixed(0)}</span></div> })}</div></div>}
      </>}
    </div>
  )
}