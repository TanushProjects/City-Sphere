import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import { Sidebar } from './components/layout'
import { useThemeStore } from './store'
import { cn } from './lib/utils'

// Lazy load pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const TransportPage = lazy(() => import('./pages/TransportPage'))
const EventsPage = lazy(() => import('./pages/EventsPage'))
const MapPage = lazy(() => import('./pages/MapPage'))
const CivicPage = lazy(() => import('./pages/CivicPage'))
const BudgetPage = lazy(() => import('./pages/BudgetPage'))
const AssistantPage = lazy(() => import('./pages/AssistantPage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  )
}

function AppLayout() {

  return (
    <div className="flex min-h-screen bg-gradient-mesh">
      <Sidebar />
      <main
        className={cn(
          'flex-1 min-h-screen transition-all duration-300',
          'px-4 py-6 lg:px-8 lg:py-8',
          'max-w-[1400px]'
        )}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/transport" element={<TransportPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/civic" element={<CivicPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default function App() {
  const { theme } = useThemeStore()

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
