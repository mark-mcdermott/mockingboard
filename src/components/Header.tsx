import { Gem } from 'lucide-react'

type HeaderProps = {
  children?: React.ReactNode
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 py-4 md:py-6">
      <div className="inline-flex flex-col">
        <span className="inline-flex items-center gap-1 font-serif text-lg font-medium tracking-tight md:text-xl">
        mockingboard
          <Gem className="size-3" strokeWidth={1.5} />
        </span>
        <span className="font-mono text-xs text-ink-soft">
          by floating.is
        </span>
      </div>
      {children}
    </header>
  )
}