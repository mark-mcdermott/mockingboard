import { describe, expect, it } from 'vitest'
import { fileToDataUrl } from './files'

describe('fileToDataUrl', () => {
  it('encodes a file as a data URL that keeps its mime type', async () => {
    const file = new File(['hello'], 'shot.png', { type: 'image/png' })
    await expect(fileToDataUrl(file)).resolves.toBe('data:image/png;base64,aGVsbG8=')
  })

  it('keeps each file type distinct so exported tiles are not all re-typed as png', async () => {
    const webp = new File(['hello'], 'shot.webp', { type: 'image/webp' })
    await expect(fileToDataUrl(webp)).resolves.toBe('data:image/webp;base64,aGVsbG8=')
  })
})
