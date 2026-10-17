import React, { useState } from 'react';
import { PresentationData } from '../types/presentation';
import { parseSlideToBlocks } from '../utils/markdownParser';
import { MermaidDiagram } from './MermaidDiagram';
import { YouTubeEmbed } from './YouTubeEmbed';
import { ArrowLeft, Play, Share2, Check } from 'lucide-react';

interface BlogViewProps {
  data: PresentationData;
  onBack: () => void;
  onStartSlide: (slideIndex?: number) => void;
}

const CATEGORY_LABEL: Record<string, string> = {
  Security: 'セキュリティ・社会',
  Life: 'ライフスタイル',
  Tech: 'テクノロジー',
  Trends: 'トレンド'
};

export const BlogView: React.FC<BlogViewProps> = ({ data, onBack, onStartSlide }) => {
  const [copied, setCopied] = useState(false);
  const { meta, slides } = data;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Sticky Minimalist Header */}
      <div className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-zinc-200/70">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>一覧へ戻る</span>
          </button>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200/80 px-3.5 py-2 rounded-full transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'コピーしました' : 'URLを共有'}</span>
            </button>

            <button
              onClick={() => onStartSlide(0)}
              className="flex items-center space-x-2 text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-800 px-4 py-2 rounded-full transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>フルスクリーンスライド開始</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Article Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-12">
        {/* Article Meta Header */}
        <header className="mb-12 pb-10 border-b border-zinc-200/80">
          <div className="flex items-center space-x-2.5 text-xs text-zinc-500 mb-4">
            <span className="font-medium text-zinc-800 bg-zinc-100 px-2.5 py-0.5 rounded-full">
              {CATEGORY_LABEL[meta.category] || meta.category}
            </span>
            <span>·</span>
            <time className="font-mono">{meta.date}</time>
            <span>·</span>
            <span>全 {slides.length} スライド</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight leading-tight mb-4">
            {meta.title}
          </h1>

          {meta.subtitle && (
            <p className="text-base sm:text-lg text-zinc-500 mb-6">
              {meta.subtitle}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {meta.tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs text-zinc-500 bg-zinc-50 border border-zinc-200/70 px-2.5 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* YouTube Video Section (if any) */}
        {meta.youtubeId && (
          <section className="mb-12">
            <YouTubeEmbed videoId={meta.youtubeId} title={meta.youtubeTitle} />
          </section>
        )}

        {/* Slides Rendered as Clean Editorial Sections */}
        <div className="divide-y divide-zinc-200/70">
          {slides.map((slideMarkdown, slideIdx) => {
            const blocks = parseSlideToBlocks(slideMarkdown);

            return (
              <section
                key={slideIdx}
                className="py-10 first:pt-0 last:pb-0 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-widest">
                    Slide {String(slideIdx + 1).padStart(2, '0')}
                  </span>
                  <button
                    onClick={() => onStartSlide(slideIdx)}
                    className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 text-xs font-medium text-zinc-500 hover:text-zinc-950 transition-opacity"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>ここからスライド再生</span>
                  </button>
                </div>

                <div className="prose-custom max-w-none">
                  {blocks.map((block, blockIdx) => {
                    if (block.type === 'mermaid') {
                      return <MermaidDiagram key={blockIdx} chart={block.content} />;
                    }
                    if (block.type === 'youtube') {
                      return <YouTubeEmbed key={blockIdx} videoId={block.content} />;
                    }
                    return (
                      <div
                        key={blockIdx}
                        dangerouslySetInnerHTML={{ __html: block.content }}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Bottom Minimalist CTA */}
        <div className="mt-16 pt-10 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-zinc-900">プレゼンモードで表示</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              全画面スライドモードに切り替えて矢印キーで操作できます。
            </p>
          </div>
          <button
            onClick={() => onStartSlide(0)}
            className="inline-flex items-center space-x-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold px-6 py-3 rounded-full transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>最初からスライド再生</span>
          </button>
        </div>
      </main>
    </div>
  );
};
