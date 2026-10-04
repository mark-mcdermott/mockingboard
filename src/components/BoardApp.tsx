import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { toPng } from 'html-to-image'
import type { Mockup } from '../types'
import { Board } from './Board'
import { BoardSurface } from './BoardSurface'
import { ClearBoardModal } from './ClearBoardModal'
import { ClearButton } from './ClearButton'
import { EmptyState } from './EmptyState'
import { ExportButton } from './ExportButton'
import { ExportToast } from './ExportToast'
import { SizeWarningModal } from './SizeWarningModal'
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DEMO_IMAGES } from '../lib/demoImages'
import { BOARD_ACTIONS_ID } from '../lib/domIds'
import { IOS_CANVAS_LIMIT, computeMaxSafeScale } from '../lib/exportLimits'
import { fileToDataUrl } from '../lib/files'

export function BoardApp() {
  const [images, setImages] = useLocalStorage<Mockup[]>(
    'mockingboard:images',
    DEMO_IMAGES,
  )
  const [dragCount, setDragCount] = useState(0)
  const [sizeModal, setSizeModal] = useState<'reduce' | 'remove' | null>(null)
  const [showError, setShowError] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)
  const [exportToastScale, setExportToastScale] = useState<number | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  // This island is client:only, so the prerendered header is already in the
  // DOM on first render and the mount node can be read straight away.
  const [actionsMount] = useState(() =>
    document.getElementById(BOARD_ACTIONS_ID),
  )
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

  const handleFiles = useCallback(async (files: FileList | null) => {
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
  }, [setImages])

  // Page-level drag target. These were JSX handlers on a div wrapping the
  // whole page; the header and footer now render outside this island, so the
  // listeners go on the window to keep the entire page a drop zone.
  useEffect(() => {
    const onEnter = (e: DragEvent) => {
      e.preventDefault()
      setDragCount((c) => c + 1)
    }
    const onLeave = (e: DragEvent) => {
      e.preventDefault()
      // Leaving the window reports no relatedTarget. Without this the counter
      // only unwinds one enter per leave, so a pair missed on the way out --
      // dragging off the window quickly, or over devtools -- strands the
      // "drop to add" overlay open until the next drop.
      if (!e.relatedTarget) {
        setDragCount(0)
        return
      }
      setDragCount((c) => Math.max(0, c - 1))
    }
    const onOver = (e: DragEvent) => e.preventDefault()
    const onDrop = (e: DragEvent) => {
      e.preventDefault()
      setDragCount(0)
      void handleFiles(e.dataTransfer?.files ?? null)
    }
    const onEnd = () => setDragCount(0)

    window.addEventListener('dragenter', onEnter)
    window.addEventListener('dragleave', onLeave)
    window.addEventListener('dragover', onOver)
    window.addEventListener('drop', onDrop)
    window.addEventListener('dragend', onEnd)
    return () => {
      window.removeEventListener('dragenter', onEnter)
      window.removeEventListener('dragleave', onLeave)
      window.removeEventListener('dragover', onOver)
      window.removeEventListener('drop', onDrop)
      window.removeEventListener('dragend', onEnd)
    }
  }, [handleFiles])

  const handleReorder = (newImages: Mockup[]) => {
    setImages(newImages)
  }

  const handleClear = () => {
    setImages([])
    setShowClearModal(false)
  }

  const handleExport = async (scale: number) => {
    if (!boardRef.current || isExporting) return
    const { width, height } = boardRef.current.getBoundingClientRect()
    const pixelRatio = scale === 0 ? computeMaxSafeScale(width, height) : scale
    if (width * pixelRatio > IOS_CANVAS_LIMIT || height * pixelRatio > IOS_CANVAS_LIMIT) {
      const fitsAt1x = width <= IOS_CANVAS_LIMIT && height <= IOS_CANVAS_LIMIT
      setSizeModal(fitsAt1x ? 'reduce' : 'remove')
      return
    }
    setIsExporting(true)
    try {
      const canvasColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-canvas')
        .trim()
      const options = { pixelRatio, backgroundColor: canvasColor, skipFonts: true }
      await toPng(boardRef.current, options)
      const dataUrl = await toPng(boardRef.current, options)
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

  const handleFocusedTileDelete = (e: KeyboardEvent) => {
    const active = document.activeElement
    if (!(active instanceof HTMLElement)) return
    if (
      active instanceof HTMLInputElement ||
      active instanceof HTMLTextAreaElement
    ) {
      return
    }
    const tile = active?.closest('[data-mockup-id]')
    if (!tile) return
    const id = tile.getAttribute('data-mockup-id')
    if (!id) return
    e.preventDefault()
    handleRemove(id)
  }

  useKeyboardShortcut('Backspace', handleFocusedTileDelete)
  useKeyboardShortcut('Delete', handleFocusedTileDelete)
  useKeyboardShortcut(
    'e',
    (e) => {
      if (isEmpty || isExporting) return
      e.preventDefault()
      handleExport(2)
    },
    { meta: true },
  )

  return (
    <>
      {actionsMount &&
        !isEmpty &&
        createPortal(
          <>
            <ExportButton onExport={handleExport} isExporting={isExporting} />
            <ClearButton onClick={() => setShowClearModal(true)} />
          </>,
          actionsMount,
        )}

      <BoardSurface ref={boardRef} isDragging={isDragging} showError={showError}>
        {isEmpty ? (
          <EmptyState onFilesPicked={handleFiles} />
        ) : (
          <Board
            images={images}
            onRemove={handleRemove}
            onReorder={handleReorder}
          />
        )}
      </BoardSurface>

      {!isEmpty && (
        <>
          {sizeModal && (
            <SizeWarningModal
              mode={sizeModal}
              onClose={() => setSizeModal(null)}
              onReduceScale={handleReduceScale}
            />
          )}
          {showClearModal && (
            <ClearBoardModal
              onClose={() => setShowClearModal(false)}
              onConfirm={handleClear}
            />
          )}
          {exportToastScale !== null && (
            <ExportToast
              scale={exportToastScale}
              onDismiss={() => setExportToastScale(null)}
            />
          )}
        </>
      )}
    </>
  )
}
