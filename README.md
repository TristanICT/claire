# Claire Usecase Builder

A React + Express + SQLite application to collect campus/company use cases in a structured format, validate input, and export each submission to JSON and PDF for your knowledge bank pipeline.

## Tech Stack

- Frontend: React + Vite
- Backend API: Express
- Database: SQLite (`better-sqlite3`)
- Export: JSON + PDF (`pdfkit`)

## Project Structure

- `src/` - React frontend
- `server/` - Express API + DB setup/seed
- `data/usecases.db` - SQLite database file (generated)
- `exports/` - generated JSON/PDF exports (generated)

## Prerequisites

- Node.js 18+ (recommended)
- npm

## Install

```bash
npm install
```

## First-Time Setup

1. Seed the database with the question template and example use cases.

```bash
npm run seed
```

2. Start the backend API.

```bash
npm run server
```

3. In a second terminal, start the frontend app.

```bash
npm run dev
```

4. Open the app in your browser.

```text
http://localhost:3000
```

## Daily Development

### Terminal 1 - API

```bash
npm run server
```

### Terminal 2 - Frontend

```bash
npm run dev
```

## Build (Frontend)

```bash
npm run build
```

Optional preview of production build:

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - start Vite dev server (frontend)
- `npm run build` - build frontend for production
- `npm run preview` - preview built frontend
- `npm run server` - start Express backend on port `3001`
- `npm run seed` - recreate database seed data (questions + example use cases)

## API Endpoints

- `GET /api/questions` - returns questionnaire fields
- `POST /api/submissions` - stores one submission and generates exports
- `GET /api/examples` - returns seeded example use cases
- `GET /api/submissions` - returns saved submissions (backend endpoint still exists)
- `GET /api/submissions/:id` - returns one saved submission

## Exports

Each successful submission automatically generates:

- one JSON export
- one PDF export

Location:

```text
exports/
```

Filename pattern:

```text
submission-<id>-<YYYYMMDD-HHMMSS>.json
submission-<id>-<YYYYMMDD-HHMMSS>.pdf
```

## Notes

- The user-facing frontend is configured for one-time form filling flow.
- Database and export artifacts are ignored in git via `.gitignore`.
- If you reseed (`npm run seed`), question definitions and examples are reset.
