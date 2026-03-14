<<<<<<< ours
﻿'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { ScoringRule } from '../../lib/types';
import { average, formatNumber } from '../../lib/format';
import { Button, EmptyState, FormField, Input, MetricCard, PageHeader, SectionCard, StatPill } from '../../components/ui';
import { ActivityIcon, SettingsIcon, SparkIcon } from '../../components/icons';

const ruleDescriptions: Record<string, string> = {
  no_website: 'Boost companies that still lack a website and may need urgent digital presence help.',
  outdated_website: 'Reward businesses whose current website looks old or neglected.',
  low_reviews: 'Increase priority when public review volume is still relatively low.',
  niche_fit: 'Give extra weight to niches that fit your core outreach playbook.',
  whatsapp_visible: 'Highlight businesses already showing customer-response intent.',
  local_business: 'Prefer local operators where faster decision-making is more likely.',
  chain_brand: 'Reduce or balance scores for larger chain-style businesses.'
};

export default function SettingsPage() {
  const { data = [], error, isLoading, refetch } = useQuery<ScoringRule[]>({ queryKey: ['rules'], queryFn: () => api<ScoringRule[]>('/scoring/rules') });
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!data.length) {
      return;
    }

    setDrafts(Object.fromEntries(data.map((rule) => [rule.key, String(rule.weight)])));
  }, [data]);

  async function saveRule(rule: ScoringRule) {
    const rawValue = drafts[rule.key] ?? String(rule.weight);
    const weight = Number.parseInt(rawValue, 10);

    if (Number.isNaN(weight)) {
      setFeedback('Please use whole numbers for rule weights.');
      return;
    }

    setSavingKey(rule.key);
    setFeedback('');

    try {
      await api('/scoring/rules', {
        method: 'PATCH',
        body: JSON.stringify({ key: rule.key, weight })
      });
      setFeedback(`Done. ${rule.label} has been updated.`);
      await refetch();
    } catch (requestError) {
      setFeedback(requestError instanceof Error ? requestError.message : 'Unable to save this rule right now.');
    } finally {
      setSavingKey(null);
    }
  }

  const averageWeight = Math.round(average(data.map((rule) => rule.weight)));
  const strongestRule = data.length ? [...data].sort((left, right) => right.weight - left.weight)[0] : null;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Scoring"
        description="Adjust how lead scores are weighted so the workspace reflects your current priorities."
        meta={
          <>
            <StatPill>{formatNumber(data.length)} active rules</StatPill>
            <StatPill>{strongestRule?.label ?? 'No top rule yet'}</StatPill>
          </>
        }
        actions={<Button href="/dashboard">Open dashboard</Button>}
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Rules loaded" value={formatNumber(data.length)} hint="Scoring rules currently available in the workspace." icon={<SettingsIcon className="h-5 w-5" />} tone="cyan" />
        <MetricCard label="Average weight" value={formatNumber(averageWeight)} hint="A quick read on how strong your scoring weights are overall." icon={<ActivityIcon className="h-5 w-5" />} tone="emerald" />
        <MetricCard label="Strongest rule" value={strongestRule?.label ?? 'No rules yet'} hint="The rule currently carrying the most scoring weight." icon={<SparkIcon className="h-5 w-5" />} tone="amber" />
        <MetricCard label="Mode" value="Manual tuning" hint="Scoring changes are explicit and easy to review." icon={<SettingsIcon className="h-5 w-5" />} tone="rose" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <SectionCard title="Scoring rules" description="Tune weights directly in the interface with a short explanation for each signal.">
          {error ? (
            <EmptyState
              icon={<SettingsIcon className="h-6 w-6" />}
              title="Scoring settings are locked"
              description="Sign in to load and update scoring rules. Once connected, changes made here will shape how new leads are ranked."
              action={<Button href="/login">Sign in</Button>}
            />
          ) : isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-28 animate-pulse rounded-xl bg-white/[0.04]" />
              ))}
            </div>
          ) : data.length ? (
            <div className="space-y-4">
              {data.map((rule) => (
                <div key={rule.id} className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="text-base font-semibold text-white">{rule.label}</div>
                      <div className="text-sm leading-6 text-slate-400">{ruleDescriptions[rule.key] ?? 'Adjust this rule to better match your current prospecting strategy.'}</div>
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{rule.key}</div>
                    </div>
                    <div className="flex w-full gap-3 lg:w-auto lg:min-w-[220px]">
                      <FormField label="Weight" hint="Higher weights push matching leads closer to the top of the queue.">
                        <Input value={drafts[rule.key] ?? String(rule.weight)} onChange={(event) => setDrafts((current) => ({ ...current, [rule.key]: event.target.value }))} inputMode="numeric" />
                      </FormField>
                      <div className="flex items-end">
                        <Button size="sm" onClick={() => saveRule(rule)} disabled={savingKey === rule.key}>
                          {savingKey === rule.key ? 'Saving...' : 'Save'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {feedback ? <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">{feedback}</div> : null}
            </div>
          ) : (
            <EmptyState
              icon={<SparkIcon className="h-6 w-6" />}
              title="No scoring rules yet"
              description="Once rules are available, you will be able to tune how strongly each lead signal affects the final score."
            />
          )}
        </SectionCard>

        <SectionCard title="How to use scoring" description="Small reminders to keep score changes useful.">
          <div className="space-y-4">
            {[
              {
                title: 'Start with the strongest signals',
                body: 'Change the biggest weights first. It is easier to judge the impact when only one or two rules move at a time.'
              },
              {
                title: 'Check the map after changes',
                body: 'Good scores should push the right businesses toward the top of the territory view, not just produce bigger numbers.'
              },
              {
                title: 'Review again after replies come in',
                body: 'Once you have reply and meeting data, scoring can reflect what is actually working in the field.'
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
=======
'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export default function SettingsPage() {
  const { data } = useQuery({ queryKey: ['rules'], queryFn: () => api<any[]>('/scoring/rules') });
  return (
    <div className="space-y-3">
      <h1 className="text-2xl">Settings</h1>
      <div className="card">Editable scoring rules: {data?.length ?? 0}</div>
>>>>>>> theirs
    </div>
  );
}
