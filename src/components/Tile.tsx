import { X } from 'lucide-react'
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
      {...attributes}
      {...listeners}
      className="group relative mb-4 break-inside-avoid cursor-grab"
    >
      <img
        src={image.src}
        alt={image.name}
        className="w-full rounded-md border border-edge"
      />
      <p className="mt-2 truncate px-1 font-mono text-xs text-ink-soft">
        {image.name}
      </p>
      <button
        onClick={() => onRemove(image.id)}
        aria-label="Remove image"
        className="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full bg-ink text-canvas opacity-0 shadow-md transition-opacity group-hover:opacity-100"
      >
        <X className="size=4" strokeWidth={1.5} />
      </button>
    </div> 
  )
}