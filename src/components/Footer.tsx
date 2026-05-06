export function Footer() {
  return (
    <footer className="py-6 bg-surface text-sm text-ink-soft">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-5 md:flex-row md:items-center md:px-12">
        <p>
          Mockingboard is a free, open source tool
          <br />
          by{' '}
          <a
            href="https://floating.is"
            className="underline hover:text-ink"
          >
            floating.is
          </a>
        </p>
        <nav className="flex items-center gap-6">
          <a 
            href="https://github.com/mark-mcdermott/mockingboard"
            className="underline hover:text-ink"
          >
            Github
          </a>
          <a href="#privacy" className="hover:underline">Privacy</a>
          <a href="#terms" className="hover:underline">Terms</a>
        </nav>
      </div>
    </footer>
  )
}