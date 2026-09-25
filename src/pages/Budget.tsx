import { Wallet, Plus } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function Budget() {
  const categories = [
    { name: 'Food & Rations', allocated: 400, spent: 248, color: 'frost-accent' },
    { name: 'Utilities', allocated: 300, spent: 255, color: 'ember' },
    { name: 'Maintenance', allocated: 200, spent: 68, color: 'frost-success' },
    { name: 'Medical', allocated: 150, spent: 72, color: 'frost-accent' },
    { name: 'Transport', allocated: 120, spent: 45, color: 'frost-success' },
    { name: 'Reserves', allocated: 500, spent: 360, color: 'ember' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Resource Budget"
        subtitle="Allocate and track your monthly spending categories"
        icon={Wallet}
        action={
          <button className="fp-btn-primary">
            <Plus className="w-4 h-4" /> Add Category
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => {
          const pct = Math.round((c.spent / c.allocated) * 100)
          const over = pct >= 90
          return (
            <div key={c.name} className="fp-panel p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-frost-text">{c.name}</h3>
                <span
                  className={`fp-badge ${over ? 'fp-badge-danger' : 'fp-badge-accent'}`}
                >
                  {pct}%
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-xl font-bold text-frost-text font-mono">
                  ${c.spent}
                </span>
                <span className="text-sm text-frost-text3 font-mono">/ ${c.allocated}</span>
              </div>
              <div className="h-2.5 bg-frost-bg rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    over ? 'bg-frost-danger' : `bg-${c.color}`
                  }`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              <p className="text-xs text-frost-text3 mt-2">
                {c.allocated - c.spent > 0
                  ? `$${c.allocated - c.spent} remaining`
                  : `$${c.spent - c.allocated} over budget`}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}