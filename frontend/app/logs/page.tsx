'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export default function LogsPage() {
  const { data = [] } = useQuery({ queryKey: ['logs'], queryFn: () => api<any[]>('/logs') });
  return (
    <div className="space-y-3">
      <h1 className="text-2xl">System logs</h1>
      <div className="card">Entries: {data.length}</div>
    </div>
  );
}
