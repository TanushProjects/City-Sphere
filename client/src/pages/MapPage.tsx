import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Layers, Navigation, X } from 'lucide-react'
import { GlassCard, PageHeader } from '../components/ui'
import { delhiLocations } from '../lib/mockData'
import { cn } from '../lib/utils'
import type { CityLocation } from '../types'

// Dynamic imports for Leaflet (avoids SSR issues)
let L: typeof import('leaflet') | null = null

const mapCategories = [
  { id: 'landmarks', label: 'Landmarks', emoji: '🏛️', color: '#3b82f6' },
  { id: 'hospitals', label: 'Hospitals', emoji: '🏥', color: '#ef4444' },
  { id: 'metro', label: 'Metro', emoji: '🚇', color: '#8b5cf6' },
  { id: 'food', label: 'Food', emoji: '🥘', color: '#f97316' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️', color: '#ec4899' },
  { id: 'temples', label: 'Temples', emoji: '🛕', color: '#eab308' },
  { id: 'parks', label: 'Parks', emoji: '🌳', color: '#22c55e' },
]

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [activeCategory, setActiveCategory] = useState('landmarks')
  const [selectedLocation, setSelectedLocation] = useState<CityLocation | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Import leaflet CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    // Import leaflet JS
    import('leaflet').then((leaflet) => {
      L = leaflet.default || leaflet
      initMap()
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  const initMap = () => {
    if (!L || !mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [28.6139, 77.2090],
      zoom: 12,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    mapInstanceRef.current = map
    setMapLoaded(true)
    loadMarkers('landmarks')
  }

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(marker)
      }
    })
    markersRef.current = []
  }

  const loadMarkers = (category: string) => {
    if (!L || !mapInstanceRef.current) return
    clearMarkers()

    const locations = delhiLocations[category] || []
    locations.forEach((loc, index) => {
      const iconHtml = `<div style="font-size: 1.8rem; text-shadow: 0 2px 4px rgba(0,0,0,0.4); cursor: pointer;">${loc.icon}</div>`
      const customIcon = L!.divIcon({
        html: iconHtml,
        className: 'leaflet-emoji-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      })

      const marker = L!.marker([loc.lat, loc.lng], { icon: customIcon })
        .bindPopup(`
          <div style="min-width: 200px; font-family: Inter, sans-serif;">
            <h4 style="margin: 0 0 4px; font-size: 14px; font-weight: 600;">${loc.icon} ${loc.name}</h4>
            <p style="margin: 0 0 4px; font-size: 12px; color: #666;">📍 ${loc.address}</p>
            ${loc.description ? `<p style="margin: 0 0 8px; font-size: 12px;">${loc.description}</p>` : ''}
            <a href="https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}" 
               target="_blank" 
               style="font-size: 12px; color: #3b82f6; text-decoration: none;">
              🧭 Get Directions
            </a>
          </div>
        `)

      marker.on('click', () => setSelectedLocation(loc))

      setTimeout(() => {
        if (mapInstanceRef.current) {
          marker.addTo(mapInstanceRef.current)
        }
      }, index * 40)

      markersRef.current.push(marker)
    })
  }

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
    setSelectedLocation(null)
    loadMarkers(categoryId)
  }

  const handleLocateMe = () => {
    if (!L || !mapInstanceRef.current) return
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          mapInstanceRef.current.flyTo([latitude, longitude], 15)
          const userIcon = L!.divIcon({
            html: '<div style="font-size: 2rem; animation: pulse 1s infinite;">📍</div>',
            className: 'leaflet-emoji-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
          })
          const marker = L!.marker([latitude, longitude], { icon: userIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup('<h4 style="margin:0; font-size: 14px;">📍 You are here!</h4>')
            .openPopup()
          markersRef.current.push(marker)
        },
        () => alert('Could not get your location. Please enable location access.')
      )
    }
  }

  return (
    <div className="page-transition space-y-6">
      <PageHeader
        title="Interactive Map"
        subtitle="Explore Delhi with 60+ curated locations"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLocateMe}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-primary text-white font-medium text-sm shadow-lg shadow-primary/25"
        >
          <Navigation className="w-4 h-4" />
          My Location
        </motion.button>
      </PageHeader>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar filters */}
        <div className="lg:w-72 flex-shrink-0 space-y-3">
          <GlassCard hover={false} padding="sm">
            <div className="flex items-center gap-2 mb-3 px-1">
              <Layers className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Categories</span>
            </div>
            <div className="space-y-1">
              {mapCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    activeCategory === cat.id
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <span className="ml-auto text-xs bg-accent px-2 py-0.5 rounded-full">
                    {(delhiLocations[cat.id] || []).length}
                  </span>
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Selected location details */}
          {selectedLocation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard glow hover={false}>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl">{selectedLocation.icon}</span>
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="p-1 rounded-lg hover:bg-accent transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-display font-bold text-lg">{selectedLocation.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {selectedLocation.address}
                </p>
                {selectedLocation.description && (
                  <p className="text-sm mt-2">{selectedLocation.description}</p>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.lat},${selectedLocation.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-white text-sm font-medium w-full justify-center"
                >
                  🧭 Get Directions
                </a>
              </GlassCard>
            </motion.div>
          )}
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <GlassCard hover={false} padding="none" className="overflow-hidden">
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-accent/50 z-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <p className="text-sm text-muted-foreground">Loading map...</p>
                </div>
              </div>
            )}
            <div
              ref={mapRef}
              className="w-full h-[500px] lg:h-[600px] rounded-xl"
              style={{ zIndex: 1 }}
            />
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
