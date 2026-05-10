import { Header } from '../components/Header'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function AboutPage() {
  useDocumentTitle('About — Mockingboard')

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-5 md:px-12">
      <Header />
      <main className="py-16">
        <h1 className="text-center font-serif text-5xl font-medium tracking-tight">
          About
        </h1>

        <div className="mt-12 space-y-12 leading-relaxed text-ink-soft">
          <section className="space-y-4">
            <p>
              Mockingboard is a small tool for arranging mockups into a single sharable image. Drop your screenshots in, rearrange them however looks best and export one PNG. That's it.
            </p>
            <p>No accounts, no upload servers, no settings to tune. The whole tool is one page.</p>
          </section>

          <section >
            <h2 className="font-serif text-2xl font-medium text-ink">
              How it works
            </h2>
            <div className="mt-4 space-y-4">
              <p>
                <span className="font-medium text-ink">Drop or pick image files.</span>{' '}
                  Anything your browser can decode — PNG, JPG, GIF, SVG, WebP — works.
              </p>
              <p>
                <span className="font-medium text-ink">Rearrange titles on the board.</span>{' '}
                Drag a title by it's handle to move it; the masonry layout adjusts automatically.
              </p>
              <p>
                <span className="font-medium text-ink">Export.</span> The browser renders the board to a canvas and downloads it as a PNG.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-medium text-ink">
              Your privacy
            </h2>
            <div className="mt-4 space-y-4">
              <p>
                Everything happens locally in your browser. Your images never leave your device. Mockingboard has no servers that see your files, no database, no accounts.
              </p>
              <p>
                The site uses cookieless analytics (Vercel Web Analytics) to count page views — never your files or anything that identifies you personally.
              </p>
              <p>
                When you close the tab, your board is gone — we don't have anywhere to keep it.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-medium text-ink">
              About export
            </h2>
            <div className="mt-4 space-y-4">
              <p>The export menu offers three scales:</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <span className="font-medium text-ink">Standard (2x)</span>{' '}
                  — sharp on retina displays, good for most uses.
                </li>
                <li>
                  <span className="font-medium text-ink">Large (3x)</span>{' '}
                  — higher resolution for print or large displays.
                </li>
                <li>
                  <span className="font-medium text-ink">Max Safe</span>{' '}
                  — the largest scale that fits within the iOS canvas size limit (~4096px). On small boards the picks 3x; on bigger ones it falls back to 2x or 1x.
                </li>
              </ul>
              <p>
                The exported PNG is a snapshot of your board{' '}
                <em>as it currently looks in the browser</em>. The output dimensions depend on your window width, the scale you picked and how tall the masonry has grown.
              </p>
              <p>
                Filenames include the scale used:{' '}
                <code className="rounded bg-surface px-1.5 py-0.5 text-xs text-ink">
                  mockingboard-3x.png
                </code>
                , etc
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-medium text-ink">
              Tips for large boards
            </h2>
            <div className="mt-4 space-y-4">
              <p>
                Browsers have an upper limit on how big a single canvas
                can be — about 4096 pixels in either dimension on iOS,
                around 10,000 px on desktop. If your board exceeds this,
                you'll see a warning when you try to export.
              </p>
              <p>A few tricks to fit more in:</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <span className="font-medium text-ink">Resize your browser wider.</span>{' '}
                  More space means more masonry columns, which means a
                  shorter overall board. Same images, smaller export.
                </li>
                <li>
                  <span className="font-medium text-ink">Zoom out.</span>{' '}
                  Cmd/Ctrl + minus. Zooming out gives you a wider
                  viewport in CSS pixels, which can also unlock more
                  columns.
                </li>
                <li>
                  <span className="font-medium text-ink">Pick a smaller scale.</span>{' '}
                  Standard (2x) and the "Reduce scale" button on the
                  size-warning modal both shrink the output.
                </li>
                <li>
                  <span className="font-medium text-ink">Remove some images.</span>{' '}
                  If even 1x doesn't fit, fewer tiles is the only fix.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-medium text-ink">
              Limitations
            </h2>
            <div className="mt-4 space-y-4">
              <p>
                This is an MVP. Things it doesn't yet do:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <span className="font-medium text-ink">Persist your work.</span>{' '}
                  Closing the tab loses your board.
                </li>
                <li>
                  <span className="font-medium text-ink">Multiple boards.</span>{' '}
                  One board at a time.
                </li>
                <li>
                  <span className="font-medium text-ink">Annotations.</span>{' '}
                  No text, arrows, or markup overlays.
                </li>
                <li>
                  <span className="font-medium text-ink">Layout control.</span>{' '}
                  The masonry is automatic. You can reorder tiles but
                  not pin specific images to specific columns.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-medium text-ink">
              Open source
            </h2>
            <div className="mt-4 space-y-4">
              <p>
                Mockingboard is open source. The full source code is on{' '}
                <a
                  href="https://github.com/mark-mcdermott/mockingboard"
                  className="underline hover:text-ink"
                >
                  GitHub
                </a>
                . Contributions, issues, and forks are welcome.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}