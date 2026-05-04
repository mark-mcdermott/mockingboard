import { useState } from 'react'
import { Gem } from 'lucide-react'

function App() {
  const [images, setImages] = useState<string[]>([])
  const [dragCount, setDragCount] = useState(0)
  const isDragging = dragCount > 0

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setDragCount((c) => c + 1)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragCount((c) => c - 1)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragCount(0)
    handleFiles(e.dataTransfer.files)
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const urls = Array.from(files).map((file) => URL.createObjectURL(file))
    setImages((prev) => [...prev, ...urls])
  }

  const isEmpty = images.length === 0

  return (
    <div 
      className={`min-h-screen text-ink transition-colors
    ${
        isDragging
          ? 'bg-surface ring-2 ring-inset ring-ink-muted'
          : 'bg-canvas'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        <header className="py-6">
          <span className="inline-flex items-center gap-1 font-serif text-xl font-medium tracking-tight">
            mockingboard
            <Gem className="size-3" strokeWidth={1.5} />
          </span>
        </header>
        <main>
          {isEmpty ? (
            <section className="py-16 md:py-24">
              <h1 className="font-serif font-medium tracking-tight text-3xl md:text-5xl">
                Drop mockups. Arrange freely. Export one beautiful PNG.
              </h1>
              <p className="mt-6 text-base md:text-lg text-ink-soft">
                Drag images in to get started.
              </p>
              <label className="mt-8 inline-flex cursor-pointer items-center rounded-md bg-ink px-4 py-2 text-sm font-medium text-canvas">
                Choose images
                <input 
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </label>
            </section>
          ) : (
            <section className="py-8">
              <div className="columns-2 gap-4 md:columns-3 lg:colums-4">
                {images.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="mb-4 w-full break-inside-avoid rounded-md border border-edge"
                  />
                ))}  
              </div> 
            </section>
          )}          
        </main>
      </div>
    </div>
  )
}

export default App