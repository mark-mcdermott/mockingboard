type HeaderProps = {
  children?: React.ReactNode
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 py-4 md:py-6">
      <div className="inline-flex flex-col">
        <span className="inline-flex items-center gap-1 font-serif text-lg font-medium tracking-tight md:text-xl">
        mockingboard
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20.95 20.65"
          className="size-3"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth=".2"
          aria-hidden="true"
        >
          <path d="M8.97.5l-2.5,6,4,13.4,4-13.4L11.97.5"/>
          <path d="M15.47.5c.6,0,1.2.3,1.6.8l3,4c.5.7.5,1.7,0,2.4l-8,11c-1.7,2-1.81,1.7-2.79.48-.6-.75-.66-.8-.82-1.05L.88,7.7c-.5-.7-.5-1.7,0-2.4L3.88,1.3c.4-.5,1-.8,1.6-.8h10Z" strokeWidth="1"/>
          <path d="M.47,6.5h20"/>
          <line x1="14.47" y1="6.5" x2="16.18" y2=".9"/>
          <line x1="6.47" y1="6.5" x2="4.78" y2=".9"/>
        </svg>
        </span>
        <span className="font-mono text-xs text-ink-soft">
          by floating.is
        </span>
      </div>
      {children}
    </header>
  )
}