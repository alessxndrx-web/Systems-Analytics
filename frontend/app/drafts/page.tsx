<<<<<<< ours
﻿import { Button, EmptyState, MetricCard, PageHeader, QuickActions, SectionCard, StatPill } from '../../components/ui';
import { DraftIcon, FollowUpIcon, MailIcon, MapIcon, SearchIcon } from '../../components/icons';
import { formatNumber } from '../../lib/format';

const zero = formatNumber(0);

export default function DraftsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Drafts"
        description="Review first-contact messages before they go out."
        meta={
          <>
            <StatPill>{zero} waiting review</StatPill>
            <StatPill>{zero} sent today</StatPill>
          </>
        }
        actions={
          <>
            <Button href="/lead-search" variant="secondary">Search businesses</Button>
            <Button href="/dashboard">Open dashboard</Button>
          </>
        }
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard label="Waiting review" value={zero} hint="Drafts waiting for approval will show up here." icon={<DraftIcon className="h-5 w-5" />} tone="cyan" />
        <MetricCard label="Approved today" value={zero} hint="Approved drafts will move into outreach activity." icon={<MailIcon className="h-5 w-5" />} tone="emerald" />
        <MetricCard label="Needs follow-up" value={zero} hint="Follow-up drafts will be grouped here once replies start coming in." icon={<FollowUpIcon className="h-5 w-5" />} tone="amber" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_360px]">
        <SectionCard title="Draft queue" description="Your message review queue will show up here.">
          <EmptyState
            icon={<DraftIcon className="h-6 w-6" />}
            title="No drafts yet"
            description="Search a city and review leads first. When a message is created, it will show up here for approval."
            action={<Button href="/lead-search">Search businesses</Button>}
          />
        </SectionCard>

        <SectionCard title="What to do next" description="A few shortcuts for getting the queue started.">
          <QuickActions
            items={[
              {
                label: 'Search businesses',
                description: 'Add new leads to the pipeline before creating drafts.',
                href: '/lead-search',
                icon: <SearchIcon className="h-4 w-4" />
              },
              {
                label: 'Open map',
                description: 'Review which territories and businesses look worth contacting.',
                href: '/map',
                icon: <MapIcon className="h-4 w-4" />
              },
              {
                label: 'Check follow-ups',
                description: 'See where the next-touch queue will appear once activity starts.',
                href: '/followups',
                icon: <FollowUpIcon className="h-4 w-4" />
              },
              {
                label: 'View dashboard',
                description: 'Keep an eye on new leads, replies, and follow-ups in one place.',
                href: '/dashboard',
                icon: <MailIcon className="h-4 w-4" />
              }
            ]}
          />
        </SectionCard>
=======
'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

interface DraftMessage {
  id: string;
  leadId: string;
  content: string;
  lead: { business: { name: string; niche: string; city: string; website?: string | null } };
}

export default function DraftsPage() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<DraftMessage | null>(null);
  const [editedMessage, setEditedMessage] = useState('');
  const [feedback, setFeedback] = useState('');

  const { data: drafts = [] } = useQuery({ queryKey: ['drafts'], queryFn: () => api<DraftMessage[]>('/leads/drafts') });

  const approveMutation = useMutation({
    mutationFn: ({ leadId, content }: { leadId: string; content: string }) =>
      api(`/leads/${leadId}/approve-first`, { method: 'POST', body: JSON.stringify({ content }) }),
    onSuccess: async () => {
      setFeedback('Message approved and sent. Lead marked as contacted and follow-up scheduled.');
      setSelected(null);
      setEditedMessage('');
      await queryClient.invalidateQueries({ queryKey: ['drafts'] });
      await queryClient.invalidateQueries({ queryKey: ['leads'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (draftId: string) => api(`/leads/drafts/${draftId}/reject`, { method: 'PATCH' }),
    onSuccess: async () => {
      setFeedback('Draft rejected and lead moved back to reviewed.');
      setSelected(null);
      await queryClient.invalidateQueries({ queryKey: ['drafts'] });
      await queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Draft Approval</h1>
      {feedback && <p className="text-sm text-cyan-200">{feedback}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card space-y-2">
          <h2 className="font-medium">Pending drafts ({drafts.length})</h2>
          {drafts.map((draft) => (
            <button
              key={draft.id}
              className="w-full rounded border border-slate-700 p-3 text-left hover:border-cyan-500"
              onClick={() => {
                setSelected(draft);
                setEditedMessage(draft.content);
              }}
            >
              <p className="font-medium">{draft.lead.business.name}</p>
              <p className="text-xs text-slate-400">{draft.lead.business.niche} · {draft.lead.business.city}</p>
              <p className="mt-1 line-clamp-2 text-sm text-slate-300">{draft.content}</p>
            </button>
          ))}
        </div>

        <div className="card space-y-3">
          <h2 className="font-medium">Review and approve</h2>
          {!selected ? (
            <p className="text-sm text-slate-400">Pick a draft to review lead context and message copy.</p>
          ) : (
            <>
              <div className="text-sm">
                <p className="font-medium">{selected.lead.business.name}</p>
                <p className="text-slate-400">{selected.lead.business.city} · Website: {selected.lead.business.website ? 'Yes' : 'No'}</p>
              </div>
              <textarea
                className="min-h-40 w-full rounded bg-slate-800 p-3"
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  className="rounded bg-cyan-600 px-3 py-2"
                  onClick={() => selected && approveMutation.mutate({ leadId: selected.leadId, content: editedMessage })}
                >
                  Approve & send
                </button>
                <button className="rounded bg-slate-700 px-3 py-2" onClick={() => rejectMutation.mutate(selected.id)}>Reject draft</button>
              </div>
            </>
          )}
        </div>
>>>>>>> theirs
      </div>
    </div>
  );
}
