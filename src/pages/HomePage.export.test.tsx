import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toPng } from 'html-to-image'
import { HomePage } from './HomePage'
import { mockup, renderWithRouter, seedBoard, stubElementSize } from '../test/utils'

vi.mock('html-to-image', () => ({ toPng: vi.fn() }))

const CANVAS_COLOR = '#fffdf7'
const FIRST_RENDER = 'data:image/png;base64,Zmlyc3Q='
const SECOND_RENDER = 'data:image/png;base64,c2Vjb25k'

let downloads: { download: string; href: string }[]

function renderBoard(width: number, height: number) {
  seedBoard(mockup('a'), mockup('b'))
  stubElementSize(width, height)
  return renderWithRouter(<HomePage />)
}

/** Lets any export that was going to start actually start. */
async function settle() {
  await act(async () => {})
}

async function exportAt(label: RegExp) {
  const user = userEvent.setup()
  await user.click(screen.getByRole('button', { name: /export png/i }))
  await user.click(screen.getByRole('menuitem', { name: label }))
}

beforeEach(() => {
  downloads = []
  vi.mocked(toPng)
    .mockResolvedValueOnce(FIRST_RENDER)
    .mockResolvedValue(SECOND_RENDER)
  document.documentElement.style.setProperty('--color-canvas', CANVAS_COLOR)
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    downloads.push({ download: this.download, href: this.href })
  })
})

describe('PNG export', () => {
  it('renders the board at the chosen scale and downloads it', async () => {
    renderBoard(800, 600)
    await exportAt(/standard/i)

    await waitFor(() => expect(downloads).toHaveLength(1))
    expect(toPng).toHaveBeenCalledWith(expect.any(HTMLElement), {
      pixelRatio: 2,
      backgroundColor: CANVAS_COLOR,
      skipFonts: true,
    })
    expect(downloads[0].download).toBe('mockingboard-2x.png')
  })

  it('exports the tiles only, not the surrounding page chrome', async () => {
    renderBoard(800, 600)
    await exportAt(/standard/i)

    await waitFor(() => expect(toPng).toHaveBeenCalled())
    const [target] = vi.mocked(toPng).mock.calls[0]
    expect(target).toContainElement(screen.getByAltText('a.png'))
    expect(target).toContainElement(screen.getByAltText('b.png'))
    expect(target).not.toContainElement(screen.getByRole('banner'))
  })

  // html-to-image misses images on a cold first pass, so the board is rendered
  // twice and the second result is the one that ships. Collapsing this back to a
  // single call is the regression this guards.
  it('renders twice and downloads the second pass', async () => {
    renderBoard(800, 600)
    await exportAt(/standard/i)

    await waitFor(() => expect(downloads).toHaveLength(1))
    expect(toPng).toHaveBeenCalledTimes(2)
    expect(downloads[0].href).toBe(SECOND_RENDER)
  })

  it('exports at 3x when Large is chosen', async () => {
    renderBoard(800, 600)
    await exportAt(/large/i)

    await waitFor(() => expect(downloads).toHaveLength(1))
    expect(toPng).toHaveBeenCalledWith(expect.any(HTMLElement), expect.objectContaining({ pixelRatio: 3 }))
    expect(downloads[0].download).toBe('mockingboard-3x.png')
  })

  it('resolves Max safe to the largest scale the board still fits at', async () => {
    renderBoard(1300, 1300)
    await exportAt(/max safe/i)

    await waitFor(() => expect(downloads).toHaveLength(1))
    expect(downloads[0].download).toBe('mockingboard-3x.png')
  })

  it('steps Max safe down as the board grows', async () => {
    renderBoard(1500, 1500)
    await exportAt(/max safe/i)

    await waitFor(() => expect(downloads).toHaveLength(1))
    expect(toPng).toHaveBeenCalledWith(expect.any(HTMLElement), expect.objectContaining({ pixelRatio: 2 }))
    expect(downloads[0].download).toBe('mockingboard-2x.png')
  })

  // dnd-kit keeps its own role="status" live region mounted, so the toast is
  // matched by its text rather than by role alone.
  it('confirms the exported scale in a dismissible toast', async () => {
    renderBoard(800, 600)
    await exportAt(/large/i)

    const toast = await screen.findByText(/^Exported PNG at 3x$/)
    expect(toast.closest('[role="status"]')).toHaveAttribute('aria-live', 'polite')

    await userEvent.setup().click(screen.getByRole('button', { name: /dismiss/i }))
    expect(screen.queryByText(/^Exported PNG at/)).not.toBeInTheDocument()
  })

  it('locks the button while a render is in flight', async () => {
    let finish: (dataUrl: string) => void = () => {}
    vi.mocked(toPng).mockReset()
    vi.mocked(toPng)
      .mockResolvedValueOnce(FIRST_RENDER)
      .mockReturnValueOnce(
        new Promise<string>((resolve) => {
          finish = resolve
        }),
      )

    renderBoard(800, 600)
    await exportAt(/standard/i)

    const button = await screen.findByRole('button', { name: /exporting/i })
    expect(button).toBeDisabled()

    finish(SECOND_RENDER)
    await waitFor(() => expect(downloads).toHaveLength(1))
    expect(screen.getByRole('button', { name: /export png/i })).toBeEnabled()
  })
})

describe('the export keyboard shortcut', () => {
  it('exports at 2x on Cmd+E', async () => {
    renderBoard(800, 600)

    fireEvent.keyDown(window, { key: 'e', metaKey: true })

    await waitFor(() => expect(downloads).toHaveLength(1))
    expect(downloads[0].download).toBe('mockingboard-2x.png')
  })

  it('ignores a bare E, so typing never triggers a download', async () => {
    renderBoard(800, 600)

    fireEvent.keyDown(window, { key: 'e' })
    await settle()
    expect(toPng).not.toHaveBeenCalled()

    // The shortcut still works with the modifier, so the board was never the reason.
    fireEvent.keyDown(window, { key: 'e', metaKey: true })
    await waitFor(() => expect(downloads).toHaveLength(1))
  })

  it('does nothing on an empty board', async () => {
    seedBoard()
    stubElementSize(800, 600)
    renderWithRouter(<HomePage />)

    fireEvent.keyDown(window, { key: 'e', metaKey: true })
    await settle()

    expect(toPng).not.toHaveBeenCalled()
    expect(downloads).toHaveLength(0)
  })
})

describe('oversized boards', () => {
  it('refuses a scale that would blow the canvas limit and offers to reduce it', async () => {
    renderBoard(2500, 2500)
    await exportAt(/large/i)

    expect(await screen.findByRole('dialog')).toHaveTextContent('Try reducing scale.')
    await settle()
    expect(toPng).not.toHaveBeenCalled()
    expect(downloads).toHaveLength(0)
  })

  it('exports at 1x when the warning offers to reduce scale', async () => {
    renderBoard(2500, 2500)
    await exportAt(/large/i)

    await userEvent.setup().click(await screen.findByRole('button', { name: /reduce scale/i }))

    await waitFor(() => expect(downloads).toHaveLength(1))
    expect(toPng).toHaveBeenCalledWith(expect.any(HTMLElement), expect.objectContaining({ pixelRatio: 1 }))
    expect(downloads[0].download).toBe('mockingboard-1x.png')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('asks for tiles to be removed when even 1x will not fit', async () => {
    renderBoard(5000, 5000)
    await exportAt(/large/i)

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveTextContent('Remove some images to make it smaller.')
    expect(screen.queryByRole('button', { name: /reduce scale/i })).not.toBeInTheDocument()
    await settle()
    expect(toPng).not.toHaveBeenCalled()
  })
})
