import React from 'react';
import { PresentationMeta } from '../types/presentation';
import { Play, ArrowUpRight, Trash2 } from 'lucide-react';

interface PresentationCardProps {
  meta: PresentationMeta;
  isCustom?: boolean;
  onSelectArticle: (id: string) => void;
  onSelectSlide: (id: string) => void;
  onDelete?: (id: string) => void;
}

const CATEGORY_LABEL: Record<string, string> = {
  Security: 'セキュリティ・社会',
  Life: 'ライフスタイル',
  Tech: 'テクノロジー',
  Trends: 'トレンド'
};

export const PresentationCard: React.FC<PresentationCardProps> = ({
  meta,
  isCustom = false,
  onSelectArticle,
  onSelectSlide,
  onDelete
}) => {
  return (
    <article className="group bg-white rounded-2xl border border-zinc-200/80 hover:border-zinc-400 transition-all duration-200 flex flex-col justify-between p-6">
      <div>
        {/* Top Meta Row */}
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-zinc-700 bg-zinc-100 px-2.5 py-0.5 rounded-full">
              {CATEGORY_LABEL[meta.category] || meta.category}
            </span>
            <span>·</span>
            <time className="font-mono">{meta.date}</time>
          </div>
          <div className="flex items-center space-x-2">
            {meta.slidesCount && (
              <span className="font-mono text-[11px] text-zinc-400">
                {meta.slidesCount} 枚
              </span>
            )}
            {isCustom && onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(meta.id);
                }}
                className="p-1 text-zinc-300 hover:text-rose-500 transition-colors"
                title="削除"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelectArticle(meta.id)}
          className="text-lg sm:text-xl font-bold text-zinc-950 group-hover:text-zinc-600 transition-colors cursor-pointer leading-snug mb-2"
        >
          {meta.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed mb-5">
          {meta.description}
        </p>
      </div>

      <div>
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {meta.tags.slice(0, 4).map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] text-zinc-500 bg-zinc-50 border border-zinc-200/60 px-2 py-0.5 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-4 border-t border-zinc-100">
          <button
            onClick={() => onSelectSlide(meta.id)}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-800 active:scale-[0.99] transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>スライド再生</span>
          </button>
          <button
            onClick={() => onSelectArticle(meta.id)}
            className="flex items-center justify-center space-x-1 py-2.5 px-4 rounded-xl text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200/80 active:scale-[0.99] transition-all"
          >
            <span>記事を読む</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>
      </div>
    </article>
  );
};
