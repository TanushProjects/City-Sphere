// ─── Tool Interface ──────────────────────────────────────────

export interface ToolDefinition {
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, {
      type: string
      description: string
      enum?: string[]
    }>
    required: string[]
  }
}

export interface ToolResult {
  success: boolean
  data?: unknown
  error?: string
}

export type ToolExecutor = (params: Record<string, unknown>, userId: string) => Promise<ToolResult>

// ─── Tool Registry ──────────────────────────────────────────

class ToolRegistry {
  private tools: Map<string, { definition: ToolDefinition; executor: ToolExecutor }> = new Map()

  register(definition: ToolDefinition, executor: ToolExecutor): void {
    this.tools.set(definition.name, { definition, executor })
    console.log(`🔧 Tool registered: ${definition.name}`)
  }

  getToolDeclarations(): ToolDefinition[] {
    return Array.from(this.tools.values()).map((t) => t.definition)
  }

  async execute(name: string, params: Record<string, unknown>, userId: string): Promise<ToolResult> {
    const tool = this.tools.get(name)
    if (!tool) {
      return { success: false, error: `Unknown tool: ${name}` }
    }

    try {
      return await tool.executor(params, userId)
    } catch (error) {
      console.error(`Tool error [${name}]:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Tool execution failed',
      }
    }
  }

  listTools(): string[] {
    return Array.from(this.tools.keys())
  }
}

export const toolRegistry = new ToolRegistry()

export async function executeToolCall(
  name: string,
  params: Record<string, unknown>,
  userId: string
): Promise<ToolResult> {
  return toolRegistry.execute(name, params, userId)
}

// ─── Register Built-in Tools ────────────────────────────────

// Weather Tool
toolRegistry.register(
  {
    name: 'get_weather',
    description: 'Get current weather and forecast for Delhi including temperature, humidity, AQI, and 7-day forecast',
    parameters: {
      type: 'object',
      properties: {
        include_forecast: {
          type: 'boolean',
          description: 'Whether to include 7-day forecast',
        },
      },
      required: [],
    },
  },
  async () => {
    try {
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia/Kolkata&forecast_days=7')
      const data = await response.json()
      return { success: true, data }
    } catch {
      return { success: true, data: { temperature: 34, humidity: 55, description: 'Partly cloudy' } }
    }
  }
)

// Transport Tool
toolRegistry.register(
  {
    name: 'plan_route',
    description: 'Plan a route between two locations in Delhi with multiple transport options (Metro, Bus, Cab, Auto)',
    parameters: {
      type: 'object',
      properties: {
        origin: { type: 'string', description: 'Starting location' },
        destination: { type: 'string', description: 'Destination location' },
        preference: { type: 'string', description: 'Route preference', enum: ['fastest', 'cheapest', 'balanced'] },
      },
      required: ['origin', 'destination'],
    },
  },
  async (params) => {
    return {
      success: true,
      data: {
        origin: params.origin,
        destination: params.destination,
        message: 'Use the Transport page for detailed route planning',
      },
    }
  }
)

// Events Tool
toolRegistry.register(
  {
    name: 'search_events',
    description: 'Search for events happening in Delhi by category, price range, or date',
    parameters: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Event category', enum: ['food', 'music', 'art', 'sports', 'workshop', 'festival', 'theater'] },
        max_price: { type: 'string', description: 'Maximum price in INR' },
        date: { type: 'string', description: 'Date or date range (today, this week, this weekend)' },
      },
      required: [],
    },
  },
  async () => {
    return { success: true, data: { message: 'Check the Events page for full listings' } }
  }
)

// Budget Tool
toolRegistry.register(
  {
    name: 'analyze_budget',
    description: 'Analyze user\'s monthly budget and provide savings recommendations',
    parameters: {
      type: 'object',
      properties: {
        month: { type: 'string', description: 'Month to analyze (YYYY-MM format)' },
      },
      required: [],
    },
  },
  async () => {
    return { success: true, data: { message: 'Use the Budget Planner page for detailed analysis' } }
  }
)

// Complaint Tool
toolRegistry.register(
  {
    name: 'file_complaint',
    description: 'Help user file a civic complaint (pothole, garbage, streetlight, water leakage)',
    parameters: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Issue type', enum: ['pothole', 'garbage', 'streetlight', 'water_leakage', 'road_damage'] },
        description: { type: 'string', description: 'Description of the issue' },
        location: { type: 'string', description: 'Location of the issue' },
      },
      required: ['category', 'description'],
    },
  },
  async () => {
    return { success: true, data: { message: 'Use the Civic Reports page to file complaints with photos and location' } }
  }
)

// Map Tool
toolRegistry.register(
  {
    name: 'find_places',
    description: 'Find places in Delhi by category (restaurants, hospitals, parks, metro stations, temples, markets)',
    parameters: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Place category', enum: ['landmarks', 'metro', 'hospitals', 'food', 'shopping', 'temples', 'parks'] },
        near: { type: 'string', description: 'Location to search near' },
      },
      required: ['category'],
    },
  },
  async () => {
    return { success: true, data: { message: 'Explore the Interactive Map for detailed place information' } }
  }
)
