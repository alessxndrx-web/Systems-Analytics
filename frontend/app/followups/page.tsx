<<<<<<< ours
﻿import { Button, EmptyState, MetricCard, PageHeader, QuickActions, SectionCard, StatPill } from '../../components/ui';
import { ActivityIcon, ClockIcon, FollowUpIcon, MailIcon } from '../../components/icons';
import { formatNumber } from '../../lib/format';

const zero = formatNumber(0);

export default function FollowupsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Follow-ups"
        description="Keep track of what needs another touch and what is due today."
        meta={
          <>
            <StatPill>{zero} scheduled</StatPill>
            <StatPill>{zero} due today</StatPill>
          </>
        }
        actions={
          <>
            <Button href="/map" variant="secondary">Open map</Button>
            <Button href="/dashboard">Open dashboard</Button>
          </>
        }
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard label="Scheduled" value={zero} hint="Every planned follow-up will appear here." icon={<FollowUpIcon className="h-5 w-5" />} tone="cyan" />
        <MetricCard label="Due today" value={zero} hint="Same-day follow-ups will stay easy to spot." icon={<ClockIcon className="h-5 w-5" />} tone="amber" />
        <MetricCard label="Completed" value={zero} hint="Completed follow-ups will show up once outreach starts running." icon={<ActivityIcon className="h-5 w-5" />} tone="emerald" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_360px]">
        <SectionCard title="Follow-up queue" description="This is where the next-touch list will live.">
          <EmptyState
            icon={<FollowUpIcon className="h-6 w-6" />}
            title="No follow-ups are scheduled yet"
            description="Once a first message goes out, upcoming touches will appear here with timing and status."
            action={<Button href="/drafts">Review drafts</Button>}
          />
        </SectionCard>

        <SectionCard title="How this queue works" description="Small guidance to make the page useful before data starts flowing.">
          <div className="space-y-4">
            <div className="rounded-lg border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
              First-contact approval is what usually creates the first follow-up.
            </div>
            <div className="rounded-lg border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
              Use the map and lead profile pages to decide which accounts deserve another touch.
            </div>
            <QuickActions
              items={[
                {
                  label: 'Review drafts',
                  description: 'See what needs approval before follow-ups can start.',
                  href: '/drafts',
                  icon: <MailIcon className="h-4 w-4" />
                },
                {
                  label: 'Check dashboard',
                  description: 'Keep an eye on what is due today and what is overdue.',
                  href: '/dashboard',
                  icon: <ClockIcon className="h-4 w-4" />
                }
              ]}
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
=======
'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

interface FollowUpItem {
  id: string;
  scheduledFor: string;
  status: string;
  content: string;
  lead: { id: string; business: { name: string; city: string; niche: string } };
}

interface QueueResponse {
  overdue: FollowUpItem[];
  upcoming: FollowUpItem[];
  completed: FollowUpItem[];
}

export default function FollowupsPage() {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState('');

  const { data } = useQuery({ queryKey: ['followups'], queryFn: () => api<QueueResponse>('/leads/followups/queue') });

  const completeMutation = useMutation({
    mutationFn: (id: string) => api(`/leads/followups/${id}/complete`, { method: 'PATCH' }),
    onSuccess: async () => {
      setFeedback('Follow-up marked as completed.');
      await queryClient.invalidateQueries({ queryKey: ['followups'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  const rescheduleMutation = useMutation({
    mutationFn: ({ id, scheduledFor }: { id: string; scheduledFor: string }) =>
      api(`/leads/followups/${id}/reschedule`, { method: 'PATCH', body: JSON.stringify({ scheduledFor }) }),
    onSuccess: async () => {
      setFeedback('Follow-up rescheduled successfully.');
      await queryClient.invalidateQueries({ queryKey: ['followups'] });
    }
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Follow-up Queue</h1>
      {feedback && <p className="text-sm text-cyan-200">{feedback}</p>}
      <QueueSection title="Overdue" items={data?.overdue ?? []} onComplete={completeMutation.mutate} onReschedule={rescheduleMutation.mutate} />
      <QueueSection title="Upcoming" items={data?.upcoming ?? []} onComplete={completeMutation.mutate} onReschedule={rescheduleMutation.mutate} />
      <QueueSection title="Completed" items={data?.completed ?? []} />
    </div>
  );
}

function QueueSection({
  title,
  items,
  onComplete,
  onReschedule
}: {
  title: string;
  items: FollowUpItem[];
  onComplete?: (id: string) => void;
  onReschedule?: (payload: { id: string; scheduledFor: string }) => void;
}) {
  const [dateById, setDateById] = useState<Record<string, string>>({});

  return (
    <section className="card space-y-3">
      <h2 className="text-lg font-medium">{title} ({items.length})</h2>
      {items.map((item) => (
        <div key={item.id} className="rounded border border-slate-700 p-3">
          <p className="font-medium">{item.lead.business.name}</p>
          <p className="text-xs text-slate-400">{item.lead.business.city} · {item.lead.business.niche}</p>
          <p className="mt-1 text-sm text-slate-300">{item.content}</p>
          <p className="mt-1 text-xs text-slate-500">Scheduled for {new Date(item.scheduledFor).toLocaleString()}</p>
          {(onComplete || onReschedule) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {onComplete && <button className="rounded bg-cyan-700 px-2 py-1" onClick={() => onComplete(item.id)}>Mark completed</button>}
              {onReschedule && (
                <>
                  <input
                    className="rounded bg-slate-800 p-1"
                    type="datetime-local"
                    value={dateById[item.id] ?? ''}
                    onChange={(e) => setDateById((prev) => ({ ...prev, [item.id]: e.target.value }))}
                  />
                  <button
                    className="rounded bg-slate-700 px-2 py-1"
                    onClick={() => {
                      const next = dateById[item.id];
                      if (next) {
                        onReschedule({ id: item.id, scheduledFor: new Date(next).toISOString() });
                      }
                    }}
                  >
                    Reschedule
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
>>>>>>> theirs
