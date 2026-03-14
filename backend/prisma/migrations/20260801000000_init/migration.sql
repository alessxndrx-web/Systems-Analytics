-- Create enums
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'REVIEWED', 'QUALIFIED', 'DRAFT_READY', 'SENT', 'REPLIED', 'INTERESTED', 'MEETING', 'WON', 'LOST', 'DISCARDED');
CREATE TYPE "MessageDirection" AS ENUM ('OUTBOUND', 'INBOUND');
CREATE TYPE "MessageType" AS ENUM ('FIRST_CONTACT', 'FOLLOW_UP', 'RESPONSE');
CREATE TYPE "EventType" AS ENUM ('LEAD_DISCOVERED', 'MESSAGE_SENT', 'REPLY_RECEIVED', 'MEETING_SCHEDULED', 'DEAL_CLOSED');

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

CREATE TABLE "Business" (
  "id" TEXT PRIMARY KEY,
  "externalId" TEXT UNIQUE,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "niche" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "latitude" DOUBLE PRECISION NOT NULL,
  "longitude" DOUBLE PRECISION NOT NULL,
  "rating" DOUBLE PRECISION,
  "reviewCount" INTEGER,
  "website" TEXT,
  "phone" TEXT,
  "hasWhatsapp" BOOLEAN NOT NULL DEFAULT false,
  "digitalPresence" INTEGER NOT NULL DEFAULT 50,
  "isChain" BOOLEAN NOT NULL DEFAULT false,
  "isOutdatedSite" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

CREATE TABLE "Lead" (
  "id" TEXT PRIMARY KEY,
  "businessId" TEXT UNIQUE NOT NULL REFERENCES "Business"("id") ON DELETE CASCADE,
  "ownerId" TEXT NOT NULL REFERENCES "User"("id"),
  "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
  "score" INTEGER NOT NULL DEFAULT 0,
  "qualifiedReason" TEXT,
  "aiSummary" TEXT,
  "manualNotes" TEXT,
  "aiNotes" TEXT,
  "firstApprovedAt" TIMESTAMP,
  "nextFollowUpDate" TIMESTAMP,
  "lastContactDate" TIMESTAMP,
  "contactedAt" TIMESTAMP,
  "discardedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

CREATE TABLE "Message" (
  "id" TEXT PRIMARY KEY,
  "leadId" TEXT NOT NULL REFERENCES "Lead"("id") ON DELETE CASCADE,
  "userId" TEXT NOT NULL REFERENCES "User"("id"),
  "direction" "MessageDirection" NOT NULL,
  "type" "MessageType" NOT NULL,
  "content" TEXT NOT NULL,
  "approved" BOOLEAN NOT NULL DEFAULT false,
  "sentAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "FollowUp" (
  "id" TEXT PRIMARY KEY,
  "leadId" TEXT NOT NULL REFERENCES "Lead"("id") ON DELETE CASCADE,
  "scheduledFor" TIMESTAMP NOT NULL,
  "executedAt" TIMESTAMP,
  "status" TEXT NOT NULL DEFAULT 'queued',
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Note" (
  "id" TEXT PRIMARY KEY,
  "leadId" TEXT NOT NULL REFERENCES "Lead"("id") ON DELETE CASCADE,
  "userId" TEXT NOT NULL REFERENCES "User"("id"),
  "type" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AnalyticsEvent" (
  "id" TEXT PRIMARY KEY,
  "leadId" TEXT,
  "eventType" "EventType" NOT NULL,
  "city" TEXT,
  "niche" TEXT,
  "metadata" JSONB,
  "value" DOUBLE PRECISION,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Deal" (
  "id" TEXT PRIMARY KEY,
  "leadId" TEXT NOT NULL REFERENCES "Lead"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "status" TEXT NOT NULL,
  "closedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ScoringRule" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "key" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "weight" INTEGER NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  UNIQUE("userId", "key")
);

CREATE TABLE "ActivityLog" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "leadId" TEXT REFERENCES "Lead"("id") ON DELETE SET NULL,
  "action" TEXT NOT NULL,
  "details" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "Business_city_niche_idx" ON "Business"("city", "niche");
CREATE INDEX "Business_lat_lon_idx" ON "Business"("latitude", "longitude");
CREATE INDEX "Lead_status_score_idx" ON "Lead"("status", "score");
CREATE INDEX "Lead_owner_created_idx" ON "Lead"("ownerId", "createdAt");
CREATE INDEX "Message_lead_created_idx" ON "Message"("leadId", "createdAt");
CREATE INDEX "FollowUp_schedule_status_idx" ON "FollowUp"("scheduledFor", "status");
CREATE INDEX "Analytics_event_created_idx" ON "AnalyticsEvent"("eventType", "createdAt");
CREATE INDEX "Analytics_city_niche_idx" ON "AnalyticsEvent"("city", "niche");
CREATE INDEX "Deal_status_created_idx" ON "Deal"("status", "createdAt");
CREATE INDEX "ActivityLog_created_idx" ON "ActivityLog"("createdAt");
