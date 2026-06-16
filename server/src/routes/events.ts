import type { FastifyInstance } from 'fastify'
import { Event } from '../models/index.js'
import { sendSuccess, sendPaginated } from '../utils/response.js'
import { NotFoundError } from '../utils/errors.js'

export async function eventRoutes(app: FastifyInstance): Promise<void> {
  // ─── GET /api/events ──────────────────────────────────────
  app.get('/', async (request, reply) => {
    const query = request.query as {
      category?: string
      minPrice?: string
      maxPrice?: string
      startDate?: string
      endDate?: string
      featured?: string
      search?: string
      page?: string
      limit?: string
    }

    const page = parseInt(query.page || '1')
    const limit = parseInt(query.limit || '12')
    const skip = (page - 1) * limit

    const filter: Record<string, unknown> = {}

    if (query.category) filter.category = query.category
    if (query.featured === 'true') filter.featured = true
    if (query.minPrice || query.maxPrice) {
      filter.price = {}
      if (query.minPrice) (filter.price as any).$gte = parseInt(query.minPrice)
      if (query.maxPrice) (filter.price as any).$lte = parseInt(query.maxPrice)
    }
    if (query.startDate || query.endDate) {
      filter.date = {}
      if (query.startDate) (filter.date as any).$gte = new Date(query.startDate)
      if (query.endDate) (filter.date as any).$lte = new Date(query.endDate)
    }
    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
        { tags: { $regex: query.search, $options: 'i' } },
      ]
    }

    const [events, total] = await Promise.all([
      Event.find(filter).sort({ date: 1 }).skip(skip).limit(limit),
      Event.countDocuments(filter),
    ])

    sendPaginated(reply, events, total, page, limit)
  })

  // ─── GET /api/events/featured ─────────────────────────────
  app.get('/featured', async (_request, reply) => {
    const events = await Event.find({ featured: true, date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(6)

    sendSuccess(reply, events)
  })

  // ─── GET /api/events/upcoming ─────────────────────────────
  app.get('/upcoming', async (_request, reply) => {
    const events = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(10)

    sendSuccess(reply, events)
  })

  // ─── GET /api/events/categories ───────────────────────────
  app.get('/categories', async (_request, reply) => {
    const categories = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    sendSuccess(
      reply,
      categories.map((c) => ({ name: c._id, count: c.count }))
    )
  })

  // ─── GET /api/events/:id ──────────────────────────────────
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const event = await Event.findById(id)
    if (!event) throw new NotFoundError('Event')
    sendSuccess(reply, event)
  })
}
