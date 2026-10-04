import { useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'mockingboard:theme'

let listeners: Array<() => void> = []

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : 'system'
  } catch {
    return 'system' // localStorage unavailable (private browsing, etc)
  }
}

// React calls getSnapshot on every render, so the value is cached rather than
// re-read from localStorage each time. Every path that can change it below
// refreshes the cache first, so the two cannot drift.
let cached: Theme | null = null

function getSnapshot(): Theme {
  cached ??= readStoredTheme()
  return cached
}

// Astro prerenders the header, where there is no localStorage. React
// reconciles this with the real value after hydration without a mismatch.
function getServerSnapshot(): Theme {
  return 'system'
}

function emit() {
  listeners.forEach((l) => l())
}

function subscribe(onChange: () => void) {
  listeners = [...listeners, onChange]
  if (listeners.length === 1) {
    // The cache outlives any single mount, so it is refreshed as the store
    // wakes up; React re-reads the snapshot after subscribing and renders the
    // corrected value.
    cached = readStoredTheme()
    // A theme set in another tab writes localStorage but cannot reach this
    // one's cache. Without this the stale value survives until a full reload.
    window.addEventListener('storage', onStorage)
  }
  return () => {
    listeners = listeners.filter((l) => l !== onChange)
    if (listeners.length === 0) {
      window.removeEventListener('storage', onStorage)
    }
  }
}

function onStorage(e: StorageEvent) {
  if (e.key !== null && e.key !== STORAGE_KEY) return
  cached = readStoredTheme()
  applyTheme(cached)
  emit()
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'system') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', theme)
  }
}

export function useTheme(): [Theme, (theme: Theme) => void] {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  // The inline script in Layout.astro applies the stored theme before first
  // paint, so the only write that needs to happen here is the user's own.
  const setTheme = (next: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Preference cannot be persisted; still apply it for this session.
    }
    cached = next
    applyTheme(next)
    emit()
  }

  return [theme, setTheme]
}
