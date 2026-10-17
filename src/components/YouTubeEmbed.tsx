import React from 'react';
import { ExternalLink, Video } from 'lucide-react';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  compact?: boolean;
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId, title, compact = false }) => {
  return (
    <div className={`my-6 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg ${compact ? 'max-w-2xl mx-auto' : ''}`}>
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/80 text-xs text-slate-300 border-b border-slate-700/50">
        <div className="flex items-center space-x-2">
          <Video className="w-4 h-4 text-rose-500" />
          <span className="font-medium truncate">{title || '관련 유튜브 영상'}</span>
        </div>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
        >
          <span>YouTube에서 보기</span>
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
