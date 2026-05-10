import { useState } from 'react'
import { Tile, TileCard } from './Tile'
import type { Mockup } from '../types'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'

type BoardProps = {
  images: Mockup[]
  onRemove: (id: string) => void
  onReorder: (images: Mockup[]) => void
  ref?: React.Ref<HTMLDivElement>
}

export function Board({ images, onRemove, onReorder, ref }: BoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeImage = activeId ? images.find((img) => img.id === activeId) : null
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = images.findIndex((img) => img.id === active.id)
    const newIndex = images.findIndex((img) => img.id === over.id)
    onReorder(arrayMove(images, oldIndex, newIndex))
  }
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={images.map((img) => img.id)}
        strategy={rectSortingStrategy}
      >
        <div
          ref={ref}
          className="columns-1 gap-4 md:columns-2 lg:columns-3 xl:columns-4"
        >
          {images.map((image) => (
            <Tile key={image.id} image={image} onRemove={onRemove} />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeImage ? <TileCard image={activeImage} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}