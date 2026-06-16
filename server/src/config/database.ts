import mongoose from 'mongoose'
import { config } from './index.js'

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(config.mongodb.uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    })
    console.log('✅ MongoDB connected successfully')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    console.log('⚠️  Running in demo mode without database')
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect()
    console.log('📦 MongoDB disconnected')
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error)
  }
}
