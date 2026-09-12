# SkillConnect Pakistan — Base44 Dev Environment

## Architecture
- **Frontend**: Next.js 15 app (`apps/frontend`) on port 3000
- **Backend**: NestJS 10 API (`apps/backend`) on port 4000, prefix `/api/v1`
- **Database**: PostgreSQL 16 (compose service `db`)

## Setup
```
docker compose -f docker-compose.base44.yml up -d --build
```

## Key details
- Both apps are bind-mounted from source with live reload (backend: `nest start --watch`, frontend: `next dev`).
- `node_modules` are in named volumes to avoid host conflicts; `npm install` runs on every container start.
- Backend startup: `npm install` → `prisma generate` → `prisma migrate deploy` → `prisma:seed` → `nest start --watch`. The seed is idempotent (deletes all rows first).
- Frontend `NEXT_PUBLIC_API_URL` is set to the backend's public URL so browser-side API calls reach it.
- Frontend `BACKEND_URL` is the internal Docker hostname (`http://backend:4000`) for server-side Next.js API routes.
- `next.config.ts` has `allowedDevOrigins` wired to `BASE44_PUBLIC_HOST_SUFFIX` so the preview origin can access dev assets/HMR.
- Backend CORS is `origin: '*'`; auth uses JWT tokens stored in `localStorage` (not cookies).

## Optional secrets (not required to boot)
- `GEMINI_API_KEY` — enables AI features; without it, AI routes return mock responses.
- `STRIPE_SECRET_KEY` — enables real Stripe payments; without it, a mock key is used.

## Verification
- Frontend: `curl -s http://localhost:3000` should return HTML.
- Backend: `curl -s http://localhost:4000/api/docs` should return the Swagger UI page.
- Swagger docs at `http://localhost:4000/api/docs`.
