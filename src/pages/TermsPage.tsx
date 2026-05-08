import { Header } from '../components/Header'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function TermsPage() {
  useDocumentTitle('Terms — Mockingboard')

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-5 md:px-12">
      <Header />
      <main className="py-16">
        <header className="text-center">
          <h1 className="font-serif text-5xl font-medium tracking-tight">
            Terms
          </h1>
          <p className="mt-4 text-sm text-ink-muted">
            Last updated: May 2026
          </p>
        </header>

        <div className="mt-12 space-y-12 leading-relaxed text-ink-soft">
          <section className="space-y-4">
            <p>
              Mockingboard is a free, open source tool for arranging
              mockups into a single exportable image. By using it, you
              agree to these terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-medium text-ink">
              Your content
            </h2>
            <div className="mt-4 space-y-4">
              <p>
                You are responsible for the content you upload and export.
              </p>
              <p>
                Mockingboard runs entirely in your browser. We do not
                upload, store, inspect, or moderate your files.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-medium text-ink">
              No warranty
            </h2>
            <div className="mt-4 space-y-4">
              <p>
                Mockingboard is provided as-is, without warranty of any
                kind. We do our best to keep the tool reliable, but we
                can't guarantee it will work perfectly in every browser
                or for every file size.
              </p>
              <p>
                If an export fails or a board is lost, we are not liable
                for any resulting loss of work.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-medium text-ink">
              Open source
            </h2>
            <div className="mt-4 space-y-4">
              <p>
                The Mockingboard source code is available on GitHub. You
                are free to read, fork, modify, and redistribute it under
                the terms of its open source license.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-medium text-ink">
              Changes
            </h2>
            <div className="mt-4 space-y-4">
              <p>
                These terms may change over time. Continued use of
                Mockingboard after a change constitutes acceptance of the
                updated terms.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-medium text-ink">
              Contact
            </h2>
            <div className="mt-4 space-y-4">
              <p>
                Questions or concerns can be raised on our{' '}
                <a
                  href="https://github.com/mark-mcdermott/mockingboard"
                  className="underline hover:text-ink"
                >
                  GitHub
                </a>{' '}
                repository.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}