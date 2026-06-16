# 🌆 City Sphere — Frontend (Client)

React 19 + TypeScript + Vite frontend for the City Sphere smart city dashboard.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 8** — lightning-fast dev server & build tool
- **Tailwind CSS 3** — utility-first styling
- **Framer Motion** — smooth page & component animations
- **Zustand** — lightweight global state management
- **React Router DOM 7** — client-side routing
- **Leaflet + React-Leaflet** — interactive city map
- **Chart.js + react-chartjs-2** — data visualizations
- **Radix UI** — accessible, unstyled UI primitives
- **Lucide React** — icon set
- **Axios** — HTTP client for API calls

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | Live city stats, weather, AQI, metro |
| `/map` | City Map | Interactive Leaflet map with 60+ Delhi locations |
| `/transport` | Transport | Metro/bus route planner |
| `/events` | Events | City events radar with filters |
| `/civic` | Civic | Report potholes, garbage, streetlights |
| `/budget` | Budget | Cost-of-living planner with charts |
| `/assistant` | AI Assistant | Gemini-powered city chatbot |

## Development

```bash
# From the root of the project (recommended)
npm run dev

# Or from this directory only
npm run dev
```

Frontend runs at **http://localhost:5173** (or next available port).

The Vite dev server proxies all `/api/*` requests to `http://localhost:5001` (the backend).

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Proxy Configuration

API calls are proxied via `vite.config.ts`:

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5001',
      changeOrigin: true,
    },
  },
}
```

This means in the code you just call `/api/weather` — no need to hardcode the backend URL.
