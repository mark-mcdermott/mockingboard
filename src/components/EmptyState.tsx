import { Upload } from 'lucide-react'

type EmptyStateProps = {
  onFilesPicked: (files: FileList | null) => void
}

export function EmptyState({ onFilesPicked }: EmptyStateProps ) {
  return (
    <label className="flex min-h-[400px] cursor-pointer flex-col items-center justify-center text-center transition hover:bg-surface/30 focus-within:ring-2 focus-within:ring-inset focus-within:ring-ink">
      <Upload className="size-10 text-ink" strokeWidth={1.25} />
      <p className="mt-4 text-base text-ink-soft">
        Drag images in to get started
      </p>
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => onFilesPicked(e.target.files)}
      />
    </label>
  )
}