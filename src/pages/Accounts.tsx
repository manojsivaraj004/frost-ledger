import { Landmark, Plus, CreditCard, Banknote, PiggyBank } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function Accounts() {
  const accounts = [
    { name: 'Checking', num: '•••• 4291', bal: 8420.5, type: 'checking', icon: CreditCard },
    { name: 'Savings', num: '•••• 8830', bal: 15210.0, type: 'savings', icon: PiggyBank },
    { name: 'Cash', num: 'On Hand', bal: 1200.0, type: 'cash', icon: Banknote },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Accounts"
        subtitle="Your financial institutions and cash positions"
        icon={Landmark}
        action={
          <button className="fp-btn-primary">
            <Plus className="w-4 h-4" /> Add Account
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((a) => {
          const Icon = a.icon
          return (
            <div key={a.name} className="fp-panel p-5 relative overflow-hidden group">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-frost-radial opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="flex items-start justify-between mb-4 relative">
                <div className="w-10 h-10 rounded-md bg-frost-panel2 border border-frost-border flex items-center justify-center">
                  <Icon className="w-5 h-5 text-frost-accent" />
                </div>
                <span className="fp-badge-accent uppercase">{a.type}</span>
              </div>
              <h3 className="text-sm font-semibold text-frost-text mb-1">{a.name}</h3>
              <p className="text-xs text-frost-text3 font-mono mb-3">{a.num}</p>
              <p className="text-2xl font-bold text-frost-text font-mono">
                ${a.bal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}