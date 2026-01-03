'use client';

import { useEffect, useState, use } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Lock, Unlock, ThumbsUp, ThumbsDown, Eye, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

export default function WatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [contestMsg, setContestMsg] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const { user } = useAuth();

  const fetchVideo = () => {
    api.get(`/videos/${slug}`)
      .then(res => setVideo(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVideo();
  }, [slug]);

  const handleContestEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/videos/${video.id}/contest`, { password });
      setContestMsg('Poprawne hasło! Twoje zgłoszenie zostało przyjęte.');
    } catch (err: any) {
      setContestMsg(err.response?.data?.message || 'Błędne hasło.');
    }
  };

  const handleLike = async (type: 'LIKE' | 'DISLIKE') => {
      if (!user) return alert('Zaloguj się, aby oceniać.');
      try {
          await api.post(`/videos/${video.id}/like`, { type });
          fetchVideo(); // Refresh to update counts
      } catch (err) {
          console.error(err);
      }
  };

  const handleSubscribe = async () => {
      if (!user) return alert('Zaloguj się, aby subskrybować.');
      try {
          await api.post(`/videos/subscribe/${video.uploaderId}`);
          fetchVideo();
      } catch (err) {
          console.error(err);
      }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!commentContent.trim()) return;
      try {
          await api.post(`/videos/${video.id}/comments`, { content: commentContent });
          setCommentContent('');
          fetchVideo();
      } catch (err) {
          console.error(err);
      }
  };

  if (loading) return <div className="text-center py-20">Ładowanie...</div>;
  if (!video) return <div className="text-center py-20">Nie znaleziono filmu.</div>;

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 shadow-xl">
          <video 
            src={video.videoUrl.startsWith('http') ? video.videoUrl : `${process.env.NEXT_PUBLIC_API_URL}${video.videoUrl}`} 
            controls 
            className="w-full h-full"
            poster={video.thumbnailUrl}
            crossOrigin="anonymous"
            playsInline
          />
        </div>

        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-800 gap-4">
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <div className="flex items-center gap-1">
              <Eye size={16} />
              <span>{video.views} wyświetleń</span>
            </div>
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center gap-2">
              <button 
                onClick={() => handleLike('LIKE')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${video.userLikeStatus === 'LIKE' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
              >
                  <ThumbsUp size={20} className={video.userLikeStatus === 'LIKE' ? 'fill-current' : ''} />
                  <span className="font-medium">{video.likesCount}</span>
              </button>
              <button 
                onClick={() => handleLike('DISLIKE')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${video.userLikeStatus === 'DISLIKE' ? 'bg-zinc-200 dark:bg-zinc-700' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
              >
                  <ThumbsDown size={20} className={video.userLikeStatus === 'DISLIKE' ? 'fill-current' : ''} />
                  {video.dislikesCount > 0 && <span className="font-medium">{video.dislikesCount}</span>}
              </button>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl mb-8">
            <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 text-sm">
                {video.description}
            </p>
        </div>

        <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">{video.comments?.length || 0} Komentarze</h3>
            
            {user && (
                <form onSubmit={handleCommentSubmit} className="flex gap-4 mb-8">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                        {user.name[0]}
                    </div>
                    <div className="flex-1">
                        <input 
                            type="text" 
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            placeholder="Dodaj komentarz..." 
                            className="w-full border-b border-zinc-300 dark:border-zinc-700 bg-transparent py-2 focus:outline-none focus:border-red-600 transition-colors"
                        />
                        <div className="flex justify-end mt-2">
                            <button 
                                type="submit" 
                                disabled={!commentContent.trim()}
                                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                Skomentuj
                            </button>
                        </div>
                    </div>
                </form>
            )}

            <div className="space-y-6">
                {video.comments?.map((comment: any) => (
                    <div key={comment.id} className="flex gap-4">
                        <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center font-bold shrink-0">
                            {comment.user.name[0]}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm">{comment.user.name}</span>
                                <span className="text-xs text-zinc-500">
                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: pl })}
                                </span>
                            </div>
                            <p className="text-sm text-zinc-800 dark:text-zinc-200">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {video.uploader.name[0]}
                </div>
                <div>
                    <h3 className="font-bold text-lg">{video.uploader.name}</h3>
                    <p className="text-sm text-zinc-500">
                        {/* Assuming we get subscriber count, though not in findOne yet fully populated for uploader relation */}
                        Twórca
                    </p>
                </div>
            </div>
            <button 
                onClick={handleSubscribe}
                className={`w-full py-2 rounded-full font-bold text-sm transition-colors ${video.isSubscribed ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white' : 'bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-90'}`}
            >
                {video.isSubscribed ? 'Subskrybujesz' : 'Subskrybuj'}
            </button>
        </div>

        {video.isContestMode && (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-yellow-700 dark:text-yellow-500">
              <Lock size={20} />
              Konkurs
            </h3>
            <p className="text-sm mb-4 text-zinc-700 dark:text-zinc-300">
              Znajdź hasło ukryte w filmie i wpisz je poniżej, aby wziąć udział!
            </p>
            
            {user ? (
              <form onSubmit={handleContestEntry} className="space-y-2">
                <input
                  type="text"
                  placeholder="Wpisz hasło..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-sm"
                />
                <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg font-bold text-sm transition-colors">
                  Wyślij zgłoszenie
                </button>
                {contestMsg && (
                  <p className={`text-sm mt-2 font-medium ${contestMsg.includes('Poprawne') ? 'text-green-600' : 'text-red-600'}`}>
                      {contestMsg}
                  </p>
                )}
              </form>
            ) : (
              <div className="text-sm text-center bg-white/50 dark:bg-black/20 p-2 rounded">
                  Zaloguj się, aby wziąć udział.
              </div>
            )}
          </div>
        )}

        {user && user.role === 'ADMIN' && video.isContestMode && (
            <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Zgłoszenia konkursowe (Admin)</h3>
                <div className="space-y-2">
                    {video.contestEntries?.length === 0 ? (
                        <p className="text-sm text-zinc-500">Brak zgłoszeń.</p>
                    ) : (
                        video.contestEntries?.map((entry: any) => (
                            <div key={entry.id} className="text-sm border-b border-zinc-200 dark:border-zinc-800 pb-2">
                                <span className="font-bold">{entry.user.name}</span>
                                {entry.user.discordNick && <span className="text-zinc-500 ml-2">(Discord: {entry.user.discordNick})</span>}
                                <span className="text-zinc-400 ml-auto float-right">
                                    {new Date(entry.enteredAt).toLocaleString()}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
