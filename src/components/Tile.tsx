import { X, GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Mockup } from '../types'

type TileCardProps = {
  image: Mockup
  isOverlay?: boolean
  children?: React.ReactNode
}

export function TileCard({
  image,
  isOverlay = false,
  children,
}: TileCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-md border-edge bg-surface ${
        isOverlay ? 'scale-[1.03] shadow-2xl' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-edge-soft bg-canvas-soft px-3 py-2">
        <span className="truncate font-mono text-xs text-ink">
          {image.name}
        </span>
        <GripVertical
          className="size-3.5 shrink-0 text-ink-muted"
          strokeWidth={1.5}
        />
      </div>
      <div>
        <img
          src={image.src}
          alt={image.name}
          draggable={false}
          className="block w-full"
        />
        {children}
      </div>
    </div>
  )
}

type TileProps = {
  image: Mockup
  onRemove: (id: string) => void
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
      data-mockup-id={image.id}
      {...attributes}
      {...listeners}
      className="group mb-4 cursor-grab rounded-md border border-edge-soft shadow-xs break-inside-avoid transition duration-200 hover:-translate-y-px hover:shadow-md active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
    >
      <TileCard image={image}>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onRemove(image.id)}
          aria-label="Remove image"
          className="absolute left-2 top-1 inline-flex size-6 cursor-pointer items-center justify-center rounded-full border border-edge bg-canvas/70 text-ink opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-canvas focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          <X className="size-3.5" strokeWidth={1.25} />
        </button>
      </TileCard>
    </div>
  )
}