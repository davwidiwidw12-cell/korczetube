import Link from 'next/link';
import { Play } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  thumbnailUrl?: string;
  views: number;
  slug: string;
  uploader: {
    name: string;
  };
  createdAt: string;
}

export default function VideoCard({ video }: { video: Video }) {
  return (
    <Link href={`/watch/${video.slug}`} className="group">
      <div className="relative aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-xl overflow-hidden mb-3">
        {video.thumbnailUrl ? (
          <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400">
            <Play size={48} />
          </div>
        )}
      </div>
      <h3 className="font-bold text-base line-clamp-2 leading-tight mb-1 group-hover:text-red-600 transition-colors">
        {video.title}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {video.uploader.name}
      </p>
      <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
        <span>{video.views} wyświetleń</span>
        <span>•</span>
        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}
