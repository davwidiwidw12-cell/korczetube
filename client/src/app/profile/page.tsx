'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function ProfilePage() {
  const { user } = useAuth();
  const [qrCode, setQrCode] = useState('');
  const [token, setToken] = useState('');
  const [msg, setMsg] = useState('');

  if (!user) return <div className="p-10">Zaloguj się.</div>;

  const enable2FA = async () => {
    try {
      const res = await api.get('/auth/2fa/generate');
      setQrCode(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const verify2FA = async () => {
    try {
      await api.post('/auth/2fa/verify', { token });
      setMsg('2FA włączone pomyślnie!');
      setQrCode('');
    } catch (err) {
      setMsg('Błędny kod.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
      <h1 className="text-2xl font-bold mb-4">Profil: {user.name}</h1>
      <p className="mb-4 text-zinc-600 dark:text-zinc-400">Email: {user.email}</p>
      <p className="mb-6 text-zinc-600 dark:text-zinc-400">Rola: {user.role}</p>

      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
        <h2 className="font-bold text-lg mb-4">Bezpieczeństwo (2FA)</h2>
        
        {!qrCode && !user.isTwoFactorEnabled && (
            <button onClick={enable2FA} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Włącz 2FA
            </button>
        )}

        {qrCode && (
            <div className="space-y-4">
                <p className="text-sm">Zeskanuj ten kod w aplikacji Google Authenticator:</p>
                <img src={qrCode} alt="QR Code" className="border rounded" />
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={token} 
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Podaj kod 6-cyfrowy"
                        className="border p-2 rounded flex-1 dark:bg-zinc-800 dark:border-zinc-700"
                    />
                    <button onClick={verify2FA} className="bg-green-600 text-white px-4 py-2 rounded">Weryfikuj</button>
                </div>
            </div>
        )}

        {msg && <p className="mt-4 font-bold">{msg}</p>}
      </div>
    </div>
  );
}
