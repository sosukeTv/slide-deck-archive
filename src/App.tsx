import React, { useState, useMemo } from 'react';
import { getAllPresentations, getPresentationById } from './content';
import { Navbar } from './components/Navbar';
import { PresentationCard } from './components/PresentationCard';
import { BlogView } from './components/BlogView';
import { SlideView } from './components/SlideView';
import { GuideModal } from './components/GuideModal';
import { Search } from 'lucide-react';

export const App: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'home' | 'article' | 'slide'>('home');
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  const presentations = useMemo(() => getAllPresentations(), []);

  const filteredPresentations = useMemo(() => {
    return presentations.filter((p) => {
      const matchCategory =
        selectedCategory === 'all' || p.meta.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.meta.title.toLowerCase().includes(q) ||
        (p.meta.subtitle && p.meta.subtitle.toLowerCase().includes(q)) ||
        p.meta.description.toLowerCase().includes(q) ||
        p.meta.tags.some((t) => t.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });
  }, [presentations, selectedCategory, searchQuery]);

  const currentPresentation = useMemo(() => {
    if (!activeId) return null;
    return getPresentationById(activeId);
  }, [activeId]);

  const handleSelectArticle = (id: string) => {
    setActiveId(id);
    setViewMode('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSlide = (id: string, startIdx: number = 0) => {
    // Request browser fullscreen directly inside user click gesture
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    setActiveId(id);
    setSlideIndex(startIdx);
    setViewMode('slide');
  };

  const handleCloseSlide = () => {
    setViewMode('article');
  };

  const handleGoHome = () => {
    setActiveId(null);
    setViewMode('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fullscreen Slide Mode
  if (viewMode === 'slide' && currentPresentation) {
    return (
      <SlideView
        data={currentPresentation}
        initialSlide={slideIndex}
        onClose={handleCloseSlide}
      />
    );
  }

  // Article Mode
  if (viewMode === 'article' && currentPresentation) {
    return (
      <BlogView
        data={currentPresentation}
        onBack={handleGoHome}
        onStartSlide={(idx = 0) => handleSelectSlide(currentPresentation.meta.id, idx)}
      />
    );
  }

  // Minimalist Home Screen
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-zinc-900">
      <Navbar onOpenGuide={() => setIsGuideOpen(true)} onGoHome={handleGoHome} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-24 flex-1 w-full">
        {/* Minimalist Intro */}
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 mb-3">
            Presentations
          </h1>
          <p className="text-sm sm:text-base text-zinc-500">
            月次プレゼンテーションのスライド再生と記事アーカイブ。
          </p>
        </header>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-zinc-200/80">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: `すべて (${presentations.length})` },
              { id: 'Security', label: 'セキュリティ・社会' },
              { id: 'Life', label: 'ライフスタイル' },
              { id: 'Tech', label: 'テクノロジー' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-zinc-950 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="キーワードで検索..."
              className="w-full pl-9 pr-4 py-1.5 bg-zinc-50 border border-zinc-200/80 rounded-full text-xs text-zinc-900 focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* Cards Grid */}
        {filteredPresentations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPresentations.map((p) => (
              <PresentationCard
                key={p.meta.id}
                meta={p.meta}
                onSelectArticle={handleSelectArticle}
                onSelectSlide={(id) => handleSelectSlide(id, 0)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-zinc-200 rounded-2xl">
            <p className="text-zinc-400 text-sm mb-3">該当するプレゼンテーションが見つかりません。</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-zinc-900 underline underline-offset-4"
            >
              フィルターをリセット
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-100 py-8 px-4 text-xs text-zinc-400">
        <div className="max-w-5xl mx-auto px-2 flex items-center justify-between">
          <span>© 2026 Slide Archive</span>
          <button
            onClick={() => setIsGuideOpen(true)}
            className="hover:text-zinc-900 transition-colors"
          >
            新規スライド作成ガイド
          </button>
        </div>
      </footer>

      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
};
