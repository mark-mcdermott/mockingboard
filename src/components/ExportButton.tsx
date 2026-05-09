import { useRef, useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { useClickOutside } from '../hooks/useClickOutside'

type ExportButtonProps = {
  onExport: (scale: number) => void
  isExporting?: boolean
}

const SCALES = [
  { label: 'Standard', sublabel: '2x', value: 2},
  { label: 'Large', sublabel: '3x', value: 3},
  { label: 'Max safe', sublabel: 'auto', value: 0},
]

export function ExportButton({ onExport, isExporting }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useClickOutside(containerRef, () => setIsOpen(false), isOpen)

  const handlePick = (scale: number) => {
    setIsOpen(false)
    onExport(scale)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen((open) => !open)}
        disabled={isExporting}
        className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-default disabled:opacity-70"
        >
          {isExporting ? (
            <>
              <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
                Exporting...
            </>
          ) : (
            <>
              <Download className="size-4" strokeWidth={1.5} />
              Export PNG
            </>
          )}
      </button>

      {isOpen && !isExporting && (
        <div
          role="menu"
          className="absolute right-0 top-full z-10 mt-2 w-48 overflow-hidden rounded-md border border-edge bg-canvas py-1 shadow-lg"
        >
          {SCALES.map((scale) => (
            <button
              key={scale.value}
              role="menuitem"
              onClick={() => handlePick(scale.value)}
              className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm hover:bg-surface"
            >
              <span className="text-ink">
                {scale.label}
              </span>
              <span className="text-xs text-ink-muted">{scale.sublabel}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}