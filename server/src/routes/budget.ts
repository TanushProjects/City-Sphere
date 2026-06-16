import type { FastifyInstance } from 'fastify'
import { Budget } from '../models/index.js'
import { requireAuth, validate, saveBudgetSchema } from '../middleware/index.js'
import { sendSuccess } from '../utils/response.js'
import { NotFoundError } from '../utils/errors.js'

export async function budgetRoutes(app: FastifyInstance): Promise<void> {
  // ─── POST /api/budget ─────────────────────────────────────
  app.post('/', { preHandler: [requireAuth] }, async (request, reply) => {
    const data = validate(saveBudgetSchema, request.body)

    // Upsert — update if exists for the same month, create otherwise
    const budget = await Budget.findOneAndUpdate(
      { userId: request.userId, month: data.month },
      { ...data, userId: request.userId },
      { new: true, upsert: true, runValidators: true }
    )

    sendSuccess(reply, budget)
  })

  // ─── GET /api/budget ──────────────────────────────────────
  app.get('/', { preHandler: [requireAuth] }, async (request, reply) => {
    const query = request.query as { month?: string }

    if (query.month) {
      const budget = await Budget.findOne({
        userId: request.userId,
        month: query.month,
      })
      if (!budget) throw new NotFoundError('Budget for this month')
      sendSuccess(reply, budget)
    } else {
      // Return last 12 months
      const budgets = await Budget.find({ userId: request.userId })
        .sort({ month: -1 })
        .limit(12)
      sendSuccess(reply, budgets)
    }
  })

  // ─── GET /api/budget/summary ──────────────────────────────
  app.get('/summary', { preHandler: [requireAuth] }, async (request, reply) => {
    const budgets = await Budget.find({ userId: request.userId })
      .sort({ month: -1 })
      .limit(6)

    const summary = {
      months: budgets.map((b) => ({
        month: b.month,
        income: b.totalIncome,
        expense: b.totalExpense,
        savings: b.savings,
      })),
      averageIncome:
        budgets.length > 0
          ? Math.round(budgets.reduce((s, b) => s + b.totalIncome, 0) / budgets.length)
          : 0,
      averageExpense:
        budgets.length > 0
          ? Math.round(budgets.reduce((s, b) => s + b.totalExpense, 0) / budgets.length)
          : 0,
      totalSavings: budgets.reduce((s, b) => s + b.savings, 0),
    }

    sendSuccess(reply, summary)
  })

  // ─── DELETE /api/budget/:month ────────────────────────────
  app.delete('/:month', { preHandler: [requireAuth] }, async (request, reply) => {
    const { month } = request.params as { month: string }

    const result = await Budget.findOneAndDelete({
      userId: request.userId,
      month,
    })

    if (!result) throw new NotFoundError('Budget')
    sendSuccess(reply, { deleted: true })
  })
}
