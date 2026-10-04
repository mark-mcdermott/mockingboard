import { render, type RenderResult } from '@testing-library/react'
import { vi } from 'vitest'
import type { ReactElement } from 'react'
import type { Mockup } from '../types'
import { BOARD_ACTIONS_ID } from '../lib/domIds'

/**
 * In the app the header is prerendered by Astro and the island portals its
 * Export/Clear controls into a node inside it. Tests reproduce that node —
 * inside a real <header>, since the suites locate those controls by the
 * banner role — or the controls render nowhere and every query fails.
 */
export function renderBoard(ui: ReactElement): RenderResult {
  const header = document.createElement('header')
  const mount = document.createElement('div')
  mount.id = BOARD_ACTIONS_ID
  header.append(mount)
  document.body.append(header)
  return render(ui)
}

/** Clears the header fixture between tests; called from the setup file. */
export function cleanupBoardFixture(): void {
  document.querySelectorAll('header').forEach((el) => el.remove())
}

export function imageFile(name: string, type = 'image/png'): File {
  return new File(['mockup-bytes'], name, { type })
}

/** jsdom has no DataTransfer, and FileList cannot be constructed. */
export function fileList(...files: File[]): FileList {
  return Object.assign(files.slice(), {
    item: (index: number) => files[index] ?? null,
  }) as unknown as FileList
}

export function seedBoard(...mockups: Mockup[]): void {
  localStorage.setItem('mockingboard:images', JSON.stringify(mockups))
}

export function mockup(id: string): Mockup {
  return { id, src: `data:image/png;base64,${id}`, name: `${id}.png` }
}

/** Board size drives every export decision, and jsdom reports 0x0 for everything. */
export function stubElementSize(width: number, height: number): void {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    width,
    height,
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  })
}
