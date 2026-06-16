import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// ─── Axios Instance ─────────────────────────────────────────

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('citysphere_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — clear and redirect
      localStorage.removeItem('citysphere_token')
      localStorage.removeItem('citysphere_user')
    }
    return Promise.reject(error)
  }
)

// ─── Auth API ───────────────────────────────────────────────

export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  getProfile: () =>
    api.get('/auth/me'),

  updateProfile: (data: { name?: string; avatar?: string; preferredCity?: string }) =>
    api.put('/auth/profile', data),
}

// ─── Chat API ───────────────────────────────────────────────

export const chatAPI = {
  sendMessage: (message: string, chatId?: string) =>
    api.post('/chat', { message, chatId }),

  getHistory: () =>
    api.get('/chat/history'),

  getChat: (id: string) =>
    api.get(`/chat/${id}`),

  deleteChat: (id: string) =>
    api.delete(`/chat/${id}`),
}

// ─── Complaints API ─────────────────────────────────────────

export const complaintsAPI = {
  create: (data: {
    category: string
    title: string
    description: string
    location: { coordinates: [number, number]; address: string; area?: string }
    images?: string[]
    priority?: string
  }) => api.post('/complaints', data),

  getMyComplaints: (params?: { page?: number; limit?: number; status?: string; category?: string }) =>
    api.get('/complaints', { params }),

  getAllComplaints: (params?: { page?: number; limit?: number; status?: string; category?: string }) =>
    api.get('/complaints/all', { params }),

  getComplaint: (id: string) =>
    api.get(`/complaints/${id}`),

  upvote: (id: string) =>
    api.post(`/complaints/${id}/upvote`),
}

// ─── Events API ─────────────────────────────────────────────

export const eventsAPI = {
  getEvents: (params?: {
    category?: string
    minPrice?: number
    maxPrice?: number
    startDate?: string
    endDate?: string
    featured?: boolean
    search?: string
    page?: number
    limit?: number
  }) => api.get('/events', { params }),

  getFeatured: () =>
    api.get('/events/featured'),

  getUpcoming: () =>
    api.get('/events/upcoming'),

  getCategories: () =>
    api.get('/events/categories'),

  getEvent: (id: string) =>
    api.get(`/events/${id}`),
}

// ─── Budget API ─────────────────────────────────────────────

export const budgetAPI = {
  save: (data: {
    month: string
    entries: Array<{ category: string; label: string; amount: number; type: 'income' | 'expense' }>
    notes?: string
  }) => api.post('/budget', data),

  get: (month?: string) =>
    api.get('/budget', { params: month ? { month } : undefined }),

  getSummary: () =>
    api.get('/budget/summary'),

  delete: (month: string) =>
    api.delete(`/budget/${month}`),
}

// ─── Transport API ──────────────────────────────────────────

export const transportAPI = {
  getRoute: (data: { origin: string; destination: string; mode?: string }) =>
    api.post('/transport/route', data),

  getStations: () =>
    api.get('/transport/stations'),

  getLines: () =>
    api.get('/transport/lines'),
}

// ─── Weather API ────────────────────────────────────────────

export const weatherAPI = {
  getCurrent: () =>
    api.get('/weather'),

  getForecast: () =>
    api.get('/weather/forecast'),
}
