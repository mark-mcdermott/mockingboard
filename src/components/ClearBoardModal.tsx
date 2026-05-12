import { useEffect } from 'react'
import { RotateCcw } from 'lucide-react'

type ClearBoardModalProps = {
  onClose: () => void
  onConfirm: () => void
}

export function ClearBoardModal({
  onClose,
  onConfirm,
}: ClearBoardModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="clear-board-title"
      className="fixed inset-0 z-30 flex items-center justify-center bg-ink/40 px-4"
      onClick={onClose}
    >
      <div
        className="flex max-w-sm flex-col items-center gap-4 rounded-lg border border-edge bg-canvas p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex size-10 items-center justify-center rounded-full border border-edge">
          <RotateCcw className="size-5 text-ink" strokeWidth={1.5} />
        </div>
        <p 
          id="clear-board-title"
          className="font-serif text-xl font-medium tracking-tight"
        >
          Clear all images from the board?
          <br />
          This can't be undone.
        </p>
        <div className="mt-2 flex gap-2">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-md border border-edge bg-transparent px-4 py-2 text-sm font-medium text-ink hover:bg-surface focus-visible:rinkoutline-none focus-visible:ring-2 focus-visible:ring-ink focus visible:ring-offset-2 focus visible:ring-offset-canvas"
            >
              Cancel
            </button>
            <button
            onClick={onConfirm}
            className="cursor-pointer rounded-md border border-edge bg-transparent px-4 py-2 text-sm font-medium text-ink hover:bg-surface focus-visible:rinkoutline-none focus-visible:ring-2 focus-visible:ring-ink focus visible:ring-offset-2 focus visible:ring-offset-canvas"
            >
              Clear board
            </button>
        </div>
      </div>
    </div>
  )
}