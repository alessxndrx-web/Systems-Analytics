const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}
