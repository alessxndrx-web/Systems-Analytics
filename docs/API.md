# LeadMap AI API

Base URL: `http://localhost:3001`
Swagger: `/docs`

## Auth
- `POST /auth/login`

## Discovery
- `POST /discovery/search`

## Leads
- `GET /leads`
- `GET /leads/:id`
- `POST /leads/:id/draft`
- `POST /leads/:id/approve-first`
- `PATCH /leads/:id/status`

## Scoring
- `GET /scoring/rules`
- `PATCH /scoring/rules`

## AI
- `POST /ai/first-message`

## Analytics
- `GET /analytics/dashboard`

## Logs
- `GET /logs`
