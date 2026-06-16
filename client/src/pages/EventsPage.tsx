import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Calendar, MapPin, Star, Sparkles, Loader2 } from 'lucide-react'
import { GlassCard, PageHeader } from '../components/ui'
import { categoryEmojis } from '../lib/mockData'
import { cn, formatDate } from '../lib/utils'
import type { EventCategory, CityEvent } from '../types'

const categories: Array<EventCategory | 'All'> = [
  'All', 'Food', 'Music', 'Concert', 'Festival', 'Theater', 'Workshop', 'Standup', 'Sports',
]

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState<EventCategory | 'All'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [events, setEvents] = useState<CityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const { eventsAPI } = await import('../lib/api')
        const res = await eventsAPI.getEvents()
        const data = res.data?.data

        if (Array.isArray(data)) {
          // Map API response to CityEvent format
          const mapped: CityEvent[] = data.map((e: any) => ({
            _id: e._id,
            title: e.title,
            description: e.description,
            category: e.category?.charAt(0).toUpperCase() + e.category?.slice(1) || 'Festival',
            date: e.date,
            location: {
              venue: e.location?.name || e.location?.venue || 'Delhi',
              address: e.location?.address || '',
            },
            image: `https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800`,
            price: e.price === 0 ? 'Free' : `₹${e.price}`,
            featured: e.featured || false,
            tags: e.tags || [],
          }))
          setEvents(mapped)
        } else if (data?.data && Array.isArray(data.data)) {
          // Handle paginated response
          const mapped: CityEvent[] = data.data.map((e: any) => ({
            _id: e._id,
            title: e.title,
            description: e.description,
            category: e.category?.charAt(0).toUpperCase() + e.category?.slice(1) || 'Festival',
            date: e.date,
            location: {
              venue: e.location?.name || e.location?.venue || 'Delhi',
              address: e.location?.address || '',
            },
            image: `https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800`,
            price: e.price === 0 ? 'Free' : `₹${e.price}`,
            featured: e.featured || false,
            tags: e.tags || [],
          }))
          setEvents(mapped)
        }
      } catch {
        setError('Could not load events. Make sure the server is running and events are seeded.')
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const filteredEvents = events.filter((event) => {
    const matchesCategory = activeCategory === 'All' || event.category === activeCategory
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredEvents = events.filter((e) => e.featured)

  return (
    <div className="page-transition space-y-8">
      <PageHeader
        title="City Events"
        subtitle="Discover what's happening in Delhi"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..."
            className="pl-10 pr-4 py-2.5 rounded-xl bg-accent/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm w-full sm:w-64"
          />
        </div>
      </PageHeader>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading events...</p>
        </motion.div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-display font-semibold mb-2">Could Not Load Events</h3>
          <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
        </motion.div>
      )}

      {/* Featured Events */}
      {!loading && !error && activeCategory === 'All' && searchQuery === '' && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-display font-bold">Featured Events</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {featuredEvents.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard glow padding="none" className="overflow-hidden group h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="badge bg-primary text-white">
                        <Star className="w-3 h-3" /> Featured
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="badge bg-white/20 backdrop-blur-sm text-white">
                        {categoryEmojis[event.category] || '🎪'} {event.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-display font-bold text-lg mb-2 line-clamp-1">{event.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                      {event.description}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(event.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {event.location.venue}
                        </span>
                      </div>
                      <span className="badge badge-primary font-bold">{event.price}</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
              activeCategory === cat
                ? 'bg-gradient-primary text-white shadow-md shadow-primary/25'
                : 'glass-card hover:!transform-none'
            )}
          >
            {cat !== 'All' && (categoryEmojis[cat] || '🎪')}{' '}
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Events Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory + searchQuery}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <GlassCard padding="none" className="overflow-hidden group h-full flex flex-col">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="badge bg-white/20 backdrop-blur-sm text-white">
                      {categoryEmojis[event.category] || '🎪'} {event.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-semibold text-base mb-1.5 line-clamp-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location.venue}
                      </div>
                    </div>
                    <span className="badge badge-primary text-sm font-bold">{event.price}</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty state */}
      {filteredEvents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">🎪</div>
          <h3 className="text-xl font-display font-semibold mb-2">No Events Found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </motion.div>
      )}
    </div>
  )
}
