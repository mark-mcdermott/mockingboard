import { X, GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Mockup } from '../types'

type TileCardProps = {
  image: Mockup
  isOverlay?: boolean
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
  children?: React.ReactNode
}

export function TileCard({ 
  image, 
  isOverlay = false,
  dragHandleProps,
  children,  
}: TileCardProps) {
  return (
    <div
      className={`overflow-hidden rounded-md border-edge bg-surface ${
        isOverlay ? 'scale-[1.03] shadow-2xl' : ''
      }`}
    >
      <div
        {...dragHandleProps}
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
      className="group mb-4 break-inside-avoid"
    >
      <TileCard
        image={image}
        dragHandleProps={{ ...attributes, ...listeners }}
      >
        <button
          onClick={() => onRemove(image.id)}
          aria-label="Remove image"
          className="absolute left-2 top-2 inline-flex size-6 cursor-pointer items-center justify-center rounded-full border border-edge bg-canvas/70 text-ink opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-canvas focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          <X className="size-3.5" strokeWidth={1.25} />
        </button>
      </TileCard>
    </div>
  )
}