import type { FastifyRequest, FastifyReply } from 'fastify'
import { UnauthorizedError } from '../utils/errors.js'

// Extend Fastify request with user data
declare module 'fastify' {
  interface FastifyRequest {
    userId?: string
    userEmail?: string
  }
}

/**
 * Middleware: Require valid JWT token
 */
export async function requireAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    await request.jwtVerify()
    const payload = (request as any).user as { id: string; email: string }
    request.userId = payload.id
    request.userEmail = payload.email
  } catch {
    throw new UnauthorizedError('Invalid or expired token')
  }
}

/**
 * Middleware: Optional auth — sets userId if token present, doesn't fail otherwise
 */
export async function optionalAuth(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  try {
    await request.jwtVerify()
    const payload = (request as any).user as { id: string; email: string }
    request.userId = payload.id
    request.userEmail = payload.email
  } catch {
    // Token missing or invalid — that's fine, continue as guest
  }
}
