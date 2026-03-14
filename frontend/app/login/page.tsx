'use client';
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
  );
}
