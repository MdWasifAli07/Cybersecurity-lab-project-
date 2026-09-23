# VULNSCAN Frontend

Modern React frontend for a dark-mode vulnerability scanner dashboard.

## Tech stack

- Vite + React 18
- react-router-dom v6
- Tailwind CSS v3
- Framer Motion
- lucide-react
- axios

## Setup

```bash
npm install
npm run dev
```

Create a local environment file from `.env.example`:

```bash
cp .env.example .env
```

The app reads the backend from `VITE_API_URL` and supports mock mode with `VITE_USE_MOCK=true`.

## Production build

```bash
npm run build
```
