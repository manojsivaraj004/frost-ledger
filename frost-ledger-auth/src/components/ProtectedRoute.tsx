import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Snowflake } from 'lucide-react'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-frost-bg">
        <div className="flex flex-col items-center gap-4">
          <Snowflake className="w-10 h-10 text-frost-accent animate-pulse text-glow" />
          <p className="text-sm text-frost-text2 tracking-wider">Initializing system...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}