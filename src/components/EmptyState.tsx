type EmptyStateProps = {
  onFilesPicked: (files: FileList | null) => void
}

export function EmptyState({ onFilesPicked }: EmptyStateProps ) {
  return (
    <section className="py-16 md:py-24">
      <h1 className="font-serif font-medium tracking-tight text-3xl md:text-5xl">
        Drop mockups. Arrange freely. Export one beautiful PNG.
      </h1>
      <p className="mt-6 text-base md:text-lg text-ink-soft">
        Drag images in to get started.
      </p>
      <label className="mt-8 inline-flex cursor-pointer items-center rounded-md bg-ink px-4 py-2 text-sm font-medium text-canvas focus-within:ring-2 focus-within:ring-ink focus-within:ring-offset-2 focus-within:ring-offset-canvas">
        Choose images
        <input 
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onFilesPicked(e.target.files)}
        />
      </label>
    </section>
  )
}