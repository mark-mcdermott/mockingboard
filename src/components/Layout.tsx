import { Outlet } from 'react-router'
import { Footer } from './Footer'
import { useScrollToTop } from '../hooks/useScrollToTop'

export function Layout() {
  useScrollToTop()
  
  return (
    <div className="flex min-h-screen flex-col text-ink">
      <Outlet />
      <Footer />
    </div>
  )
}