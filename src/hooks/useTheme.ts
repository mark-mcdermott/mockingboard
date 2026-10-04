import { useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'mockingboard:theme'

let listeners: Array<() => void> = []

function subscribe(onChange: () => void) {
  listeners = [...listeners, onChange]
  return () => {
    listeners = listeners.filter((l) => l !== onChange)
  }
}

function getSnapshot(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : 'system'
  } catch {
    return 'system' // localStorage unavailable (private browsing, etc)
  }
}

// Astro prerenders the header, where there is no localStorage. React reconciles
// this with the real value after hydration without a mismatch.
function getServerSnapshot(): Theme {
  return 'system'
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
    applyTheme(next)
    listeners.forEach((l) => l())
  }

  return [theme, setTheme]
}
