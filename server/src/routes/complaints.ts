import type { FastifyInstance } from 'fastify'
import { Complaint } from '../models/index.js'
import { requireAuth, validate, createComplaintSchema } from '../middleware/index.js'
import { sendSuccess, sendPaginated } from '../utils/response.js'
import { NotFoundError } from '../utils/errors.js'

function generateComplaintId(): string {
  const prefix = 'CS'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export async function complaintRoutes(app: FastifyInstance): Promise<void> {
  // ─── POST /api/complaints ─────────────────────────────────
  app.post('/', { preHandler: [requireAuth] }, async (request, reply) => {
    const data = validate(createComplaintSchema, request.body)

    const complaint = await Complaint.create({
      ...data,
      userId: request.userId,
      complaintId: generateComplaintId(),
      location: {
        type: 'Point',
        ...data.location,
      },
    })

    sendSuccess(reply, complaint, 201)
  })

  // ─── GET /api/complaints ──────────────────────────────────
  app.get('/', { preHandler: [requireAuth] }, async (request, reply) => {
    const query = request.query as {
      page?: string
      limit?: string
      status?: string
      category?: string
    }

    const page = parseInt(query.page || '1')
    const limit = parseInt(query.limit || '10')
    const skip = (page - 1) * limit

    const filter: Record<string, unknown> = { userId: request.userId }
    if (query.status) filter.status = query.status
    if (query.category) filter.category = query.category

    const [complaints, total] = await Promise.all([
      Complaint.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Complaint.countDocuments(filter),
    ])

    sendPaginated(reply, complaints, total, page, limit)
  })

  // ─── GET /api/complaints/all ──────────────────────────────
  app.get('/all', async (request, reply) => {
    const query = request.query as {
      page?: string
      limit?: string
      status?: string
      category?: string
    }

    const page = parseInt(query.page || '1')
    const limit = parseInt(query.limit || '20')
    const skip = (page - 1) * limit

    const filter: Record<string, unknown> = {}
    if (query.status) filter.status = query.status
    if (query.category) filter.category = query.category

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .populate('userId', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Complaint.countDocuments(filter),
    ])

    sendPaginated(reply, complaints, total, page, limit)
  })

  // ─── GET /api/complaints/:id ──────────────────────────────
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const complaint = await Complaint.findById(id).populate('userId', 'name avatar')
    if (!complaint) throw new NotFoundError('Complaint')
    sendSuccess(reply, complaint)
  })

  // ─── POST /api/complaints/:id/upvote ──────────────────────
  app.post('/:id/upvote', { preHandler: [requireAuth] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const complaint = await Complaint.findById(id)
    if (!complaint) throw new NotFoundError('Complaint')

    const userId = request.userId!
    const alreadyUpvoted = complaint.upvotedBy.some(
      (uid) => uid.toString() === userId
    )

    if (alreadyUpvoted) {
      // Remove upvote
      complaint.upvotedBy = complaint.upvotedBy.filter(
        (uid) => uid.toString() !== userId
      ) as any
      complaint.upvotes = Math.max(0, complaint.upvotes - 1)
    } else {
      // Add upvote
      complaint.upvotedBy.push(userId as any)
      complaint.upvotes += 1
    }

    await complaint.save()
    sendSuccess(reply, { upvotes: complaint.upvotes, upvoted: !alreadyUpvoted })
  })
}
