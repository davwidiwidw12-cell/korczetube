'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import VideoCard from '@/components/VideoCard';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.get('/videos')
        .then(res => setVideos(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
          Witaj na KorczeTube!
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-lg">
          Zaloguj się, aby oglądać filmy, brać udział w konkursach i dołączyć do społeczności.
        </p>
        <div className="flex gap-4">
          <Link 
            href="/auth/login" 
            className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-transform hover:scale-105 shadow-lg"
          >
            Zaloguj się
          </Link>
          <Link 
            href="/auth/register" 
            className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white px-8 py-3 rounded-full font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-transform hover:scale-105"
          >
            Załóż konto
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-zinc-200 dark:bg-zinc-800 aspect-video rounded-xl mb-3"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {videos.map((video: any) => (
        <VideoCard key={video.id} video={video} />
      ))}
      {videos.length === 0 && (
        <div className="col-span-full text-center py-20 text-zinc-500">
          Brak filmów. Zaloguj się jako Korcze i dodaj coś!
        </div>
      )}
    </motion.div>
  );
}
