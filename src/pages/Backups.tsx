import { DatabaseBackup, Download, Upload, RotateCcw, Trash2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function Backups() {
  const backups = [
    { name: 'frost-ledger-2026-09-24.zip', size: '2.4 MB', date: '2026-09-24 18:00', auto: true },
    { name: 'frost-ledger-2026-09-23.zip', size: '2.3 MB', date: '2026-09-23 18:00', auto: true },
    { name: 'frost-ledger-2026-09-22.zip', size: '2.3 MB', date: '2026-09-22 18:00', auto: true },
    { name: 'frost-ledger-manual-09-20.zip', size: '2.2 MB', date: '2026-09-20 14:32', auto: false },
    { name: 'frost-ledger-2026-09-21.zip', size: '2.3 MB', date: '2026-09-21 18:00', auto: true },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Data Vaults"
        subtitle="Backup, restore, and export your financial data"
        icon={DatabaseBackup}
      />

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button className="fp-panel p-5 text-left hover:border-frost-accent2 transition-colors group">
          <Download className="w-6 h-6 text-frost-accent mb-3 group-hover:text-glow" />
          <h3 className="text-sm font-semibold text-frost-text mb-1">Create Backup</h3>
          <p className="text-xs text-frost-text3">Export all data to a compressed archive</p>
        </button>
        <button className="fp-panel p-5 text-left hover:border-frost-accent2 transition-colors group">
          <Upload className="w-6 h-6 text-frost-accent mb-3" />
          <h3 className="text-sm font-semibold text-frost-text mb-1">Restore Backup</h3>
          <p className="text-xs text-frost-text3">Import data from a previous backup file</p>
        </button>
        <button className="fp-panel p-5 text-left hover:border-frost-accent2 transition-colors group">
          <RotateCcw className="w-6 h-6 text-frost-accent mb-3" />
          <h3 className="text-sm font-semibold text-frost-text mb-1">Auto-Backup</h3>
          <p className="text-xs text-frost-text3">Daily automatic backups enabled</p>
        </button>
      </div>

      {/* Backup list */}
      <div className="fp-panel overflow-hidden">
        <div className="px-5 py-3 border-b border-frost-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-frost-text">Backup History</h3>
          <span className="text-xs text-frost-text3 font-mono">{backups.length} archives</span>
        </div>
        <div className="divide-y divide-frost-border/50">
          {backups.map((b, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-3 hover:bg-frost-panel2/50 transition-colors"
            >
              <DatabaseBackup className="w-4 h-4 text-frost-text3 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-frost-text font-mono truncate">{b.name}</p>
                <p className="text-xs text-frost-text3">
                  {b.date} · {b.size}
                  {b.auto && <span className="ml-2 fp-badge-accent">Auto</span>}
                </p>
              </div>
              <button className="fp-btn !py-1 !px-2.5">
                <Download className="w-3.5 h-3.5" />
              </button>
              <button className="fp-btn-danger !py-1 !px-2.5">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}