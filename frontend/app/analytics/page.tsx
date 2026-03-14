<<<<<<< ours
﻿'use client';

import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../../lib/api';
import { DashboardData } from '../../lib/types';
import { formatCurrency, formatNumber, formatPercent } from '../../lib/format';
import { Button, EmptyState, MetricCard, PageHeader, SectionCard, StatPill } from '../../components/ui';
import { ActivityIcon, AnalyticsIcon, GlobeIcon, RevenueIcon } from '../../components/icons';

function getGroupCount(item: { _count: number | { _all: number } }) {
  return typeof item._count === 'number' ? item._count : item._count?._all ?? 0;
}

const chartTooltipStyle = {
  backgroundColor: '#10151d',
  border: '1px solid rgba(148, 163, 184, 0.12)',
  borderRadius: '14px',
  color: '#f8fafc',
  boxShadow: '0 18px 40px -34px rgba(15, 23, 42, 0.95)'
};

export default function AnalyticsPage() {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['analytics'],
    queryFn: () => api<DashboardData>('/analytics/dashboard')
  });

  const byCity = (data?.prospecting.byCity ?? []).map((item) => ({ city: item.city || 'Unassigned', count: getGroupCount(item) }));
  const byNiche = (data?.prospecting.byNiche ?? []).map((item) => ({ niche: item.niche || 'Unassigned', count: getGroupCount(item) }));
  const messagesSent = data?.messaging.sent ?? 0;
  const replies = data?.messaging.replies ?? 0;
  const meetings = data?.conversion.meetings ?? 0;
  const won = data?.conversion.won ?? 0;
  const revenue = data?.conversion.revenue ?? 0;
  const topCity = [...byCity].sort((left, right) => right.count - left.count)[0];
  const topNiche = [...byNiche].sort((left, right) => right.count - left.count)[0];
  const funnel = [
    { label: 'Sent', value: messagesSent },
    { label: 'Replies', value: replies },
    { label: 'Meetings', value: meetings },
    { label: 'Won', value: won }
  ];
  const funnelMax = Math.max(...funnel.map((step) => step.value), 1);

  const analyticsSummary = byCity.length
    ? `${topCity?.city || 'Your top city'} currently has the highest lead concentration, while ${topNiche?.niche || 'your top niche'} is the strongest niche in the dataset.`
    : 'Run a lead search to start building your first territory and outreach trends.';

  return (
    <div className="space-y-5">
      <PageHeader
        title="Performance"
        description="See where new leads are coming from and how outreach is moving through the pipeline."
        meta={
          <>
            <StatPill>{formatNumber(messagesSent)} messages sent</StatPill>
            <StatPill tone="success">{formatPercent(data?.messaging.replyRate ?? 0)} reply rate</StatPill>
            <StatPill>{formatNumber(byCity.length)} territories tracked</StatPill>
          </>
        }
        actions={<Button href="/dashboard">Back to dashboard</Button>}
      />

      {error ? (
        <SectionCard>
          <EmptyState
            icon={<AnalyticsIcon className="h-6 w-6" />}
            title="No analytics data yet"
            description="Sign in to load live metrics. Once data is available, this page will show territory trends, reply performance, and revenue in one place."
            action={<Button href="/login">Sign in</Button>}
          />
        </SectionCard>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="New leads"
              value={formatNumber(byCity.reduce((sum, item) => sum + item.count, 0))}
              hint={isLoading ? 'Loading discovery activity.' : 'Leads currently represented in analytics.'}
              icon={<GlobeIcon className="h-5 w-5" />}
              tone="cyan"
            />
            <MetricCard
              label="Replies"
              value={formatNumber(replies)}
              hint={isLoading ? 'Loading reply activity.' : `${formatPercent(data?.messaging.replyRate ?? 0)} of sent messages received a reply.`}
              icon={<ActivityIcon className="h-5 w-5" />}
              tone="emerald"
            />
            <MetricCard
              label="Meetings"
              value={formatNumber(meetings)}
              hint={isLoading ? 'Loading meeting conversion.' : `${formatNumber(won)} opportunities have already been won.`}
              icon={<AnalyticsIcon className="h-5 w-5" />}
              tone="amber"
            />
            <MetricCard
              label="Revenue"
              value={formatCurrency(revenue)}
              hint={isLoading ? 'Loading revenue.' : 'Closed revenue tied to the current pipeline.'}
              icon={<RevenueIcon className="h-5 w-5" />}
              tone="rose"
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
            <SectionCard title="Lead volume by city" description="Which territories are producing the most leads right now.">
              {isLoading ? (
                <div className="h-[320px] animate-pulse rounded-xl bg-white/[0.04]" />
              ) : byCity.length ? (
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={byCity} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                      <XAxis dataKey="city" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} contentStyle={chartTooltipStyle} />
                      <Bar dataKey="count" fill="#94a3b8" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState compact title="No territory data yet" description="Search a city to start building your first territory view." action={<Button href="/lead-search" size="sm">Search businesses</Button>} />
              )}
            </SectionCard>

            <SectionCard title="Pipeline movement" description="A quick view of how leads are moving from outbound to won.">
              <div className="space-y-4">
                {funnel.map((step) => (
                  <div key={step.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{step.label}</span>
                      <span className="font-medium text-white">{formatNumber(step.value)}</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/6">
                      <div
                        className="h-3 rounded-full bg-slate-300"
                        style={{ width: `${Math.max(step.value ? (step.value / funnelMax) * 100 : 0, step.value ? 14 : 8)}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="rounded-lg border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
                  {messagesSent
                    ? `${formatNumber(messagesSent)} messages have gone out, ${formatNumber(replies)} have received a reply, and ${formatNumber(meetings)} have moved into meetings.`
                    : 'No outreach activity is recorded yet. Once messages are sent, this funnel will help you see where the pipeline is slowing down.'}
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
            <SectionCard title="Lead volume by niche" description="Which business types are showing the strongest lead volume.">
              {isLoading ? (
                <div className="h-[320px] animate-pulse rounded-xl bg-white/[0.04]" />
              ) : byNiche.length ? (
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={byNiche} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <YAxis dataKey="niche" type="category" width={92} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} contentStyle={chartTooltipStyle} />
                      <Bar dataKey="count" fill="#64748b" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState compact title="No niche data yet" description="Your niche mix will appear here once searches start bringing in leads." action={<Button href="/lead-search" size="sm">Search businesses</Button>} />
              )}
            </SectionCard>

            <SectionCard title="What stands out" description="Small summaries to help explain what the numbers mean.">
              <div className="space-y-3">
                <div className="rounded-lg border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
                  <div className="text-sm font-semibold text-white">Overview</div>
                  <p className="mt-2">{analyticsSummary}</p>
                </div>
                <div className="rounded-lg border border-white/8 bg-white/[0.03] p-4">
                  <div className="text-sm font-semibold text-white">Top territory</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {topCity ? `${topCity.city} leads the board with ${formatNumber(topCity.count)} leads.` : 'No territory trend yet.'}
                  </p>
                </div>
                <div className="rounded-lg border border-white/8 bg-white/[0.03] p-4">
                  <div className="text-sm font-semibold text-white">Top niche</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {topNiche ? `${topNiche.niche} is the strongest niche in the current dataset.` : 'No niche trend yet.'}
                  </p>
                </div>
                <div className="rounded-lg border border-white/8 bg-white/[0.03] p-4">
                  <div className="text-sm font-semibold text-white">Reply health</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {messagesSent
                      ? `${formatPercent(data?.messaging.replyRate ?? 0)} of sent messages are getting a reply.`
                      : 'Once messages go out, reply rate will tell you whether the current niche and territory are worth doubling down on.'}
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>
        </>
      )}
=======
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
>>>>>>> theirs
    </div>
  );
}
