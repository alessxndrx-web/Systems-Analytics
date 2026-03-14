const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

<<<<<<< ours
=======
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
  | 'DISCARDED';

export interface Lead {
  id: string;
  score: number;
  status: LeadStatus;
  business: {
    name: string;
    niche: string;
    city: string;
    country: string;
    address: string;
    website?: string | null;
    phone?: string | null;
    latitude: number;
    longitude: number;
    rating?: number | null;
    reviewCount?: number | null;
  };
}

>>>>>>> theirs
export async function api<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const response = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers
    }
  });
<<<<<<< ours
  if (!response.ok) throw new Error(await response.text());
=======

  if (!response.ok) {
    throw new Error(await response.text());
  }

>>>>>>> theirs
  return response.json();
}
