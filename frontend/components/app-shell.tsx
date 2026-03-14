'use client';

import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AppNavigation, resolveRouteMeta } from './nav';
import { Button, StatPill } from './ui';
import { LogoMark } from './icons';

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const routeMeta = resolveRouteMeta(pathname);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const syncTokenState = () => {
      setHasToken(Boolean(window.localStorage.getItem('token')));
    };

    syncTokenState();
    window.addEventListener('storage', syncTokenState);
    return () => window.removeEventListener('storage', syncTokenState);
  }, []);

  const isShelllessPage = pathname === '/' || pathname === '/login';

  if (isShelllessPage) {
    return (
      <div className="min-h-screen bg-[var(--app-bg)]">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--app-bg)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <aside className="hidden w-[272px] shrink-0 border-r border-white/8 bg-[#0b0e13] px-4 py-4 lg:flex lg:flex-col">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-xl px-2 py-2">
            <LogoMark className="h-9 w-9 shrink-0" />
            <div>
              <div className="font-display text-base font-semibold text-white">LeadMap AI</div>
              <div className="text-xs text-slate-500">Lead operations workspace</div>
            </div>
          </Link>

          <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-3 text-xs text-slate-400">
            <div className="flex items-center justify-between gap-2">
              <span>Workspace</span>
              <StatPill tone={hasToken ? 'success' : 'default'}>{hasToken ? 'Signed in' : 'Guest'}</StatPill>
            </div>
          </div>

          <div className="mt-6 flex-1 overflow-y-auto pr-1">
            <AppNavigation pathname={pathname} />
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Workspace online
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/8 bg-[#0b0e13]/95 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 xl:px-10">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-white">{routeMeta.label}</div>
                <div className="truncate text-xs text-slate-500">{routeMeta.description}</div>
              </div>
              <div className="hidden items-center gap-2 md:flex">
                {hasToken ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      window.localStorage.removeItem('token');
                      setHasToken(false);
                      window.location.href = '/login';
                    }}
                  >
                    Sign out
                  </Button>
                ) : (
                  <Button href="/login" variant="secondary" size="sm">
                    Sign in
                  </Button>
                )}
                <Button href="/lead-search" size="sm">
                  Lead Search
                </Button>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[1320px] px-4 pb-3 sm:px-6 lg:hidden lg:px-8 xl:px-10">
              <AppNavigation pathname={pathname} mobile />
            </div>
          </header>

          <main className="flex-1 px-4 py-4 sm:px-6 lg:px-8 xl:px-10 xl:py-5">
            <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
