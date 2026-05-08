import { Outlet } from 'react-router'
import { Footer } from './Footer'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col text-ink">
      <Outlet />
      <Footer />
    </div>
  )
}