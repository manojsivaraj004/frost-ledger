import type { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  action?: React.ReactNode
}

export default function PageHeader({ title, subtitle, icon: Icon, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-md bg-frost-panel2 border border-frost-border flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-frost-accent" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-frost-text tracking-wide">{title}</h2>
          {subtitle && <p className="text-sm text-frost-text2 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}