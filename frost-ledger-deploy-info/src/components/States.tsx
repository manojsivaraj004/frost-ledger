import { Loader2, Snowflake } from 'lucide-react'

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return <div className="flex flex-col items-center justify-center py-20 gap-3"><Loader2 className="w-8 h-8 text-frost-accent animate-spin" /><p className="text-sm text-frost-text2">{message}</p></div>
}
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <div className="flex flex-col items-center justify-center py-20 gap-3"><Snowflake className="w-8 h-8 text-frost-danger" /><p className="text-sm text-frost-danger">{message}</p>{onRetry && <button onClick={onRetry} className="fp-btn">Retry</button>}</div>
}
export function EmptyState({ title, message, action }: { title: string; message: string; action?: React.ReactNode }) {
  return <div className="flex flex-col items-center justify-center py-20 gap-3"><Snowflake className="w-10 h-10 text-frost-text3 opacity-50" /><h3 className="text-sm font-semibold text-frost-text2">{title}</h3><p className="text-xs text-frost-text3 max-w-sm text-center">{message}</p>{action}</div>
}