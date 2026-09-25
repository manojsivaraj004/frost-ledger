import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Landmark,
  Repeat,
  Target,
  BarChart3,
  DatabaseBackup,
  Settings as SettingsIcon,
  Snowflake,
  Menu,
  X,
  Flame,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/budget', label: 'Budget', icon: Wallet },
  { to: '/accounts', label: 'Accounts', icon: Landmark },
  { to: '/recurring', label: 'Recurring', icon: Repeat },
  { to: '/savings-goals', label: 'Savings Goals', icon: Target },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/backups', label: 'Backups', icon: DatabaseBackup },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]

const pageTitles: Record<string, string> = {
  '/': 'Command Center',
  '/transactions': 'Transaction Ledger',
  '/budget': 'Resource Budget',
  '/accounts': 'Accounts',
  '/recurring': 'Recurring Allocations',
  '/savings-goals': 'Savings Goals',
  '/reports': 'Reports & Analysis',
  '/backups': 'Data Vaults',
  '/settings': 'Settings',
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const currentTitle = pageTitles[location.pathname] ?? 'Frost Ledger'

  return (
    <div className="min-h-screen flex bg-frost-bg">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-frost-panel border-r border-frost-border
        flex flex-col transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-frost-border relative">
          <div className="relative">
            <Snowflake className="w-7 h-7 text-frost-accent text-glow" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-wider text-frost-text">FROST LEDGER</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-frost-text3 mt-0.5">
              Survival Finance
            </span>
          </div>
          <button
            className="ml-auto lg:hidden text-frost-text2 hover:text-frost-text"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="fp-section-title px-3 mb-2">Navigation</div>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 relative group ${
                    isActive
                      ? 'bg-frost-accent2/15 text-frost-accent border-l-2 border-frost-accent'
                      : 'text-frost-text2 hover:text-frost-text hover:bg-frost-panel2 border-l-2 border-transparent'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Footer status */}
        <div className="p-3 border-t border-frost-border">
          <div className="fp-panel-2 p-3 rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-3.5 h-3.5 text-ember" />
              <span className="text-xs font-medium text-frost-text2">Generator Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-frost-bg rounded-full overflow-hidden">
                <div className="h-full w-[78%] bg-gradient-to-r from-ember to-ember-glow rounded-full" />
              </div>
              <span className="text-[10px] font-mono text-ember">78%</span>
            </div>
            <p className="text-[10px] text-frost-text3 mt-1.5">Coal reserves: 14 days</p>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-frost-border bg-frost-panel/80 backdrop-blur-sm flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30">
          <button
            className="lg:hidden text-frost-text2 hover:text-frost-text"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-frost-accent rounded-full shadow-frost-glow" />
            <h1 className="text-lg font-semibold text-frost-text tracking-wide">{currentTitle}</h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-frost-panel2 border border-frost-border">
              <div className="w-2 h-2 rounded-full bg-frost-success animate-pulse" />
              <span className="text-xs text-frost-text2">System Online</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-frost-panel2 border border-frost-border2 flex items-center justify-center text-frost-accent text-sm font-semibold">
              M
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-grid">
          <Outlet />
        </main>
      </div>
    </div>
  )
}