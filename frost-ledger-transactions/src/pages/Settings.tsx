import { useState, useEffect, useCallback } from 'react'
import { Settings as SettingsIcon, Moon, Bell, Globe, Shield, Palette } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/PageHeader'
import { LoadingState } from '../components/States'
import type { UserSettings } from '../types/database'

export default function Settings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase.from('user_settings').select('*').eq('user_id', user.id).single()
    if (data) setSettings(data as UserSettings)
    setLoading(false)
  }, [user])

  useEffect(() => { fetchData() }, [fetchData])

  const handleSave = async () => {
    if (!user || !settings) return
    setSaving(true)
    await supabase.from('user_settings').update({ currency: settings.currency, date_format: settings.date_format, language: settings.language, theme: settings.theme, accent_color: settings.accent_color, density: settings.density, notifications: settings.notifications }).eq('user_id', user.id)
    setSaving(false)
  }

  if (loading || !settings) return <div className="max-w-7xl mx-auto"><LoadingState /></div>

  const toggleNotification = (key: keyof UserSettings['notifications']) => setSettings({ ...settings, notifications: { ...settings.notifications, [key]: !settings.notifications[key] } })
  const sections = [
    { title: 'General', icon: Globe, fields: [{ label: 'Currency', key: 'currency' as const }, { label: 'Date Format', key: 'date_format' as const }, { label: 'Language', key: 'language' as const }] },
    { title: 'Appearance', icon: Palette, fields: [{ label: 'Theme', key: 'theme' as const }, { label: 'Accent Color', key: 'accent_color' as const }, { label: 'Density', key: 'density' as const }] },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader title="Settings" subtitle="Configure your Frost Ledger preferences" icon={SettingsIcon} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((s) => { const Icon = s.icon; return <div key={s.title} className="fp-panel p-5"><div className="flex items-center gap-2 mb-4"><Icon className="w-4 h-4 text-frost-accent" /><h3 className="text-sm font-semibold text-frost-text">{s.title}</h3></div><div className="space-y-3">{s.fields.map((f) => <div key={f.key} className="flex items-center justify-between py-2 border-b border-frost-border/50 last:border-0"><span className="text-sm text-frost-text2">{f.label}</span><input className="fp-input !w-48 text-right" value={settings[f.key]} onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })} /></div>)}</div></div> })}
        <div className="fp-panel p-5"><div className="flex items-center gap-2 mb-4"><Bell className="w-4 h-4 text-frost-accent" /><h3 className="text-sm font-semibold text-frost-text">Notifications</h3></div><div className="space-y-3">{[{ label: 'Budget Alerts', key: 'budget_alerts' as const }, { label: 'Recurring Reminders', key: 'recurring_reminders' as const }, { label: 'Goal Milestones', key: 'goal_milestones' as const }].map((f) => <div key={f.key} className="flex items-center justify-between py-2 border-b border-frost-border/50 last:border-0"><span className="text-sm text-frost-text2">{f.label}</span><button onClick={() => toggleNotification(f.key)} className={`relative w-10 h-5 rounded-full transition-colors ${settings.notifications[f.key] ? 'bg-frost-accent2/40' : 'bg-frost-border'}`}><span className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform ${settings.notifications[f.key] ? 'left-5 bg-frost-accent' : 'left-0.5 bg-frost-text3'}`} /></button></div>)}</div></div>
        <div className="fp-panel p-5"><div className="flex items-center gap-2 mb-4"><Shield className="w-4 h-4 text-frost-accent" /><h3 className="text-sm font-semibold text-frost-text">Security</h3></div><div className="space-y-3"><div className="flex items-center justify-between py-2 border-b border-frost-border/50"><span className="text-sm text-frost-text2">Two-Factor Auth</span><span className="text-sm text-frost-text3">Configure in Supabase</span></div><div className="flex items-center justify-between py-2 border-b border-frost-border/50"><span className="text-sm text-frost-text2">Session Timeout</span><span className="text-sm text-frost-text3 font-mono">Auto (Supabase)</span></div><div className="flex items-center justify-between py-2"><span className="text-sm text-frost-text2">Export Encryption</span><span className="text-sm text-frost-success">Enabled</span></div></div></div>
      </div>
      <div className="fp-panel p-5 flex items-center gap-3"><Moon className="w-5 h-5 text-frost-text3" /><div className="flex-1"><p className="text-sm text-frost-text">Frost Ledger v1.0.0</p><p className="text-xs text-frost-text3">Built for survival. Stay warm. Stay solvent.</p></div><button onClick={handleSave} disabled={saving} className="fp-btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button></div>
    </div>
  )
}