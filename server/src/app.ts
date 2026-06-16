import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import { config } from './config/index.js'
import { connectDB } from './config/database.js'
import { AppError } from './utils/errors.js'

// Route imports
import { authRoutes } from './routes/auth.js'
import { chatRoutes } from './routes/chat.js'
import { complaintRoutes } from './routes/complaints.js'
import { eventRoutes } from './routes/events.js'
import { budgetRoutes } from './routes/budget.js'
import { transportRoutes } from './routes/transport.js'
import { weatherRoutes } from './routes/weather.js'

// ─── Create App ─────────────────────────────────────────────

const app = Fastify({
  logger: true,
})

// ─── Global Error Handler ───────────────────────────────────

app.setErrorHandler((error: any, _request, reply) => {
  if (error instanceof AppError) {
    reply.status(error.statusCode).send({
      success: false,
      message: error.message,
      error: { code: error.code },
    })
    return
  }

  // Fastify validation errors
  if (error.validation) {
    reply.status(400).send({
      success: false,
      message: 'Validation error',
      error: {
        code: 'VALIDATION_ERROR',
        details: error.validation,
      },
    })
    return
  }

  // Unknown errors
  console.error('Unhandled error:', error)
  reply.status(500).send({
    success: false,
    message: 'Internal server error',
    error: { code: 'INTERNAL_ERROR' },
  })
})

// ─── Plugins ────────────────────────────────────────────────

async function registerPlugins(): Promise<void> {
  // CORS
  await app.register(cors, {
    origin: config.cors.origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  })

  // JWT
  await app.register(jwt, {
    secret: config.jwt.secret,
    sign: { expiresIn: config.jwt.expiresIn },
  })

  // Rate limiting
  await app.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.timeWindow,
  })
}

// ─── Routes ─────────────────────────────────────────────────

async function registerRoutes(): Promise<void> {
  // Health check
  app.get('/api/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }))

  // API routes
  await app.register(authRoutes, { prefix: '/api/auth' })
  await app.register(chatRoutes, { prefix: '/api/chat' })
  await app.register(complaintRoutes, { prefix: '/api/complaints' })
  await app.register(eventRoutes, { prefix: '/api/events' })
  await app.register(budgetRoutes, { prefix: '/api/budget' })
  await app.register(transportRoutes, { prefix: '/api/transport' })
  await app.register(weatherRoutes, { prefix: '/api/weather' })
}

// ─── Start Server ───────────────────────────────────────────

async function start(): Promise<void> {
  try {
    // Connect to MongoDB
    await connectDB()

    // Register plugins and routes
    await registerPlugins()
    await registerRoutes()

    // Start listening
    const address = await app.listen({ port: config.port, host: config.host })

    console.log(`
  ╔══════════════════════════════════════════════════════╗
  ║                                                      ║
  ║   🌆  CitySphere API Server                          ║
  ║                                                      ║
  ║   🚀  Server:   ${address.padEnd(33)}║
  ║   🔑  JWT:      ${config.jwt.secret ? 'Configured' : '⚠️ Using default'.padEnd(33)}║
  ║   🤖  Gemini:   ${config.gemini.apiKey ? '✅ API Key set' : '⚠️ No API key (demo mode)'.padEnd(33)}║
  ║   🗄️  MongoDB:  ${config.mongodb.uri.substring(0, 30).padEnd(33)}║
  ║                                                      ║
  ╚══════════════════════════════════════════════════════╝
    `)
  } catch (error) {
    console.error('❌ Server start error:', error)
    process.exit(1)
  }
}

start()

// ─── Graceful Shutdown ──────────────────────────────────────

const signals = ['SIGINT', 'SIGTERM'] as const
for (const signal of signals) {
  process.on(signal, async () => {
    console.log(`\n📦 Received ${signal}, shutting down gracefully...`)
    await app.close()
    process.exit(0)
  })
}
