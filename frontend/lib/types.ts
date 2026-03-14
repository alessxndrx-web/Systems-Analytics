export type LeadStatus =
  | 'NEW'
  | 'REVIEWED'
  | 'QUALIFIED'
  | 'DRAFT_READY'
  | 'SENT'
  | 'REPLIED'
  | 'INTERESTED'
  | 'MEETING'
  | 'WON'
  | 'LOST'
  | 'DISCARDED'
  | string;

export interface Business {
  id: string;
  externalId?: string | null;
  name: string;
  category: string;
  niche: string;
  city: string;
  country: string;
  address: string;
  latitude: number;
  longitude: number;
  rating?: number | null;
  reviewCount?: number | null;
  website?: string | null;
  phone?: string | null;
  hasWhatsapp: boolean;
  digitalPresence?: number;
  isChain: boolean;
  isOutdatedSite: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadMessage {
  id: string;
  direction: 'OUTBOUND' | 'INBOUND' | string;
  type: string;
  content: string;
  approved: boolean;
  sentAt?: string | null;
  createdAt: string;
}

export interface FollowUp {
  id: string;
  scheduledFor: string;
  executedAt?: string | null;
  status: string;
  content: string;
  createdAt: string;
}

export interface Note {
  id: string;
  type: string;
  content: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  name: string;
  amount: number;
  status: string;
  closedAt?: string | null;
  createdAt: string;
}

export interface Lead {
  id: string;
  businessId?: string;
  ownerId?: string;
  status: LeadStatus;
  score: number;
  qualifiedReason?: string | null;
  aiSummary?: string | null;
  manualNotes?: string | null;
  aiNotes?: string | null;
  nextFollowUpDate?: string | null;
  lastContactDate?: string | null;
  contactedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  business: Business;
}

export interface LeadDetail extends Lead {
  messages: LeadMessage[];
  followUps: FollowUp[];
  notes: Note[];
  deals: Deal[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  leadId?: string | null;
  action: string;
  details?: unknown;
  createdAt: string;
}

export interface ActivityLogListResponse {
  items: ActivityLog[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export interface ScoringRule {
  id: string;
  userId: string;
  key: string;
  label: string;
  weight: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GroupCount<T extends string> {
  [key: string]: string | number | null;
  _count: number;
}

export interface DashboardData {
  prospecting: {
    byCity: Array<{ city: string | null; _count: number | { _all: number } }>;
    byNiche: Array<{ niche: string | null; _count: number | { _all: number } }>;
  };
  messaging: {
    sent: number;
    replies: number;
    replyRate: number;
  };
  conversion: {
    meetings: number;
    won: number;
    conversionRate: number;
    revenue: number;
  };
}
