import { Header } from '../components/Header'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function TermsPage() {
  useDocumentTitle('Terms — Mockingboard')

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-5 md:px-12">
      <Header />
      <main className="py-16 text-center">
        <h1 className="font-serif text-5xl font-medium tracking-tight">
          Terms
        </h1>
        <p className="mt-12 text-ink-soft">Page content coming next step.</p>
      </main>
    </div>
  )
}