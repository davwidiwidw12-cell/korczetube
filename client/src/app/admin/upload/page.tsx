'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [tags, setTags] = useState('');
  const [isContestMode, setIsContestMode] = useState(false);
  const [contestPassword, setContestPassword] = useState('');
  const [uploading, setUploading] = useState(false);

  if (!user || user.role !== 'ADMIN') {
      return <div className="p-10 text-center">Brak dostępu.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('video', file);
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('isContestMode', isContestMode.toString());
    if (isContestMode) {
        formData.append('contestPassword', contestPassword);
    }

    setUploading(true);
    try {
      await api.post('/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('Błąd uploadu');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
      <h1 className="text-2xl font-bold mb-6">Dodaj nowy film</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Tytuł</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Opis</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border rounded-lg bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Plik wideo</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full"
            required
          />
        </div>

        <div>
            <label className="block text-sm font-medium mb-1">Miniaturka (PNG/JPG)</label>
            <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                className="w-full"
            />
        </div>

        <div>
            <label className="block text-sm font-medium mb-1">Tagi (po przecinku)</label>
            <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="vlog, tutorial, game"
                className="w-full px-3 py-2 border rounded-lg bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
            />
        </div>

        <div className="flex items-center gap-2">
            <input
                type="checkbox"
                id="contest"
                checked={isContestMode}
                onChange={(e) => setIsContestMode(e.target.checked)}
                className="w-4 h-4"
            />
            <label htmlFor="contest" className="font-medium">Tryb Konkursowy (Wymaga hasła)</label>
        </div>

        {isContestMode && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <label className="block text-sm font-medium mb-1 text-yellow-800 dark:text-yellow-200">Hasło konkursowe</label>
                <input
                    type="text"
                    value={contestPassword}
                    onChange={(e) => setContestPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                    required={isContestMode}
                />
            </div>
        )}

        <button 
            type="submit" 
            disabled={uploading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
        >
            {uploading ? 'Przesyłanie...' : 'Opublikuj Film'}
        </button>
      </form>
    </div>
  );
}
