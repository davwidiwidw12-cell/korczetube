'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.access_token, res.data.user);
    } catch (err: any) {
      setError('Nieprawidłowe dane logowania');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
      <h1 className="text-2xl font-bold mb-6 text-center">Zaloguj się</h1>
      {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Hasło</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
            required
          />
        </div>
        <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition-colors">
          Zaloguj się
        </button>
      </form>
      <div className="mt-4 text-center text-sm">
        Nie masz konta? <Link href="/auth/register" className="text-red-600 hover:underline">Zarejestruj się</Link>
      </div>
    </div>
  );
}
