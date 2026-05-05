import { Tile } from './Tile'
import type { Mockup } from '../types'
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
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
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = images.findIndex((img) => img.id === active.id)
    const newIndex = images.findIndex((img) => img.id === over.id)
    onReorder(arrayMove(images, oldIndex, newIndex))
  }
  return (
    <section className="py-8">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((img) => img.id)}
          strategy={rectSortingStrategy}
        >
          <div
            ref={ref}
            className="columns-2 gap-4 md:columns-3 lg:columns-4"
          >
            {images.map((image) => (
              <Tile key={image.id} image={image} onRemove={onRemove} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  )
}