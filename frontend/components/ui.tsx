import type { Route } from 'next';
import Link from 'next/link';
import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { ArrowUpRightIcon } from './icons';
import { formatStatusLabel } from '../lib/format';

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

type ButtonProps = {
  children: ReactNode;
  href?: Route;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export type QuickActionItem = {
  label: string;
  description: string;
  href: Route;
  icon?: ReactNode;
};

export type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  meta?: string;
  status?: string | null;
  href?: Route;
  icon?: ReactNode;
};

const buttonVariants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'border-slate-100 bg-slate-100 text-slate-950 hover:bg-white focus-visible:ring-slate-200/20',
  secondary: 'border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.06] focus-visible:ring-white/10',
  ghost: 'border-transparent bg-transparent text-slate-400 hover:bg-white/[0.04] hover:text-white focus-visible:ring-white/10'
};

const buttonSizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-9 px-4 text-sm',
  lg: 'h-10 px-4.5 text-sm'
};

export function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className,
  leading,
  trailing,
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-xl border font-medium transition duration-150 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60',
    buttonVariants[variant],
    buttonSizes[size],
    className
  );

  const content = (
    <>
      {leading}
      <span>{children}</span>
      {trailing}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {content}
    </button>
  );
}

export function StatPill({ children, tone = 'default', className }: { children: ReactNode; tone?: 'default' | 'success' | 'accent'; className?: string }) {
  const tones = {
    default: 'border-white/8 bg-white/[0.03] text-slate-300',
    success: 'border-emerald-400/14 bg-emerald-400/8 text-emerald-200',
    accent: 'border-sky-400/14 bg-sky-400/8 text-sky-200'
  };

  return <span className={cn('inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium tracking-[0.02em]', tones[tone], className)}>{children}</span>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl space-y-2">
        {eyebrow ? <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{eyebrow}</div> : null}
        <div className="space-y-1.5">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-400">{description}</p>
        </div>
        {meta ? <div className="flex flex-wrap items-center gap-2 pt-1">{meta}</div> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section className={cn('panel p-4 sm:p-5', className)}>
      {title || description || action ? (
        <div className="mb-4 flex flex-col gap-3 border-b border-white/8 pb-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            {title ? <h2 className="text-base font-semibold tracking-tight text-white">{title}</h2> : null}
            {description ? <p className="max-w-2xl text-sm leading-5 text-slate-400">{description}</p> : null}
          </div>
          {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
        </div>
      ) : null}
      <div className={contentClassName}>{children}</div>
    </section>
  );
}

const toneStyles: Record<'cyan' | 'emerald' | 'amber' | 'rose', string> = {
  cyan: 'border-sky-400/14',
  emerald: 'border-emerald-400/14',
  amber: 'border-amber-400/14',
  rose: 'border-rose-400/14'
};

const iconStyles: Record<'cyan' | 'emerald' | 'amber' | 'rose', string> = {
  cyan: 'border-sky-400/14 bg-sky-400/8 text-sky-200',
  emerald: 'border-emerald-400/14 bg-emerald-400/8 text-emerald-200',
  amber: 'border-amber-400/14 bg-amber-400/8 text-amber-200',
  rose: 'border-rose-400/14 bg-rose-400/8 text-rose-200'
};

export function MetricCard({
  label,
  value,
  hint,
  icon,
  tone = 'cyan'
}: {
  label: string;
  value: string;
  hint: string;
  icon?: ReactNode;
  tone?: 'cyan' | 'emerald' | 'amber' | 'rose';
}) {
  return (
    <div className={cn('panel p-4', toneStyles[tone])}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{label}</p>
          <div className="space-y-1">
            <p className="font-display text-2xl font-semibold tracking-tight text-white">{value}</p>
            <p className="text-xs leading-5 text-slate-400">{hint}</p>
          </div>
        </div>
        {icon ? <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg border', iconStyles[tone])}>{icon}</div> : null}
      </div>
    </div>
  );
}

export function HelperText({ children }: { children: ReactNode }) {
  return <p className="text-xs leading-5 text-slate-500">{children}</p>;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  compact = false,
  className
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-start rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-left', compact ? 'gap-3 p-4' : 'gap-4 p-5 sm:p-6', className)}>
      {icon ? <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/8 bg-white/[0.04] text-slate-100">{icon}</div> : null}
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="max-w-xl text-sm leading-6 text-slate-400">{description}</p>
      </div>
      {action ? <div className="flex flex-wrap items-center gap-2">{action}</div> : null}
    </div>
  );
}

export function StatusBadge({ status }: { status?: string | null }) {
  const value = status?.toUpperCase() ?? 'UNKNOWN';
  const palette = (() => {
    if (value === 'WON' || value === 'INTERESTED') {
      return 'border-emerald-400/14 bg-emerald-400/8 text-emerald-200';
    }
    if (value === 'MEETING' || value === 'QUALIFIED' || value === 'SENT') {
      return 'border-sky-400/14 bg-sky-400/8 text-sky-200';
    }
    if (value === 'REPLIED' || value === 'DRAFT_READY' || value === 'REVIEWED') {
      return 'border-violet-400/14 bg-violet-400/8 text-violet-200';
    }
    if (value === 'LOST' || value === 'DISCARDED') {
      return 'border-rose-400/14 bg-rose-400/8 text-rose-200';
    }
    return 'border-white/8 bg-white/[0.03] text-slate-300';
  })();

  return <span className={cn('inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-medium tracking-[0.02em]', palette)}>{formatStatusLabel(status)}</span>;
}

export function TableShell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('table-shell overflow-x-auto', className)}>{children}</div>;
}

export function FormField({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      {children}
      {hint ? <HelperText>{hint}</HelperText> : null}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('input-shell', className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn('input-shell appearance-none', className)} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('input-shell min-h-[120px] resize-y', className)} {...props} />;
}

export function SectionLink({ href, children }: { href: Route; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 transition hover:text-white">
      <span>{children}</span>
      <ArrowUpRightIcon className="h-3.5 w-3.5" />
    </Link>
  );
}

export function QuickActions({ items }: { items: QuickActionItem[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="rounded-lg border border-white/8 bg-white/[0.02] px-3 py-3 transition hover:bg-white/[0.04]">
          <div className="flex items-start gap-3">
            {item.icon ? <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md border border-white/8 bg-white/[0.03] text-slate-200">{item.icon}</div> : null}
            <div className="min-w-0">
              <div className="text-sm font-medium text-white">{item.label}</div>
              <div className="mt-1 text-xs leading-5 text-slate-500">{item.description}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function ActivityFeed({
  items,
  empty,
  className
}: {
  items: ActivityItem[];
  empty: { title: string; description: string; action?: ReactNode; icon?: ReactNode };
  className?: string;
}) {
  if (!items.length) {
    return <EmptyState compact icon={empty.icon} title={empty.title} description={empty.description} action={empty.action} className={className} />;
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item) => {
        const content = (
          <div className="flex items-start gap-3 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-3 transition hover:bg-white/[0.04]">
            {item.icon ? <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md border border-white/8 bg-white/[0.03] text-slate-200">{item.icon}</div> : null}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-white">{item.title}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</div>
                </div>
                {item.status ? <StatusBadge status={item.status} /> : null}
              </div>
              {item.meta ? <div className="mt-2 text-xs text-slate-500">{item.meta}</div> : null}
            </div>
          </div>
        );

        if (item.href) {
          return (
            <Link key={item.id} href={item.href}>
              {content}
            </Link>
          );
        }

        return <div key={item.id}>{content}</div>;
      })}
    </div>
  );
}

export function LoadingBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-xl border border-white/8 bg-white/[0.03]', className)} />;
}
