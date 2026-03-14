# LeadMap AI (MVP)

LeadMap AI is a single-user lead-generation and outreach MVP built as a monorepo:
- **Backend:** NestJS + Prisma + PostgreSQL + Redis + BullMQ
- **Frontend:** Next.js + TypeScript + Tailwind + React Query + Recharts + Leaflet/OSM

## Project structure
- `backend/` NestJS API and worker logic
- `frontend/` Next.js web app
- `docker-compose.yml` local orchestration (frontend, backend, postgres, redis)
- `.env.example` environment template

## Environment variables
Copy and edit:

```bash
cp .env.example .env
```

Required variables (from `.env.example`):
- `DATABASE_URL`
- `JWT_SECRET`
- `REDIS_HOST`, `REDIS_PORT`
- `NEXT_PUBLIC_API_URL`

Optional integrations:
- `GOOGLE_PLACES_API_KEY` (enables Google Places discovery provider)
- `OPENAI_API_KEY` (enables OpenAI-generated messages)

## Discovery provider behavior
Lead discovery uses provider selection in backend:
- If `GOOGLE_PLACES_API_KEY` is present → **GooglePlacesProvider** is used.
- If key is missing → **MockPlacesProvider** fallback is used.

## Local development
Install dependencies at repo root:

```bash
npm install
```

Run both apps:

```bash
npm run dev
```

Run manually per service:

```bash
npm run dev -w backend
npm run dev -w frontend
```

## Prisma workflow
Generate Prisma client:

```bash
npm run prisma:generate -w backend
```

Apply migrations:

```bash
npm run prisma:migrate -w backend
```

Optional seed (manual only):

```bash
npm run prisma:seed -w backend
```

Seed user defaults:
- Email: `admin@leadmap.ai`
- Password: `admin1234`

## Build
Build both workspaces:

```bash
npm run build
```

## Docker workflow
Start full stack:

```bash
docker compose up --build
```

Notes:
- Backend container runs `prisma migrate deploy` on startup.
- Backend **does not auto-seed** on startup.
- To seed manually in Docker, run a one-off command:

```bash
docker compose exec backend npm run prisma:seed
```

## Health check
Backend exposes:

```http
GET /health
```

Expected response:

```json
{ "status": "ok" }
```

Example check:

```bash
curl http://localhost:3001/health
```

## API docs
Swagger UI:
- `http://localhost:3001/docs`

See endpoint summary in `docs/API.md`.

## Typed routes decision (frontend)
`experimental.typedRoutes` remains enabled in `frontend/next.config.js`.
Navigation links are now defined with statically typed route objects to stay fully compatible with typed routes and prevent dynamic href build failures.

## Git / GitHub Desktop workflow
### Open as local repository
1. Open GitHub Desktop.
2. **File → Add Local Repository**.
3. Select this folder.

### Publish to GitHub
1. Click **Publish repository** in GitHub Desktop.
2. Choose name + visibility and publish.

### Branch naming convention
- `feat/<name>`
- `fix/<name>`
- `chore/<name>`

### Commit naming convention
- `feat: ...`
- `fix: ...`
- `chore: ...`

### Lightweight PR workflow
1. Pull latest `main`.
2. Create branch from `main`.
3. Implement and test.
4. Commit focused changes.
5. Push branch and open PR.
6. Merge, then sync `main`.
