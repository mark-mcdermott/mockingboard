import { Tile } from './Tile'

type BoardProps = {
  images: string[]
  onRemove: (src: string) => void
  ref?: React.Ref<HTMLDivElement>
}

export function Board({ images, onRemove, ref }: BoardProps) {
  return (
    <section className="py-8">
      <div
        ref={ref}
        className="columns-2 gap-4 md:columns-3 lg:columns-4"
      >
        {images.map((src) => (
          <Tile key={src} src={src} onRemove={onRemove} />

        ))}
      </div>
    </section>
  )
}