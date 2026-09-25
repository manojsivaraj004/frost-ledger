import { Settings as SettingsIcon, Moon, Bell, Globe, Shield, Palette } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function Settings() {
  const sections = [
    {
      title: 'General',
      icon: Globe,
      fields: [
        { label: 'Currency', value: 'USD ($)', type: 'text' },
        { label: 'Date Format', value: 'YYYY-MM-DD', type: 'text' },
        { label: 'Language', value: 'English', type: 'text' },
      ],
    },
    {
      title: 'Appearance',
      icon: Palette,
      fields: [
        { label: 'Theme', value: 'Frostpunk (Dark)', type: 'text' },
        { label: 'Accent Color', value: 'Arctic Blue', type: 'text' },
        { label: 'Density', value: 'Compact', type: 'text' },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      fields: [
        { label: 'Budget Alerts', value: 'Enabled', type: 'toggle' },
        { label: 'Recurring Reminders', value: 'Enabled', type: 'toggle' },
        { label: 'Goal Milestones', value: 'Disabled', type: 'toggle' },
      ],
    },
    {
      title: 'Security',
      icon: Shield,
      fields: [
        { label: 'Two-Factor Auth', value: 'Enabled', type: 'toggle' },
        { label: 'Session Timeout', value: '30 minutes', type: 'text' },
        { label: 'Export Encryption', value: 'Enabled', type: 'toggle' },
      ],
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Configure your Frost Ledger preferences"
        icon={SettingsIcon}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.title} className="fp-panel p-5">
              <div className="flex items-center gap-2 mb-4">
                <Icon className="w-4 h-4 text-frost-accent" />
                <h3 className="text-sm font-semibold text-frost-text">{s.title}</h3>
              </div>
              <div className="space-y-3">
                {s.fields.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center justify-between py-2 border-b border-frost-border/50 last:border-0"
                  >
                    <span className="text-sm text-frost-text2">{f.label}</span>
                    {f.type === 'toggle' ? (
                      <button
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          f.value === 'Enabled'
                            ? 'bg-frost-accent2/40'
                            : 'bg-frost-border'
                        }`
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform ${
                            f.value === 'Enabled'
                              ? 'left-5 bg-frost-accent'
                              : 'left-0.5 bg-frost-text3'
                          }`
                        />
                      </button>
                    ) : (
                      <span className="text-sm text-frost-text font-mono">{f.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="fp-panel p-5 flex items-center gap-3">
        <Moon className="w-5 h-5 text-frost-text3" />
        <div className="flex-1">
          <p className="text-sm text-frost-text">Frost Ledger v1.0.0</p>
          <p className="text-xs text-frost-text3">
            Built for survival. Stay warm. Stay solvent.
          </p>
        </div>
        <button className="fp-btn-primary">Save Changes</button>
      </div>
    </div>
  )
}