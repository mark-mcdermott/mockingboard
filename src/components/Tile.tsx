import { X, GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Mockup } from '../types'

type TileProps = {
  image: Mockup
  onRemove: (src: string) => void
}

export function Tile({ image, onRemove }: TileProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group mb-4 break-inside-avoid overflow-hidden rounded-md border border-edge bg-surface"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex cursor-grab items-center justify-between gap-2 px-3 py-2 active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-insert focus-visible:ring-ink"
      >
        <span className="truncate font-mono text-xs text-ink-soft">
          {image.name}
        </span>
        <GripVertical
          className="size-3.5 shrink-0 text-ink-muted"
          strokeWidth={1.5}
        />
      </div>
      <div className="relative">
        <img
          src={image.src}
          alt={image.name}
          draggable={false}
          className="block w-full"
        />
        <button 
          onClick={() => onRemove(image.id)}
          aria-label="Remove image"
          className="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full bg-ink text-canvas opacity-0 shadow-md transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          <X className="size-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}