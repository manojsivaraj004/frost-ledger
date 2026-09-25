import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function Reports() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
  const income = [4200, 4350, 5100, 4900, 5200, 5400, 5300, 5400, 5420]
  const expenses = [3100, 3400, 3800, 3500, 3900, 3300, 3600, 3400, 3180]
  const maxVal = Math.max(...income, ...expenses)

  const catBreakdown = [
    { cat: 'Housing', amt: 1200, pct: 38 },
    { cat: 'Food', amt: 248, pct: 8 },
    { cat: 'Utilities', amt: 255, pct: 8 },
    { cat: 'Transport', amt: 45, pct: 1 },
    { cat: 'Medical', amt: 72, pct: 2 },
    { cat: 'Other', amt: 360, pct: 11 },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Reports & Analysis"
        subtitle="Financial trends and spending breakdowns"
        icon={BarChart3}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="fp-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-frost-success" />
            <span className="fp-section-title">Avg Monthly Income</span>
          </div>
          <p className="text-2xl font-bold text-frost-text font-mono">$5,030</p>
        </div>
        <div className="fp-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-frost-danger" />
            <span className="fp-section-title">Avg Monthly Expenses</span>
          </div>
          <p className="text-2xl font-bold text-frost-text font-mono">$3,453</p>
        </div>
        <div className="fp-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-frost-accent" />
            <span className="fp-section-title">Savings Rate</span>
          </div>
          <p className="text-2xl font-bold text-frost-accent font-mono">31.4%</p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="fp-panel p-5">
        <h3 className="text-sm font-semibold text-frost-text mb-4">Income vs Expenses</h3>
        <div className="flex items-end justify-between gap-2 h-48">
          {months.map((m, i) => (
            <div key={m} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end justify-center gap-1 h-40">
                <div
                  className="w-3 rounded-t bg-gradient-to-t from-frost-accent2 to-frost-accent transition-all"
                  style={{ height: `${(income[i] / maxVal) * 100}%` }}
                  title={`Income: $${income[i]}`}
                />
                <div
                  className="w-3 rounded-t bg-gradient-to-t from-frost-danger/60 to-frost-danger transition-all"
                  style={{ height: `${(expenses[i] / maxVal) * 100}%` }}
                  title={`Expenses: $${expenses[i]}`}
                />
              </div>
              <span className="text-[10px] text-frost-text3 font-mono">{m}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-frost-accent" />
            <span className="text-xs text-frost-text2">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-frost-danger" />
            <span className="text-xs text-frost-text2">Expenses</span>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="fp-panel p-5">
        <h3 className="text-sm font-semibold text-frost-text mb-4">Spending by Category</h3>
        <div className="space-y-3">
          {catBreakdown.map((c) => (
            <div key={c.cat} className="flex items-center gap-3">
              <span className="text-sm text-frost-text2 w-24 shrink-0">{c.cat}</span>
              <div className="flex-1 h-2.5 bg-frost-bg rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-frost-accent2 to-frost-accent"
                  style={{ width: `${c.pct * 3}%` }}
                />
              </div>
              <span className="text-sm text-frost-text3 font-mono w-16 text-right">
                ${c.amt}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}