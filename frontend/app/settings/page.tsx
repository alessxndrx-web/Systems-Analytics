'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export default function SettingsPage() {
  const { data } = useQuery({ queryKey: ['rules'], queryFn: () => api<any[]>('/scoring/rules') });
  return (
    <div className="space-y-3">
      <h1 className="text-2xl">Settings</h1>
      <div className="card">Editable scoring rules: {data?.length ?? 0}</div>
    </div>
  );
}
