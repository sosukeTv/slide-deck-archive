import React from 'react';
import { Presentation, HelpCircle, MapPin } from 'lucide-react';

interface NavbarProps {
  onOpenGuide: () => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenGuide, onGoHome }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={onGoHome}
          className="flex items-center space-x-3 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                Monthly Deck
              </span>
              <span className="inline-flex items-center text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                <MapPin className="w-2.5 h-2.5 mr-1" />
                Tokyo
              </span>
            </div>
            <p className="text-xs text-slate-500">팀원을 위한 월간 발표 & 지식 아카이브</p>
          </div>
        </button>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenGuide}
            className="flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-blue-600 bg-slate-100/80 hover:bg-blue-50 px-3.5 py-2 rounded-lg border border-slate-200/60 transition-all"
          >
            <HelpCircle className="w-4 h-4 text-blue-500" />
            <span>새 발표 올리는 법</span>
          </button>
        </div>
      </div>
    </header>
  );
};
