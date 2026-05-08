import { Link } from 'react-router'
import { Header } from '../components/Header'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Page not found — Mockingboard')

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-5 md:px-12">
      <Header />
      <main className="py-16 text-center">
        <h1 className="font-serif text-7xl font-medium tracking-tight md:text-8xl">
          404
        </h1>
        <p className="mt-4 font-serif text-2xl text-ink">Page not found</p>
        <p className="mx-auto mt-6 max-w-md text-ink-soft">
          We couldn't find the page you're lookgin for. It may have been moved or doesn't exist.
        </p>

        <div className="mt-10 flex items-center justify-center gap-3">
          <Link 
            to="/"
            className="inline-flex items-center rounded-md bg-ink px-4 py-2 text-sm font-medium text-canvas hover:opacity-90 focus:outline-none focus"
          >
            Go home
          </Link>
          <a
            href="https://github.com/mark-mcdermott/mockingboard"
            className="inline-flex items-center rounded-md border border-edge px-4 py-2 text-sm font-medium text-ink hover:bg-surface focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 focus:ring-offset-canvas"
          >
            View on GitHub
          </a>
        </div>

        <div
          aria-hidden="true"
          className="mx-auto mt-20 flex w-full max-w-md justify-center gap-3 rounded-2xl border border-dashed border-edge p-6"
        >
          <div className="h-20 w-24 -rotate-3 rounded bg-surface" />
          <div className="h-20 w-24 rotate-1 rounded bg-surface" />
          <div className="h-20 w-24 rotate-3 rounded bg-surface" />
        </div>
      </main>
    </div>
  )
}