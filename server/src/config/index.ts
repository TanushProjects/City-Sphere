import 'dotenv/config'

// Validate required secrets at startup — fail fast rather than run insecurely
const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret) {
  throw new Error(
    '[CitySphere] FATAL: JWT_SECRET environment variable is not set. ' +
    'Copy server/.env.example to server/.env and fill in your secrets before starting.'
  )
}

export const config = {
  port: parseInt(process.env.PORT || '5001'),
  host: process.env.HOST || '0.0.0.0',

  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/citysphere',
  },

  jwt: {
    // Loaded from environment — never hardcode a fallback for secrets
    secret: jwtSecret,
    expiresIn: '7d',
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  },

  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(','),
  },

  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    timeWindow: process.env.RATE_LIMIT_WINDOW || '1 minute',
  },
}
