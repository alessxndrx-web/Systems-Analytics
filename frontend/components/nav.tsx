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
  );
}
