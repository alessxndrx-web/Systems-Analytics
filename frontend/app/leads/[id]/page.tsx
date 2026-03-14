'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const { data } = useQuery({ queryKey: ['lead', params.id], queryFn: () => api<any>(`/leads/${params.id}`) });
  return (
    <div className="space-y-3">
      <h1 className="text-2xl">Lead detail</h1>
      <div className="card">{data?.business?.name}</div>
      <div className="card">History items: {data?.messages?.length ?? 0}</div>
    </div>
  );
}
