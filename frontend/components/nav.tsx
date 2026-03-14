import Link from 'next/link';

const links = ['dashboard', 'lead-search', 'map', 'drafts', 'followups', 'analytics', 'settings', 'logs'];

export function Nav() {
  return (
    <nav className="flex gap-3 p-4 border-b border-slate-800">
      {links.map((link) => (
        <Link key={link} href={`/${link}`} className="text-sm text-cyan-300 hover:text-cyan-200">
          {link}
        </Link>
      ))}
    </nav>
  );
}
