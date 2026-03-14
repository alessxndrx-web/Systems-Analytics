'use client';
import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../../lib/api';

export default function AnalyticsPage() {
  const { data } = useQuery({ queryKey: ['analytics'], queryFn: () => api<any>('/analytics/dashboard') });
  const chartData = data?.prospecting?.byCity?.map((item: any) => ({ city: item.city, count: item._count })) || [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl">Analytics</h1>
      <div className="card">
        <BarChart width={700} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="city" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#22d3ee" />
        </BarChart>
      </div>
    </div>
  );
}
