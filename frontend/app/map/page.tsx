<<<<<<< ours
﻿'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../../lib/api';
import { Lead } from '../../lib/types';
import { average, formatNumber } from '../../lib/format';
import { Button, EmptyState, HelperText, Input, MetricCard, PageHeader, SectionCard, Select, StatPill, StatusBadge, TableShell } from '../../components/ui';
import { ActivityIcon, CompassIcon, FilterIcon, GlobeIcon, MapIcon, SearchIcon } from '../../components/icons';
=======
'use client';

import type { Route } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, Lead } from '../../lib/api';
>>>>>>> theirs

const LazyMap = dynamic(() => import('../../components/map-view').then((mod) => mod.MapView), { ssr: false });

export default function MapPage() {
<<<<<<< ours
  const { data = [], isLoading, error } = useQuery<Lead[]>({ queryKey: ['leads'], queryFn: () => api<Lead[]>('/leads') });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const statusOptions = ['ALL', ...new Set(data.map((lead) => lead.status))];
  const filteredLeads = data.filter((lead) => {
    const matchesSearch = !search
      || [lead.business.name, lead.business.city, lead.business.niche].some((value) => value.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const averageScore = Math.round(average(filteredLeads.map((lead) => lead.score)));
  const hotLeads = filteredLeads.filter((lead) => lead.score >= 70).length;
  const readyLeads = filteredLeads.filter((lead) => ['NEW', 'REVIEWED', 'QUALIFIED', 'DRAFT_READY'].includes(lead.status)).length;
  const contactedLeads = filteredLeads.filter((lead) => ['SENT', 'REPLIED', 'INTERESTED', 'MEETING', 'WON'].includes(lead.status)).length;
  const repliedLeads = filteredLeads.filter((lead) => ['REPLIED', 'INTERESTED'].includes(lead.status)).length;
  const noWebsite = filteredLeads.filter((lead) => !lead.business.website).length;
  const cityCount = new Set(filteredLeads.map((lead) => `${lead.business.city}-${lead.business.country}`)).size;
  const territoryBreakdown = Array.from(
    filteredLeads.reduce((map, lead) => {
      const key = `${lead.business.city}, ${lead.business.country}`;
      map.set(key, (map.get(key) ?? 0) + 1);
      return map;
    }, new Map<string, number>())
  ).sort((left, right) => right[1] - left[1]);
  const statusBreakdown = Array.from(
    filteredLeads.reduce((map, lead) => {
      map.set(lead.status, (map.get(lead.status) ?? 0) + 1);
      return map;
    }, new Map<string, number>())
  ).sort((left, right) => right[1] - left[1]);
  const topTerritory = territoryBreakdown[0];

  const contextualSummary = filteredLeads.length
    ? `${formatNumber(filteredLeads.length)} leads are in view across ${formatNumber(cityCount)} territories. ${formatNumber(readyLeads)} are ready for first contact and ${formatNumber(noWebsite)} do not have a website.`
    : 'No leads match the current filters. Clear the search or change the status filter to bring leads back into view.';

  return (
    <div className="space-y-5">
      <PageHeader
        title="Lead Map"
        description="Review territory coverage, score quality, and lead status in one shared view."
        meta={
          <>
            <StatPill>{formatNumber(filteredLeads.length)} leads in view</StatPill>
            <StatPill>{formatNumber(readyLeads)} ready now</StatPill>
            <StatPill tone="success">{formatNumber(repliedLeads)} replied</StatPill>
          </>
        }
        actions={
          <>
            <Button href="/lead-search" variant="secondary">
              Search businesses
            </Button>
            <Button href="/dashboard">Open dashboard</Button>
          </>
        }
      />

      {error ? (
        <SectionCard>
          <EmptyState
            icon={<MapIcon className="h-6 w-6" />}
            title="No map data yet"
            description="Sign in to load live lead data. Once leads are available, the map and table will stay in sync so territory review is easier to work through."
            action={<Button href="/login">Sign in</Button>}
          />
        </SectionCard>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Visible leads" value={formatNumber(filteredLeads.length)} hint="The accounts currently shown on the map and in the table." icon={<MapIcon className="h-5 w-5" />} tone="cyan" />
            <MetricCard label="Average score" value={formatNumber(averageScore)} hint="A quick read on the quality of the current lead set." icon={<ActivityIcon className="h-5 w-5" />} tone="emerald" />
            <MetricCard label="Ready for contact" value={formatNumber(readyLeads)} hint="Leads that can move into first outreach next." icon={<CompassIcon className="h-5 w-5" />} tone="amber" />
            <MetricCard label="No website" value={formatNumber(noWebsite)} hint="Businesses that may need a digital presence conversation." icon={<GlobeIcon className="h-5 w-5" />} tone="rose" />
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_360px]">
            <SectionCard
              title="Map view"
              description="Filters update the map and the table together, so review stays consistent."
              action={
                <div className="flex flex-wrap items-center gap-2">
                  <StatPill>{formatNumber(hotLeads)} high-score leads</StatPill>
                  <StatPill>{formatNumber(contactedLeads)} already contacted</StatPill>
                </div>
              }
            >
              <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_200px]">
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search business, city, or niche" />
                <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status === 'ALL' ? 'All statuses' : status}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="mb-4 space-y-2">
                <HelperText>Use filters to narrow the territory view. The lead table below updates with the same filters.</HelperText>
                <div className="rounded-lg border border-white/8 bg-white/[0.02] px-3 py-3 text-sm leading-6 text-slate-300">
                  {contextualSummary}
                </div>
              </div>

              {isLoading ? (
                <div className="h-[460px] animate-pulse rounded-xl bg-white/[0.04]" />
              ) : filteredLeads.length ? (
                <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/70">
                  <LazyMap leads={filteredLeads} />
                </div>
              ) : (
                <EmptyState
                  icon={<FilterIcon className="h-6 w-6" />}
                  title="No leads match these filters"
                  description="Clear the search or pick a different status to bring businesses back into view. The map and the table will update together."
                  action={
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSearch('');
                        setStatusFilter('ALL');
                      }}
                    >
                      Reset filters
                    </Button>
                  }
                />
              )}
            </SectionCard>

            <SectionCard title="This view" description="A quick summary of what stands out in the current slice.">
              <div className="space-y-4">
                <div className="rounded-lg border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
                  <div className="text-sm font-semibold text-white">Territory summary</div>
                  <p className="mt-2">{contextualSummary}</p>
                </div>

                <div className="rounded-lg border border-white/8 bg-white/[0.03] p-4">
                  <div className="text-sm font-semibold text-white">Top territory</div>
                  <div className="mt-3 text-lg font-semibold text-white">{topTerritory ? topTerritory[0] : 'No territory yet'}</div>
                  <div className="mt-1 text-sm text-slate-500">{topTerritory ? `${formatNumber(topTerritory[1])} leads in the current filtered view.` : 'Run a search to see where lead density is strongest.'}</div>
                </div>

                <div className="rounded-lg border border-white/8 bg-white/[0.03] p-4">
                  <div className="text-sm font-semibold text-white">Status breakdown</div>
                  <div className="mt-4 space-y-3">
                    {statusBreakdown.length ? (
                      statusBreakdown.map(([status, count]) => (
                        <div key={status} className="flex items-center justify-between gap-3">
                          <StatusBadge status={status} />
                          <span className="text-sm text-slate-300">{formatNumber(count)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-500">No active leads in this view yet.</div>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-white/8 bg-white/[0.03] p-4">
                  <div className="text-sm font-semibold text-white">Map legend</div>
                  <div className="mt-4 space-y-3 text-sm text-slate-400">
                    <div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full bg-emerald-400" /> Score 75+ priority accounts</div>
                    <div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full bg-sky-300" /> Mid-range accounts worth review</div>
                    <div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full bg-amber-400" /> Lower-score accounts to review later</div>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          <SectionCard
            title="Lead table"
            description={filteredLeads.length ? 'Map and table share the same filters, so you can review a territory without losing context.' : 'Search a city to start building your map and table view.'}
          >
            {filteredLeads.length ? (
              <TableShell>
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-white/8 bg-white/[0.02] text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Business</th>
                      <th className="px-4 py-3 font-medium">Niche</th>
                      <th className="px-4 py-3 font-medium">Location</th>
                      <th className="px-4 py-3 font-medium">Score</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Signals</th>
                      <th className="px-4 py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="border-b border-white/6 transition hover:bg-white/[0.02] last:border-b-0">
                        <td className="px-4 py-3 font-medium">
                          <div className="font-medium text-white">{lead.business.name}</div>
                          <div className="mt-1 text-slate-400">{lead.business.address}</div>
                        </td>
                        <td className="px-4 py-3 align-top text-slate-300">{lead.business.niche}</td>
                        <td className="px-4 py-3 align-top text-slate-300">
                          <div>{lead.business.city}</div>
                          <div className="mt-1 text-slate-500">{lead.business.country}</div>
                        </td>
                        <td className="px-4 py-3 font-medium">
                          <div className="inline-flex rounded-full border border-sky-400/16 bg-sky-400/8 px-3 py-1 text-sm font-medium text-sky-100">{formatNumber(lead.score)}</div>
                        </td>
                        <td className="px-4 py-3 font-medium">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="px-4 py-3 align-top text-slate-300">
                          <div className="flex flex-wrap gap-2">
                            <StatPill>{lead.business.website ? 'Website' : 'No website'}</StatPill>
                            {lead.business.hasWhatsapp ? <StatPill tone="success">WhatsApp</StatPill> : null}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium">
                          <Link href={`/leads/${lead.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white">
                            Open lead
                            <SearchIcon className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableShell>
            ) : (
              <EmptyState
                icon={<MapIcon className="h-6 w-6" />}
                title="No leads to review yet"
                description="Search a city to start building your pipeline, then come back here to review the territory and table together."
                action={<Button href="/lead-search">Search businesses</Button>}
              />
            )}
          </SectionCard>
        </>
      )}
=======
  const { data = [] } = useQuery({ queryKey: ['leads'], queryFn: () => api<Lead[]>('/leads') });

  const summary = useMemo(() => {
    const byStatus = data.reduce<Record<string, number>>((acc, lead) => {
      const key = lead.status;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return {
      total: data.length,
      withWebsite: data.filter((lead) => !!lead.business.website).length,
      highScore: data.filter((lead) => lead.score >= 70).length,
      byStatus
    };
  }, [data]);

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Territory map</h1>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="card">Businesses discovered: {summary.total}</div>
        <div className="card">High-opportunity (70+): {summary.highScore}</div>
        <div className="card">Has website: {summary.withWebsite}</div>
        <div className="card">Contacted: {summary.byStatus.SENT ?? 0}</div>
      </div>

      <div className="card overflow-hidden">
        <LazyMap leads={data} />
      </div>

      <div className="card">
        <h2 className="mb-2 font-medium">Quick lead selection</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-300"><th>Name</th><th>Niche</th><th>Score</th><th>Marker state</th><th /></tr>
          </thead>
          <tbody>
            {data.map((lead) => (
              <tr key={lead.id} className="border-t border-slate-800">
                <td>{lead.business.name}</td>
                <td>{lead.business.niche}</td>
                <td>{lead.score}</td>
                <td>{lead.status === 'REPLIED' ? 'Hot' : lead.status === 'SENT' ? 'Contacted' : lead.status === 'DISCARDED' ? 'Closed' : 'Open'}</td>
                <td>
                  <Link href={`/leads/${lead.id}` as Route} className="text-cyan-300">Open</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
>>>>>>> theirs
    </div>
  );
}
