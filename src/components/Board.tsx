import { Tile } from './Tile'
import type { Mockup } from '../types'

type BoardProps = {
  images: Mockup[]
  onRemove: (id: string) => void
  ref?: React.Ref<HTMLDivElement>
}

export function Board({ images, onRemove, ref }: BoardProps) {
  return (
    <section className="py-8">
      <div
        ref={ref}
        className="columns-2 gap-4 md:columns-3 lg:columns-4"
      >
        {images.map((image) => (
          <Tile key={image.id} image={image} onRemove={onRemove} />

        ))}
      </div>
    </section>
  )
}