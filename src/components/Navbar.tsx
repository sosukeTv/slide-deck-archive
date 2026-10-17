import React from 'react';
import { Plus } from 'lucide-react';

interface NavbarProps {
  onOpenGuide: () => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenGuide, onGoHome }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button
          onClick={onGoHome}
          className="flex items-center space-x-3 group text-left focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white font-bold text-sm tracking-tighter group-hover:bg-zinc-800 transition-colors">
            S
          </div>
          <div className="flex items-baseline space-x-2.5">
            <span className="font-bold text-base text-zinc-950 tracking-tight">
              Slide Archive
            </span>
            <span className="hidden sm:inline text-xs text-zinc-400 font-normal">
              月次プレゼン＆ナレッジ共有
            </span>
          </div>
        </button>

        <button
          onClick={onOpenGuide}
          className="flex items-center space-x-1.5 text-xs font-bold text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200/70 px-3.5 py-2 rounded-full transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>新規作成</span>
        </button>
      </div>
    </header>
  );
};
