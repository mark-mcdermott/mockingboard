import { Trash2 } from 'lucide-react'

type ClearButtonProps = {
  onClick: () => void
}

export function ClearButton({ onClick }: ClearButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Clear board"
      className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-edge bg-transparent px-3 py-2 text-sm font-medium text-ink-soft hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    >
      <Trash2 className="size-4" strokeWidth={1.5} />
      <span className="hidden sm:inline">Clear</span>
    </button>
  )
}