import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Train,
  Calendar,
  Map,
  AlertTriangle,
  Wallet,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogIn,
  LogOut,
} from 'lucide-react'
import { useCityDataStore, useAuthStore } from '../../store'
import { cn } from '../../lib/utils'
import { ThemeToggle } from './ThemeToggle'
import { AuthModal } from '../auth'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transport', label: 'Transport', icon: Train },
  { path: '/events', label: 'Events', icon: Calendar },
  { path: '/map', label: 'City Map', icon: Map },
  { path: '/civic', label: 'Civic Reports', icon: AlertTriangle },
  { path: '/budget', label: 'Budget', icon: Wallet },
  { path: '/assistant', label: 'AI Assistant', icon: MessageSquare },
]

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useCityDataStore()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [authOpen, setAuthOpen] = useState(false)
  const location = useLocation()

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          'fixed top-0 left-0 h-full z-50 glass-sidebar flex flex-col transition-all duration-300',
          'lg:relative lg:z-auto',
          sidebarOpen ? 'w-64' : 'w-20',
          !sidebarOpen && 'max-lg:-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-border/50">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            C
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-display font-bold text-lg text-gradient whitespace-nowrap overflow-hidden"
              >
                CitySphere
              </motion.span>
            )}
          </AnimatePresence>

          {/* Close button on mobile */}
          <button
            onClick={toggleSidebar}
            className="ml-auto lg:hidden p-1 rounded-lg hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar()
                }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <item.icon
                  className={cn(
                    'w-5 h-5 flex-shrink-0 transition-colors',
                    isActive ? 'text-primary' : 'group-hover:text-foreground'
                  )}
                />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-border/50 space-y-2">
          <ThemeToggle collapsed={!sidebarOpen} />

          {/* Auth button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex-1 min-w-0 overflow-hidden"
                  >
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                    <button
                      onClick={() => { logout(); localStorage.removeItem('citysphere_token') }}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <LogOut className="w-3 h-3" /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200"
            >
              <LogIn className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium"
                  >
                    Sign In
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}

          {/* Collapse button (desktop only) */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-5 h-5 flex-shrink-0" />
            )}
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-40 lg:hidden p-2 rounded-xl glass-card"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
