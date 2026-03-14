'use client';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

const LazyMap = dynamic(() => import('../../components/map-view').then((mod) => mod.MapView), { ssr: false });

export default function MapPage() {
  const { data = [] } = useQuery({ queryKey: ['leads'], queryFn: () => api<any[]>('/leads') });
  return (
    <div className="space-y-3">
      <h1 className="text-2xl">Interactive map + table</h1>
      <div className="card overflow-hidden">
        <LazyMap leads={data} />
      </div>
      <div className="card">
        <table className="w-full text-sm">
          <thead><tr><th>Name</th><th>Niche</th><th>Score</th><th>Status</th></tr></thead>
          <tbody>
            {data.map((lead) => <tr key={lead.id}><td>{lead.business.name}</td><td>{lead.business.niche}</td><td>{lead.score}</td><td>{lead.status}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
