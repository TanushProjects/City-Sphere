import type { FastifyReply, FastifyRequest } from 'fastify'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    details?: unknown
  }
}

export function sendSuccess<T>(reply: FastifyReply, data: T, statusCode: number = 200): void {
  reply.status(statusCode).send({
    success: true,
    data,
  } satisfies ApiResponse<T>)
}

export function sendError(
  reply: FastifyReply,
  message: string,
  statusCode: number = 500,
  code: string = 'INTERNAL_ERROR',
  details?: unknown
): void {
  reply.status(statusCode).send({
    success: false,
    message,
    error: { code, details },
  } satisfies ApiResponse)
}

export function sendPaginated<T>(
  reply: FastifyReply,
  data: T[],
  total: number,
  page: number,
  limit: number
): void {
  reply.status(200).send({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  })
}
