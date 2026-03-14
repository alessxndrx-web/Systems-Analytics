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
        </Providers>
      </body>
    </html>
  );
}
