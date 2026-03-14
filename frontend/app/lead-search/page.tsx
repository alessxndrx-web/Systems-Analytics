'use client';
import { useState } from 'react';
import { api } from '../../lib/api';

export default function LeadSearchPage() {
  const [city, setCity] = useState('San José');
  const [country, setCountry] = useState('Costa Rica');
  const [niche, setNiche] = useState('gyms');
  const [leads, setLeads] = useState<any[]>([]);

  return (
    <div className="space-y-3">
      <h1 className="text-2xl">Lead search</h1>
      <div className="card flex gap-2">
        <input className="bg-slate-800 p-2" value={city} onChange={(e) => setCity(e.target.value)} />
        <input className="bg-slate-800 p-2" value={country} onChange={(e) => setCountry(e.target.value)} />
        <input className="bg-slate-800 p-2" value={niche} onChange={(e) => setNiche(e.target.value)} />
        <button
          className="bg-cyan-600 px-3"
          onClick={async () => setLeads(await api('/discovery/search', { method: 'POST', body: JSON.stringify({ city, country, niche }) }))}
        >
          Discover
        </button>
      </div>
      <div className="card">Found {leads.length} leads</div>
    </div>
  );
}
