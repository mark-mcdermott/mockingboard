type BoardSurfaceProps = {
  children: React.ReactNode
}

export function BoardSurface({ children }: BoardSurfaceProps) {
  return (
    <section className="rounded-lg border border-dashed border-edge p-4 md:p-6">
      {children}
    </section>

  )
}