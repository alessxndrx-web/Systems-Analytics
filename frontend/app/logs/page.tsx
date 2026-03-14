'use client';
<<<<<<< ours

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { ActivityLog, ActivityLogListResponse } from '../../lib/types';
import { formatDateTime, formatNumber, truncateValue } from '../../lib/format';
import { Button, EmptyState, MetricCard, PageHeader, SectionCard, StatPill, TableShell } from '../../components/ui';
import { ActivityIcon, LogsIcon } from '../../components/icons';

const pageSize = 25;

export default function LogsPage() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, isFetching } = useQuery<ActivityLogListResponse>({
    queryKey: ['logs', page],
    queryFn: () => api<ActivityLogListResponse>(`/logs?page=${page}&pageSize=${pageSize}`)
  });

  const items = data?.items ?? [];
  const uniqueActions = new Set(items.map((entry) => entry.action)).size;
  const withLeadContext = items.filter((entry) => Boolean(entry.leadId)).length;
  const latestEntry = items[0];
  const summary = latestEntry
    ? `Latest activity: ${latestEntry.action} on ${formatDateTime(latestEntry.createdAt)}.`
    : 'Searches, messages, and system actions will start showing up here as you use the workspace.';
  const pageCount = data?.pageCount ?? 1;
  const start = items.length ? (page - 1) * pageSize + 1 : 0;
  const end = items.length ? start + items.length - 1 : 0;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Recent activity"
        description="Searches, sends, and system actions show up here so you can see what changed."
        meta={
          <>
            <StatPill>{formatNumber(data?.total ?? 0)} total events</StatPill>
            <StatPill>{formatNumber(uniqueActions)} action types on this page</StatPill>
            {isFetching && !isLoading ? <StatPill tone="accent">Refreshing</StatPill> : null}
          </>
        }
        actions={<Button href="/dashboard">Open dashboard</Button>}
      />

      {error ? (
        <SectionCard>
          <EmptyState
            icon={<LogsIcon className="h-6 w-6" />}
            title="No activity data yet"
            description="Sign in to load workspace events. Once connected, this page will show searches, updates, and lead-related actions in one place."
            action={<Button href="/login">Sign in</Button>}
          />
        </SectionCard>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Events on page" value={formatNumber(items.length)} hint="Recent system activity returned for the current page." icon={<LogsIcon className="h-5 w-5" />} tone="cyan" />
            <MetricCard label="Action types" value={formatNumber(uniqueActions)} hint="The number of different actions in the current page of logs." icon={<ActivityIcon className="h-5 w-5" />} tone="emerald" />
            <MetricCard label="Lead-linked" value={formatNumber(withLeadContext)} hint="Events that include direct lead context." icon={<ActivityIcon className="h-5 w-5" />} tone="amber" />
            <MetricCard
              label="Latest event"
              value={latestEntry ? truncateValue(latestEntry.action, 18) : 'No activity'}
              hint={latestEntry ? formatDateTime(latestEntry.createdAt) : 'The newest event will show up here.'}
              icon={<LogsIcon className="h-5 w-5" />}
              tone="rose"
            />
          </div>

          <SectionCard
            title="Activity feed"
            description="A running record of what changed in the workspace."
            action={
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{items.length ? `${start}-${end} of ${formatNumber(data?.total ?? 0)}` : 'No results'}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
                  Previous
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page >= pageCount}>
                  Next
                </Button>
              </div>
            }
          >
            <div className="mb-4 rounded-lg border border-white/8 bg-white/[0.02] px-4 py-3 text-sm leading-6 text-slate-300">{summary}</div>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-16 animate-pulse rounded-lg bg-white/[0.04]" />
                ))}
              </div>
            ) : items.length ? (
              <TableShell>
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-white/8 bg-white/[0.02] text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Action</th>
                      <th className="px-4 py-3 font-medium">Lead</th>
                      <th className="px-4 py-3 font-medium">User</th>
                      <th className="px-4 py-3 font-medium">Context</th>
                      <th className="px-4 py-3 font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((entry: ActivityLog) => (
                      <tr key={entry.id} className="border-b border-white/6 transition hover:bg-white/[0.02] last:border-b-0">
                        <td className="px-4 py-3 font-medium">
                          <div className="font-medium text-white">{entry.action}</div>
                          <div className="mt-1 text-slate-500">{truncateValue(entry.id, 12)}</div>
                        </td>
                        <td className="px-4 py-3 align-top text-slate-300">{truncateValue(entry.leadId, 12)}</td>
                        <td className="px-4 py-3 align-top text-slate-300">{truncateValue(entry.userId, 12)}</td>
                        <td className="px-4 py-3 align-top text-slate-300">{entry.details ? 'Metadata attached' : 'No metadata'}</td>
                        <td className="px-4 py-3 align-top text-slate-400">{formatDateTime(entry.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableShell>
            ) : (
              <EmptyState
                icon={<ActivityIcon className="h-6 w-6" />}
                title="No recent activity"
                description="Your searches, lead changes, and outreach actions will show up here once work starts happening in the app."
                action={<Button href="/lead-search">Search businesses</Button>}
              />
            )}
          </SectionCard>
        </>
      )}
=======
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export default function LogsPage() {
  const { data = [] } = useQuery({ queryKey: ['logs'], queryFn: () => api<any[]>('/logs') });
  return (
    <div className="space-y-3">
      <h1 className="text-2xl">System logs</h1>
      <div className="card">Entries: {data.length}</div>
>>>>>>> theirs
    </div>
  );
}
