import React from 'react';
import { ExternalLink, PlaySquare } from 'lucide-react';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  compact?: boolean;
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId, title, compact = false }) => {
  return (
    <div className={`my-6 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 ${compact ? 'max-w-3xl mx-auto' : ''}`}>
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 text-xs text-zinc-300 border-b border-zinc-800">
        <div className="flex items-center space-x-2 truncate">
          <PlaySquare className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="font-medium truncate">{title || '関連動画'}</span>
        </div>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 text-zinc-400 hover:text-white transition-colors shrink-0 ml-4"
        >
          <span>YouTubeで開く</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <div className="relative w-full pt-[56.25%]">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title || 'YouTube video player'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};
