import mongoose, { Schema, type Document } from 'mongoose'

export interface IBudgetEntry {
  category: string
  label: string
  amount: number
  type: 'income' | 'expense'
}

export interface IBudget extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  month: string // Format: "YYYY-MM"
  entries: IBudgetEntry[]
  totalIncome: number
  totalExpense: number
  savings: number
  notes?: string
  aiAnalysis?: string
  createdAt: Date
  updatedAt: Date
}

const budgetEntrySchema = new Schema<IBudgetEntry>(
  {
    category: {
      type: String,
      required: true,
      enum: [
        'salary', 'freelance', 'investment', 'other_income',
        'rent', 'food', 'commute', 'utilities', 'entertainment',
        'healthcare', 'education', 'shopping', 'savings', 'other_expense',
      ],
    },
    label: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
  },
  { _id: false }
)

const budgetSchema = new Schema<IBudget>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    month: {
      type: String,
      required: true,
    },
    entries: [budgetEntrySchema],
    totalIncome: {
      type: Number,
      default: 0,
    },
    totalExpense: {
      type: Number,
      default: 0,
    },
    savings: {
      type: Number,
      default: 0,
    },
    notes: String,
    aiAnalysis: String,
  },
  {
    timestamps: true,
  }
)

budgetSchema.index({ userId: 1, month: -1 }, { unique: true })

// Auto-calculate totals before save
budgetSchema.pre('save', function () {
  this.totalIncome = this.entries
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0)
  this.totalExpense = this.entries
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0)
  this.savings = this.totalIncome - this.totalExpense
})

export const Budget = mongoose.model<IBudget>('Budget', budgetSchema)
