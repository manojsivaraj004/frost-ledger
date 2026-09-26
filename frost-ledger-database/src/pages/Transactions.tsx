import { ArrowLeftRight, Plus, Search, Filter } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function Transactions() {
  const transactions = [
    { date: '2026-09-24', desc: 'Coal Supply Co.', cat: 'Utilities', acct: 'Checking', amt: -142.5 },
    { date: '2026-09-23', desc: 'Generator Maintenance', cat: 'Maintenance', acct: 'Checking', amt: -85.0 },
    { date: '2026-09-22', desc: 'Salary Deposit', cat: 'Income', acct: 'Checking', amt: 2710.0 },
    { date: '2026-09-22', desc: 'Food Rations — Week 38', cat: 'Food', acct: 'Cash', amt: -64.3 },
    { date: '2026-09-21', desc: 'Medical Supplies', cat: 'Health', acct: 'Checking', amt: -38.75 },
    { date: '2026-09-20', desc: 'Insulation Materials', cat: 'Maintenance', acct: 'Savings', amt: -120.0 },
    { date: '2026-09-19', desc: 'Freelance — Survey Work', cat: 'Income', acct: 'Checking', amt: 450.0 },
    { date: '2026-09-18', desc: 'Heating Fuel', cat: 'Utilities', acct: 'Checking', amt: -78.2 },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Transaction Ledger"
        subtitle="All financial movements across your accounts"
        icon={ArrowLeftRight}
        action={
          <button className="fp-btn-primary">
            <Plus className="w-4 h-4" /> New Transaction
          </button>
        }
      />

      {/* Filters */}
      <div className="fp-panel p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-frost-text3" />
          <input className="fp-input pl-10" placeholder="Search transactions..." />
        </div>
        <button className="fp-btn">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="fp-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-frost-border bg-frost-panel2/50">
                <th className="text-left px-4 py-3 fp-section-title font-semibold">Date</th>
                <th className="text-left px-4 py-3 fp-section-title font-semibold">Description</th>
                <th className="text-left px-4 py-3 fp-section-title font-semibold">Category</th>
                <th className="text-left px-4 py-3 fp-section-title font-semibold">Account</th>
                <th className="text-right px-4 py-3 fp-section-title font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr
                  key={i}
                  className="border-b border-frost-border/50 hover:bg-frost-panel2/50 transition-colors"
                >
                  <td className="px-4 py-3 text-frost-text3 font-mono text-xs">{t.date}</td>
                  <td className="px-4 py-3 text-frost-text">{t.desc}</td>
                  <td className="px-4 py-3">
                    <span className="fp-badge-accent">{t.cat}</span>
                  </td>
                  <td className="px-4 py-3 text-frost-text2">{t.acct}</td>
                  <td
                    className={`px-4 py-3 text-right font-mono font-medium ${
                      t.amt > 0 ? 'text-frost-success' : 'text-frost-text2'
                    }`}
                  >
                    {t.amt > 0 ? '+' : ''}{t.amt.toFixed(2)}
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