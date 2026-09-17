import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { ReactNode } from 'react'
import type { Mockup } from '../types'
import { Board } from './Board'
import { mockup } from '../test/utils'

// Pointer-driven sorting needs real layout, which jsdom does not have. Stubbing
// the dnd-kit shell lets these tests drive the drag contract Board actually
// implements — which tile moved where — with arrayMove left as the real thing.
const dnd: {
  onDragStart?: (event: DragStartEvent) => void
  onDragEnd?: (event: DragEndEvent) => void
} = {}
let sortableItems: string[] = []

vi.mock('@dnd-kit/core', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@dnd-kit/core')>()),
  DndContext: ({
    children,
    onDragStart,
    onDragEnd,
  }: {
    children: ReactNode
    onDragStart: (event: DragStartEvent) => void
    onDragEnd: (event: DragEndEvent) => void
  }) => {
    dnd.onDragStart = onDragStart
    dnd.onDragEnd = onDragEnd
    return <>{children}</>
  },
  DragOverlay: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

vi.mock('@dnd-kit/sortable', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@dnd-kit/sortable')>()),
  SortableContext: ({ children, items }: { children: ReactNode; items: string[] }) => {
    sortableItems = items
    return <>{children}</>
  },
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
}))

function dragEnd(activeId: string, overId: string | null): DragEndEvent {
  return {
    active: { id: activeId },
    over: overId === null ? null : { id: overId },
  } as unknown as DragEndEvent
}

function tileOrder(): string[] {
  return screen
    .getAllByRole('img')
    .map((img) => img.getAttribute('alt') ?? '')
}

const images = [mockup('a'), mockup('b'), mockup('c'), mockup('d')]
let onReorder: Mock<(images: Mockup[]) => void>
let onRemove: Mock<(id: string) => void>

function renderBoard() {
  return render(<Board images={images} onRemove={onRemove} onReorder={onReorder} />)
}

beforeEach(() => {
  onReorder = vi.fn()
  onRemove = vi.fn()
})

describe('Board arrangement', () => {
  it('lays tiles out in board order', () => {
    renderBoard()
    expect(tileOrder()).toEqual(['a.png', 'b.png', 'c.png', 'd.png'])
  })

  it('registers sortable ids in board order, so drop targets match what is on screen', () => {
    renderBoard()
    expect(sortableItems).toEqual(['a', 'b', 'c', 'd'])
  })

  it('moves a tile forward to the slot it was dropped on', () => {
    renderBoard()
    act(() => dnd.onDragEnd?.(dragEnd('a', 'c')))
    expect(onReorder).toHaveBeenCalledWith([
      images[1],
      images[2],
      images[0],
      images[3],
    ])
  })

  it('moves a tile backward to the slot it was dropped on', () => {
    renderBoard()
    act(() => dnd.onDragEnd?.(dragEnd('d', 'b')))
    expect(onReorder).toHaveBeenCalledWith([
      images[0],
      images[3],
      images[1],
      images[2],
    ])
  })

  it('shifts only the tiles between source and target', () => {
    renderBoard()
    act(() => dnd.onDragEnd?.(dragEnd('b', 'c')))
    expect(onReorder).toHaveBeenCalledWith([
      images[0],
      images[2],
      images[1],
      images[3],
    ])
  })

  it('hands back a new array rather than sorting the board in place', () => {
    renderBoard()
    act(() => dnd.onDragEnd?.(dragEnd('a', 'd')))
    const next = onReorder.mock.calls[0][0]
    expect(next).not.toBe(images)
    expect(images).toEqual([mockup('a'), mockup('b'), mockup('c'), mockup('d')])
  })

  it('ignores a tile dropped back onto itself', () => {
    renderBoard()
    act(() => dnd.onDragEnd?.(dragEnd('b', 'b')))
    expect(onReorder).not.toHaveBeenCalled()
  })

  it('ignores a tile dropped outside every slot', () => {
    renderBoard()
    act(() => dnd.onDragEnd?.(dragEnd('b', null)))
    expect(onReorder).not.toHaveBeenCalled()
  })

  it('previews the tile being dragged in the drag overlay', () => {
    renderBoard()
    expect(screen.getAllByAltText('c.png')).toHaveLength(1)
    act(() =>
      dnd.onDragStart?.({ active: { id: 'c' } } as unknown as DragStartEvent),
    )
    expect(screen.getAllByAltText('c.png')).toHaveLength(2)
  })
})
