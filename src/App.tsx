import { Gem } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        <header className="py-6">
          <span className="inline-flex items-center gap-1 font-serif text-xl font-medium tracking-tight">
            mockingboard
            <Gem className="size-3" strokeWidth={1.5} />
          </span>
        </header>
        <main>
          <section className="py-16 md:py-24">
            <h1 className="font-serif font-medium tracking-tight text-3xl md:text-5xl">
              Drop mockups. Arrange freely. Export one beautiful PNG.
            </h1>
            <p className="mt-6 text-base md:text-lg text-ink-soft">
              Drag images in to get started.
            </p>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App