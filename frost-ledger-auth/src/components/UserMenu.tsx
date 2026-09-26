import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ChevronDown, LogOut, User as UserIcon, Settings as SettingsIcon } from 'lucide-react'

export default function UserMenu() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (!user) return null

  const email = user.email ?? 'unknown@frostland.net'
  const initial = email[0]?.toUpperCase() ?? 'S'

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth', { replace: true })
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-frost-panel2 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-frost-panel2 border border-frost-border2 flex items-center justify-center text-frost-accent text-sm font-semibold">
          {initial}
        </div>
        <ChevronDown className={`w-4 h-4 text-frost-text3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 fp-panel p-2 z-50 shadow-frost-panel">
          {/* User info */}
          <div className="px-3 py-2.5 border-b border-frost-border mb-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-frost-accent2/20 border border-frost-accent2/40 flex items-center justify-center text-frost-accent text-sm font-semibold">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-frost-text truncate">{email}</p>
                <p className="text-[10px] text-frost-text3 uppercase tracking-wider">Survivor</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <button
            onClick={() => { setOpen(false); navigate('/settings') }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-frost-text2 hover:text-frost-text hover:bg-frost-panel2 transition-colors"
          >
            <SettingsIcon className="w-4 h-4" /> Settings
          </button>
          <button
            onClick={() => { setOpen(false); navigate('/backups') }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-frost-text2 hover:text-frost-text hover:bg-frost-panel2 transition-colors"
          >
            <UserIcon className="w-4 h-4" /> Account Data
          </button>

          <div className="fp-divider my-1" />

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-frost-danger hover:bg-frost-danger/10 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      )}
    </div>
  )
}