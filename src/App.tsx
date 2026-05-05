import { useEffect, useRef, useState } from 'react'
import type { Mockup } from './types'
import { toPng } from 'html-to-image'
import { Header } from './components/Header'
import { EmptyState } from './components/EmptyState'
import { Board } from './components/Board'
import { ExportButton } from './components/ExportButton'

function App() {
  const [images, setImages] = useState<Mockup[]>([])
  const [dragCount, setDragCount] = useState(0)
  const [boardTooLarge, setBoardTooLarge] = useState(false)
  const boardRef = useRef<HTMLDivElement>(null)
  const isDragging = dragCount > 0
  const isEmpty = images.length === 0

  useEffect(() => {
    const board = boardRef.current
    if (!board) {
      setBoardTooLarge(false)
      return
    }
    const observer = new ResizeObserver(() => {
      const { width, height } = board.getBoundingClientRect()
      setBoardTooLarge(width * 2 > 4096 || height * 2 > 4096)
    })
    observer.observe(board)
    return () => observer.disconnect()
  }, [images])

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const newImages: Mockup[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      src: URL.createObjectURL(file),
      name: file.name,
    }))
    setImages((prev) => [...prev, ...newImages])
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

  const handleRemove = (id: string) => {
    const target = images.find((img) => img.id === id)
    if (target) URL.revokeObjectURL(target.src)
    setImages((prev) => prev.filter((img) => img.id !== id))
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
        <>
          {boardTooLarge && (
            <div className="fixed bottom-20 right-6 z-10 max-w-xs rounded-md bg-surface px-3 py-2 text-xs text-ink-soft shadow-md">
              This board is huge. Export may fail in some browsers.
            </div>
          )}
          <ExportButton onExport={handleExport} />
        </>
      )}
    </div>
  )
}

export default App