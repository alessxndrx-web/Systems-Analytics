<<<<<<< ours
﻿import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Manrope, Space_Grotesk } from 'next/font/google';
import { AppShell } from '../components/app-shell';
import { Providers } from '../components/providers';

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body'
});

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display'
});

export const metadata: Metadata = {
  title: 'LeadMap AI',
  description: 'A polished lead-generation workspace for discovery, mapping, outreach, and analytics.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
=======
import './globals.css';
import { ReactNode } from 'react';
import { Nav } from '../components/nav';
import { Providers } from '../components/providers';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Nav />
          <main className="max-w-7xl mx-auto p-6">{children}</main>
>>>>>>> theirs
        </Providers>
      </body>
    </html>
  );
}
