import { useLocalStorage } from '../hooks/useLocalStorage'
import { fileToDataUrl } from '../lib/files'
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
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { 
  IOS_CANVAS_LIMIT,
  computeMaxSafeScale,
} from '../lib/exportLimits'

export function HomePage() {
  useDocumentTitle('Mockingboard')
  
  const [images, setImages] = useLocalStorage<Mockup[]>(
    'mockingboard:images',
    [],
  )
  const [dragCount, setDragCount] = useState(0)
  const [sizeModal, setSizeModal] = useState<'reduce' | 'remove' | null>(null)
  const [showError, setShowError] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportToastScale, setExportToastScale] = useState<number | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const isDragging = dragCount > 0
  const isEmpty = images.length === 0

  useEffect(() => {
    if (!showError) return
    const timer = setTimeout(() => setShowError(false), 3000)
    return () => clearTimeout(timer)
  }, [showError])

  useEffect(() => {
    if (!exportToastScale) return
    const timer = setTimeout(() => setExportToastScale(null), 3000)
    return () => clearTimeout(timer)
  }, [exportToastScale])

  const handleFiles = async (files: FileList | null) => {
    if (!files) return
    const allFiles = Array.from(files)
    const imageFiles = allFiles.filter((f) => f.type.startsWith('image/'))

    if (imageFiles.length < allFiles.length) {
      setShowError(true)
    }

    if (imageFiles.length === 0) return

    const newImages: Mockup[] = await Promise.all(
      imageFiles.map(async (file) => ({
        id: crypto.randomUUID(),
        src: await fileToDataUrl(file),
        name: file.name,
      })),
    )
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

  const handleExport = async (scale: number) => {
    if (!boardRef.current || isExporting) return
    const { width, height } = boardRef.current.getBoundingClientRect()
    const pixelRatio = scale === 0 ? computeMaxSafeScale(width, height) : scale
    if (width * pixelRatio > IOS_CANVAS_LIMIT || height * pixelRatio > IOS_CANVAS_LIMIT) {
      const fitsAt1x =
        width <= IOS_CANVAS_LIMIT && height <= IOS_CANVAS_LIMIT
      setSizeModal(fitsAt1x ? 'reduce' : 'remove')
      return
    }
    setIsExporting(true)
    try {
      const canvasColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-canvas')
        .trim()
      const dataUrl = await toPng(boardRef.current, {
        pixelRatio,
        backgroundColor: canvasColor,
        skipFonts: true,
      })
      const link = document.createElement('a')
      link.download = `mockingboard-${pixelRatio}x.png`
      link.href = dataUrl
      link.click()
      setExportToastScale(pixelRatio)
    } finally {
      setIsExporting(false)
    }
  }
 
  const handleReduceScale = () => {
    setSizeModal(null)
    handleExport(1)
  }

  const handleRemove = (id: string) => {
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
          {sizeModal && (
            <SizeWarningModal
              mode={sizeModal}
              onClose={() => setSizeModal(null)}
              onReduceScale={handleReduceScale}
            />
          )}
          {exportToastScale !== null && (
            <ExportToast 
              scale={exportToastScale}
              onDismiss={() => setExportToastScale(null)} />
          )}
        </>
      )}
    </div>
  )
}