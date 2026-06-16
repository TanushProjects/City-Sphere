// ========================================
// CITYSPHERE TYPE DEFINITIONS
// ========================================

export interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  preferences?: UserPreferences
  createdAt: string
}

export interface UserPreferences {
  preferredTransport: 'metro' | 'bus' | 'cab' | 'walking' | 'auto'
  budgetRange: { min: number; max: number }
  favoriteLocations: string[]
  theme: 'light' | 'dark' | 'system'
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  tools?: ToolCall[]
}

export interface ToolCall {
  name: string
  args: Record<string, unknown>
  result?: unknown
}

export interface Conversation {
  _id: string
  userId: string
  messages: ChatMessage[]
  summary?: string
  createdAt: string
  updatedAt: string
}

export interface CityEvent {
  _id: string
  title: string
  description: string
  category: EventCategory
  date: string
  endDate?: string
  location: {
    venue: string
    address: string
    lat?: number
    lng?: number
  }
  image: string
  price: string
  featured: boolean
  tags: string[]
}

export type EventCategory = 
  | 'Food'
  | 'Music'
  | 'Art'
  | 'Sports'
  | 'Workshop'
  | 'Festival'
  | 'Theater'
  | 'Standup'
  | 'Concert'
  | 'Nightlife'

export interface Complaint {
  _id: string
  userId: string
  complaintId: string
  category: ComplaintCategory
  description: string
  location: {
    address: string
    lat: number
    lng: number
  }
  images: string[]
  status: ComplaintStatus
  upvotes: number
  createdAt: string
  updatedAt: string
}

export type ComplaintCategory = 
  | 'pothole'
  | 'garbage'
  | 'streetlight'
  | 'water_leakage'
  | 'road_damage'
  | 'drainage'
  | 'other'

export type ComplaintStatus = 
  | 'Submitted'
  | 'Acknowledged'
  | 'In Progress'
  | 'Resolved'
  | 'Closed'

export interface BudgetEntry {
  _id: string
  userId: string
  month: string // YYYY-MM
  entries: BudgetItem[]
  totalIncome: number
  totalExpense: number
  savings: number
}

export interface BudgetItem {
  category: BudgetCategory
  amount: number
  label: string
}

export type BudgetCategory = 
  | 'rent'
  | 'food'
  | 'commute'
  | 'utilities'
  | 'entertainment'
  | 'shopping'
  | 'health'
  | 'education'
  | 'savings'
  | 'other'

export interface RouteOption {
  mode: TransportMode
  duration: number // minutes
  cost: number // INR
  distance: number // km
  steps: RouteStep[]
  recommended?: 'fastest' | 'cheapest' | 'balanced'
}

export interface RouteStep {
  instruction: string
  mode: TransportMode
  duration: number
  distance: number
  details?: string
}

export type TransportMode = 'metro' | 'bus' | 'walking' | 'cab' | 'auto'

export interface CityLocation {
  name: string
  lat: number
  lng: number
  icon: string
  address: string
  description: string
  category?: string
}

export interface CrowdData {
  place: string
  placeType: string
  level: 'low' | 'moderate' | 'high' | 'very_high'
  prediction: {
    bestTimeToVisit: string
  }
}

export interface WeatherData {
  city: string
  temperature: { current: number; high: number; low: number }
  condition: string
  humidity: number
  wind: number
  aqi: number
  rainChance: number
  icon: string
}

export interface MapLayer {
  id: string
  name: string
  icon: string
  visible: boolean
  color: string
}
