<<<<<<< ours
﻿import type { Route } from 'next';
import Link from 'next/link';
import { ComponentType, SVGProps } from 'react';
import {
  AnalyticsIcon,
  DashboardIcon,
  DraftIcon,
  FollowUpIcon,
  LogsIcon,
  MapIcon,
  SearchIcon,
  SettingsIcon
} from './icons';
import { cn } from './ui';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type NavItem = {
  label: string;
  href: Route;
  icon: IconComponent;
};

export const navigationGroups: Array<{ label: string; items: NavItem[] }> = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
      { label: 'Analytics', href: '/analytics', icon: AnalyticsIcon },
      { label: 'Logs', href: '/logs', icon: LogsIcon }
    ]
  },
  {
    label: 'Workflow',
    items: [
      { label: 'Lead Search', href: '/lead-search', icon: SearchIcon },
      { label: 'Map', href: '/map', icon: MapIcon },
      { label: 'Drafts', href: '/drafts', icon: DraftIcon },
      { label: 'Follow-ups', href: '/followups', icon: FollowUpIcon },
      { label: 'Settings', href: '/settings', icon: SettingsIcon }
    ]
  }
];

const routeMeta: Array<{ match: RegExp; label: string; description: string }> = [
  { match: /^\/dashboard$/, label: 'Dashboard', description: 'What needs attention across new leads, outreach, and follow-ups.' },
  { match: /^\/lead-search$/, label: 'Lead Search', description: 'Find businesses by city and niche.' },
  { match: /^\/map$/, label: 'Lead Map', description: 'Review territories, scores, and lead status.' },
  { match: /^\/analytics$/, label: 'Analytics', description: 'Track territory coverage and reply performance.' },
  { match: /^\/settings$/, label: 'Settings', description: 'Adjust how leads are scored.' },
  { match: /^\/drafts$/, label: 'Drafts', description: 'Review messages before they go out.' },
  { match: /^\/followups$/, label: 'Follow-ups', description: 'See what needs another touch.' },
  { match: /^\/logs$/, label: 'Activity Log', description: 'Recent searches, sends, and system actions.' },
  { match: /^\/leads\/.+$/, label: 'Lead Profile', description: 'Business details, message history, and next steps.' },
  { match: /^\/$/, label: 'LeadMap AI', description: 'Lead operations workspace.' },
  { match: /^\/login$/, label: 'Sign In', description: 'Sign in to the workspace.' }
];

function isActive(pathname: string, href: string) {
  if (pathname === href) {
    return true;
  }

  if (href === '/dashboard') {
    return pathname.startsWith('/dashboard');
  }

  return pathname.startsWith(`${href}/`);
}

export function resolveRouteMeta(pathname: string) {
  return routeMeta.find((item) => item.match.test(pathname)) ?? routeMeta[0];
}

export function AppNavigation({ pathname, mobile = false }: { pathname: string; mobile?: boolean }) {
  if (mobile) {
    const items = navigationGroups.flatMap((group) => group.items);

    return (
      <div className="flex gap-2 overflow-x-auto pb-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'inline-flex min-w-max items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition',
                active ? 'border-white/10 bg-white/[0.08] text-white' : 'border-white/8 bg-white/[0.02] text-slate-400 hover:text-white'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {navigationGroups.map((group) => (
        <div key={group.label} className="space-y-2">
          <div className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{group.label}</div>
          <div className="space-y-1">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-2.5 rounded-xl border px-3 py-2 text-sm transition',
                    active ? 'border-white/10 bg-white/[0.08] text-white' : 'border-transparent text-slate-400 hover:border-white/8 hover:bg-white/[0.03] hover:text-white'
                  )}
                >
                  <div className={cn('flex h-7 w-7 items-center justify-center rounded-md border transition', active ? 'border-white/10 bg-white/[0.06]' : 'border-white/6 bg-white/[0.02]')}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
=======
import type { Route } from 'next';
import Link from 'next/link';

const links: Array<{ label: string; href: Route }> = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Lead Search', href: '/lead-search' },
  { label: 'Map', href: '/map' },
  { label: 'Drafts', href: '/drafts' },
  { label: 'Follow-ups', href: '/followups' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Settings', href: '/settings' },
  { label: 'Logs', href: '/logs' }
];

export function Nav() {
  return (
    <nav className="flex gap-3 p-4 border-b border-slate-800">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="text-sm text-cyan-300 hover:text-cyan-200">
          {link.label}
        </Link>
      ))}
    </nav>
>>>>>>> theirs
  );
}
