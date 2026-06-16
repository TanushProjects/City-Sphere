import { GoogleGenerativeAI } from '@google/generative-ai'
import type { IChatMessage } from '../../models/Chat.js'
import { config } from '../../config/index.js'
import { toolRegistry, executeToolCall } from './tools/registry.js'

// ─── System Prompt ──────────────────────────────────────────

const SYSTEM_PROMPT = `You are CitySphere AI — a smart, helpful, and friendly digital assistant for navigating city life in Delhi, India.

**Your Personality:**
- Warm, enthusiastic, and knowledgeable about Delhi
- Use occasional Hindi words naturally (namaste, yaar, etc.)
- Be concise but informative
- Add relevant emojis to make responses engaging

**Your Capabilities:**
1. 🚇 **Transport Planning**: Routes via Metro, Bus, Cab, Auto, Walking. Know Delhi Metro lines, major bus routes, and traffic patterns.
2. 🌤️ **Weather**: Current weather, forecasts, AQI levels, outfit/activity suggestions.
3. 🎪 **City Events**: Discover concerts, festivals, food fests, workshops, exhibitions happening in Delhi.
4. 💰 **Budget Management**: Analyze expenses, suggest savings, compare costs of living.
5. 🏥 **Civic Issues**: Help report potholes, garbage, broken streetlights; track complaint status.
6. 🗺️ **City Navigation**: Recommend places — restaurants, hospitals, parks, markets, temples, metro stations.
7. 📊 **City Stats**: Crowd levels, rush predictions, best times to visit popular spots.

**Guidelines:**
- Always provide specific, actionable information
- Include estimated costs in INR (₹) when relevant
- Mention safety tips for late-night travel
- Suggest alternatives when the preferred option isn't ideal
- For route queries, compare at least 2-3 modes of transport
- If you don't know something specific, say so honestly

**Delhi Knowledge:**
- Major areas: Connaught Place, Chandni Chowk, Hauz Khas, Saket, Dwarka, Noida, Gurgaon
- Metro lines: Red, Yellow, Blue, Green, Violet, Magenta, Pink, Airport Express
- Key landmarks: India Gate, Red Fort, Qutub Minar, Lotus Temple, Akshardham
- Food hubs: Chandni Chowk (street food), Hauz Khas Village, Khan Market, Connaught Place
- Hospitals: AIIMS, Safdarjung, Max, Fortis, Apollo
- Shopping: Sarojini Nagar, Lajpat Nagar, South Ex, Select Citywalk, DLF Mall`

// ─── AI Agent ───────────────────────────────────────────────

interface AIResponse {
  content: string
  toolCalls?: Array<{
    name: string
    args: Record<string, unknown>
    result?: unknown
  }>
}

export async function processMessage(
  userMessage: string,
  conversationHistory: IChatMessage[],
  userId: string
): Promise<AIResponse> {
  // If no API key, return a clear error
  if (!config.gemini.apiKey) {
    return {
      content: `⚠️ **Gemini API Key Not Configured**

The AI assistant requires a Gemini API key to function. Please:

1. Go to [Google AI Studio](https://aistudio.google.com/apikey) and create an API key
2. Add it to your server \`.env\` file: \`GEMINI_API_KEY=your_key_here\`
3. Restart the server

Once configured, I'll be able to help you with routes, weather, events, budget, and more! 🚀`,
    }
  }

  try {
    const genAI = new GoogleGenerativeAI(config.gemini.apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT,
    })

    // Build conversation context
    const history = conversationHistory.slice(-10).map((msg) => ({
      role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
      parts: [{ text: msg.content }],
    }))

    const chat = model.startChat({
      history: history.filter((h) => h.role === 'user' || h.role === 'model'),
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    })

    // Get tool declarations
    const tools = toolRegistry.getToolDeclarations()

    const result = await chat.sendMessage(userMessage)
    const response = result.response
    const text = response.text()

    return {
      content: text,
    }
  } catch (error) {
    console.error('AI processing error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Provide a helpful error message based on the error type
    if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
      return {
        content: `⏳ **Rate Limit Reached**

The Gemini API free tier has a limit of 15 requests per minute. Please wait a moment and try again.

💡 *Tip: Upgrade to a paid plan at [Google AI Studio](https://aistudio.google.com/) for higher limits.*`,
      }
    }

    if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('401') || errorMessage.includes('403')) {
      return {
        content: `🔑 **Invalid API Key**

Your Gemini API key appears to be invalid or expired. Please:

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Update it in your server \`.env\` file
4. Restart the server`,
      }
    }

    return {
      content: `❌ **AI Error**

Something went wrong while processing your request: ${errorMessage}

Please try again in a moment. If the issue persists, check your server logs for details.`,
    }
  }
}
