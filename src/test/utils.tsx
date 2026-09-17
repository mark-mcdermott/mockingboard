import { render, type RenderResult } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import type { ReactElement } from 'react'
import type { Mockup } from '../types'

export function renderWithRouter(ui: ReactElement): RenderResult {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
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
