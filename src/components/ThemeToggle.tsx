import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

const ICON = {
  light: Sun,
  dark: Moon,
  system: Monitor 
} as const

const NEXT_THEME = {
  light: 'dark',
  dark: 'system',
  system: 'light'
} as const

const LABEL = {
  light: 'Light mode. Click for dark.',
  dark: 'Dark mode. Click for system.',
  system: 'System theme. Click for light.',
} as const

export function ThemeToggle() {
  const [theme, setTheme] = useTheme()
  const Icon = ICON[theme]

  return (
    <button
      onClick={() => setTheme(NEXT_THEME[theme])}
      aria-label={LABEL[theme]}
      className="inline-flex cursor-pointer items-center justify-center rounded-md border border-edge bg-transparent p-2 text-ink-soft hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    >
      <Icon className="size-4" strokeWidth={1.5} />
    </button>
  )
}