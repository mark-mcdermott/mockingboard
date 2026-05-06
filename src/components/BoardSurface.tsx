import { Upload, FileX } from 'lucide-react'

type BoardSurfaceProps = {
  children: React.ReactNode
  isDragging?: boolean
  showError?: boolean
}

export function BoardSurface({ children, isDragging, showError }:
   BoardSurfaceProps) {
  return (
    <section 
      className={`relative rounded-lg border border-dashed p-4 transition-colors md:p-6 ${
      isDragging ? 'border-ink-muted' : 'border-edge'
    }`}
    >
      <div>
        {children}
      </div>
      {isDragging && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center bg-canvas">
          <div className="rounded-full border border-edge p-4 shadow-md">
            <Upload className="size-8 text-ink" strokeWidth={1.25} />
          </div>
          <p className="font-serif text-2xl font-medium tracking-tight">
            Drop to add your mockups
          </p>
          <p className="text-sm text-ink-soft">
            PNG, JPG, WebP up to 50MB
          </p>
        </div>
      )}

      {showError && !isDragging && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-canvas px-4 text-center">
          <div className="rounded-md border border-edge p-3">
            <FileX className="size-6 text-ink-muted" strokeWidth={1.25} />
          </div>
          <p className="font-serif text-xl font-medium tracking-tight">
            Only image files supported
          </p>
          <p className="text-sm text-ink-soft">
            Please try dragging image files like PNG, JPG or WEBP.
          </p>
        </div>
      )}
    </section>
  )
}