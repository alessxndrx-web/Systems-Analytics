'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export default function DashboardPage() {
  const { data } = useQuery({ queryKey: ['dashboard'], queryFn: () => api<any>('/analytics/dashboard') });
  return (
    <div className="space-y-3">
      <h1 className="text-2xl">Dashboard</h1>
      <div className="grid grid-cols-3 gap-3">
        <div className="card">Leads by city: {data?.prospecting.byCity?.length ?? 0}</div>
        <div className="card">Messages sent: {data?.messaging.sent ?? 0}</div>
        <div className="card">Revenue: ${data?.conversion.revenue ?? 0}</div>
      </div>
    </div>
  );
}
