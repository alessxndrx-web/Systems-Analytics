<<<<<<< ours
﻿'use client';

import { FormEvent, useState } from 'react';
import { api } from '../../lib/api';
import { Lead } from '../../lib/types';
import { average, formatNumber } from '../../lib/format';
import { Button, EmptyState, FormField, MetricCard, PageHeader, SectionCard, StatPill, StatusBadge, TableShell, Input } from '../../components/ui';
import { CompassIcon, FilterIcon, GlobeIcon, SearchIcon, SparkIcon } from '../../components/icons';

const nichePresets = ['gyms', 'lawyers', 'clinics', 'restaurants', 'florists', 'stores'];

export default function LeadSearchPage() {
  const [city, setCity] = useState('San Jose');
  const [country, setCountry] = useState('Costa Rica');
  const [niche, setNiche] = useState('gyms');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const withWebsite = leads.filter((lead) => Boolean(lead.business.website)).length;
  const withWhatsapp = leads.filter((lead) => lead.business.hasWhatsapp).length;
  const noWebsite = leads.filter((lead) => !lead.business.website).length;
  const highScore = leads.filter((lead) => lead.score >= 70).length;
  const averageScore = average(leads.map((lead) => lead.score));

  async function handleSearch(event: FormEvent) {
    event.preventDefault();
    setError('');
    setFeedback('');
    setIsLoading(true);

    try {
      const results = await api<Lead[]>('/discovery/search', {
        method: 'POST',
        body: JSON.stringify({ city, country, niche })
      });
      setLeads(results);
      setFeedback(
        results.length
          ? `Search completed. ${formatNumber(results.length)} businesses found in ${city}, ${country}.`
          : `Search completed. No businesses were found in ${city}, ${country}.`
      );
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to search for businesses right now.');
    } finally {
      setIsLoading(false);
    }
  }

  const searchSummary = leads.length
    ? `${formatNumber(highScore)} leads look high priority, ${formatNumber(noWebsite)} do not have a website, and ${formatNumber(withWhatsapp)} show WhatsApp availability.`
    : 'Start by searching businesses in a city. Results will show up here with the context you need to triage them.';

  return (
    <div className="space-y-5">
      <PageHeader
        title="Lead Search"
        description="Search a city and niche, then review the results before moving into map review or outreach."
        meta={
          <>
            <StatPill>{formatNumber(leads.length)} leads in this search</StatPill>
            <StatPill>{city}, {country}</StatPill>
          </>
        }
        actions={
          <>
            <Button href="/map" variant="secondary">
              Open map
            </Button>
            <Button href="/dashboard">Open dashboard</Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <SectionCard title="Search businesses" description="Pick a city and business type, then run a new search.">
          <form onSubmit={handleSearch} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              <FormField label="City" hint="Use the city where you want to build your first lead cluster.">
                <Input value={city} onChange={(event) => setCity(event.target.value)} placeholder="e.g. San Jose" />
              </FormField>
              <FormField label="Country" hint="Keeps location targeting clear when the search runs.">
                <Input value={country} onChange={(event) => setCountry(event.target.value)} placeholder="e.g. Costa Rica" />
              </FormField>
              <FormField label="Niche" hint="Choose a niche with a clear website or outreach opportunity.">
                <Input value={niche} onChange={(event) => setNiche(event.target.value)} placeholder="e.g. gyms" />
              </FormField>
            </div>

            <div className="flex flex-wrap gap-2">
              {nichePresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${niche === preset ? 'border-sky-400/16 bg-sky-400/8 text-sky-100' : 'border-white/10 bg-white/[0.04] text-slate-300 hover:text-white'}`}
                  onClick={() => setNiche(preset)}
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={isLoading} leading={<SearchIcon className="h-4 w-4" />}>
                {isLoading ? 'Searching...' : 'Search businesses'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setCity('San Jose');
                  setCountry('Costa Rica');
                  setNiche('gyms');
                  setFeedback('Defaults restored. You can run a fresh search now.');
                }}
              >
                Reset defaults
              </Button>
            </div>

            {feedback ? <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">{feedback}</div> : null}
            {error ? <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</div> : null}
          </form>
        </SectionCard>

        <SectionCard title="Before you search" description="A few habits that make discovery easier to work through later.">
          <div className="space-y-4">
            {[
              {
                title: 'Start with one city',
                body: 'A tighter search gives you a cleaner map, a more useful dashboard, and a faster first review.'
              },
              {
                title: 'Use the same niche for a few runs',
                body: 'Repeated searches in one niche make score and reply trends easier to compare.'
              },
              {
                title: 'Review results before writing',
                body: 'Use the map and lead detail pages to decide which businesses are worth the first message.'
              }
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-white/8 bg-white/[0.03] p-4">
                <div className="text-sm font-semibold text-white">{item.title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.body}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Leads found" value={formatNumber(leads.length)} hint="Businesses returned in the current search session." icon={<SearchIcon className="h-5 w-5" />} tone="cyan" />
        <MetricCard label="Average score" value={formatNumber(Math.round(averageScore))} hint="A quick read on how promising this search looks." icon={<SparkIcon className="h-5 w-5" />} tone="emerald" />
        <MetricCard label="High priority" value={formatNumber(highScore)} hint="Leads scoring 70 or higher and worth an early review." icon={<CompassIcon className="h-5 w-5" />} tone="amber" />
        <MetricCard label="WhatsApp visible" value={formatNumber(withWhatsapp)} hint="Businesses showing a direct messaging signal." icon={<GlobeIcon className="h-5 w-5" />} tone="rose" />
      </div>

      <SectionCard
        title="Search summary"
        description="A practical read on what this search returned."
        action={
          leads.length ? (
            <Button href="/map" variant="secondary" size="sm">
              Review on map
            </Button>
          ) : null
        }
      >
        <div className="rounded-lg border border-white/8 bg-white/[0.02] px-4 py-3 text-sm leading-6 text-slate-300">{searchSummary}</div>
      </SectionCard>

      <SectionCard
        title="Results"
        description={leads.length ? 'Review the businesses below, then move the strongest ones into map review or outreach.' : 'No data yet. Search a city to start building your pipeline.'}
        action={
          leads.length ? (
            <Button href="/map" variant="secondary" size="sm">
              Open map
            </Button>
          ) : null
        }
      >
        {leads.length ? (
          <TableShell>
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-white/8 bg-white/[0.02] text-[11px] uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Business</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Signals</th>
                  <th className="px-4 py-3 font-medium">Score</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/6 transition hover:bg-white/[0.02] last:border-b-0">
                    <td className="px-4 py-3 font-medium">
                      <div className="font-medium text-white">{lead.business.name}</div>
                      <div className="mt-1 text-slate-400">{lead.business.category}</div>
                    </td>
                    <td className="px-4 py-3 align-top text-slate-300">
                      <div>{lead.business.city}</div>
                      <div className="mt-1 text-slate-500">{lead.business.country}</div>
                    </td>
                    <td className="px-4 py-3 align-top text-slate-300">
                      <div className="flex flex-wrap gap-2">
                        <StatPill>{lead.business.website ? 'Website' : 'No website'}</StatPill>
                        {lead.business.hasWhatsapp ? <StatPill tone="success">WhatsApp</StatPill> : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      <div className="inline-flex rounded-full border border-sky-400/16 bg-sky-400/8 px-3 py-1 text-sm font-medium text-sky-100">{formatNumber(lead.score)}</div>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      <StatusBadge status={lead.status} />
                    </td>
=======
'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, Lead, LeadStatus } from '../../lib/api';

const statusOptions: Array<{ label: string; value: LeadStatus }> = [
  { label: 'New', value: 'NEW' },
  { label: 'Reviewed', value: 'REVIEWED' },
  { label: 'Contacted', value: 'SENT' },
  { label: 'Replied', value: 'REPLIED' },
  { label: 'Interested', value: 'INTERESTED' },
  { label: 'Won', value: 'WON' },
  { label: 'Lost', value: 'LOST' },
  { label: 'Discarded', value: 'DISCARDED' }
];

export default function LeadSearchPage() {
  const queryClient = useQueryClient();
  const [city, setCity] = useState('San José');
  const [country, setCountry] = useState('Costa Rica');
  const [niche, setNiche] = useState('gyms');
  const [feedback, setFeedback] = useState<string>('');

  const { data: leads = [], isLoading } = useQuery({ queryKey: ['leads'], queryFn: () => api<Lead[]>('/leads') });

  const discoveryMutation = useMutation({
    mutationFn: () => api<Lead[]>('/discovery/search', { method: 'POST', body: JSON.stringify({ city, country, niche }) }),
    onSuccess: async (result) => {
      setFeedback(`Discovery finished: ${result.length} businesses captured for review.`);
      await queryClient.invalidateQueries({ queryKey: ['leads'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  const draftMutation = useMutation({
    mutationFn: (leadId: string) => api(`/leads/${leadId}/draft`, { method: 'POST' }),
    onSuccess: async () => {
      setFeedback('Draft generated and lead moved to Draft Ready.');
      await queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      api(`/leads/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    onSuccess: async (_, variables) => {
      setFeedback(`Lead status updated to ${variables.status}.`);
      await queryClient.invalidateQueries({ queryKey: ['leads'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  const scoredLeads = useMemo(() => [...leads].sort((a, b) => b.score - a.score), [leads]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Lead Review Workspace</h1>

      <section className="card space-y-3">
        <h2 className="text-lg font-medium">1) Discover businesses by territory</h2>
        <div className="flex flex-wrap gap-2">
          <input className="rounded bg-slate-800 p-2" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
          <input className="rounded bg-slate-800 p-2" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" />
          <input className="rounded bg-slate-800 p-2" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Niche" />
          <button className="rounded bg-cyan-600 px-3 py-2" onClick={() => discoveryMutation.mutate()}>
            {discoveryMutation.isPending ? 'Discovering...' : 'Discover Leads'}
          </button>
        </div>
        {feedback && <p className="text-sm text-cyan-200">{feedback}</p>}
      </section>

      <section className="card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium">2) Review and act on leads</h2>
          <span className="text-sm text-slate-300">{scoredLeads.length} leads</span>
        </div>

        {isLoading ? (
          <p>Loading leads...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-300">
                  <th className="py-2">Business</th>
                  <th>Score</th>
                  <th>Website</th>
                  <th>Status</th>
                  <th>Quick actions</th>
                </tr>
              </thead>
              <tbody>
                {scoredLeads.map((lead) => (
                  <tr key={lead.id} className="border-t border-slate-800 align-top">
                    <td className="py-3 pr-2">
                      <p className="font-medium">{lead.business.name}</p>
                      <p className="text-xs text-slate-400">{lead.business.address}</p>
                      <p className="text-xs text-slate-500">{lead.business.niche} · {lead.business.city}</p>
                    </td>
                    <td className="py-3">{lead.score}</td>
                    <td className="py-3">{lead.business.website ? 'Yes' : 'No'}</td>
                    <td className="py-3">
                      <select
                        className="rounded bg-slate-800 p-1"
                        value={lead.status}
                        onChange={(e) => statusMutation.mutate({ id: lead.id, status: e.target.value as LeadStatus })}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <button className="rounded bg-cyan-700 px-2 py-1" onClick={() => draftMutation.mutate(lead.id)}>Generate draft</button>
                        <button className="rounded bg-slate-700 px-2 py-1" onClick={() => statusMutation.mutate({ id: lead.id, status: 'DISCARDED' })}>Discard</button>
                        <Link className="rounded bg-slate-800 px-2 py-1" href={`/leads/${lead.id}` as Route}>Open details</Link>
                      </div>
                    </td>
>>>>>>> theirs
                  </tr>
                ))}
              </tbody>
            </table>
<<<<<<< ours
          </TableShell>
        ) : (
          <EmptyState
            icon={<FilterIcon className="h-6 w-6" />}
            title="No leads yet"
            description="Start by searching businesses in a city. You will see their score, location, and outreach signals here."
            action={<Button onClick={() => setFeedback('Use the search form above to run your first city search.')}>How to start</Button>}
          />
        )}
      </SectionCard>
=======
          </div>
        )}
      </section>
>>>>>>> theirs
    </div>
  );
}
