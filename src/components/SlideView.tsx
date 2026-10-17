import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PresentationData } from '../types/presentation';
import { parseSlideToBlocks } from '../utils/markdownParser';
import { MermaidDiagram } from './MermaidDiagram';
import { YouTubeEmbed } from './YouTubeEmbed';
import { PresentationTimer } from './PresentationTimer';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Grid,
  Info,
  Layers
} from 'lucide-react';

interface SlideViewProps {
  data: PresentationData;
  initialSlide?: number;
  onClose: () => void;
}

export const SlideView: React.FC<SlideViewProps> = ({
  data,
  initialSlide = 0,
  onClose
}) => {
  const [currentIdx, setCurrentIdx] = useState(initialSlide);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  const { slides } = data;
  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.warn('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn('Error attempting to exit fullscreen:', err);
      });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ': // Spacebar
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          prevSlide();
          break;
        case 'Escape':
          if (showOverview) {
            setShowOverview(false);
          } else if (showHelp) {
            setShowHelp(false);
          } else {
            onClose();
          }
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'o':
        case 'O':
          e.preventDefault();
          setShowOverview((prev) => !prev);
          break;
        case '?':
          setShowHelp((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, onClose, showOverview, showHelp]);

  // Sync fullscreen change event
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartXRef.current = null;
  };

  const currentSlideMarkdown = slides[currentIdx] || '';
  const currentBlocks = parseSlideToBlocks(currentSlideMarkdown);
  const progressPercent = ((currentIdx + 1) / totalSlides) * 100;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 z-20">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="flex items-center space-x-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-all"
            title="발표 종료 및 글 모드로 복귀 (ESC)"
          >
            <X className="w-4 h-4 text-rose-400" />
            <span>종료 (ESC)</span>
          </button>

          <span className="text-slate-600 hidden sm:inline">|</span>

          <span className="text-xs text-slate-400 font-medium truncate max-w-xs sm:max-w-md hidden sm:inline">
            {data.meta.title}
          </span>
        </div>

        {/* Center: Slide Timer */}
        <div className="flex items-center space-x-4">
          <PresentationTimer />
        </div>

        {/* Right: Actions & Page counter */}
        <div className="flex items-center space-x-2">
          {/* Slide Overview Toggle */}
          <button
            onClick={() => setShowOverview(!showOverview)}
            className={`p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ${
              showOverview ? 'bg-blue-600 text-white' : ''
            }`}
            title="슬라이드 전체 보기 (O)"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Help Toggle */}
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="단축키 안내 (?)"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="전체화면 전환 (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Slide Canvas (16:9 presentation area) */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 md:p-12 relative overflow-hidden">
        {/* Previous Button Left Hotspot */}
        <button
          onClick={prevSlide}
          disabled={currentIdx === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white flex items-center justify-center transition-all disabled:opacity-0 disabled:pointer-events-none hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button Right Hotspot */}
        <button
          onClick={nextSlide}
          disabled={currentIdx === totalSlides - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white flex items-center justify-center transition-all disabled:opacity-0 disabled:pointer-events-none hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Card */}
        <div className="w-full max-w-5xl aspect-[16/10] sm:aspect-[16/9] max-h-[80vh] bg-white text-slate-900 rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl flex flex-col justify-between overflow-y-auto relative border border-slate-200">
          <div className="slide-content flex-1 flex flex-col justify-center">
            {currentBlocks.map((block, idx) => {
              if (block.type === 'mermaid') {
                return <MermaidDiagram key={idx} chart={block.content} className="my-4 max-h-64" />;
              }
              if (block.type === 'youtube') {
                return <YouTubeEmbed key={idx} videoId={block.content} compact />;
              }
              return (
                <div
                  key={idx}
                  dangerouslySetInnerHTML={{ __html: block.content }}
                />
              );
            })}
          </div>

          {/* Slide Footer */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium truncate max-w-sm">{data.meta.title}</span>
            <span className="font-semibold text-slate-500">
              {currentIdx + 1} / {totalSlides}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar & Navigation */}
      <div className="bg-slate-900/80 backdrop-blur-md border-t border-slate-800/80 px-6 py-3 flex items-center justify-between z-20">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>
            슬라이드 <strong className="text-white">{currentIdx + 1}</strong> / {totalSlides}
          </span>
        </div>

        {/* Center Progress Dots */}
        <div className="hidden sm:flex items-center space-x-1.5 max-w-md overflow-x-auto py-1">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIdx
                  ? 'w-8 bg-blue-500'
                  : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              title={`${idx + 1}번 슬라이드로 이동`}
            />
          ))}
        </div>

        {/* Right Keyboard Hints */}
        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
          <span className="hidden md:inline">방향키(← →) 또는 Space로 넘김</span>
          <div className="flex space-x-1">
            <button
              onClick={prevSlide}
              disabled={currentIdx === 0}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded text-slate-200"
            >
              이전
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIdx === totalSlides - 1}
              className="px-2 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded text-white font-medium"
            >
              다음
            </button>
          </div>
        </div>
      </div>

      {/* Full Progress Line at bottom */}
      <div className="w-full bg-slate-800 h-1">
        <div
          className="bg-blue-500 h-1 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Slide Overview Grid Modal */}
      {showOverview && (
        <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md p-6 sm:p-12 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Grid className="w-5 h-5 text-blue-400" />
                <span>전체 슬라이드 목차 (총 {totalSlides}장)</span>
              </h2>
              <button
                onClick={() => setShowOverview(false)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {slides.map((s, idx) => {
                const previewText = s
                  .replace(/#+/g, '')
                  .replace(/```[\s\S]*?```/g, '[다이어그램]')
                  .replace(/\n+/g, ' ')
                  .trim()
                  .slice(0, 100);

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIdx(idx);
                      setShowOverview(false);
                    }}
                    className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between h-36 ${
                      idx === currentIdx
                        ? 'bg-blue-950/70 border-blue-500 ring-2 ring-blue-500/50'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800/80'
                    }`}
                  >
                    <span className="text-xs font-bold text-blue-400 mb-1">
                      Slide {idx + 1}
                    </span>
                    <p className="text-xs text-slate-300 line-clamp-4 leading-relaxed">
                      {previewText || '내용 없음'}
                    </p>
                    <div className="text-[10px] text-slate-500 pt-1 text-right">
                      {idx === currentIdx ? '● 현재 슬라이드' : '이동하기 →'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="font-bold text-lg flex items-center space-x-2">
                <Info className="w-5 h-5 text-blue-400" />
                <span>발표 단축키 안내</span>
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span>다음 슬라이드</span>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded text-xs font-mono text-blue-400">
                  → / Space / PageDown
                </kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span>이전 슬라이드</span>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded text-xs font-mono text-blue-400">
                  ← / PageUp
                </kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span>전체화면 켜기/끄기</span>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded text-xs font-mono text-blue-400">
                  F
                </kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span>전체 슬라이드 목차</span>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded text-xs font-mono text-blue-400">
                  O
                </kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span>발표 종료 (글 모드)</span>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded text-xs font-mono text-blue-400">
                  ESC
                </kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>모바일 / 태블릿</span>
                <span className="text-xs text-slate-400">좌우 스와이프 터치</span>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full mt-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
