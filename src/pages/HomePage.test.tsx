import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { HomePage } from './HomePage'
import { DEMO_IMAGES } from '../lib/demoImages'
import {
  fileList,
  imageFile,
  mockup,
  renderWithRouter,
  seedBoard,
} from '../test/utils'

const STORAGE_KEY = 'mockingboard:images'

function renderBoard() {
  return renderWithRouter(<HomePage />)
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

/** jsdom has no DataTransfer, so the drop payload is supplied directly. */
function dropFiles(...files: File[]) {
  fireEvent.drop(screen.getByRole('main'), {
    dataTransfer: { files: fileList(...files) },
  })
}

describe('adding mockups', () => {
  it('starts with the demo board so a first visit is not an empty canvas', () => {
    renderBoard()
    expect(tileNames()).toEqual(DEMO_IMAGES.map((img) => img.name))
  })

  it('restores a saved board instead of the demos', () => {
    seedBoard(mockup('saved-one'), mockup('saved-two'))
    renderBoard()
    expect(tileNames()).toEqual(['saved-one.png', 'saved-two.png'])
  })

  it('appends dropped images to the end of the board', async () => {
    seedBoard(mockup('existing'))
    renderBoard()

    dropFiles(imageFile('hero.png'), imageFile('pricing.jpg', 'image/jpeg'))

    await waitFor(() =>
      expect(tileNames()).toEqual(['existing.png', 'hero.png', 'pricing.jpg']),
    )
  })

  it('reads each dropped file into the tile it renders', async () => {
    seedBoard()
    renderBoard()

    dropFiles(imageFile('hero.png'))

    const tile = await screen.findByAltText('hero.png')
    expect(tile).toHaveAttribute('src', 'data:image/png;base64,bW9ja3VwLWJ5dGVz')
  })

  it('persists dropped images so the board survives a reload', async () => {
    seedBoard(mockup('existing'))
    renderBoard()

    dropFiles(imageFile('hero.png'))

    await waitFor(() => expect(storedNames()).toEqual(['existing.png', 'hero.png']))
  })

  it('accepts images picked through the empty-state file input', async () => {
    seedBoard()
    renderBoard()

    await userEvent.setup().upload(getFilePicker(), imageFile('hero.png'))

    expect(await screen.findByAltText('hero.png')).toBeInTheDocument()
    expect(queryFilePicker()).not.toBeInTheDocument()
  })

  it('invites a drop while files are dragged over the page', () => {
    renderBoard()
    const surface = screen.getByRole('main')

    fireEvent.dragEnter(surface)
    expect(screen.getByText(/drop to add your mockups/i)).toBeInTheDocument()

    fireEvent.dragLeave(surface)
    expect(screen.queryByText(/drop to add your mockups/i)).not.toBeInTheDocument()
  })
})

describe('rejecting non-images', () => {
  it('refuses a drop of non-image files and says why', async () => {
    seedBoard(mockup('existing'))
    renderBoard()

    dropFiles(new File(['notes'], 'spec.pdf', { type: 'application/pdf' }))

    expect(await screen.findByText(/only image files supported/i)).toBeInTheDocument()
    expect(tileNames()).toEqual(['existing.png'])
  })

  it('keeps the images from a mixed drop and still flags the rest', async () => {
    seedBoard()
    renderBoard()

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
      renderBoard()

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
    renderBoard()

    await userEvent
      .setup()
      .click(within(tileFor('b.png')).getByRole('button', { name: /remove image/i }))

    expect(tileNames()).toEqual(['a.png', 'c.png'])
    await waitFor(() => expect(storedNames()).toEqual(['a.png', 'c.png']))
  })

  it('removes the focused tile on Backspace', () => {
    seedBoard(mockup('a'), mockup('b'))
    renderBoard()

    tileFor('a.png').focus()
    fireEvent.keyDown(window, { key: 'Backspace' })

    expect(tileNames()).toEqual(['b.png'])
  })

  it('leaves the board alone when Backspace is pressed off a tile', () => {
    seedBoard(mockup('a'), mockup('b'))
    renderBoard()

    fireEvent.keyDown(window, { key: 'Backspace' })

    expect(tileNames()).toEqual(['a.png', 'b.png'])
  })

  it('empties the board only once clearing is confirmed', async () => {
    seedBoard(mockup('a'), mockup('b'))
    renderBoard()
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
    renderBoard()

    expect(screen.queryByRole('button', { name: /export png/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /clear board/i })).not.toBeInTheDocument()
  })
})
