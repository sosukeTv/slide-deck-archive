import React, { useState } from 'react';
import { PresentationData } from '../types/presentation';
import { parseSlideToBlocks } from '../utils/markdownParser';
import { MermaidDiagram } from './MermaidDiagram';
import { YouTubeEmbed } from './YouTubeEmbed';
import { ArrowLeft, Play, Calendar, User, Tag, Share2, Check } from 'lucide-react';

interface BlogViewProps {
  data: PresentationData;
  onBack: () => void;
  onStartSlide: (slideIndex?: number) => void;
}

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
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Sticky Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">목록으로</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors"
              title="팀원에게 공유하기 위해 링크 복사"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? '복사됨!' : '공유하기'}</span>
            </button>

            <button
              onClick={() => onStartSlide(0)}
              className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>발표 슬라이드 시작</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Article Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {/* Article Meta Header */}
        <header className="mb-8 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {meta.category}
            </span>
            <div className="flex items-center space-x-1 text-xs text-slate-500 ml-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{meta.date}</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center space-x-1 text-xs text-slate-500">
              <User className="w-3.5 h-3.5" />
              <span>{meta.author}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
            {meta.title}
          </h1>

          {meta.subtitle && (
            <p className="text-base sm:text-lg text-slate-600 font-medium mb-4">
              {meta.subtitle}
            </p>
          )}

          {meta.description && (
            <div className="p-4 bg-slate-100/80 rounded-xl text-slate-700 text-sm leading-relaxed border-l-4 border-blue-500">
              {meta.description}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {meta.tags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center text-xs text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg"
              >
                <Tag className="w-3 h-3 mr-1 text-slate-400" />
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* YouTube Video Section (if any) */}
        {meta.youtubeId && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center space-x-2">
              <span>관련 추천 영상</span>
            </h2>
            <YouTubeEmbed videoId={meta.youtubeId} title={meta.youtubeTitle} />
          </section>
        )}

        {/* Slides Rendered as Structured Article Sections */}
        <div className="space-y-12">
          {slides.map((slideMarkdown, slideIdx) => {
            const blocks = parseSlideToBlocks(slideMarkdown);

            return (
              <section
                key={slideIdx}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-blue-200 transition-colors"
              >
                {/* Section header banner with jump-to-slide button */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                    Section {slideIdx + 1} / {slides.length}
                  </span>
                  <button
                    onClick={() => onStartSlide(slideIdx)}
                    className="opacity-80 group-hover:opacity-100 flex items-center space-x-1 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-all"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>이 슬라이드부터 발표 보기</span>
                  </button>
                </div>

                {/* Render Slide Blocks */}
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

        {/* Bottom CTA for Team Presentation */}
        <div className="mt-12 p-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white text-center shadow-lg">
          <h3 className="text-xl font-bold mb-2">팀원들 앞에서 직접 발표할 준비가 되셨나요?</h3>
          <p className="text-blue-100 text-sm max-w-lg mx-auto mb-6">
            프로젝터나 화면 공유를 켜고 풀스크린 슬라이드 모드로 전환하여 깔끔하고 프로페셔널한 발표를 진행하세요.
          </p>
          <button
            onClick={() => onStartSlide(0)}
            className="inline-flex items-center space-x-2 bg-white text-blue-600 hover:bg-blue-50 font-bold px-6 py-3 rounded-xl shadow-md transition-all active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>1페이지부터 슬라이드 시작</span>
          </button>
        </div>
      </main>
    </div>
  );
};
