import { X } from 'lucide-react'

type TileProps = {
  src: string
  onRemove: (src: string) => void
}

export function Tile({ src, onRemove }: TileProps) {
  return (
    <div key={src} className="group relative mb-4 break-inside-avoid">
      <img
        src={src}
        alt=""
        className="w-full rounded-md border border-edge"
      />
      <button
        onClick={() => onRemove(src)}
        aria-label="Remove image"
        className="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full bg-ink text-canvas opacity-0 shadow-md transition-opacity group-hover:opacity-100"
      >
        <X className="size=4" strokeWidth={1.5} />
      </button>
    </div> 
  )
}