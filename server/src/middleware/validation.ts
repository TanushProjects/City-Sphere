import { z } from 'zod'
import { ValidationError } from '../utils/errors.js'

// ─── Auth Schemas ────────────────────────────────────────────

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required').max(100),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// ─── Chat Schemas ────────────────────────────────────────────

export const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message is required').max(5000),
  chatId: z.string().optional(),
})

// ─── Complaint Schemas ───────────────────────────────────────

export const createComplaintSchema = z.object({
  category: z.enum(['pothole', 'garbage', 'streetlight', 'water_leakage', 'road_damage', 'other']),
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(2000),
  location: z.object({
    coordinates: z.tuple([z.number(), z.number()]),
    address: z.string().min(1),
    area: z.string().optional(),
  }),
  images: z.array(z.string()).max(5).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
})

// ─── Budget Schemas ──────────────────────────────────────────

export const budgetEntrySchema = z.object({
  category: z.string(),
  label: z.string().min(1),
  amount: z.number().min(0),
  type: z.enum(['income', 'expense']),
})

export const saveBudgetSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'),
  entries: z.array(budgetEntrySchema).min(1),
  notes: z.string().max(1000).optional(),
})

// ─── Transport Schemas ───────────────────────────────────────

export const routeQuerySchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  mode: z.enum(['fastest', 'cheapest', 'balanced']).optional(),
})

// ─── Event Schemas ───────────────────────────────────────────

export const eventFilterSchema = z.object({
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  featured: z.boolean().optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(50).optional(),
})

// ─── Validation Helper ──────────────────────────────────────

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    const errors = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
    throw new ValidationError(errors)
  }
  return result.data
}
