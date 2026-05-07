import { Check, X } from 'lucide-react'

type ExportToastProps = {
  onDismiss: () => void
}

export function ExportToast({ onDismiss }: ExportToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-md border border-edge bg-canvas px-4 py-3 text-sm shadow-lg"
    >
      <Check className="size-4 text-emrald-600" strokeWidth={2} />
        <span>Exported PNG</span>
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="cursor-pointer text-ink-muted hover:text-ink"
        >
          <X className="size-4" strokeWidth={1.5} />
        </button>
    </div>
  )
}