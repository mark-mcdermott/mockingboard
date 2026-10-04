import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { BoardApp } from './BoardApp'
import { DEMO_IMAGES } from '../lib/demoImages'
import {
  fileList,
  imageFile,
  mockup,
  renderBoard,
  seedBoard,
} from '../test/utils'

const STORAGE_KEY = 'mockingboard:images'

function renderApp() {
  return renderBoard(<BoardApp />)
}

function tileNames(): string[] {
  return screen.getAllByRole('img').map((img) => img.getAttribute('alt') ?? '')
}

function tileFor(name: string): HTMLElement {
  const tile = screen.getByAltText(name).closest('[data-mockup-id]')
  if (!(tile instanceof HTMLElement)) throw new Error(`No tile rendered for ${name}`)
  return tile
}

/** The empty state is the only place that offers a file picker. */
function queryFilePicker(): HTMLInputElement | null {
  return document.querySelector('input[type="file"]')
}

function getFilePicker(): HTMLInputElement {
  const picker = queryFilePicker()
  if (!picker) throw new Error('No file picker on screen')
  return picker
}

/** The header's Clear control shares its accessible name with the modal's. */
function headerButton(name: RegExp) {
  return within(screen.getByRole('banner')).getByRole('button', { name })
}

function storedNames(): string[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? (JSON.parse(raw) as { name: string }[]).map((img) => img.name) : []
}

/**
 * jsdom has no DataTransfer, so the drop payload is supplied directly. The
 * island listens on the window — the page chrome it used to wrap is now
 * prerendered outside it — so that is where the event is fired.
 */
function dropFiles(...files: File[]) {
  fireEvent.drop(window, {
    dataTransfer: { files: fileList(...files) },
  })
}

/**
 * fireEvent's drag events carry no relatedTarget under jsdom, and that field is
 * exactly what separates "moved onto another element" from "left the window".
 * A MouseEvent does carry it.
 */
function dragLeaveTo(relatedTarget: EventTarget | null) {
  act(() => {
    window.dispatchEvent(
      new MouseEvent('dragleave', { bubbles: true, relatedTarget }),
    )
  })
}

describe('adding mockups', () => {
  it('starts with the demo board so a first visit is not an empty canvas', () => {
    renderApp()
    expect(tileNames()).toEqual(DEMO_IMAGES.map((img) => img.name))
  })

  it('restores a saved board instead of the demos', () => {
    seedBoard(mockup('saved-one'), mockup('saved-two'))
    renderApp()
    expect(tileNames()).toEqual(['saved-one.png', 'saved-two.png'])
  })

  it('appends dropped images to the end of the board', async () => {
    seedBoard(mockup('existing'))
    renderApp()

    dropFiles(imageFile('hero.png'), imageFile('pricing.jpg', 'image/jpeg'))

    await waitFor(() =>
      expect(tileNames()).toEqual(['existing.png', 'hero.png', 'pricing.jpg']),
    )
  })

  it('reads each dropped file into the tile it renders', async () => {
    seedBoard()
    renderApp()

    dropFiles(imageFile('hero.png'))

    const tile = await screen.findByAltText('hero.png')
    expect(tile).toHaveAttribute('src', 'data:image/png;base64,bW9ja3VwLWJ5dGVz')
  })

  it('persists dropped images so the board survives a reload', async () => {
    seedBoard(mockup('existing'))
    renderApp()

    dropFiles(imageFile('hero.png'))

    await waitFor(() => expect(storedNames()).toEqual(['existing.png', 'hero.png']))
  })

  it('accepts images picked through the empty-state file input', async () => {
    seedBoard()
    renderApp()

    await userEvent.setup().upload(getFilePicker(), imageFile('hero.png'))

    expect(await screen.findByAltText('hero.png')).toBeInTheDocument()
    expect(queryFilePicker()).not.toBeInTheDocument()
  })

  it('invites a drop while files are dragged over the page', () => {
    renderApp()

    fireEvent.dragEnter(window)
    expect(screen.getByText(/drop to add your mockups/i)).toBeInTheDocument()

    fireEvent.dragLeave(window)
    expect(screen.queryByText(/drop to add your mockups/i)).not.toBeInTheDocument()
  })

  it('keeps the invitation up while the drag moves between elements', () => {
    renderApp()

    // Moving across nested elements fires an enter for each one before the
    // matching leaves arrive; the overlay must not flicker off in between.
    fireEvent.dragEnter(window)
    fireEvent.dragEnter(window)
    dragLeaveTo(document.body)

    expect(screen.getByText(/drop to add your mockups/i)).toBeInTheDocument()
  })

  it('dismisses the invitation when the drag leaves the window unevenly', () => {
    renderApp()

    fireEvent.dragEnter(window)
    fireEvent.dragEnter(window)
    // Leaving the window reports no relatedTarget, and only one leave arrives
    // for the two enters. Unwinding the counter by one would stand the overlay
    // open for good.
    dragLeaveTo(null)

    expect(screen.queryByText(/drop to add your mockups/i)).not.toBeInTheDocument()
  })
})

describe('rejecting non-images', () => {
  it('refuses a drop of non-image files and says why', async () => {
    seedBoard(mockup('existing'))
    renderApp()

    dropFiles(new File(['notes'], 'spec.pdf', { type: 'application/pdf' }))

    expect(await screen.findByText(/only image files supported/i)).toBeInTheDocument()
    expect(tileNames()).toEqual(['existing.png'])
  })

  it('keeps the images from a mixed drop and still flags the rest', async () => {
    seedBoard()
    renderApp()

    dropFiles(
      imageFile('hero.png'),
      new File(['notes'], 'spec.pdf', { type: 'application/pdf' }),
    )

    expect(await screen.findByText(/only image files supported/i)).toBeInTheDocument()
    await waitFor(() => expect(tileNames()).toEqual(['hero.png']))
  })

  it('clears the warning on its own', async () => {
    vi.useFakeTimers()
    try {
      seedBoard(mockup('existing'))
      renderApp()

      dropFiles(new File(['notes'], 'spec.pdf', { type: 'application/pdf' }))
      expect(screen.getByText(/only image files supported/i)).toBeInTheDocument()

      await act(async () => {
        vi.advanceTimersByTime(3000)
      })
      expect(screen.queryByText(/only image files supported/i)).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('removing mockups', () => {
  it('removes the tile whose button was clicked, not its neighbours', async () => {
    seedBoard(mockup('a'), mockup('b'), mockup('c'))
    renderApp()

    await userEvent
      .setup()
      .click(within(tileFor('b.png')).getByRole('button', { name: /remove image/i }))

    expect(tileNames()).toEqual(['a.png', 'c.png'])
    await waitFor(() => expect(storedNames()).toEqual(['a.png', 'c.png']))
  })

  it('removes the focused tile on Backspace', () => {
    seedBoard(mockup('a'), mockup('b'))
    renderApp()

    tileFor('a.png').focus()
    fireEvent.keyDown(window, { key: 'Backspace' })

    expect(tileNames()).toEqual(['b.png'])
  })

  it('leaves the board alone when Backspace is pressed off a tile', () => {
    seedBoard(mockup('a'), mockup('b'))
    renderApp()

    fireEvent.keyDown(window, { key: 'Backspace' })

    expect(tileNames()).toEqual(['a.png', 'b.png'])
  })

  it('empties the board only once clearing is confirmed', async () => {
    seedBoard(mockup('a'), mockup('b'))
    renderApp()
    const user = userEvent.setup()

    await user.click(headerButton(/clear board/i))
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(tileNames()).toEqual(['a.png', 'b.png'])
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(headerButton(/clear board/i))
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: /clear board/i }),
    )

    expect(screen.queryAllByRole('img')).toHaveLength(0)
    expect(queryFilePicker()).toBeInTheDocument()
    await waitFor(() => expect(storedNames()).toEqual([]))
  })

  it('hides the export and clear controls once the board is empty', () => {
    seedBoard()
    renderApp()

    expect(screen.queryByRole('button', { name: /export png/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /clear board/i })).not.toBeInTheDocument()
  })
})
