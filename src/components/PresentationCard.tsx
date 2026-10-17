import React from 'react';
import { PresentationMeta } from '../types/presentation';
import { Calendar, Layers, Play, BookOpen, User, Tag } from 'lucide-react';

interface PresentationCardProps {
  meta: PresentationMeta;
  onSelectArticle: (id: string) => void;
  onSelectSlide: (id: string) => void;
}

export const PresentationCard: React.FC<PresentationCardProps> = ({
  meta,
  onSelectArticle,
  onSelectSlide
}) => {
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'Security':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Life':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Tech':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={meta.thumbnail}
          alt={meta.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

        {/* Badges on Thumbnail */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${getCategoryBadge(meta.category)}`}>
            {meta.category}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <span className="flex items-center space-x-1 drop-shadow">
            <Calendar className="w-3.5 h-3.5" />
            <span>{meta.date}</span>
          </span>
          {meta.slidesCount && (
            <span className="flex items-center space-x-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/20">
              <Layers className="w-3.5 h-3.5" />
              <span>{meta.slidesCount} 슬라이드</span>
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2">
          <User className="w-3.5 h-3.5" />
          <span>{meta.author}</span>
        </div>

        <h3
          onClick={() => onSelectArticle(meta.id)}
          className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer mb-2"
        >
          {meta.title}
        </h3>

        {meta.subtitle && (
          <p className="text-xs text-slate-500 line-clamp-1 mb-2 font-medium">
            {meta.subtitle}
          </p>
        )}

        <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed flex-1">
          {meta.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {meta.tags.slice(0, 4).map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center text-[11px] text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md transition-colors"
            >
              <Tag className="w-2.5 h-2.5 mr-1 text-slate-400" />
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={() => onSelectArticle(meta.id)}
            className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>글 & 요약 읽기</span>
          </button>
          <button
            onClick={() => onSelectSlide(meta.id)}
            className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-500/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>슬라이드 시작</span>
          </button>
        </div>
      </div>
    </article>
  );
};
