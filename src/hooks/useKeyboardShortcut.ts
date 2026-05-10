import { useEffect } from 'react'

export function useKeyboardShortcut(
  key: string,
  handler: (e: KeyboardEvent) => void,
  options?: { meta?: boolean; enabled?: boolean },
) {
  const meta = options?.meta ?? false
  const enabled = options?.enabled ?? true

  useEffect(() => {
    if (!enabled) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== key) return
      const hasMeta = e.metaKey || e.ctrlKey
      if (meta !== hasMeta) return
      handler(e)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [key, meta, enabled, handler])
}