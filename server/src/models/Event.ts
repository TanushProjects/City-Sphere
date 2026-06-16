import mongoose, { Schema, type Document } from 'mongoose'

export interface IEvent extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  description: string
  category: 'food' | 'music' | 'art' | 'sports' | 'workshop' | 'festival' | 'theater' | 'other'
  date: Date
  endDate?: Date
  time: string
  location: {
    name: string
    address: string
    lat: number
    lng: number
  }
  price: number
  maxPrice?: number
  currency: string
  featured: boolean
  image?: string
  organizer: string
  tags: string[]
  attendees: number
  maxAttendees?: number
  createdAt: Date
  updatedAt: Date
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      enum: ['food', 'music', 'art', 'sports', 'workshop', 'festival', 'theater', 'other'],
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    endDate: Date,
    time: {
      type: String,
      required: true,
    },
    location: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxPrice: Number,
    currency: {
      type: String,
      default: 'INR',
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    image: String,
    organizer: {
      type: String,
      required: true,
    },
    tags: [{ type: String }],
    attendees: {
      type: Number,
      default: 0,
    },
    maxAttendees: Number,
  },
  {
    timestamps: true,
  }
)

eventSchema.index({ category: 1, date: 1 })
eventSchema.index({ featured: 1, date: 1 })

export const Event = mongoose.model<IEvent>('Event', eventSchema)
