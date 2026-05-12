import { RotateCcw } from 'lucide-react'

type ClearButtonProps = {
  onClick: () => void
}

export function ClearButton({ onClick }: ClearButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Clear board"
      className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-edge bg-transparent p-3 text-ink-soft hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    >
      <RotateCcw className="size-3" strokeWidth={1.5} />
      <span className="hidden sm:inline"></span>
    </button>
  )
}