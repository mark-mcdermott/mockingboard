import { useEffect } from 'react'
import { CircleAlert } from 'lucide-react'

type SizeWarningModalProps = {
  open: boolean
  onClose: () => void
  onReduceScale: () => void
}

export function SizeWarningModal({
  open,
  onClose,
  onReduceScale,
}: SizeWarningModalProps) {
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-warning-title"
      className="fixed inset-0 z-30 flex items-center justify-center bg-ink/40 px-4"
      onClick={onClose}
    >
      <div className="flex max-w-sm flex-col items-center gap-4 rounded-lg border border-edge bg-canvas p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex size-10 items-center justify-center rounded-full border border-edge">
          <CircleAlert className="size-5 text-ink" strokeWidth={1.5} />
        </div>
        <p
          id="size-warning-title"
          className="font-serif text-xl font-medium tracking-tight"
        >
          This board is too large to export.
          <br />
          Try reducing scale.
        </p>
        <div className="mt-2 flex gap-2">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-md border border-edge bg-transparent px-4 py-2 text-sm font-medium text-ink hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            Close
          </button>
          <button 
            onClick={onReduceScale}
            className="cursor-pointer rounded-md bg-ink px-4 py-2 text-sm font-medium text-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            Reduce scale
          </button>
        </div>
      </div>
    </div>
  )
}