'use client';
<<<<<<< ours

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, FormField, Input, StatPill } from '../../components/ui';
import { CheckCircleIcon, LogoMark } from '../../components/icons';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      localStorage.setItem('token', data.accessToken);
      setStatus('Signed in. Redirecting to dashboard...');
      router.push('/dashboard');
      router.refresh();
    } catch (requestError) {
      setStatus(requestError instanceof Error ? requestError.message : 'Unable to sign in.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid flex-1 items-center gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:py-12">
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <LogoMark className="h-12 w-12" />
          <div>
            <div className="font-display text-xl font-semibold text-white">LeadMap AI</div>
            <div className="text-sm text-slate-500">Workspace sign-in</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <StatPill>Protected routes</StatPill>
            <StatPill tone="accent">Operator account required</StatPill>
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Access the workspace.</h1>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            Sign in with an operator account created through the backend seed command or your existing environment setup.
          </p>
        </div>
      </section>

      <form onSubmit={submit} className="panel p-5 sm:p-6">
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Credentials</h2>
            <p className="mt-1 text-sm text-slate-500">The repository no longer relies on hardcoded default credentials.</p>
          </div>

          <div className="space-y-4">
            <FormField label="Email" hint="Create the first user with the backend seed command if needed.">
              <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" />
            </FormField>
            <FormField label="Password" hint="Uses the existing auth endpoint.">
              <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" />
            </FormField>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" disabled={isLoading} size="sm" leading={<CheckCircleIcon className="h-4 w-4" />}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Button href="/" variant="ghost" size="sm">
              Back
            </Button>
          </div>

          {status ? <div className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">{status}</div> : null}
        </div>
      </form>
    </div>
=======
import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@leadmap.ai');
  const [password, setPassword] = useState('admin1234');
  const [status, setStatus] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    localStorage.setItem('token', data.accessToken);
    setStatus('Logged in');
  }

  return (
    <form onSubmit={submit} className="card max-w-md space-y-3">
      <h1 className="text-xl font-semibold">Login</h1>
      <input className="w-full bg-slate-800 p-2" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full bg-slate-800 p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="bg-cyan-600 px-3 py-2">Sign in</button>
      <p>{status}</p>
    </form>
>>>>>>> theirs
  );
}
