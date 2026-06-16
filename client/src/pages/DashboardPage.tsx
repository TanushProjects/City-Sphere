import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Cloud,
  Wind,
  Droplets,
  Train,
  MapPin,
  TrendingUp,
  Users,
  AlertTriangle,
  Hospital,
  Fuel,
  Zap,
  Shield,
  Compass,
  Calendar,
  Wallet,
} from 'lucide-react'
import { GlassCard, PageHeader, StatWidget } from '../components/ui'
import { metroLines } from '../lib/mockData'
import type { CrowdData } from '../types'

// Static crowd reference data for popular Delhi locations
const crowdData: CrowdData[] = [
  { place: 'Select Citywalk', placeType: 'mall', level: 'high', prediction: { bestTimeToVisit: '11 AM - 1 PM' } },
  { place: 'Rajiv Chowk Metro', placeType: 'metro_station', level: 'very_high', prediction: { bestTimeToVisit: '11 AM - 4 PM' } },
  { place: 'Akshardham Temple', placeType: 'temple', level: 'moderate', prediction: { bestTimeToVisit: '3 PM - 5 PM' } },
  { place: 'Chandni Chowk', placeType: 'market', level: 'high', prediction: { bestTimeToVisit: '9 AM - 10 AM' } },
  { place: 'India Gate', placeType: 'tourist_spot', level: 'moderate', prediction: { bestTimeToVisit: '6 PM - 8 PM' } },
  { place: 'Connaught Place', placeType: 'market', level: 'high', prediction: { bestTimeToVisit: '11 AM - 2 PM' } },
]
import { cn, getGreeting } from '../lib/utils'
import { Link } from 'react-router-dom'

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function DashboardPage() {
  const [weather, setWeather] = useState<{
    temperature: { current: number; high: number; low: number };
    condition: string;
    humidity: number;
    wind: number;
    aqi: number;
    rainChance: number;
    icon: string;
  } | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(true)

  useEffect(() => {
    fetch('/api/weather')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          const w = d.data
          const desc = (w.weatherDescription || '').toLowerCase()
          setWeather({
            temperature: { current: w.temperature, high: w.temperature + 4, low: w.temperature - 6 },
            condition: w.weatherDescription || 'Unknown',
            humidity: w.humidity,
            wind: w.windSpeed,
            aqi: w.aqi || 0,
            rainChance: desc.includes('rain') ? 75 : desc.includes('cloud') ? 30 : 10,
            icon: desc.includes('rain') ? '🌧️'
              : desc.includes('cloud') ? '⛅'
              : desc.includes('thunder') ? '⛈️'
              : desc.includes('clear') ? '☀️' : '⛅',
          })
        }
      })
      .catch(() => { /* weather unavailable */ })
      .finally(() => setWeatherLoading(false))
  }, [])

  const getAqiLevel = (aqi: number) => {
    if (aqi <= 50) return { label: 'Good', color: '#22c55e', bg: 'bg-green-500' }
    if (aqi <= 100) return { label: 'Satisfactory', color: '#84cc16', bg: 'bg-lime-500' }
    if (aqi <= 200) return { label: 'Moderate', color: '#f59e0b', bg: 'bg-amber-500' }
    if (aqi <= 300) return { label: 'Poor', color: '#ef4444', bg: 'bg-red-500' }
    return { label: 'Severe', color: '#7f1d1d', bg: 'bg-red-900' }
  }

  const aqiInfo = getAqiLevel(weather?.aqi ?? 0)

  return (
    <div className="page-transition space-y-8">
      {/* Header */}
      <PageHeader
        title={`${getGreeting()}, Explorer`}
        subtitle="Here's what's happening in Delhi right now"
      />

      {/* Stats Row */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={fadeUp}>
          <StatWidget
            label="Places Mapped"
            value={1247}
            icon={<MapPin className="w-6 h-6 text-blue-500" />}
            trend={{ value: 12, label: 'this month' }}
            color="#3b82f6"
          />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatWidget
            label="Routes Tracked"
            value={534}
            icon={<Train className="w-6 h-6 text-purple-500" />}
            trend={{ value: 8, label: 'this week' }}
            color="#a855f7"
          />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatWidget
            label="Active Users"
            value={2891}
            icon={<Users className="w-6 h-6 text-green-500" />}
            trend={{ value: 23, label: 'vs last week' }}
            color="#22c55e"
          />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatWidget
            label="Issues Resolved"
            value={156}
            icon={<TrendingUp className="w-6 h-6 text-amber-500" />}
            trend={{ value: 15, label: 'this month' }}
            color="#f59e0b"
          />
        </motion.div>
      </motion.div>

      {/* Dashboard Grid */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {/* Weather Card */}
        <motion.div variants={fadeUp}>
          <GlassCard glow className="h-full">
            {weather ? (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Current Weather</p>
                    <div className="text-4xl font-display font-bold mt-1">
                      {weather.temperature.current}°C
                    </div>
                  </div>
                  <div className="text-5xl">{weather.icon}</div>
                </div>
                <p className="text-foreground font-medium mb-4">{weather.condition}</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 rounded-lg bg-accent/50">
                    <Droplets className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                    <div className="text-sm font-semibold">{weather.humidity}%</div>
                    <div className="text-xs text-muted-foreground">Humidity</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-accent/50">
                    <Wind className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                    <div className="text-sm font-semibold">{weather.wind} km/h</div>
                    <div className="text-xs text-muted-foreground">Wind</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-accent/50">
                    <Cloud className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                    <div className="text-sm font-semibold">{weather.rainChance}%</div>
                    <div className="text-xs text-muted-foreground">Rain</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <Cloud className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">{weatherLoading ? 'Loading weather...' : 'Weather unavailable'}</p>
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* AQI Card */}
        <motion.div variants={fadeUp}>
          <GlassCard glow className="h-full">
            <div className="flex items-start justify-between mb-2">
              <div className="text-2xl">💨</div>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: aqiInfo.color }}
              >
                {aqiInfo.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Air Quality Index</p>
            <div className="text-4xl font-display font-bold mt-1 mb-4">{weather?.aqi ?? '—'}</div>
            <div className="relative h-3 rounded-full overflow-hidden bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-600">
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 shadow-lg"
                style={{ borderColor: aqiInfo.color }}
                initial={{ left: '0%' }}
                animate={{ left: `${Math.min(((weather?.aqi ?? 0) / 500) * 100, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Sensitive groups should reduce outdoor activity
            </p>
          </GlassCard>
        </motion.div>

        {/* Metro Countdown */}
        <motion.div variants={fadeUp}>
          <GlassCard glow className="h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl">🚇</div>
              <span className="flex items-center gap-1.5 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-medium mb-4">Next Metro</p>
            <div className="space-y-3">
              {metroLines.slice(0, 4).map((line) => (
                <div key={line.name} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: line.color }}
                  />
                  <span className="text-sm flex-1">{line.name}</span>
                  <motion.span
                    className="text-sm font-bold"
                    style={{ color: line.color }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {line.eta} min
                  </motion.span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* City Mood */}
        <motion.div variants={fadeUp}>
          <GlassCard glow className="h-full">
            <div className="flex items-start justify-between mb-2">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                😊
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-medium">City Mood</p>
            <div className="text-2xl font-display font-bold mt-1">Busy</div>
            <p className="text-sm text-muted-foreground mt-2">
              Evening rush — people heading home from work
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {['#DelhiDiaries', '#WeekendVibes', '#CityLife'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Rain Forecast */}
        <motion.div variants={fadeUp}>
          <GlassCard glow className="h-full">
            <div className="text-2xl mb-2">🌧️</div>
            <p className="text-sm text-muted-foreground font-medium">Rain Forecast</p>
            <div className="text-2xl font-display font-bold mt-1 text-green-500">No Rain</div>
            <p className="text-sm text-muted-foreground mt-2">
              Clear skies expected for the next 6 hours
            </p>
            <div className="mt-4">
              <span className="badge badge-success">✓ Carry umbrella: No</span>
            </div>
          </GlassCard>
        </motion.div>

        {/* Traffic Overview */}
        <motion.div variants={fadeUp}>
          <GlassCard glow className="h-full">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl">🚗</div>
              <span className="flex items-center gap-1.5 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Traffic Overview</p>
            <div className="text-2xl font-display font-bold mt-1 text-amber-500">Moderate</div>
            <div className="space-y-2 mt-4">
              {[
                { road: 'Ring Road', level: 'heavy', color: 'bg-red-500' },
                { road: 'NH-48', level: 'moderate', color: 'bg-amber-500' },
                { road: 'Outer Ring Rd', level: 'light', color: 'bg-green-500' },
              ].map((route) => (
                <div key={route.road} className="flex items-center justify-between">
                  <span className="text-sm">{route.road}</span>
                  <div className="flex items-center gap-2">
                    <div className={cn('w-2 h-2 rounded-full', route.color)} />
                    <span className="text-xs text-muted-foreground capitalize">{route.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Crowd Predictor */}
      <div>
        <h2 className="text-2xl font-display font-bold mb-4">
          Crowd & Rush <span className="text-gradient">Predictor</span>
        </h2>
        <p className="text-muted-foreground mb-6">Know before you go — real-time crowd levels</p>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {crowdData.map((item) => {
            const levelColors = {
              low: { bg: 'bg-green-500/10', text: 'text-green-500', dot: 'bg-green-500' },
              moderate: { bg: 'bg-amber-500/10', text: 'text-amber-500', dot: 'bg-amber-500' },
              high: { bg: 'bg-orange-500/10', text: 'text-orange-500', dot: 'bg-orange-500' },
              very_high: { bg: 'bg-red-500/10', text: 'text-red-500', dot: 'bg-red-500' },
            }
            const colors = levelColors[item.level]
            const icons: Record<string, string> = {
              mall: '🛍️', metro_station: '🚇', temple: '🛕',
              market: '🏪', tourist_spot: '📸',
            }

            return (
              <motion.div key={item.place} variants={fadeUp}>
                <GlassCard className="flex items-center gap-4">
                  <motion.div
                    className={cn('w-14 h-14 rounded-xl flex items-center justify-center text-2xl', colors.bg)}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: item.level === 'very_high' ? 0.8 : item.level === 'high' ? 1.2 : 2,
                      repeat: Infinity,
                    }}
                  >
                    {icons[item.placeType] || '📍'}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{item.place}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={cn('w-2 h-2 rounded-full', colors.dot)} />
                      <span className={cn('text-sm font-medium capitalize', colors.text)}>
                        {item.level.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Best: {item.prediction.bestTimeToVisit}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Local Essentials */}
      <div>
        <h2 className="text-2xl font-display font-bold mb-4">
          Local <span className="text-gradient">Essentials</span> Finder
        </h2>
        <p className="text-muted-foreground mb-6">Find what you need, when you need it</p>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {[
            { icon: <Hospital className="w-5 h-5" />, emoji: '🏥', name: 'Hospitals', detail: 'Nearest: AIIMS (2.3 km)' },
            { icon: null, emoji: '💊', name: '24×7 Pharmacies', detail: 'Nearest: Apollo (0.8 km)' },
            { icon: <Zap className="w-5 h-5" />, emoji: '⚡', name: 'EV Charging', detail: '2 available nearby' },
            { icon: null, emoji: '🏧', name: 'ATMs', detail: '5 within 500m' },
            { icon: <Shield className="w-5 h-5" />, emoji: '👮', name: 'Police Stations', detail: 'Nearest: 0.7 km' },
            { icon: <Fuel className="w-5 h-5" />, emoji: '⛽', name: 'Petrol Pumps', detail: '3 within 1 km' },
          ].map((item) => (
            <motion.div key={item.name} variants={fadeUp}>
              <GlassCard className="flex items-center gap-4 cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-accent/50 flex items-center justify-center text-xl">
                  {item.emoji}
                </div>
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-display font-bold mb-6">
          Quick <span className="text-gradient">Actions</span>
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { to: '/transport', icon: <Train className="w-4 h-4" />, label: 'Plan Route', primary: true },
            { to: '/events', icon: <Calendar className="w-4 h-4" />, label: 'View Events' },
            { to: '/civic', icon: <AlertTriangle className="w-4 h-4" />, label: 'Report Issue' },
            { to: '/budget', icon: <Wallet className="w-4 h-4" />, label: 'Budget Planner' },
            { to: '/assistant', icon: <Compass className="w-4 h-4" />, label: 'Ask AI' },
          ].map((action) => (
            <Link key={action.to} to={action.to}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors',
                  action.primary
                    ? 'bg-gradient-primary text-white shadow-lg shadow-primary/25'
                    : 'glass-card hover:!transform-none'
                )}
              >
                {action.icon}
                {action.label}
              </motion.button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
