# 🌆 City Sphere 2.0 — AI-Powered Smart City Digital Twin

<p align="center">
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
</p>

**City Sphere 2.0** is a full-stack, AI-powered smart city dashboard for Indian cities (demo data for Delhi). It features a React + TypeScript frontend, a Fastify REST API backend, MongoDB Atlas for persistence, and a Gemini AI assistant with real tool-calling capabilities.

---

## ✨ Features

- 🏙️ **Live City Dashboard** — Real-time weather, AQI, traffic, and metro data
- 🚇 **Smart Transport Planner** — Bus/metro comparisons, route optimization
- 📅 **City Events Radar** — Filterable events with animations
- 🗺️ **Interactive City Map** — 60+ Delhi locations (Landmarks, Metro, Hospitals, Food, Parks, Temples)
- 🏛️ **Civic Issue Reporting** — Report potholes, garbage, streetlights — persisted to DB
- 💰 **Visual Budget Planner** — Animated charts for rent/food/commute planning
- 🤖 **Gemini AI Assistant** — Context-aware city assistant with tool-calling (weather, transport, events, places)
- 🔐 **Auth System** — JWT-based registration & login

---

## 🏗️ Tech Stack

### Frontend (`/client`)
| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI Framework |
| Vite 8 | Build Tool & Dev Server |
| Tailwind CSS 3 | Styling |
| Framer Motion | Animations |
| Zustand | State Management |
| React Router DOM 7 | Routing |
| Leaflet + React-Leaflet | Interactive Maps |
| Chart.js + react-chartjs-2 | Data Visualizations |
| Radix UI | Accessible UI Components |
| Axios | HTTP Client |
| Lucide React | Icons |

### Backend (`/server`)
| Technology | Purpose |
|---|---|
| Fastify 5 | REST API Framework |
| TypeScript 6 | Type Safety |
| MongoDB + Mongoose | Database |
| `@fastify/jwt` | Authentication |
| `@fastify/cors` | Cross-Origin Resource Sharing |
| `@fastify/rate-limit` | API Rate Limiting |
| Google Generative AI SDK | Gemini AI Integration |
| bcryptjs | Password Hashing |
| Zod | Request Validation |
| dotenv | Environment Management |

---

## 📁 Project Structure

```
city-sphere/
├── client/                        # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/              # AuthModal (login/register)
│   │   │   ├── layout/            # Sidebar, ThemeToggle
│   │   │   └── ui/                # GlassCard, PageHeader, StatWidget
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx  # Main city overview
│   │   │   ├── MapPage.tsx        # Interactive Leaflet map
│   │   │   ├── TransportPage.tsx  # Route planner
│   │   │   ├── EventsPage.tsx     # City events
│   │   │   ├── CivicPage.tsx      # Issue reporting
│   │   │   ├── BudgetPage.tsx     # Budget planner
│   │   │   └── AssistantPage.tsx  # Gemini AI chat
│   │   ├── store/                 # Zustand global state
│   │   ├── lib/                   # API client, utils, mock data
│   │   └── types/                 # Shared TypeScript types
│   ├── public/
│   └── vite.config.ts
│
├── server/                        # Fastify REST API
│   ├── src/
│   │   ├── config/
│   │   │   ├── index.ts           # App config (env vars)
│   │   │   └── database.ts        # MongoDB connection
│   │   ├── routes/
│   │   │   ├── auth.ts            # POST /api/auth/register, /login
│   │   │   ├── weather.ts         # GET /api/weather
│   │   │   ├── transport.ts       # GET /api/transport
│   │   │   ├── events.ts          # GET/POST /api/events
│   │   │   ├── budget.ts          # GET/POST /api/budget
│   │   │   ├── complaints.ts      # GET/POST /api/complaints
│   │   │   └── chat.ts            # POST /api/chat (AI)
│   │   ├── models/                # Mongoose schemas (User, Event, etc.)
│   │   ├── middleware/            # Auth, validation
│   │   ├── services/ai/           # Gemini agent + tool registry
│   │   ├── seeds/                 # Database seed script
│   │   └── app.ts                 # Fastify app entry point
│   ├── .env.example               # Environment variable template
│   └── tsconfig.json
│
├── frontend/                      # Legacy static HTML version (v1)
├── .gitignore
├── package.json                   # Root orchestrator scripts
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **MongoDB** (local) or a free [MongoDB Atlas](https://cloud.mongodb.com) cluster
- **Gemini API Key** — get one free at [aistudio.google.com](https://aistudio.google.com/apikey)

### 1. Clone the repository
```bash
git clone https://github.com/TanushProjects/City-Sphere.git
cd City-Sphere
```

### 2. Install all dependencies
```bash
npm run install:all
```

### 3. Set up environment variables
```bash
# Copy the template
copy server\.env.example server\.env
```

Then edit `server/.env` with your real values:
```env
PORT=5001
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/citysphere
JWT_SECRET=your_strong_random_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 4. Run the development servers
```bash
npm run dev
```

This starts both servers concurrently:
| Service | URL |
|---|---|
| 🌐 Frontend (Vite) | http://localhost:5173 |
| ⚡ Backend (Fastify) | http://localhost:5001 |

### 5. (Optional) Seed the database
```bash
npm run seed
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start both client and server in dev mode |
| `npm run dev:client` | Start only the Vite frontend |
| `npm run dev:server` | Start only the Fastify backend |
| `npm run build` | Build both client and server for production |
| `npm run install:all` | Install dependencies for client and server |
| `npm run seed` | Seed the MongoDB database with demo data |

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create account | ❌ |
| POST | `/api/auth/login` | Login & get JWT | ❌ |
| GET | `/api/weather` | Live weather data | ❌ |
| GET | `/api/transport/metro` | Metro station data | ❌ |
| GET | `/api/events` | City events list | ❌ |
| POST | `/api/events` | Create event | ✅ |
| GET | `/api/budget` | User budget data | ✅ |
| POST | `/api/budget` | Save budget | ✅ |
| GET | `/api/complaints` | Civic reports | ❌ |
| POST | `/api/complaints` | File a complaint | ✅ |
| POST | `/api/chat` | AI assistant chat | ✅ |

---

## 🔐 Security

- Passwords hashed with **bcryptjs**
- JWT tokens for authenticated routes
- Rate limiting on all API routes
- Environment secrets never hardcoded — loaded via `.env`
- `.env` is gitignored — see `server/.env.example` for the template

---

## 🤖 AI Assistant

The Gemini AI assistant uses **tool-calling** with these registered tools:

| Tool | What it does |
|---|---|
| `get_weather` | Fetches live weather & AQI for Delhi |
| `plan_route` | Suggests optimal metro/bus routes |
| `search_events` | Finds upcoming city events |
| `analyze_budget` | Helps with cost-of-living breakdown |
| `file_complaint` | Submits a civic issue on your behalf |
| `find_places` | Locates hospitals, parks, food spots, etc. |

---

## 📄 License

MIT License — free to use and adapt.

---

<p align="center">Made with ❤️ for Indian cities · City Sphere 2.0</p>
