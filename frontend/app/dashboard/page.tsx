<<<<<<< ours
﻿'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { DashboardData, Lead } from '../../lib/types';
import { formatCurrency, formatDateTime, formatNumber, formatPercent, formatShortDate, isOverdue, isSameDay } from '../../lib/format';
import { ActivityFeed, Button, EmptyState, LoadingBlock, MetricCard, PageHeader, QuickActions, SectionCard, StatPill, StatusBadge, TableShell } from '../../components/ui';
import { ActivityIcon, AnalyticsIcon, ClockIcon, DraftIcon, GlobeIcon, MailIcon, MapIcon, RevenueIcon, SearchIcon } from '../../components/icons';

function getGroupCount(item: { _count: number | { _all: number } }) {
  return typeof item._count === 'number' ? item._count : item._count?._all ?? 0;
}

function sortByDate<T>(items: T[], selector: (item: T) => string | null | undefined) {
  return [...items].sort((left, right) => {
    const leftDate = selector(left) ? new Date(selector(left) as string).getTime() : 0;
    const rightDate = selector(right) ? new Date(selector(right) as string).getTime() : 0;
    return rightDate - leftDate;
  });
}

export default function DashboardPage() {
  const dashboardQuery = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => api<DashboardData>('/analytics/dashboard')
  });
  const leadsQuery = useQuery<Lead[]>({
    queryKey: ['dashboard-leads'],
    queryFn: () => api<Lead[]>('/leads')
  });

  const data = dashboardQuery.data;
  const leads = leadsQuery.data ?? [];
  const byCity = data?.prospecting.byCity ?? [];
  const sortedCities = [...byCity].sort((left, right) => getGroupCount(right) - getGroupCount(left));
  const territoryMax = sortedCities.length ? Math.max(...sortedCities.map((item) => getGroupCount(item))) : 1;
  const responseRate = data?.messaging.replyRate ?? 0;
  const revenue = data?.conversion.revenue ?? 0;
  const totalLeads = leads.length || byCity.reduce((sum, item) => sum + getGroupCount(item), 0);

  const recentLeads = sortByDate(leads, (lead) => lead.createdAt ?? lead.updatedAt).slice(0, 6);
  const recentOutreach = sortByDate(
    leads.filter((lead) => ['SENT', 'REPLIED', 'INTERESTED', 'MEETING', 'WON'].includes(lead.status)),
    (lead) => lead.lastContactDate ?? lead.updatedAt
  ).slice(0, 6);
  const followUpQueue = sortByDate(
    leads.filter((lead) => Boolean(lead.nextFollowUpDate)),
    (lead) => lead.nextFollowUpDate
  )
    .reverse()
    .slice(0, 6)
    .sort((left, right) => new Date(left.nextFollowUpDate ?? 0).getTime() - new Date(right.nextFollowUpDate ?? 0).getTime());

  const readyLeads = leads.filter((lead) => ['NEW', 'REVIEWED', 'QUALIFIED', 'DRAFT_READY'].includes(lead.status)).length;
  const newToday = leads.filter((lead) => isSameDay(lead.createdAt ?? lead.updatedAt)).length;
  const sentToday = leads.filter((lead) => lead.status === 'SENT' && isSameDay(lead.lastContactDate ?? lead.updatedAt)).length;
  const repliesToday = leads.filter((lead) => lead.status === 'REPLIED' && isSameDay(lead.lastContactDate ?? lead.updatedAt)).length;
  const followUpsDueToday = leads.filter((lead) => isSameDay(lead.nextFollowUpDate)).length;
  const overdueFollowUps = leads.filter((lead) => isOverdue(lead.nextFollowUpDate)).length;
  const topCity = sortedCities[0];
  const topCityLabel = topCity?.city || 'Unassigned';

  const todaySummary = totalLeads
    ? `${formatNumber(readyLeads)} leads are ready for first contact and ${formatNumber(overdueFollowUps)} follow-ups need attention.`
    : 'Start by searching businesses in a city. You will see your pipeline, replies, and follow-ups here.';

  const quickActions = [
    {
      label: 'Search businesses',
      description: 'Start a new city search and add fresh leads to the workspace.',
      href: '/lead-search',
      icon: <SearchIcon className="h-4 w-4" />
    },
    {
      label: 'Open map',
      description: 'Review territory clusters and spot high-priority accounts.',
      href: '/map',
      icon: <MapIcon className="h-4 w-4" />
    },
    {
      label: 'Review drafts',
      description: 'Check what is waiting for approval before anything goes out.',
      href: '/drafts',
      icon: <DraftIcon className="h-4 w-4" />
    },
    {
      label: 'Check analytics',
      description: 'Look at reply trends, territory coverage, and revenue.',
      href: '/analytics',
      icon: <AnalyticsIcon className="h-4 w-4" />
    }
  ] as const;

  const recentActivityItems = recentOutreach.map((lead) => ({
    id: lead.id,
    title: lead.business.name,
    detail: `${lead.business.city} • ${lead.status === 'REPLIED' ? 'Reply recorded' : 'Outbound activity logged'}`,
    meta: `Last touch ${formatDateTime(lead.lastContactDate ?? lead.updatedAt)}`,
    status: lead.status,
    icon: <MailIcon className="h-4 w-4" />
  }));

  const followUpItems = followUpQueue.map((lead) => ({
    id: lead.id,
    title: lead.business.name,
    detail: `${lead.business.city} • Follow-up due ${formatShortDate(lead.nextFollowUpDate)}`,
    meta: isOverdue(lead.nextFollowUpDate) ? 'Overdue' : isSameDay(lead.nextFollowUpDate) ? 'Due today' : 'Upcoming',
    status: lead.status,
    icon: <ClockIcon className="h-4 w-4" />
  }));

  const isLoading = dashboardQuery.isLoading || leadsQuery.isLoading;
  const showErrorState = dashboardQuery.error && leadsQuery.error;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Pipeline Dashboard"
        description="Track what changed today, what needs follow-up, and where new leads are showing up."
        meta={
          <>
            <StatPill>{formatNumber(newToday)} new today</StatPill>
            <StatPill tone="success">{formatNumber(repliesToday)} replies today</StatPill>
            <StatPill tone="accent">{formatNumber(overdueFollowUps)} overdue follow-ups</StatPill>
          </>
        }
        actions={
          <>
            <Button href="/lead-search" variant="secondary" size="sm">
              Search businesses
            </Button>
            <Button href="/map" size="sm">
              Open map
            </Button>
          </>
        }
      />

      {showErrorState ? (
        <SectionCard>
          <EmptyState
            icon={<ActivityIcon className="h-5 w-5" />}
            title="No dashboard data yet"
            description="Sign in to load live pipeline data. Once the workspace is connected, this page will show your daily queue, recent activity, and territory coverage."
            action={<Button href="/login">Sign in</Button>}
          />
        </SectionCard>
      ) : (
        <>
          <div className="grid gap-3 xl:grid-cols-4">
            <MetricCard label="Leads discovered" value={formatNumber(totalLeads)} hint="Businesses currently in your pipeline." icon={<GlobeIcon className="h-4 w-4" />} tone="cyan" />
            <MetricCard label="Messages sent" value={formatNumber(data?.messaging.sent ?? 0)} hint="Outbound messages logged so far." icon={<MailIcon className="h-4 w-4" />} tone="emerald" />
            <MetricCard label="Response rate" value={formatPercent(responseRate)} hint="How many outbound messages are getting a reply." icon={<ActivityIcon className="h-4 w-4" />} tone="amber" />
            <MetricCard label="Revenue" value={formatCurrency(revenue)} hint="Closed revenue tied to the current workspace." icon={<RevenueIcon className="h-4 w-4" />} tone="rose" />
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <SectionCard title="Today" description="A quick read on what needs attention now.">
              {isLoading ? (
                <LoadingBlock className="h-[208px]" />
              ) : (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      {
                        label: 'New leads',
                        value: formatNumber(newToday),
                        detail: newToday ? 'Added in the last day.' : 'New searches will show up here.'
                      },
                      {
                        label: 'Ready for contact',
                        value: formatNumber(readyLeads),
                        detail: readyLeads ? 'Leads ready for first outreach.' : 'Nothing is waiting for a first touch.'
                      },
                      {
                        label: 'Follow-ups due',
                        value: formatNumber(followUpsDueToday),
                        detail: followUpsDueToday ? 'Scheduled for today.' : 'Nothing due today.'
                      },
                      {
                        label: 'Replies today',
                        value: formatNumber(repliesToday),
                        detail: repliesToday ? 'New replies landed today.' : 'Replies will show up here.'
                      }
                    ].map((item) => (
                      <div key={item.label} className="rounded-lg border border-white/8 bg-white/[0.02] px-3 py-3">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{item.label}</div>
                        <div className="mt-2 text-xl font-semibold text-white">{item.value}</div>
                        <div className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg border border-white/8 bg-white/[0.02] px-3 py-3 text-sm leading-6 text-slate-300">
                    {todaySummary}
                  </div>
                </div>
              )}
            </SectionCard>

            <SectionCard title="Quick actions" description="Jump straight into the next task.">
              <QuickActions items={[...quickActions]} />
            </SectionCard>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <SectionCard
              title="Territory activity"
              description="Where new lead volume is concentrated right now."
              action={topCity ? <StatPill>{topCityLabel} leads the board</StatPill> : null}
            >
              {dashboardQuery.isLoading ? (
                <LoadingBlock className="h-[248px]" />
              ) : sortedCities.length ? (
                <div className="space-y-3">
                  {sortedCities.slice(0, 8).map((item) => {
                    const count = getGroupCount(item);
                    return (
                      <div key={item.city ?? 'unknown'} className="grid grid-cols-[160px_minmax(0,1fr)_54px] items-center gap-3 text-sm">
                        <div className="truncate text-slate-300">{item.city || 'Unassigned'}</div>
                        <div className="h-2 rounded bg-white/[0.05]">
                          <div className="h-2 rounded bg-slate-300" style={{ width: `${Math.max(10, (count / territoryMax) * 100)}%` }} />
                        </div>
                        <div className="text-right text-slate-500">{formatNumber(count)}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState compact title="No territory activity yet" description="Search a city to start building your pipeline. Territory volume will appear here once leads are added." action={<Button href="/lead-search" size="sm">Search businesses</Button>} />
              )}
            </SectionCard>

            <SectionCard title="Recent leads" description="The newest accounts added to the workspace." action={<Button href="/map" variant="ghost" size="sm">View all</Button>}>
              {leadsQuery.isLoading ? (
                <LoadingBlock className="h-[248px]" />
              ) : recentLeads.length ? (
                <TableShell>
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-white/8 bg-white/[0.02] text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Lead</th>
                        <th className="px-4 py-3 font-medium">Territory</th>
                        <th className="px-4 py-3 font-medium">Score</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentLeads.map((lead) => (
                        <tr key={lead.id} className="border-b border-white/6 transition hover:bg-white/[0.02] last:border-b-0">
                          <td className="px-4 py-3 align-top">
                            <div className="font-medium text-white">{lead.business.name}</div>
                            <div className="mt-1 text-xs text-slate-500">{lead.business.niche}</div>
                          </td>
                          <td className="px-4 py-3 align-top text-slate-300">{lead.business.city}</td>
                          <td className="px-4 py-3 align-top text-slate-300">{formatNumber(lead.score)}</td>
                          <td className="px-4 py-3 align-top">
                            <StatusBadge status={lead.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableShell>
              ) : (
                <EmptyState compact title="No leads yet" description="Run a city search to start filling the pipeline. New leads will show up here as soon as they are added." action={<Button href="/lead-search" size="sm">Search businesses</Button>} />
              )}
            </SectionCard>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <SectionCard
              title="Recent activity"
              description="Latest outreach and reply activity across your leads."
              action={sentToday ? <StatPill tone="success">{formatNumber(sentToday)} sent today</StatPill> : null}
            >
              {leadsQuery.isLoading ? (
                <LoadingBlock className="h-[248px]" />
              ) : (
                <ActivityFeed
                  items={recentActivityItems}
                  empty={{
                    icon: <MailIcon className="h-5 w-5" />,
                    title: 'No recent activity',
                    description: 'Your recent outreach activity will show up here once messages are approved or replies start coming in.',
                    action: <Button href="/drafts" size="sm">Review drafts</Button>
                  }}
                />
              )}
            </SectionCard>

            <SectionCard
              title="Follow-up queue"
              description="What is due next across the current pipeline."
              action={followUpsDueToday ? <StatPill tone="accent">{formatNumber(followUpsDueToday)} due today</StatPill> : null}
            >
              {leadsQuery.isLoading ? (
                <LoadingBlock className="h-[248px]" />
              ) : (
                <ActivityFeed
                  items={followUpItems}
                  empty={{
                    icon: <ClockIcon className="h-5 w-5" />,
                    title: 'No follow-ups scheduled',
                    description: 'No follow-ups are scheduled yet. Once outreach starts, this queue will keep the next touch visible.',
                    action: <Button href="/followups" size="sm">Open follow-ups</Button>
                  }}
                />
              )}
            </SectionCard>
          </div>
        </>
      )}
=======
'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

interface DashboardResponse {
  today: { leadsDiscovered: number; messagesSent: number; repliesReceived: number; followUpsDue: number };
  recentActivity: Array<{ id: string; action: string; createdAt: string; lead?: { business?: { name?: string } } | null }>;
  pipeline: Array<{ status: string; _count: number }>;
  messaging: { sent: number; replies: number; replyRate: number };
  conversion: { revenue: number };
}

const quickActions: Array<{ label: string; href: Route }> = [
  { label: 'Search businesses', href: '/lead-search' },
  { label: 'Review leads', href: '/lead-search' },
  { label: 'Check follow-ups', href: '/followups' },
  { label: 'Open analytics', href: '/analytics' }
];

export default function DashboardPage() {
  const { data } = useQuery({ queryKey: ['dashboard'], queryFn: () => api<DashboardResponse>('/analytics/dashboard') });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Operator Dashboard</h1>

      <section className="card">
        <h2 className="mb-2 font-medium">Quick actions</h2>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href} className="rounded bg-cyan-700 px-3 py-2 text-sm">
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        <MetricCard label="Leads discovered today" value={data?.today.leadsDiscovered ?? 0} />
        <MetricCard label="Messages sent today" value={data?.today.messagesSent ?? 0} />
        <MetricCard label="Replies today" value={data?.today.repliesReceived ?? 0} />
        <MetricCard label="Follow-ups due" value={data?.today.followUpsDue ?? 0} />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="mb-2 font-medium">Recent activity</h2>
          <div className="space-y-2 text-sm">
            {data?.recentActivity?.map((item) => (
              <div key={item.id} className="rounded border border-slate-800 p-2">
                <p className="font-medium">{item.action}</p>
                <p className="text-xs text-slate-400">{item.lead?.business?.name ?? 'System action'} · {new Date(item.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="mb-2 font-medium">Pipeline summary</h2>
          <div className="space-y-2 text-sm">
            {data?.pipeline?.map((row) => (
              <div key={row.status} className="flex justify-between rounded border border-slate-800 p-2">
                <span>{row.status === 'SENT' ? 'CONTACTED' : row.status}</span>
                <span>{row._count}</span>
              </div>
            ))}
            <div className="mt-3 border-t border-slate-800 pt-2 text-slate-300">
              Reply rate: {Math.round((data?.messaging.replyRate ?? 0) * 100)}% · Revenue: ${data?.conversion.revenue ?? 0}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card">
      <p className="text-xs uppercase text-slate-400">{label}</p>
      <p className="text-2xl font-semibold text-cyan-200">{value}</p>
>>>>>>> theirs
    </div>
  );
}
