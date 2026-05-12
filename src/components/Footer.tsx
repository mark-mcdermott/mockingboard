import { NavLink } from 'react-router'

export function Footer() {
  return (
    <footer className="bg-surface py-6 text-xs text-ink-soft font-serif font-normal">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-5 md:flex-row md:items-center md:px-12">
        <p>
          Mockingboard is a free, open source tool
          <br />
          by{' '}
          <a
            href="https://floating.is"
            className="underline text-ink font-bold hover:text-ink-soft"
          >
            floating.is
          </a>
        </p>
        <nav className="flex items-center gap-6">
          <NavLink to="/about" className={({ isActive }) => isActive ? 'font-bold text-ink-bold hover:underline' : 'text-ink-bold hover:underline'}
          >
            About
          </NavLink>
          <a 
            href="https://github.com/mark-mcdermott/mockingboard"
            className="text-ink-bold hover:underline"
          >
            Github
          </a>
          <NavLink to="/privacy" className={({ isActive }) => isActive ? 'font-bold text-ink-bold hover:underline' : 'text-ink-bold hover:underline'}
          >
            Privacy
          </NavLink>
          <NavLink
            to="/terms"
            className={({ isActive }) => isActive ? 'font-bold text-ink-bold hover:underline' : 'text-ink-bold hover:underline'
            }
          >
            Terms
          </NavLink>
        </nav>
      </div>
    </footer>
  )
}