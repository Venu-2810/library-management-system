# AgriSense DataHub

A real-time agricultural environmental data collection and monitoring platform. AgriSense automatically pulls live weather data for registered farm locations every few minutes, stores it for historical analysis, and presents it through a full-featured dashboard - built for farmers, agronomists, and researchers who need reliable, location-specific environmental data.

## Overview

AgriSense DataHub continuously collects weather data (temperature, humidity, rainfall, wind, UV index, cloud cover, and more) for any number of registered locations, using a background scheduler that runs independently of the web interface. The collected data feeds into live dashboards, historical trend charts, and CSV/Excel exports - with full admin visibility into system health and collection reliability.

## Features

- **Live Weather Dashboard** - auto-refreshing cards showing current conditions per location, with a manual "Trigger Collection" override
- **Automated Data Collection** - background scheduler fetches live data from Open-Meteo on a configurable interval (default: every 5-10 minutes) for all active locations
- **Historical Trends** - interactive line charts (temperature, humidity, rainfall, UV index) per location, powered by Recharts
- **Location Management** - full CRUD for farm locations, including crop type, soil type, coordinates, and status (active/inactive)
- **Admin & Monitoring** - real-time system health (collector/scheduler/DB status), collection success rate, system logs, and user management
- **Data Export** - generate CSV/Excel exports filtered by location, crop, state, or date range, with direct in-browser download
- **JWT Authentication** - secure login with access/refresh token flow and protected routes
- **Historical Backfill** - script to bulk-import a year worth of historical weather data via Open-Meteo archive API

## Tech Stack

**Backend**
- FastAPI (Python) - async REST API
- PostgreSQL + SQLAlchemy (async ORM)
- Alembic - database migrations
- APScheduler - background job scheduling
- httpx + tenacity - resilient external API calls with retry logic
- Open-Meteo API - weather, forecast, and historical archive data
- JWT (python-jose / passlib) - authentication

**Frontend**
- React 18 + TypeScript
- Vite - build tooling
- React Router - client-side routing
- Recharts - data visualization
- Axios - API client with interceptors for auth and error handling
- Custom component library (no UI framework dependency)

## Project Structure
agrisense/
├── backend/
│ ├── app/
│ │ ├── collectors/ # Weather/AQI/forecast data collectors (Open-Meteo)
│ │ ├── controllers/ # FastAPI route handlers
│ │ ├── models/ # SQLAlchemy ORM models
│ │ ├── repositories/ # Data access layer
│ │ ├── schemas/ # Pydantic request/response schemas
│ │ ├── services/ # Business logic layer
│ │ ├── scheduler/ # Background collection job + APScheduler setup
│ │ ├── scripts/ # One-off scripts (e.g. historical backfill)
│ │ └── utils/ # Shared utilities (auth, HTTP client, dependencies)
│ ├── alembic/ # Database migrations
│ ├── main.py # FastAPI app entrypoint
│ └── .env.example
└── frontend/
├── src/
│ ├── api/ # API client functions per resource
│ ├── components/ # Shared UI components (Layout, Dropdown, ProtectedRoute)
│ ├── context/ # Auth context/provider
│ ├── pages/ # Route-level pages (Dashboard, Locations, Trends, Admin, Export)
│ └── types/ # TypeScript interfaces matching backend schemas
└── .env.example


## Getting Started

### Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL 14+

### Backend Setup

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt

cp .env.example .env
# edit .env with your database URL and a secure JWT secret

alembic upgrade head
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be live at `http://localhost:8000`, with interactive docs at `http://localhost:8000/docs`.

On first run, a default admin user is seeded:
- **Email:** `admin@agrisense.com`
- **Password:** `admin123`

### Frontend Setup

```bash
cd frontend
npm install

cp .env.example .env
# confirm VITE_API_URL points to your backend

npm run dev
```

The app will be live at `http://localhost:5173`.

### Historical Data Backfill (optional)

To populate the database with a year of historical weather data for testing/demo purposes:

```bash
cd backend
python -m app.scripts.backfill_weather
```

Edit `LOCATIONS` and the date range at the top of the script to match your registered locations.

## Configuration

Key environment variables (see `.env.example` in each folder):

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL async connection string |
| `JWT_SECRET_KEY` | Secret used to sign auth tokens - change in production |
| `COLLECTION_INTERVAL_MINUTES` | How often the scheduler collects live data (default: 5) |
| `COLLECTOR_CONCURRENCY_LIMIT` | Max locations collected in parallel per cycle |
| `CORS_ORIGINS` | Comma-separated list of allowed frontend origins |
| `VITE_API_URL` | Backend API base URL used by the frontend |

## Notes

- The scheduler runs as a background task inside the FastAPI process - the backend must stay running continuously for automated collection to continue. It does not require any manual triggering.
- Exported files are currently written to disk on the server (`backend/exports/`) and served via an authenticated download endpoint.
- AQI and forecast data models exist in the schema but are not yet exposed via dedicated API routes - a natural next extension.

## License

This project is for educational and portfolio purposes.
