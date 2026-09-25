import { LayoutDashboard, TrendingUp, TrendingDown, Wallet, Snowflake, Flame } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function Dashboard() {
  const stats = [
    { label: 'Total Balance', value: '$24,830.50', change: '+2.4%', positive: true, icon: Wallet },
    { label: 'Monthly Income', value: '$5,420.00', change: '+0.8%', positive: true, icon: TrendingUp },
    { label: 'Monthly Expenses', value: '$3,180.75', change: '-1.2%', positive: true, icon: TrendingDown },
    { label: 'Net Savings', value: '$2,239.25', change: '+5.6%', positive: true, icon: Snowflake },
  ]

  const recent = [
    { desc: 'Coal Supply Co.', cat: 'Utilities', amt: -142.5, date: '2026-09-24' },
    { desc: 'Generator Maintenance', cat: 'Maintenance', amt: -85.0, date: '2026-09-23' },
    { desc: 'Salary Deposit', cat: 'Income', amt: 2710.0, date: '2026-09-22' },
    { desc: 'Food Rations', cat: 'Food', amt: -64.3, date: '2026-09-22' },
    { desc: 'Medical Supplies', cat: 'Health', amt: -38.75, date: '2026-09-21' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Command Center"
        subtitle="Overview of your financial survival status"
        icon={LayoutDashboard}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="fp-panel p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-frost-radial opacity-50" />
              <div className="flex items-center justify-between mb-3 relative">
                <span className="fp-section-title">{s.label}</span>
                <Icon className="w-4 h-4 text-frost-text3" />
              </div>
              <div className="text-2xl font-bold text-frost-text font-mono">{s.value}</div>
              <div className="flex items-center gap-1 mt-2">
                <span
                  className={`text-xs font-medium ${s.positive ? 'text-frost-success' : 'text-frost-danger'}`}
                >
                  {s.change}
                </span>
                <span className="text-xs text-frost-text3">vs last month</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Two-column area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent transactions */}
        <div className="lg:col-span-2 fp-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-frost-text">Recent Transactions</h3>
            <button className="text-xs text-frost-accent hover:text-frost-glow">View all →</button>
          </div>
          <div className="space-y-1">
            {recent.map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2.5 px-3 rounded-md hover:bg-frost-panel2 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold ${
                    t.amt > 0
                      ? 'bg-frost-success/10 text-frost-success'
                      : 'bg-frost-danger/10 text-frost-danger'
                  }`
                }
                >
                  {t.amt > 0 ? '↑' : '↓'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-frost-text truncate">{t.desc}</p>
                  <p className="text-xs text-frost-text3">{t.cat} · {t.date}</p>
                </div>
                <span
                  className={`text-sm font-mono font-medium ${t.amt > 0 ? 'text-frost-success' : 'text-frost-text2'}`}
                >
                  {t.amt > 0 ? '+' : ''}{t.amt.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Generator / budget health */}
        <div className="fp-panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-ember" />
            <h3 className="text-sm font-semibold text-frost-text">Budget Health</h3>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Food & Rations', pct: 62, color: 'frost-accent' },
              { label: 'Utilities', pct: 85, color: 'ember' },
              { label: 'Maintenance', pct: 34, color: 'frost-success' },
              { label: 'Medical', pct: 48, color: 'frost-accent' },
              { label: 'Reserves', pct: 72, color: 'ember' },
            ].map((b) => (
              <div key={b.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-frost-text2">{b.label}</span>
                  <span className="text-frost-text3 font-mono">{b.pct}%</span>
                </div>
                <div className="h-2 bg-frost-bg rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-${b.color} transition-all`}
                    style={{ width: `${b.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}