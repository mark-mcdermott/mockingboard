import { useEffect, useRef, useState } from 'react'
import type { Mockup } from '../types'
import { toPng } from 'html-to-image'
import { Header } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { Board } from '../components/Board'
import { ExportButton } from '../components/ExportButton'
import { Hero } from '../components/Hero'
import { BoardSurface } from '../components/BoardSurface'
import { PrivacyNote } from '../components/PrivacyNote'
import { ExportToast } from '../components/ExportToast'
import { SizeWarningModal } from '../components/SizeWarningModal'

export function HomePage() {
  const [images, setImages] = useState<Mockup[]>([])
  const [dragCount, setDragCount] = useState(0)
  const [showSizeModal, setShowSizeModal] = useState(false)
  const [showError, setShowError] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showExportToast, setShowExportToast] = useState(false)
  const boardRef = useRef<HTMLDivElement>(null)
  const isDragging = dragCount > 0
  const isEmpty = images.length === 0

  useEffect(() => {
    if (!showError) return
    const timer = setTimeout(() => setShowError(false), 3000)
    return () => clearTimeout(timer)
  }, [showError])

  useEffect(() => {
    if (!showExportToast) return
    const timer = setTimeout(() => setShowExportToast(false), 3000)
    return () => clearTimeout(timer)
  }, [showExportToast])

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const allFiles = Array.from(files)
    const imageFiles = allFiles.filter((f) => f.type.startsWith('image/'))

    if (imageFiles.length < allFiles.length) {
      setShowError(true)
    }

    if (imageFiles.length === 0) return

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

  const handleReorder = (newImages: Mockup[]) => {
    setImages(newImages)
  }

  const handleExport = async (pixelRatio: number = 2) => {
    if (!boardRef.current || isExporting) return
    if (pixelRatio === 2) {
      const { width, height } = boardRef.current.getBoundingClientRect()
      if (width * 2 > 4096 || height * 2 > 4096) {
        setShowSizeModal(true)
        return
      }
    }
    setIsExporting(true)
    try {
      const canvasColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-canvas')
        .trim()
      const dataUrl = await toPng(boardRef.current, {
        pixelRatio: 2,
        backgroundColor: canvasColor,
        skipFonts: true,
      })
      const link = document.createElement('a')
      link.download = 'mockingboard.png'
      link.href = dataUrl
      link.click()
      setShowExportToast(true)
    } finally {
      setIsExporting(false)
    }
  }

  const handleReduceScale = () => {
    setShowSizeModal(false)
    handleExport(1)
  }

  const handleRemove = (id: string) => {
    const target = images.find((img) => img.id === id)
    if (target) URL.revokeObjectURL(target.src)
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  return (
    <div 
      className="flex flex-1 flex-col"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="mx-auto w-full max-w-7xl flex-1 px-5 md:px-12">
        <Header>
          {!isEmpty && (<ExportButton onExport={handleExport} isExporting={isExporting} />
          )}
        </Header>
        <Hero />
        <main className="pb-8">
          <BoardSurface isDragging={isDragging} showError={showError}>
            {isEmpty ? (
              <EmptyState onFilesPicked={handleFiles} />
            ) : (
              <Board 
                ref={boardRef} 
                images={images} 
                onRemove={handleRemove} 
                onReorder={handleReorder}  
              />
            )}          
          </BoardSurface>
          <PrivacyNote />
        </main>
      </div>

      {!isEmpty && (
        <>
          {showSizeModal && (
            <SizeWarningModal
              open={showSizeModal}
              onClose={() => setShowSizeModal(false)}
              onReduceScale={handleReduceScale}
            />
          )}
          {showExportToast && (
            <ExportToast onDismiss={() => setShowExportToast(false)} />
          )}
        </>
      )}
    </div>
  )
}