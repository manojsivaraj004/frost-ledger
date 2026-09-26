import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Snowflake, Mail, Lock, User, Loader2, AlertCircle, Flame } from 'lucide-react'

export default function Auth() {
  const { signIn, signUp, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: string })?.from || '/'

  useEffect(() => {
    if (user) navigate(from, { replace: true })
  }, [user, navigate, from])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    const { error } =
      mode === 'signin'
        ? await signIn(email, password)
        : await signUp(email, password)
    setLoading(false)

    if (error) {
      setError(error)
    } else if (mode === 'signup') {
      setError('Check your email for a confirmation link, then sign in.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-frost-bg p-4 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-frost-radial" />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-frost-accent/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <Snowflake className="w-14 h-14 text-frost-accent text-glow" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-frost-text">FROST LEDGER</h1>
          <p className="text-xs uppercase tracking-[0.25em] text-frost-text3 mt-1.5">
            Survival Finance
          </p>
        </div>

        {/* Card */}
        <div className="fp-panel p-6 relative">
          {/* Corner rivets */}
          <div className="fp-rivet top-2 left-2" />
          <div className="fp-rivet top-2 right-2" />
          <div className="fp-rivet bottom-2 left-2" />
          <div className="fp-rivet bottom-2 right-2" />

          {/* Mode toggle */}
          <div className="flex gap-1 p-1 bg-frost-bg rounded-md mb-6 border border-frost-border">
            <button
              onClick={() => { setMode('signin'); setError(null) }}
              className={`flex-1 py-2 rounded text-sm font-medium transition-all ${
                mode === 'signin'
                  ? 'bg-frost-accent2/20 text-frost-accent border border-frost-accent2/40'
                  : 'text-frost-text3 hover:text-frost-text2'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null) }}
              className={`flex-1 py-2 rounded text-sm font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-frost-accent2/20 text-frost-accent border border-frost-accent2/40'
                  : 'text-frost-text3 hover:text-frost-text2'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="fp-label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-frost-text3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="fp-input pl-10"
                  placeholder="survivor@frostland.net"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="fp-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-frost-text3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="fp-input pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Confirm password (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="fp-label">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-frost-text3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="fp-input pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-frost-danger/10 border border-frost-danger/30">
                <AlertCircle className="w-4 h-4 text-frost-danger shrink-0 mt-0.5" />
                <p className="text-xs text-frost-danger">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="fp-btn-primary w-full !py-2.5"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === 'signin' ? (
                <>
                  <User className="w-4 h-4" /> Enter the City
                </>
              ) : (
                <>
                  <Snowflake className="w-4 h-4" /> Register Survivor
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="fp-divider my-5" />

          {/* Footer hint */}
          <div className="flex items-center gap-2 text-xs text-frost-text3">
            <Flame className="w-3.5 h-3.5 text-ember" />
            <span>
              {mode === 'signin'
                ? 'The generator hums. Access your records.'
                : 'New survivors must confirm their email before entry.'}
            </span>
          </div>
        </div>

        {/* Back to home */}
        <button
          onClick={() => navigate('/')}
          className="block mx-auto mt-4 text-xs text-frost-text3 hover:text-frost-text2 transition-colors"
        >
          ← Return to overview
        </button>
      </div>
    </div>
  )
}