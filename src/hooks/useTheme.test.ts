import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useTheme } from './useTheme'

const STORAGE_KEY = 'mockingboard:theme'

afterEach(() => {
  document.documentElement.removeAttribute('data-theme')
})

describe('useTheme', () => {
  it('falls back to the system theme when nothing is stored', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current[0]).toBe('system')
  })

  it('reads the stored preference', () => {
    localStorage.setItem(STORAGE_KEY, 'dark')
    const { result } = renderHook(() => useTheme())
    expect(result.current[0]).toBe('dark')
  })

  it('persists a change and puts it on the document', () => {
    const { result } = renderHook(() => useTheme())

    act(() => result.current[1]('dark'))

    expect(result.current[0]).toBe('dark')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('clears the attribute for the system theme rather than naming it', () => {
    const { result } = renderHook(() => useTheme())

    act(() => result.current[1]('dark'))
    act(() => result.current[1]('system'))

    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
  })

  it('picks up a theme set in another tab', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current[0]).toBe('system')

    // The snapshot is cached, so without the storage listener this write would
    // stay invisible until a full reload.
    act(() => {
      localStorage.setItem(STORAGE_KEY, 'light')
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }))
    })

    expect(result.current[0]).toBe('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })
})
