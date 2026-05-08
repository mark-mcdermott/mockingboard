import { Link } from 'react-router'
import { Header } from '../components/Header'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Page not found — Mockingboard')

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-5 md:px-12">
      <Header />
      <main className="py-16 text-center">
        <h1 className="font-serif text-7xl font-medium tracking-tight">
          404
        </h1>
        <p className="mt-4 font-serif text-2xl">Page not found</p>
        <Link 
          to="/"
          className="mt-12 inline-flex rounded-md bg-ink px-4 py-2 text-sm font-medium text-canvas hover:opacity-90"
        >
          Go home
        </Link>
      </main>
    </div>
  )
}