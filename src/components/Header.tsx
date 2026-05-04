import { Gem } from 'lucide-react'

export function Header() {
  return (
    <header className="py-6">
      <span className="inline-flex items-center gap-1 font-serif text-xl font-medium tracking-tight">
        mockingboard
        <Gem className="size-3" strokeWidth={1.5} />
      </span>
    </header>
  )
}