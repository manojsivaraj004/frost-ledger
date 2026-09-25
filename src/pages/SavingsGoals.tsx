import { Target, Plus, Snowflake } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function SavingsGoals() {
  const goals = [
    { name: 'Emergency Furnace', target: 5000, saved: 3200, deadline: '2026-12-31' },
    { name: 'Winter Supplies', target: 2000, saved: 1450, deadline: '2026-11-15' },
    { name: 'Generator Upgrade', target: 3500, saved: 800, deadline: '2027-03-01' },
    { name: 'Medical Reserve', target: 1500, saved: 1500, deadline: '2026-10-01' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Savings Goals"
        subtitle="Track progress toward your survival reserves"
        icon={Target}
        action={
          <button className="fp-btn-primary">
            <Plus className="w-4 h-4" /> New Goal
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((g) => {
          const pct = Math.round((g.saved / g.target) * 100)
          const done = g.saved >= g.target
          return (
            <div key={g.name} className="fp-panel p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {done ? (
                    <Snowflake className="w-5 h-5 text-frost-accent text-glow" />
                  ) : (
                    <Target className="w-5 h-5 text-frost-text2" />
                  )}
                  <h3 className="text-sm font-semibold text-frost-text">{g.name}</h3>
                </div>
                {done && <span className="fp-badge-success">Complete</span>}
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-2xl font-bold text-frost-text font-mono">
                  ${g.saved.toLocaleString()}
                </span>
                <span className="text-sm text-frost-text3 font-mono">
                  / ${g.target.toLocaleString()}
                </span>
              </div>

              <div className="h-3 bg-frost-bg rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all ${
                    done
                      ? 'bg-frost-success'
                      : 'bg-gradient-to-r from-frost-accent2 to-frost-accent'
                  }`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-frost-text2">{pct}% saved</span>
                <span className="text-frost-text3 font-mono">Due {g.deadline}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}