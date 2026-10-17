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
  Sun,
  Moon
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
  const [darkTheme, setDarkTheme] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { slides } = data;
  const totalSlides = slides.length;

  // Auto-enter fullscreen on mount if possible
  useEffect(() => {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        // Ignore if browser blocks automatic fullscreen without direct gesture
      });
    }
    return () => {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  // Auto-hide controls after 2.5s of mouse inactivity
  const resetControlsTimer = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 2500);
  }, []);

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [resetControlsTimer, currentIdx]);

  const nextSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const handleClose = useCallback(() => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    onClose();
  }, [onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
        case 'Enter':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
        case 'Backspace':
          e.preventDefault();
          prevSlide();
          break;
        case 'Escape':
          if (showOverview) {
            setShowOverview(false);
          } else {
            handleClose();
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
        case 't':
        case 'T':
          e.preventDefault();
          setDarkTheme((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, handleClose, toggleFullscreen, showOverview]);

  // Sync fullscreen state
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
    resetControlsTimer();
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
      onMouseMove={resetControlsTimer}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`fixed inset-0 z-50 w-screen h-screen flex flex-col justify-between overflow-hidden select-none transition-colors duration-300 ${
        darkTheme ? 'bg-zinc-950 text-zinc-50' : 'bg-white text-zinc-950'
      }`}
    >
      {/* Full-Viewport Slide Content Canvas */}
      <div className="flex-1 w-full h-full flex items-center justify-center px-8 sm:px-16 md:px-28 py-12 overflow-y-auto relative">
        {/* Invisible Left/Right Click Zones for quick navigation */}
        <div
          onClick={prevSlide}
          className="fixed left-0 top-0 bottom-16 w-16 sm:w-24 z-10 cursor-w-resize"
          title="前のスライド (←)"
        />
        <div
          onClick={nextSlide}
          className="fixed right-0 top-0 bottom-16 w-16 sm:w-24 z-10 cursor-e-resize"
          title="次のスライド (→)"
        />

        {/* Slide Body */}
        <div className="w-full max-w-6xl mx-auto my-auto slide-content">
          {currentBlocks.map((block, idx) => {
            if (block.type === 'mermaid') {
              return (
                <MermaidDiagram
                  key={idx}
                  chart={block.content}
                  className={darkTheme ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200/80'}
                />
              );
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
      </div>

      {/* Subtle Minimal Footer Watermark (Always visible at bottom corners) */}
      <div className="px-8 sm:px-14 pb-5 flex items-center justify-between text-xs font-mono opacity-40 pointer-events-none">
        <span className="truncate max-w-md">{data.meta.title}</span>
        <span>
          {String(currentIdx + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
        </span>
      </div>

      {/* Floating Auto-Hiding Control Pill */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2 bg-zinc-900/90 text-white backdrop-blur-md px-4 py-2 rounded-full border border-zinc-700/70 shadow-2xl transition-all duration-300 ${
          controlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={prevSlide}
          disabled={currentIdx === 0}
          className="p-1.5 hover:bg-zinc-800 rounded-full disabled:opacity-30 transition-colors"
          title="前のスライド (←)"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-mono px-2 tabular-nums text-zinc-300">
          {currentIdx + 1} / {totalSlides}
        </span>

        <button
          onClick={nextSlide}
          disabled={currentIdx === totalSlides - 1}
          className="p-1.5 hover:bg-zinc-800 rounded-full disabled:opacity-30 transition-colors"
          title="次のスライド (→)"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-zinc-700 mx-1" />

        <PresentationTimer />

        <div className="h-4 w-px bg-zinc-700 mx-1" />

        {/* Slide Overview Toggle */}
        <button
          onClick={() => setShowOverview(!showOverview)}
          className="p-1.5 hover:bg-zinc-800 rounded-full text-zinc-300 hover:text-white transition-colors"
          title="スライド一覧 (O)"
        >
          <Grid className="w-4 h-4" />
        </button>

        {/* Theme Toggle (Light / Dark) */}
        <button
          onClick={() => setDarkTheme(!darkTheme)}
          className="p-1.5 hover:bg-zinc-800 rounded-full text-zinc-300 hover:text-white transition-colors"
          title="テーマ切替 (T)"
        >
          {darkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 hover:bg-zinc-800 rounded-full text-zinc-300 hover:text-white transition-colors"
          title="全画面表示 (F)"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        <div className="h-4 w-px bg-zinc-700 mx-1" />

        {/* Exit Slide Mode */}
        <button
          onClick={handleClose}
          className="flex items-center space-x-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-full text-xs font-medium text-zinc-200 transition-colors"
          title="終了 (ESC)"
        >
          <X className="w-3.5 h-3.5" />
          <span>終了</span>
        </button>
      </div>

      {/* Ultra-thin Progress Line at Bottom Edge */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-zinc-500/10 z-20">
        <div
          className={`h-full transition-all duration-300 ${
            darkTheme ? 'bg-white' : 'bg-zinc-950'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Slide Overview Grid Modal */}
      {showOverview && (
        <div className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-md p-6 sm:p-12 overflow-y-auto text-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-zinc-800">
              <h2 className="text-lg font-bold flex items-center space-x-2">
                <Grid className="w-5 h-5 text-zinc-400" />
                <span>スライド一覧（全 {totalSlides} 枚）</span>
              </h2>
              <button
                onClick={() => setShowOverview(false)}
                className="p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {slides.map((s, idx) => {
                const previewText = s
                  .replace(/#+/g, '')
                  .replace(/```[\s\S]*?```/g, '[図表]')
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
                    className={`p-5 rounded-2xl text-left border transition-all flex flex-col justify-between h-40 ${
                      idx === currentIdx
                        ? 'bg-zinc-800 border-white ring-1 ring-white'
                        : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <span className="text-xs font-mono text-zinc-400">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <p className="text-xs text-zinc-200 line-clamp-3 leading-relaxed">
                      {previewText || 'スライド'}
                    </p>
                    <div className="text-[11px] text-zinc-500 text-right">
                      {idx === currentIdx ? '表示中' : '移動 →'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
