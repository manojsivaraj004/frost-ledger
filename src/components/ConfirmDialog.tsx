import { AlertTriangle, Loader2 } from 'lucide-react'
import Modal from './Modal'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  loading?: boolean
}

export default function ConfirmDialog({
  open, onClose, onConfirm, title, message,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false, loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${danger ? 'bg-frost-danger/10' : 'bg-frost-warn/10'}`}>
            <AlertTriangle className={`w-5 h-5 ${danger ? 'text-frost-danger' : 'text-frost-warn'}`} />
          </div>
          <p className="text-sm text-frost-text2 pt-1.5">{message}</p>
        </div>
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onConfirm} disabled={loading} className={danger ? 'fp-btn-danger flex-1' : 'fp-btn-primary flex-1'}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : confirmLabel}
          </button>
          <button type="button" onClick={onClose} disabled={loading} className="fp-btn">{cancelLabel}</button>
        </div>
      </div>
    </Modal>
  )
}