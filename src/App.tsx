import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { Header } from './components/Header'
import { EmptyState } from './components/EmptyState'
import { Board } from './components/Board'
import { ExportButton } from './components/ExportButton'

function App() {
  const [images, setImages] = useState<string[]>([])
  const [dragCount, setDragCount] = useState(0)
  const boardRef = useRef<HTMLDivElement>(null)
  const isDragging = dragCount > 0
  const isEmpty = images.length === 0

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const urls = Array.from(files).map((file) => URL.createObjectURL(file))
    setImages((prev) => [...prev, ...urls])
  }

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

  const handleExport = async () => {
    if (!boardRef.current) return
    const canvasColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-canvas')
      .trim()
    const dataUrl = await toPng(boardRef.current, {
      pixelRatio: 2,
      backgroundColor: canvasColor
    })
    const link = document.createElement('a')
    link.download = 'mockingboard.png'
    link.href = dataUrl
    link.click()
  }

  const handleRemove = (src: string) => {
    setImages((prev) => prev.filter((s) => s !== src))
    URL.revokeObjectURL(src)
  }

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
        <Header />
        <main>
          {isEmpty ? (
            <EmptyState onFilesPicked={handleFiles} />
          ) : (
            <Board images={images} onRemove={handleRemove} ref={boardRef} />
          )}          
        </main>
      </div>

      {!isEmpty && (
        <ExportButton onExport={handleExport} />
      )}
    </div>
  )
}

export default App