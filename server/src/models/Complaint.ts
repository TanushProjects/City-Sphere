import mongoose, { Schema, type Document } from 'mongoose'

export interface IComplaint extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  complaintId: string
  category: 'pothole' | 'garbage' | 'streetlight' | 'water_leakage' | 'road_damage' | 'other'
  title: string
  description: string
  location: {
    type: 'Point'
    coordinates: [number, number] // [lng, lat]
    address: string
    area: string
  }
  images: string[]
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected'
  priority: 'low' | 'medium' | 'high' | 'critical'
  upvotes: number
  upvotedBy: mongoose.Types.ObjectId[]
  resolution?: string
  resolvedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const complaintSchema = new Schema<IComplaint>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    complaintId: {
      type: String,
      unique: true,
      required: true,
    },
    category: {
      type: String,
      enum: ['pothole', 'garbage', 'streetlight', 'water_leakage', 'road_damage', 'other'],
      required: true,
      index: true,
    },
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
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      area: {
        type: String,
        default: '',
      },
    },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'resolved', 'rejected'],
      default: 'pending',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    resolution: String,
    resolvedAt: Date,
  },
  {
    timestamps: true,
  }
)

complaintSchema.index({ 'location.coordinates': '2dsphere' })
complaintSchema.index({ userId: 1, createdAt: -1 })

export const Complaint = mongoose.model<IComplaint>('Complaint', complaintSchema)
