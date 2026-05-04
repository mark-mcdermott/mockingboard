import { Download } from 'lucide-react'

type ExportButtonProps = {
  onExport: () => void
}

export function ExportButton({ onExport }: ExportButtonProps) {
  return (
    <button
      onClick={onExport}
      className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-canvas shadow-lg"
      >
        <Download className="size-4" strokeWidth={1.5} />
        Export PNG
    </button>
  )
}