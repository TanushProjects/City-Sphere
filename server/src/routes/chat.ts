import type { FastifyInstance } from 'fastify'
import { Chat } from '../models/index.js'
import { requireAuth, validate, chatMessageSchema } from '../middleware/index.js'
import { sendSuccess } from '../utils/response.js'
import { NotFoundError } from '../utils/errors.js'
import { processMessage } from '../services/ai/agent.js'

export async function chatRoutes(app: FastifyInstance): Promise<void> {
  // ─── POST /api/chat ───────────────────────────────────────
  app.post('/', { preHandler: [requireAuth] }, async (request, reply) => {
    const { message, chatId } = validate(chatMessageSchema, request.body)

    let chat: InstanceType<typeof Chat>

    if (chatId) {
      // Continue existing conversation
      const existing = await Chat.findOne({ _id: chatId, userId: request.userId })
      if (!existing) throw new NotFoundError('Chat')
      chat = existing
    } else {
      // Start new conversation
      chat = new Chat({
        userId: request.userId,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        messages: [],
      })
    }

    // Add user message
    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    })

    // Process with AI
    const aiResponse = await processMessage(message, chat.messages, request.userId!)

    // Add AI response
    chat.messages.push({
      role: 'assistant',
      content: aiResponse.content,
      toolCalls: aiResponse.toolCalls,
      timestamp: new Date(),
    })

    // Auto-generate title from first message
    if (chat.messages.length <= 2) {
      chat.title = message.substring(0, 60) + (message.length > 60 ? '...' : '')
    }

    await chat.save()

    sendSuccess(reply, {
      chatId: chat._id.toString(),
      message: {
        role: 'assistant',
        content: aiResponse.content,
        toolCalls: aiResponse.toolCalls,
        timestamp: new Date(),
      },
    })
  })

  // ─── GET /api/chat/history ────────────────────────────────
  app.get('/history', { preHandler: [requireAuth] }, async (request, reply) => {
    const chats = await Chat.find({ userId: request.userId })
      .select('title createdAt updatedAt messages')
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean()

    const chatList = chats.map((c) => ({
      id: c._id!.toString(),
      title: c.title,
      messageCount: c.messages.length,
      lastMessage: c.messages[c.messages.length - 1]?.content?.substring(0, 100) || '',
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }))

    sendSuccess(reply, chatList)
  })

  // ─── GET /api/chat/:id ────────────────────────────────────
  app.get('/:id', { preHandler: [requireAuth] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const chat = await Chat.findOne({ _id: id, userId: request.userId })
    if (!chat) throw new NotFoundError('Chat')

    sendSuccess(reply, {
      id: chat._id.toString(),
      title: chat.title,
      messages: chat.messages,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    })
  })

  // ─── DELETE /api/chat/:id ─────────────────────────────────
  app.delete('/:id', { preHandler: [requireAuth] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const result = await Chat.findOneAndDelete({ _id: id, userId: request.userId })
    if (!result) throw new NotFoundError('Chat')
    sendSuccess(reply, { deleted: true })
  })
}
