'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Trash2, Edit, Eye, ThumbsUp, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!user || user.role !== 'ADMIN') {
      return <div className="p-10 text-center">Brak dostępu.</div>;
  }

  const fetchVideos = () => {
    api.get('/videos/dashboard')
      .then(res => setVideos(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id: string) => {
      if (!confirm('Czy na pewno chcesz usunąć ten film?')) return;
      try {
          await api.delete(`/videos/${id}`);
          fetchVideos();
      } catch (err) {
          console.error(err);
          alert('Błąd usuwania');
      }
  };

  if (loading) return <div className="p-10 text-center">Ładowanie...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panel Studia (Dashboard)</h1>
        <Link 
            href="/admin/upload" 
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors"
        >
            Dodaj nowy film
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                    <tr>
                        <th className="px-6 py-4 font-bold text-zinc-500">Wideo</th>
                        <th className="px-6 py-4 font-bold text-zinc-500">Data</th>
                        <th className="px-6 py-4 font-bold text-zinc-500">Wyświetlenia</th>
                        <th className="px-6 py-4 font-bold text-zinc-500">Komentarze</th>
                        <th className="px-6 py-4 font-bold text-zinc-500">Lajki (typ)</th>
                        <th className="px-6 py-4 font-bold text-zinc-500 text-right">Akcje</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {videos.map((video: any) => (
                        <tr key={video.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-24 aspect-video bg-black rounded overflow-hidden flex-shrink-0">
                                        {video.thumbnailUrl && (
                                            <img src={video.thumbnailUrl} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold line-clamp-1 max-w-[200px]">{video.title}</div>
                                        <div className="text-xs text-zinc-500 line-clamp-1 max-w-[200px]">{video.description}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-zinc-500">
                                {new Date(video.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1">
                                    <Eye size={16} className="text-zinc-400" />
                                    {video.views}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1">
                                    <MessageCircle size={16} className="text-zinc-400" />
                                    {video._count.comments}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1">
                                    <ThumbsUp size={16} className="text-zinc-400" />
                                    {video._count.likes}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Link href={`/watch/${video.slug}`} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded text-zinc-500 hover:text-blue-600">
                                        <Eye size={18} />
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(video.id)}
                                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-zinc-500 hover:text-red-600"
                                        title="Usuń film"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {videos.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                                Brak filmów.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
