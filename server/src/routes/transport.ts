import type { FastifyInstance } from 'fastify'
import { validate, routeQuerySchema } from '../middleware/index.js'
import { sendSuccess } from '../utils/response.js'

// ─── Delhi Metro Data ────────────────────────────────────────

interface MetroStation {
  name: string
  lat: number
  lng: number
  line: string
  lineColor: string
}

const metroStations: MetroStation[] = [
  { name: 'Rajiv Chowk', lat: 28.6328, lng: 77.2197, line: 'Blue/Yellow', lineColor: '#0066CC' },
  { name: 'Kashmere Gate', lat: 28.6675, lng: 77.2284, line: 'Red/Yellow/Violet', lineColor: '#CC0000' },
  { name: 'Hauz Khas', lat: 28.4996, lng: 77.2069, line: 'Yellow/Magenta', lineColor: '#FFDD00' },
  { name: 'Central Secretariat', lat: 28.6147, lng: 77.2115, line: 'Yellow/Violet', lineColor: '#FFDD00' },
  { name: 'New Delhi', lat: 28.6420, lng: 77.2215, line: 'Yellow/Airport', lineColor: '#FFDD00' },
  { name: 'HUDA City Centre', lat: 28.4594, lng: 77.0726, line: 'Yellow', lineColor: '#FFDD00' },
  { name: 'Chandni Chowk', lat: 28.6569, lng: 77.2300, line: 'Yellow', lineColor: '#FFDD00' },
  { name: 'AIIMS', lat: 28.5689, lng: 77.2088, line: 'Yellow', lineColor: '#FFDD00' },
  { name: 'Dwarka', lat: 28.5820, lng: 77.0504, line: 'Blue', lineColor: '#0066CC' },
  { name: 'Noida City Centre', lat: 28.5778, lng: 77.3565, line: 'Blue', lineColor: '#0066CC' },
  { name: 'Botanical Garden', lat: 28.5637, lng: 77.3340, line: 'Blue/Magenta', lineColor: '#0066CC' },
  { name: 'Vaishali', lat: 28.6445, lng: 77.3395, line: 'Blue', lineColor: '#0066CC' },
  { name: 'Mandi House', lat: 28.6258, lng: 77.2339, line: 'Blue/Violet', lineColor: '#0066CC' },
  { name: 'Lajpat Nagar', lat: 28.5690, lng: 77.2377, line: 'Violet', lineColor: '#9B59B6' },
  { name: 'Nehru Place', lat: 28.5494, lng: 77.2530, line: 'Violet', lineColor: '#9B59B6' },
  { name: 'Janakpuri West', lat: 28.6284, lng: 77.0818, line: 'Magenta', lineColor: '#E91E63' },
  { name: 'Kalkaji Mandir', lat: 28.5430, lng: 77.2567, line: 'Violet/Magenta', lineColor: '#9B59B6' },
  { name: 'Dilshad Garden', lat: 28.6841, lng: 77.3189, line: 'Red', lineColor: '#CC0000' },
  { name: 'Rithala', lat: 28.7207, lng: 77.1067, line: 'Red', lineColor: '#CC0000' },
  { name: 'Mundka', lat: 28.6845, lng: 77.0271, line: 'Green', lineColor: '#00CC00' },
]

// ─── Route Calculation ──────────────────────────────────────

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function findNearestStation(name: string): MetroStation | null {
  // Try exact match first
  const exact = metroStations.find(
    (s) => s.name.toLowerCase() === name.toLowerCase()
  )
  if (exact) return exact

  // Try partial match
  const partial = metroStations.find(
    (s) => s.name.toLowerCase().includes(name.toLowerCase()) ||
           name.toLowerCase().includes(s.name.toLowerCase())
  )
  return partial || null
}

interface RouteResult {
  mode: string
  icon: string
  duration: string
  durationMinutes: number
  cost: string
  costAmount: number
  steps: string[]
  color: string
  recommended?: boolean
  tag?: string
}

function calculateRoutes(origin: string, destination: string, preference: string = 'balanced'): RouteResult[] {
  // Estimate a rough distance based on Delhi's extent
  const baseDist = 5 + Math.random() * 20 // 5-25 km

  const routes: RouteResult[] = []

  // Metro route
  const originStation = findNearestStation(origin)
  const destStation = findNearestStation(destination)

  const metroTime = Math.round(baseDist * 2.5 + 5) // ~2.5 min/km + 5 min walk
  const metroCost = Math.max(10, Math.round(baseDist * 2.5))
  routes.push({
    mode: 'Metro',
    icon: '🚇',
    duration: `${metroTime} min`,
    durationMinutes: metroTime,
    cost: `₹${metroCost}`,
    costAmount: metroCost,
    steps: [
      `Walk to ${originStation?.name || 'nearest metro station'} (5 min)`,
      `Take ${originStation?.line || 'Blue Line'} towards ${destStation?.name || destination}`,
      ...(Math.random() > 0.5
        ? [`Change at ${metroStations[Math.floor(Math.random() * 5)].name}`]
        : []),
      `Exit at ${destStation?.name || 'nearest station'} (${Math.round(metroTime * 0.8)} min)`,
      `Walk to ${destination} (3 min)`,
    ],
    color: '#0066CC',
  })

  // Bus route
  const busTime = Math.round(baseDist * 4 + 10) // ~4 min/km + waiting
  const busCost = Math.max(5, Math.round(baseDist * 1.5))
  routes.push({
    mode: 'Bus',
    icon: '🚌',
    duration: `${busTime} min`,
    durationMinutes: busTime,
    cost: `₹${busCost}`,
    costAmount: busCost,
    steps: [
      `Walk to nearest bus stop (5 min)`,
      `Take DTC Bus ${100 + Math.floor(Math.random() * 900)} towards ${destination}`,
      ...(Math.random() > 0.6
        ? [`Change bus at ${['ISBT', 'Nehru Place', 'CP', 'Saket'][Math.floor(Math.random() * 4)]}`]
        : []),
      `Alight at ${destination} bus stop`,
      `Walk to destination (4 min)`,
    ],
    color: '#27AE60',
  })

  // Cab route
  const cabTime = Math.round(baseDist * 2.2 + 3)
  const cabCost = Math.round(50 + baseDist * 14) // ₹50 base + ₹14/km
  routes.push({
    mode: 'Cab',
    icon: '🚕',
    duration: `${cabTime} min`,
    durationMinutes: cabTime,
    cost: `₹${cabCost}`,
    costAmount: cabCost,
    steps: [
      `Book cab from ${origin}`,
      `Direct drive to ${destination}`,
      `Estimated arrival: ${cabTime} min`,
    ],
    color: '#F39C12',
  })

  // Walking (only if < 5 km)
  if (baseDist < 5) {
    const walkTime = Math.round(baseDist * 12)
    routes.push({
      mode: 'Walking',
      icon: '🚶',
      duration: `${walkTime} min`,
      durationMinutes: walkTime,
      cost: 'Free',
      costAmount: 0,
      steps: [
        `Walk from ${origin} to ${destination}`,
        `Distance: ${baseDist.toFixed(1)} km`,
      ],
      color: '#8E44AD',
    })
  }

  // Auto-rickshaw
  const autoTime = Math.round(baseDist * 3 + 5)
  const autoCost = Math.round(30 + baseDist * 10)
  routes.push({
    mode: 'Auto',
    icon: '🛺',
    duration: `${autoTime} min`,
    durationMinutes: autoTime,
    cost: `₹${autoCost}`,
    costAmount: autoCost,
    steps: [
      `Find auto-rickshaw near ${origin}`,
      `Negotiate fare to ${destination}`,
      `Ride through local streets`,
    ],
    color: '#1ABC9C',
  })

  // Tag recommended routes
  const sorted = [...routes]
  if (preference === 'fastest') {
    sorted.sort((a, b) => a.durationMinutes - b.durationMinutes)
  } else if (preference === 'cheapest') {
    sorted.sort((a, b) => a.costAmount - b.costAmount)
  } else {
    // Balanced: weighted score
    sorted.sort((a, b) => {
      const scoreA = a.durationMinutes * 0.6 + a.costAmount * 0.4
      const scoreB = b.durationMinutes * 0.6 + b.costAmount * 0.4
      return scoreA - scoreB
    })
  }

  sorted[0].recommended = true
  sorted[0].tag = preference === 'fastest' ? '⚡ Fastest' : preference === 'cheapest' ? '💰 Cheapest' : '⭐ Recommended'

  return sorted
}

export async function transportRoutes(app: FastifyInstance): Promise<void> {
  // ─── POST /api/transport/route ────────────────────────────
  app.post('/route', async (request, reply) => {
    const { origin, destination, mode } = validate(routeQuerySchema, request.body)

    const routes = calculateRoutes(origin, destination, mode || 'balanced')

    sendSuccess(reply, {
      origin,
      destination,
      preference: mode || 'balanced',
      routes,
    })
  })

  // ─── GET /api/transport/stations ──────────────────────────
  app.get('/stations', async (_request, reply) => {
    sendSuccess(reply, metroStations)
  })

  // ─── GET /api/transport/lines ─────────────────────────────
  app.get('/lines', async (_request, reply) => {
    const lines = [
      { name: 'Red Line', color: '#CC0000', stations: metroStations.filter((s) => s.line.includes('Red')).length },
      { name: 'Yellow Line', color: '#FFDD00', stations: metroStations.filter((s) => s.line.includes('Yellow')).length },
      { name: 'Blue Line', color: '#0066CC', stations: metroStations.filter((s) => s.line.includes('Blue')).length },
      { name: 'Green Line', color: '#00CC00', stations: metroStations.filter((s) => s.line.includes('Green')).length },
      { name: 'Violet Line', color: '#9B59B6', stations: metroStations.filter((s) => s.line.includes('Violet')).length },
      { name: 'Magenta Line', color: '#E91E63', stations: metroStations.filter((s) => s.line.includes('Magenta')).length },
    ]
    sendSuccess(reply, lines)
  })
}
