# LeadMap AI (MVP)

LeadMap AI is a personal (single-user) lead-generation and outreach system.

## Stack
- Frontend: Next.js + TypeScript + Tailwind + React Query + Recharts + Leaflet/OSM
- Backend: NestJS + Prisma + PostgreSQL + Redis + BullMQ
- AI: OpenAI API with safe fallback templates
- Infra: Docker Compose

## Included MVP Modules
1. Architecture and modular services
2. Prisma schema + migration + seed
3. JWT authentication + password hashing + throttling
4. Lead discovery abstraction with mock provider fallback
5. Editable scoring rules and 0-100 scoring engine
6. AI messaging generation layer
7. CRM states + lead/message/follow-up workflows
8. Analytics event tracking and dashboard metrics
9. Interactive Leaflet map + table
10. Dockerized frontend/backend/postgres/redis

## Quick Start
1. Copy env file:
   ```bash
   cp .env.example .env
   ```
2. Start full stack:
   ```bash
   docker-compose up --build
   ```
3. Open apps:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
   - API docs: http://localhost:3001/docs

## Local Development
```bash
npm install
npm run dev
```

### Backend only
```bash
npm run prisma:generate -w backend
npm run prisma:migrate -w backend
npm run prisma:seed -w backend
npm run dev -w backend
```

### Frontend only
```bash
npm run dev -w frontend
```

## Seed User
- Email: `admin@leadmap.ai`
- Password: `admin1234`

## Assumptions
- Single user owner model.
- WhatsApp is the primary outbound channel; sending is simulated as persisted outbound messages.
- Google Places adapter point exists; mock provider is default for no-key environments.
- Follow-up queue demonstrates BullMQ automation; real WhatsApp transport can be wired in provider layer.
