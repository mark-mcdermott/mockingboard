import { Download, Loader2 } from 'lucide-react'

type ExportButtonProps = {
  onExport: () => void
  isExporting?: boolean
}

export function ExportButton({ onExport, isExporting }: ExportButtonProps) {
  return (
    <button
      onClick={onExport}
      disabled={isExporting}
      className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-default disabled:opacity-70"
      >
        {isExporting ? (
          <>
            <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
              Exporting...
          </>
        ) : (
          <>
            <Download className="size-4" strokeWidth={1.5} />
            Export PNG
          </>
        )}
    </button>
  )
}