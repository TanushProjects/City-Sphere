# 🌆 CitySphere — Smart City Digital Twin

<p align="center">
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
    <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP">
</p>

CitySphere is a frontend-only, animated digital twin demo for Indian cities (demo data for Delhi). It provides a live dashboard, transport planner, events radar, crowd prediction, civic issue reporting, interactive map and a budget planner — all without a backend (mock data only).

Quick links
- Demo data: Delhi (mock)
- No API keys required for maps (Leaflet + OpenStreetMap)

## Key Features

- Live city dashboard: weather, AQI, traffic heatmap, metro countdown, animated gradients
- Smart transport & route planner: bus/metro comparisons, fastest vs cheapest routes, travel-time estimates
- City events radar: filterable events, flying-card animations
- Crowd & rush predictor: mall/metro/market crowd levels, best-visit suggestions
- Civic issue reporting: potholes, garbage, streetlight reports saved to localStorage
- Interactive city map: 60+ Delhi locations, filters (Landmarks, Metro, Hospitals, Food, Shopping, Temples, Parks), directions
- Visual budget planner: sliders for rent/food/commute, animated charts

## Tech Stack

- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Styling: Tailwind CSS + custom CSS variables
- Animations: GSAP (ScrollTrigger)
- Maps: Leaflet + OpenStreetMap (FREE — no API key)
- Charts: Chart.js
- Icons: Lucide

## Project Structure

```
CitySphere/
├── frontend/
│   ├── index.html          # Dashboard
│   ├── events.html         # Events radar
│   ├── transport.html      # Route planner
│   ├── map.html            # City map & issues
│   ├── budget.html         # Budget planner
│   ├── scripts/
│   │   └── main.js         # Core JS with mock data
│   └── styles/
│       └── style.css       # Main stylesheet
├── README.md
├── DEPLOYMENT.md
└── ADDING_DATA.md
```

## Quick Start

Recommended: VS Code Live Server

1. Open the `frontend` folder in VS Code  
2. Install "Live Server" extension  
3. Right-click `index.html` → "Open with Live Server"

Other options:

- Using a static server:
    ```bash
    cd frontend
    npx serve .
    # or
    python -m http.server 3000
    ```
- Direct browser: double-click `frontend/index.html`

## Map & Data

Map implementation: Leaflet + OpenStreetMap (no API key).

Included Delhi locations (sample counts):
- Landmarks: 15+
- Hospitals: 6+
- Metro stations: 6+
- Food spots: 6+
- Shopping areas: 6+
- Temples: 6+
- Parks: 6+

To add or edit locations, see ADDING_DATA.md or update `delhiLocations` in `frontend/scripts/main.js`:

```javascript
const MapManager = {
    delhiLocations: {
        landmarks: [
            {
                name: 'Your Place',
                lat: 28.1234,
                lng: 77.5678,
                icon: '🏛️',
                address: 'Full Address',
                description: 'Brief description'
            },
            // ...
        ],
        // other categories...
    }
};
```

## Design System

- Themes: Day (light) & Night (dark with neon accents)
- Animations: GSAP scroll-triggered, hover micro-interactions, flying cards, pulsating indicators
- Components: glassmorphism cards, gradient text, 3D hover transforms, animated charts
- Responsive: Desktop (full layout), Tablet (stacked grid), Mobile (single-column)

## Data & Persistence

- All data is mock/demo and stored client-side
- Civic reports persist to browser localStorage
- No server or database required

## Contribute

- Add locations or events via ADDING_DATA.md
- Keep changes confined to frontend files when testing locally

## License

MIT License — free to use and adapt.

## Acknowledgments

- OpenStreetMap & Leaflet for maps
- GreenSock (GSAP) for animations
- Chart.js for charts
- Unsplash for images
- Lucide for icons

---

Made with ❤️ for Indian cities

