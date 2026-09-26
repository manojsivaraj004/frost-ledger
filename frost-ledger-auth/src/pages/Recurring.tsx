import { Repeat, Plus, Calendar } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function Recurring() {
  const recurring = [
    { name: 'Rent — Shelter', amt: 1200, freq: 'Monthly', next: '2026-10-01', active: true },
    { name: 'Heating — Gas', amt: 85, freq: 'Monthly', next: '2026-10-03', active: true },
    { name: 'Internet', amt: 45, freq: 'Monthly', next: '2026-10-05', active: true },
    { name: 'Insurance', amt: 32, freq: 'Monthly', next: '2026-10-10', active: true },
    { name: 'Streaming', amt: 12, freq: 'Monthly', next: '2026-10-12', active: false },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Recurring Allocations"
        subtitle="Scheduled and repeating financial commitments"
        icon={Repeat}
        action={
          <button className="fp-btn-primary">
            <Plus className="w-4 h-4" /> Add Recurring
          </button>
        }
      />

      <div className="fp-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-frost-border bg-frost-panel2/50">
                <th className="text-left px-4 py-3 fp-section-title font-semibold">Name</th>
                <th className="text-left px-4 py-3 fp-section-title font-semibold">Frequency</th>
                <th className="text-left px-4 py-3 fp-section-title font-semibold">Next Date</th>
                <th className="text-right px-4 py-3 fp-section-title font-semibold">Amount</th>
                <th className="text-center px-4 py-3 fp-section-title font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recurring.map((r, i) => (
                <tr
                  key={i}
                  className="border-b border-frost-border/50 hover:bg-frost-panel2/50 transition-colors"
                >
                  <td className="px-4 py-3 text-frost-text font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-frost-text2">{r.freq}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-frost-text3 font-mono text-xs">
                      <Calendar className="w-3.5 h-3.5" /> {r.next}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-frost-text2">
                    -${r.amt.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {r.active ? (
                      <span className="fp-badge-success">Active</span>
                    ) : (
                      <span className="fp-badge-warn">Paused</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}