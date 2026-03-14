# LeadMap AI (MVP)

<<<<<<< ours
LeadMap AI is a single-operator lead-generation and outreach MVP built as a monorepo:
- Backend: NestJS + Prisma + PostgreSQL + Redis + BullMQ
- Frontend: Next.js + TypeScript + Tailwind + React Query + Recharts + Leaflet/OSM

## Project structure
- `backend/` NestJS API and follow-up worker logic
=======
LeadMap AI is a single-user lead-generation and outreach MVP built as a monorepo:
- **Backend:** NestJS + Prisma + PostgreSQL + Redis + BullMQ
- **Frontend:** Next.js + TypeScript + Tailwind + React Query + Recharts + Leaflet/OSM

## Project structure
- `backend/` NestJS API and worker logic
>>>>>>> theirs
- `frontend/` Next.js web app
- `docker-compose.yml` local orchestration (frontend, backend, postgres, redis)
- `.env.example` environment template

## Environment variables
Copy and edit:

```bash
cp .env.example .env
```

<<<<<<< ours
Required backend variables:
- `DATABASE_URL`
- `JWT_SECRET`
- `REDIS_URL` or both `REDIS_HOST` and `REDIS_PORT`

Optional variables:
- `CORS_ORIGINS` comma-separated list of allowed frontend origins
- `GOOGLE_PLACES_API_KEY` enables Google Places discovery
- `OPENAI_API_KEY` enables OpenAI-generated messages

Frontend variable:
- `NEXT_PUBLIC_API_URL`
=======
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
>>>>>>> theirs

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

<<<<<<< ours
Create the first operator account:

```bash
SEED_USER_EMAIL=owner@example.com SEED_USER_PASSWORD='replace-me' npm run prisma:seed -w backend
```

Optional seed name:

```bash
SEED_USER_NAME='Lead Operator' SEED_USER_EMAIL=owner@example.com SEED_USER_PASSWORD='replace-me' npm run prisma:seed -w backend
```

The seed command no longer relies on repository default credentials.
=======
Optional seed (manual only):

```bash
npm run prisma:seed -w backend
```

Seed user defaults:
- Email: `admin@leadmap.ai`
- Password: `admin1234`
>>>>>>> theirs

## Build
Build both workspaces:

```bash
npm run build
```

## Docker workflow
<<<<<<< ours
Start the full stack:
=======
Start full stack:
>>>>>>> theirs

```bash
docker compose up --build
```

Notes:
- Backend container runs `prisma migrate deploy` on startup.
<<<<<<< ours
- Backend does not auto-seed on startup.
- To create the first operator account in Docker, run:

```bash
docker compose exec backend sh -lc "SEED_USER_EMAIL=owner@example.com SEED_USER_PASSWORD='replace-me' npm run prisma:seed"
=======
- Backend **does not auto-seed** on startup.
- To seed manually in Docker, run a one-off command:

```bash
docker compose exec backend npm run prisma:seed
>>>>>>> theirs
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
<<<<<<< ours
Navigation links use typed route objects to stay compatible with typed routes and avoid dynamic href build failures.

## Git workflow
Branch naming:
=======
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
>>>>>>> theirs
- `feat/<name>`
- `fix/<name>`
- `chore/<name>`

<<<<<<< ours
Commit naming:
- `feat: ...`
- `fix: ...`
- `chore: ...`
=======
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
>>>>>>> theirs
