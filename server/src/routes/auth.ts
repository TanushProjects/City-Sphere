import type { FastifyInstance } from 'fastify'
import { User } from '../models/index.js'
import { requireAuth, validate, registerSchema, loginSchema } from '../middleware/index.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { ConflictError, UnauthorizedError } from '../utils/errors.js'

export async function authRoutes(app: FastifyInstance): Promise<void> {
  // ─── POST /api/auth/register ──────────────────────────────
  app.post('/register', async (request, reply) => {
    const { email, password, name } = validate(registerSchema, request.body)

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new ConflictError('A user with this email already exists')
    }

    // Create user
    const user = await User.create({ email, password, name })

    // Generate JWT
    const token = app.jwt.sign(
      { id: user._id.toString(), email: user.email },
      { expiresIn: '7d' }
    )

    sendSuccess(reply, {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        preferredCity: user.preferredCity,
      },
      token,
    }, 201)
  })

  // ─── POST /api/auth/login ─────────────────────────────────
  app.post('/login', async (request, reply) => {
    const { email, password } = validate(loginSchema, request.body)

    // Find user WITH password
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      throw new UnauthorizedError('Invalid email or password')
    }

    // Verify password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password')
    }

    // Generate JWT
    const token = app.jwt.sign(
      { id: user._id.toString(), email: user.email },
      { expiresIn: '7d' }
    )

    sendSuccess(reply, {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        preferredCity: user.preferredCity,
      },
      token,
    })
  })

  // ─── GET /api/auth/me ─────────────────────────────────────
  app.get('/me', { preHandler: [requireAuth] }, async (request, reply) => {
    const user = await User.findById(request.userId)
    if (!user) {
      throw new UnauthorizedError('User not found')
    }

    sendSuccess(reply, {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      preferredCity: user.preferredCity,
      createdAt: user.createdAt,
    })
  })

  // ─── PUT /api/auth/profile ────────────────────────────────
  app.put('/profile', { preHandler: [requireAuth] }, async (request, reply) => {
    const body = request.body as { name?: string; avatar?: string; preferredCity?: string }

    const updateFields: Record<string, unknown> = {}
    if (body.name) updateFields.name = body.name
    if (body.avatar !== undefined) updateFields.avatar = body.avatar
    if (body.preferredCity) updateFields.preferredCity = body.preferredCity

    const user = await User.findByIdAndUpdate(request.userId, updateFields, { new: true })
    if (!user) {
      throw new UnauthorizedError('User not found')
    }

    sendSuccess(reply, {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      preferredCity: user.preferredCity,
    })
  })
}
