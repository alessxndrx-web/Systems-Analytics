<<<<<<< ours
﻿import { Button, StatPill } from '../components/ui';
import { AnalyticsIcon, LogoMark, MapIcon, SearchIcon } from '../components/icons';

export default function Home() {
  return (
    <div className="flex flex-1 items-center py-8 lg:py-12">
      <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <LogoMark className="h-12 w-12" />
            <div>
              <div className="font-display text-xl font-semibold text-white">LeadMap AI</div>
              <div className="text-sm text-slate-500">Lead operations workspace</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <StatPill>Workspace</StatPill>
              <StatPill tone="success">Frontend online</StatPill>
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Open the workspace.</h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-400">
              Use the current MVP routes to search leads, review the map, and monitor pipeline activity from a denser operational interface.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button href="/login" size="sm">Sign In</Button>
            <Button href="/dashboard" variant="secondary" size="sm">Dashboard</Button>
            <Button href="/lead-search" variant="secondary" size="sm">Lead Search</Button>
          </div>
        </section>

        <aside className="panel p-5">
          <div className="space-y-4">
            <div className="text-sm font-semibold text-white">Available views</div>
            <div className="grid gap-2">
              {[
                { label: 'Dashboard', note: 'Pipeline metrics and activity', icon: AnalyticsIcon },
                { label: 'Lead Search', note: 'Discovery workflow', icon: SearchIcon },
                { label: 'Map', note: 'Territory and score review', icon: MapIcon }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/8 bg-white/[0.03] text-slate-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.note}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
=======
export default function Home() {
  return <div className="card">LeadMap AI MVP. Go to /login to begin.</div>;
>>>>>>> theirs
}
