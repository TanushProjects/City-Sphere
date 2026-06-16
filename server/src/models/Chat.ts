import mongoose, { Schema, type Document } from 'mongoose'

export interface IChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  toolCalls?: Array<{
    name: string
    args: Record<string, unknown>
    result?: unknown
  }>
  timestamp: Date
}

export interface IChat extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  title: string
  messages: IChatMessage[]
  summary?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    toolCalls: [
      {
        name: String,
        args: Schema.Types.Mixed,
        result: Schema.Types.Mixed,
      },
    ],
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
)

const chatSchema = new Schema<IChat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'New Conversation',
      maxlength: 200,
    },
    messages: [chatMessageSchema],
    summary: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

chatSchema.index({ userId: 1, createdAt: -1 })

export const Chat = mongoose.model<IChat>('Chat', chatSchema)
