import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, ChatMessage, WeatherData, CrowdData, CityEvent, Complaint, BudgetEntry } from '../types'

// ========================================
// THEME STORE
// ========================================
interface ThemeStore {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: newTheme })
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
      },
      setTheme: (theme) => {
        set({ theme })
        document.documentElement.classList.toggle('dark', theme === 'dark')
      },
    }),
    { name: 'citysphere-theme' }
  )
)

// ========================================
// AUTH STORE
// ========================================
interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (updates) => {
        const current = get().user
        if (current) {
          set({ user: { ...current, ...updates } })
        }
      },
    }),
    { name: 'citysphere-auth' }
  )
)

// ========================================
// CHAT STORE
// ========================================
interface ChatStore {
  messages: ChatMessage[]
  isLoading: boolean
  conversationId: string | null
  addMessage: (message: ChatMessage) => void
  setMessages: (messages: ChatMessage[]) => void
  setLoading: (loading: boolean) => void
  setConversationId: (id: string) => void
  clearChat: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  conversationId: null,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setLoading: (isLoading) => set({ isLoading }),
  setConversationId: (conversationId) => set({ conversationId }),
  clearChat: () => set({ messages: [], conversationId: null }),
}))

// ========================================
// CITY DATA STORE
// ========================================
interface CityDataStore {
  weather: WeatherData | null
  crowdData: CrowdData[]
  events: CityEvent[]
  complaints: Complaint[]
  budgets: BudgetEntry[]
  sidebarOpen: boolean
  setWeather: (data: WeatherData) => void
  setCrowdData: (data: CrowdData[]) => void
  setEvents: (events: CityEvent[]) => void
  setComplaints: (complaints: Complaint[]) => void
  setBudgets: (budgets: BudgetEntry[]) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useCityDataStore = create<CityDataStore>((set) => ({
  weather: null,
  crowdData: [],
  events: [],
  complaints: [],
  budgets: [],
  sidebarOpen: true,
  setWeather: (weather) => set({ weather }),
  setCrowdData: (crowdData) => set({ crowdData }),
  setEvents: (events) => set({ events }),
  setComplaints: (complaints) => set({ complaints }),
  setBudgets: (budgets) => set({ budgets }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}))
