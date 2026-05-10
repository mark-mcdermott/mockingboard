import { Header } from '../components/Header'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function PrivacyPage() {
  useDocumentTitle('Privacy — Mockingboard')

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-5 md:px-12">
      <Header />
      <main className="py-16">
        <header className="text-center">
          <h1 className="font-serif text-5xl font-medium tracking-tight">
            Privacy
          </h1>
          <p className="mt-4 text-sm text-ink-muted">
            Last updated: May 2026
          </p>
        </header>

        <div className="mt-12 space-y-12 leading-relaxed text-ink-soft">
          <section className="space-y-4">
            <p>
              Mockingboard is designed to run entirely in your browser. Your
              images and files never leave your device.
            </p>
            <p>This Privacy Policy explains exactly how that works.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-medium text-ink">
              What we collect
            </h2>
            <div className="mt-4 space-y-4">
              <p>
                We do not collect, store, or process any of your images,
                files, or personal data.
              </p>
              <p>Mockingboard has no accounts, logins, or user profiles.</p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-medium text-ink">
              How your data is handled
            </h2>
            <div className="mt-4 space-y-4">
              <p>All image processing happens locally in your browser.</p>
              <p>Your files are never uploaded to our servers.</p>
              <p>
                When you export a board, the image is generated on your
                device and saved directly to your computer.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-medium text-ink">
              Analytics
            </h2>
            <div className="mt-4 space-y-4">
              <p>
                We use Vercel Web Analytics to understand how Mockingboard is used — pages visited, country, device type, referrer. No cookies, no tracking across sites, no fingerprinting.
              </p>
              <p>
                This data is anonymous and does not include any of your
                files or personal information.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-medium text-ink">
              Third parties
            </h2>
            <div className="mt-4 space-y-4">
              <p>We do not share any data with third parties.</p>
              <p>
                Mockingboard does not require third-party services to have
                access to your data or files.
              </p>
              <p>
                If you have any questions, feel free to reach out via our{' '}
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