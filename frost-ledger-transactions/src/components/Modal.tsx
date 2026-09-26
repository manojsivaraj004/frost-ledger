import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps { open: boolean; onClose: () => void; title: string; children: ReactNode }

export default function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative fp-panel p-6 w-full max-w-md max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold text-frost-text tracking-wide">{title}</h3><button onClick={onClose} className="text-frost-text3 hover:text-frost-text"><X className="w-5 h-5" /></button></div>
        {children}
      </div>
    </div>
  )
}