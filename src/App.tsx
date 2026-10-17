import React, { useState, useMemo } from 'react';
import { getAllPresentations, getPresentationById } from './content';
import { Navbar } from './components/Navbar';
import { PresentationCard } from './components/PresentationCard';
import { BlogView } from './components/BlogView';
import { SlideView } from './components/SlideView';
import { GuideModal } from './components/GuideModal';
import {
  Sparkles,
  Search,
  BookOpen,
  MonitorPlay,
  Layers,
  ShieldAlert,
  Coffee,
  Cpu
} from 'lucide-react';

export const App: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'home' | 'article' | 'slide'>('home');
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Load all presentations
  const presentations = useMemo(() => getAllPresentations(), []);

  // Filtered presentations
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

  // Selected presentation data
  const currentPresentation = useMemo(() => {
    if (!activeId) return null;
    return getPresentationById(activeId);
  }, [activeId]);

  // Handlers
  const handleSelectArticle = (id: string) => {
    setActiveId(id);
    setViewMode('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSlide = (id: string, startIdx: number = 0) => {
    setActiveId(id);
    setSlideIndex(startIdx);
    setViewMode('slide');
  };

  const handleCloseSlide = () => {
    // If returning from slide view, go back to article view
    setViewMode('article');
  };

  const handleGoHome = () => {
    setActiveId(null);
    setViewMode('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Slide Mode Fullscreen
  if (viewMode === 'slide' && currentPresentation) {
    return (
      <SlideView
        data={currentPresentation}
        initialSlide={slideIndex}
        onClose={handleCloseSlide}
      />
    );
  }

  // Render Article / Blog Mode
  if (viewMode === 'article' && currentPresentation) {
    return (
      <BlogView
        data={currentPresentation}
        onBack={handleGoHome}
        onStartSlide={(idx = 0) => handleSelectSlide(currentPresentation.meta.id, idx)}
      />
    );
  }

  // Render Home Screen
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar onOpenGuide={() => setIsGuideOpen(true)} onGoHome={handleGoHome} />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 text-xs font-medium px-3.5 py-1.5 rounded-full border border-blue-400/30 backdrop-blur-sm mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>도쿄에서 전하는 팀원 20명을 위한 월간 프레젠테이션</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight sm:leading-tight mb-5">
            한 달에 한 번, <br className="hidden sm:inline" />
            우리의 이야기와 지식을 연결합니다
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            일상의 소소한 발견부터 정보 유출 사고 같은 최신 보안 이슈까지.<br />
            <strong>[발표용 슬라이드 모드]</strong>와 <strong>[사후 공유용 웹 문서 모드]</strong>로 완벽하게 기록됩니다.
          </p>

          {/* Quick Stats / Highlights */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-xl mx-auto pt-4 border-t border-slate-800/80">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <MonitorPlay className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
              <div className="text-sm sm:text-base font-bold">슬라이드 모드</div>
              <div className="text-[11px] text-slate-400">발표 당일 프로젝터용</div>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <BookOpen className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />
              <div className="text-sm sm:text-base font-bold">블로그 모드</div>
              <div className="text-[11px] text-slate-400">팀원 사후 열람용</div>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <Layers className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <div className="text-sm sm:text-base font-bold">마크다운 관리</div>
              <div className="text-[11px] text-slate-400">파일 하나로 자동 생성</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 z-20 flex-1 w-full pb-20">
        {/* Filter and Search Bar Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              전체 ({presentations.length})
            </button>
            <button
              onClick={() => setSelectedCategory('Security')}
              className={`flex items-center space-x-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === 'Security'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>보안/사회이슈</span>
            </button>
            <button
              onClick={() => setSelectedCategory('Life')}
              className={`flex items-center space-x-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === 'Life'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>도쿄 일상</span>
            </button>
            <button
              onClick={() => setSelectedCategory('Tech')}
              className={`flex items-center space-x-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === 'Tech'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>IT / 테크</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="제목, 태그, 내용 검색..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Presentation Cards Grid */}
        {filteredPresentations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
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
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
            <p className="text-slate-500 text-sm mb-3">검색 조건에 맞는 발표 자료가 없습니다.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              필터 및 검색어 초기화
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Monthly Deck. Tokyo Team Knowledge Archive.</p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-blue-600 transition-colors"
            >
              새 자료 추가 방법
            </button>
            <span>•</span>
            <span className="text-slate-400">무료 호스팅 (Vercel / Cloudflare) 최적화</span>
          </div>
        </div>
      </footer>

      {/* Guide Modal */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
};
