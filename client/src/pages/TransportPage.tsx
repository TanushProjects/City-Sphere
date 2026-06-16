import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  Clock,
  IndianRupee,
  Route,
  Zap,
  Coins,
  Scale,
  ArrowLeftRight,
} from 'lucide-react'
import { GlassCard, PageHeader } from '../components/ui'
import { transportModeInfo } from '../lib/mockData'
import { cn } from '../lib/utils'
import type { RouteOption } from '../types'


export default function TransportPage() {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [routes, setRoutes] = useState<RouteOption[]>([])
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null)
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  const handleSearch = async () => {
    setSearching(true)
    setSelectedRoute(null)
    setSearchError('')

    try {
      const { transportAPI } = await import('../lib/api')
      const res = await transportAPI.getRoute({ origin, destination, mode: 'balanced' })
      const data = res.data?.data

      if (data?.routes?.length) {
        const apiRoutes: RouteOption[] = data.routes.map((r: any) => ({
          mode: r.mode.toLowerCase() === 'auto' ? 'auto' : r.mode.toLowerCase(),
          duration: r.durationMinutes,
          cost: r.costAmount,
          distance: Math.round(r.durationMinutes * 0.4 * 10) / 10,
          recommended: r.recommended ? r.tag?.includes('Fastest') ? 'fastest' : r.tag?.includes('Cheapest') ? 'cheapest' : 'balanced' : undefined,
          steps: r.steps.map((s: string) => ({
            instruction: s,
            mode: r.mode.toLowerCase() === 'auto' ? 'auto' : r.mode.toLowerCase(),
            duration: Math.round(r.durationMinutes / r.steps.length),
            distance: Math.round((r.durationMinutes * 0.4) / r.steps.length * 10) / 10,
          })),
        }))
        setRoutes(apiRoutes)
      } else {
        setSearchError('No routes found for this origin-destination pair.')
      }
    } catch {
      setSearchError('Could not connect to the server. Make sure the backend is running.')
    } finally {
      setSearching(false)
    }
  }

  const swapLocations = () => {
    setOrigin(destination)
    setDestination(origin)
    setRoutes([])
    setSelectedRoute(null)
  }

  const getRecommendedBadge = (rec?: string) => {
    if (!rec) return null
    const badges = {
      fastest: { label: '⚡ Fastest', class: 'badge-warning' },
      cheapest: { label: '💰 Cheapest', class: 'badge-success' },
      balanced: { label: '⚖️ Balanced', class: 'badge-info' },
    }
    const badge = badges[rec as keyof typeof badges]
    return badge ? <span className={cn('badge', badge.class)}>{badge.label}</span> : null
  }

  return (
    <div className="page-transition space-y-8">
      <PageHeader
        title="Transport Planner"
        subtitle="AI-powered route recommendations for Delhi NCR"
      />

      {/* Search Card */}
      <GlassCard glow hover={false} padding="lg">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Enter starting point"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-accent/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={swapLocations}
            className="p-3 rounded-xl bg-accent/50 hover:bg-accent transition-colors flex-shrink-0"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </motion.button>

          <div className="flex-1 w-full">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">To</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-accent/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            disabled={searching || !origin || !destination}
            className="px-8 py-3 rounded-xl bg-gradient-primary text-white font-medium text-sm shadow-lg shadow-primary/25 disabled:opacity-50 flex items-center gap-2 flex-shrink-0"
          >
            {searching ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Route className="w-5 h-5" />
            )}
            {searching ? 'Finding...' : 'Find Routes'}
          </motion.button>
        </div>
      </GlassCard>

      {/* Results */}
      <AnimatePresence>
        {routes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Route Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: <Zap className="w-5 h-5 text-amber-500" />, label: 'Fastest', route: routes.find(r => r.recommended === 'fastest'), value: `${routes.find(r => r.recommended === 'fastest')?.duration} min` },
                { icon: <Coins className="w-5 h-5 text-green-500" />, label: 'Cheapest', route: routes.find(r => r.recommended === 'cheapest'), value: `₹${routes.find(r => r.recommended === 'cheapest')?.cost}` },
                { icon: <Scale className="w-5 h-5 text-blue-500" />, label: 'Balanced', route: routes.find(r => r.recommended === 'balanced'), value: `${routes.find(r => r.recommended === 'balanced')?.duration} min · ₹${routes.find(r => r.recommended === 'balanced')?.cost}` },
              ].map((item) => (
                <GlassCard key={item.label} glow>
                  <div className="flex items-center gap-3 mb-2">
                    {item.icon}
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  <div className="text-2xl font-display font-bold">{item.value}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    via {transportModeInfo[item.route?.mode || 'metro'].emoji} {transportModeInfo[item.route?.mode || 'metro'].label}
                  </p>
                </GlassCard>
              ))}
            </div>

            {/* All Routes */}
            <h3 className="text-xl font-display font-bold">
              All <span className="text-gradient">Routes</span>
            </h3>
            <div className="space-y-4">
              {routes.map((route, index) => {
                const modeInfo = transportModeInfo[route.mode]
                const isSelected = selectedRoute === index

                return (
                  <motion.div
                    key={route.mode}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard
                      glow
                      hover={false}
                      padding="none"
                      className={cn(
                        'cursor-pointer transition-all',
                        isSelected && 'ring-2 ring-primary'
                      )}
                      onClick={() => setSelectedRoute(isSelected ? null : index)}
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                              style={{ backgroundColor: `${modeInfo.color}15` }}
                            >
                              {modeInfo.emoji}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-lg">{modeInfo.label}</h4>
                                {getRecommendedBadge(route.recommended)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {route.distance} km · {route.steps.length} steps
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-1 text-lg font-bold">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              {route.duration} min
                            </div>
                            <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                              <IndianRupee className="w-3 h-3" />
                              {route.cost}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded steps */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 pt-2 border-t border-border/50">
                              <div className="space-y-4 ml-2">
                                {route.steps.map((step, sIndex) => {
                                  const stepMode = transportModeInfo[step.mode]
                                  return (
                                    <div key={sIndex} className="flex gap-4">
                                      <div className="flex flex-col items-center">
                                        <div
                                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                                          style={{ backgroundColor: `${stepMode.color}20` }}
                                        >
                                          {stepMode.emoji}
                                        </div>
                                        {sIndex < route.steps.length - 1 && (
                                          <div className="w-0.5 flex-1 bg-border mt-1" />
                                        )}
                                      </div>
                                      <div className="pb-4">
                                        <p className="font-medium text-sm">{step.instruction}</p>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                          <span>{step.duration} min</span>
                                          <span>·</span>
                                          <span>{step.distance} km</span>
                                          {step.details && (
                                            <>
                                              <span>·</span>
                                              <span>{step.details}</span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </GlassCard>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      {searchError && !searching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-display font-semibold mb-2">Route Search Failed</h3>
          <p className="text-muted-foreground max-w-md mx-auto">{searchError}</p>
        </motion.div>
      )}

      {/* Empty state */}
      {routes.length === 0 && !searching && !searchError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-display font-semibold mb-2">Plan Your Journey</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Enter your origin and destination above to get AI-powered route recommendations
            with time and cost estimates.
          </p>
        </motion.div>
      )}
    </div>
  )
}
