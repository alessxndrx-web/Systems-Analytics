<<<<<<< ours
﻿'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { LeadDetail } from '../../../lib/types';
import { formatCurrency, formatDateTime, formatNumber } from '../../../lib/format';
import { Button, EmptyState, MetricCard, PageHeader, SectionCard, StatPill, StatusBadge } from '../../../components/ui';
import { ActivityIcon, BuildingIcon, ClockIcon, MailIcon, RevenueIcon } from '../../../components/icons';

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, error, isLoading } = useQuery<LeadDetail>({ queryKey: ['lead', params.id], queryFn: () => api<LeadDetail>(`/leads/${params.id}`) });

  const messages = data?.messages ?? [];
  const followUps = data?.followUps ?? [];
  const deals = data?.deals ?? [];
  const revenue = deals.reduce((sum, deal) => sum + deal.amount, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        title={data?.business.name || 'Lead profile'}
        description={
          data
            ? `${data.business.category} in ${data.business.city}, ${data.business.country}. Review the business, recent outreach, and what should happen next.`
            : 'Review the business, recent outreach, and what should happen next.'
        }
        meta={
          <>
            {data ? <StatusBadge status={data.status} /> : null}
            <StatPill>{formatNumber(data?.score ?? 0)} score</StatPill>
          </>
        }
        actions={
          <>
            <Button href="/map" variant="secondary">
              Back to map
            </Button>
            <Button href="/lead-search">Search businesses</Button>
          </>
        }
      />

      {error ? (
        <SectionCard>
          <EmptyState
            icon={<BuildingIcon className="h-6 w-6" />}
            title="This lead is not available right now"
            description="Sign in to load the full lead record. Once connected, this page will show business details, outreach history, and follow-up timing."
            action={<Button href="/login">Sign in</Button>}
          />
        </SectionCard>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Score" value={formatNumber(data?.score ?? 0)} hint="Current lead score for this business." icon={<ActivityIcon className="h-5 w-5" />} tone="cyan" />
            <MetricCard label="Messages" value={formatNumber(messages.length)} hint="Outbound and inbound messages tied to this lead." icon={<MailIcon className="h-5 w-5" />} tone="emerald" />
            <MetricCard label="Follow-ups" value={formatNumber(followUps.length)} hint="Scheduled and completed follow-ups for this lead." icon={<ClockIcon className="h-5 w-5" />} tone="amber" />
            <MetricCard label="Deal value" value={formatCurrency(revenue)} hint="Open or won deal value tied to this lead." icon={<RevenueIcon className="h-5 w-5" />} tone="rose" />
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_360px]">
            <SectionCard title="Business profile" description="Key account details for review before outreach or follow-up.">
              {isLoading ? (
                <div className="h-60 animate-pulse rounded-xl bg-white/[0.04]" />
              ) : data ? (
                <dl className="grid gap-4 sm:grid-cols-2">
                  {[
                    ['Category', data.business.category],
                    ['Niche', data.business.niche],
                    ['Website', data.business.website || 'No website'],
                    ['Phone', data.business.phone || 'No phone'],
                    ['Address', data.business.address],
                    ['Next follow-up', formatDateTime(data.nextFollowUpDate)]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-white/8 bg-white/[0.03] p-4">
                      <dt className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</dt>
                      <dd className="mt-3 text-sm leading-6 text-white">{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <EmptyState compact title="No profile data yet" description="Business details will show up here once this lead is available." />
              )}
            </SectionCard>

            <SectionCard title="What to do next" description="A simple checklist for working this lead.">
              <div className="space-y-3">
                {[
                  'Check the territory on the map to make sure this business belongs in the current search area.',
                  'Use the outreach history below to decide whether the next step is a first message or a follow-up.',
                  'Only adjust scoring after you start seeing the same patterns across several leads.'
                ].map((item) => (
                  <div key={item} className="rounded-lg border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_360px]">
            <SectionCard title="Outreach history" description="Messages tied to this lead, in the order they happened.">
              {messages.length ? (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div key={message.id} className="rounded-lg border border-white/8 bg-white/[0.03] p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatPill>{message.direction}</StatPill>
                        <StatPill tone={message.approved ? 'success' : 'accent'}>{message.approved ? 'Approved' : 'Pending review'}</StatPill>
                        <StatPill>{message.type}</StatPill>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-slate-200">{message.content}</p>
                      <div className="mt-3 text-xs text-slate-500">{formatDateTime(message.sentAt || message.createdAt)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState compact icon={<MailIcon className="h-5 w-5" />} title="No messages yet" description="When outreach starts, sent drafts and replies will appear here in one timeline." />
              )}
            </SectionCard>

            <SectionCard title="Follow-ups" description="Scheduled touches tied to this business.">
              {followUps.length ? (
                <div className="space-y-3">
                  {followUps.map((followUp) => (
                    <div key={followUp.id} className="rounded-lg border border-white/8 bg-white/[0.03] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <StatusBadge status={followUp.status} />
                        <span className="text-xs text-slate-500">{formatDateTime(followUp.scheduledFor)}</span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-200">{followUp.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState compact icon={<ClockIcon className="h-5 w-5" />} title="No follow-ups yet" description="Once outreach moves past the first touch, follow-up timing and notes will show up here." />
              )}
            </SectionCard>
          </div>
        </>
      )}
    </div>
  );
}
=======
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, LeadStatus } from '../../../lib/api';

interface LeadDetail {
  id: string;
  status: LeadStatus;
  score: number;
  business: { name: string; city: string; niche: string; website?: string | null; phone?: string | null; address: string };
  messages: Array<{ id: string; direction: 'OUTBOUND' | 'INBOUND'; content: string; createdAt: string }>;
  followUps: Array<{ id: string; status: string; scheduledFor: string; executedAt?: string | null }>;
  activityLog: Array<{ id: string; action: string; createdAt: string; details?: unknown }>;
}

const opportunityStatuses: LeadStatus[] = ['NEW', 'REVIEWED', 'SENT', 'REPLIED', 'INTERESTED', 'WON', 'LOST', 'DISCARDED'];

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [replyText, setReplyText] = useState('Thanks, I am interested in learning more.');
  const [feedback, setFeedback] = useState('');

  const { data } = useQuery({ queryKey: ['lead', params.id], queryFn: () => api<LeadDetail>(`/leads/${params.id}`) });

  const replyMutation = useMutation({
    mutationFn: () => api(`/leads/${params.id}/reply`, { method: 'POST', body: JSON.stringify({ content: replyText }) }),
    onSuccess: async () => {
      setFeedback('Reply recorded and lead moved to replied.');
      await queryClient.invalidateQueries({ queryKey: ['lead', params.id] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  const statusMutation = useMutation({
    mutationFn: (status: LeadStatus) => api(`/leads/${params.id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    onSuccess: async (_, status) => {
      setFeedback(`Lead moved to ${status}.`);
      await queryClient.invalidateQueries({ queryKey: ['lead', params.id] });
      await queryClient.invalidateQueries({ queryKey: ['leads'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Lead detail</h1>
      {feedback && <p className="text-sm text-cyan-200">{feedback}</p>}
      <section className="card">
        <p className="text-lg font-medium">{data?.business.name}</p>
        <p className="text-sm text-slate-400">{data?.business.address}</p>
        <p className="mt-1 text-sm">Score: {data?.score} · Status: {displayStatus(data?.status)}</p>
      </section>

      <section className="card space-y-2">
        <h2 className="font-medium">Opportunity status</h2>
        <div className="flex flex-wrap gap-2">
          {opportunityStatuses.map((status) => (
            <button key={status} className="rounded bg-slate-800 px-2 py-1 text-xs" onClick={() => statusMutation.mutate(status)}>
              {displayStatus(status)}
            </button>
          ))}
        </div>
      </section>

      <section className="card space-y-2">
        <h2 className="font-medium">Reply tracking</h2>
        <textarea className="min-h-24 w-full rounded bg-slate-800 p-2" value={replyText} onChange={(e) => setReplyText(e.target.value)} />
        <button className="rounded bg-cyan-700 px-3 py-2" onClick={() => replyMutation.mutate()}>
          Mark as replied
        </button>
      </section>

      <section className="card">
        <h2 className="mb-2 font-medium">Activity timeline</h2>
        <div className="space-y-2 text-sm">
          {data?.activityLog?.map((item) => (
            <div key={item.id} className="rounded border border-slate-800 p-2">
              <p className="font-medium">{item.action}</p>
              <p className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
          ))}
          {data?.messages?.map((message) => (
            <div key={message.id} className="rounded border border-slate-800 p-2">
              <p className="font-medium">{message.direction === 'INBOUND' ? 'Reply received' : 'Message sent'}</p>
              <p className="text-xs text-slate-300">{message.content}</p>
              <p className="text-xs text-slate-500">{new Date(message.createdAt).toLocaleString()}</p>
            </div>
          ))}
          {data?.followUps?.map((followUp) => (
            <div key={followUp.id} className="rounded border border-slate-800 p-2">
              <p className="font-medium">Follow-up {followUp.status}</p>
              <p className="text-xs text-slate-500">Scheduled {new Date(followUp.scheduledFor).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function displayStatus(status?: LeadStatus) {
  if (!status) return '-';
  if (status === 'SENT') return 'CONTACTED';
  return status;
}
>>>>>>> theirs
