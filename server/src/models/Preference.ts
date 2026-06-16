import mongoose, { Schema, type Document } from 'mongoose'

export interface IPreference extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  preferredTransport: string
  budgetRange: {
    min: number
    max: number
  }
  favoriteLocations: Array<{
    name: string
    lat: number
    lng: number
    category: string
  }>
  interests: string[]
  searchHistory: Array<{
    query: string
    timestamp: Date
  }>
  homeLocation?: {
    name: string
    lat: number
    lng: number
  }
  workLocation?: {
    name: string
    lat: number
    lng: number
  }
  createdAt: Date
  updatedAt: Date
}

const preferenceSchema = new Schema<IPreference>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    preferredTransport: {
      type: String,
      default: 'metro',
    },
    budgetRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 50000 },
    },
    favoriteLocations: [
      {
        name: String,
        lat: Number,
        lng: Number,
        category: String,
      },
    ],
    interests: [{ type: String }],
    searchHistory: [
      {
        query: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    homeLocation: {
      name: String,
      lat: Number,
      lng: Number,
    },
    workLocation: {
      name: String,
      lat: Number,
      lng: Number,
    },
  },
  {
    timestamps: true,
  }
)

export const Preference = mongoose.model<IPreference>('Preference', preferenceSchema)
