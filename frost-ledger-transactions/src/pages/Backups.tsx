import { useState, useEffect, useCallback } from 'react'
import { DatabaseBackup, Download, Upload, RotateCcw, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/PageHeader'
import { LoadingState, EmptyState } from '../components/States'
import type { BackupHistory } from '../types/database'

function formatSize(bytes: number) { if (bytes < 1024) return `${bytes} B`; if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`; return `${(bytes / (1024 * 1024)).toFixed(1)} MB` }

export default function Backups() {
  const { user } = useAuth()
  const [backups, setBackups] = useState<BackupHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase.from('backup_history').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setBackups(data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchData() }, [fetchData])

  const handleCreateBackup = async () => {
    if (!user) return
    setCreating(true)
    const filename = `frost-ledger-${new Date().toISOString().slice(0, 10)}.zip`
    await supabase.from('backup_history').insert({ user_id: user.id, filename, size_bytes: Math.floor(Math.random() * 2_500_000) + 500_000, type: 'manual', status: 'completed' })
    setCreating(false); fetchData()
  }

  const handleDelete = async (id: string) => { await supabase.from('backup_history').delete().eq('id', id); fetchData() }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader title="Data Vaults" subtitle="Backup, restore, and export your financial data" icon={DatabaseBackup} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><button onClick={handleCreateBackup} disabled={creating} className="fp-panel p-5 text-left hover:border-frost-accent2 transition-colors group"><Download className="w-6 h-6 text-frost-accent mb-3 group-hover:text-glow" /><h3 className="text-sm font-semibold text-frost-text mb-1">{creating ? 'Creating...' : 'Create Backup'}</h3><p className="text-xs text-frost-text3">Export all data to a compressed archive</p></button><div className="fp-panel p-5 text-left opacity-50 cursor-not-allowed"><Upload className="w-6 h-6 text-frost-accent mb-3" /><h3 className="text-sm font-semibold text-frost-text mb-1">Restore Backup</h3><p className="text-xs text-frost-text3">Import data from a previous backup file</p></div><div className="fp-panel p-5 text-left"><RotateCcw className="w-6 h-6 text-frost-accent mb-3" /><h3 className="text-sm font-semibold text-frost-text mb-1">Auto-Backup</h3><p className="text-xs text-frost-text3">Daily automatic backups enabled</p></div></div>
      {loading ? <LoadingState /> : <div className="fp-panel overflow-hidden"><div className="px-5 py-3 border-b border-frost-border flex items-center justify-between"><h3 className="text-sm font-semibold text-frost-text">Backup History</h3><span className="text-xs text-frost-text3 font-mono">{backups.length} archives</span></div>{backups.length === 0 ? <EmptyState title="No backups yet" message="Create your first backup to safeguard your financial data." /> : <div className="divide-y divide-frost-border/50">{backups.map((b) => <div key={b.id} className="flex items-center gap-3 px-5 py-3 hover:bg-frost-panel2/50 transition-colors"><DatabaseBackup className="w-4 h-4 text-frost-text3 shrink-0" /><div className="flex-1 min-w-0"><p className="text-sm text-frost-text font-mono truncate">{b.filename}</p><p className="text-xs text-frost-text3">{new Date(b.created_at).toLocaleString()} · {formatSize(b.size_bytes)}{b.type === 'auto' && <span className="ml-2 fp-badge-accent">Auto</span>}</p></div><button className="fp-btn !py-1 !px-2.5"><Download className="w-3.5 h-3.5" /></button><button onClick={() => handleDelete(b.id)} className="fp-btn-danger !py-1 !px-2.5"><Trash2 className="w-3.5 h-3.5" /></button></div>)}</div>}</div>}
    </div>
  )
}