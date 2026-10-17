import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

export const PresentationTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setSeconds(0);
    setIsActive(false);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-2 bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-mono text-slate-200 border border-slate-700/60 shadow-inner">
      <Clock className="w-3.5 h-3.5 text-blue-400" />
      <span className="font-semibold text-white tracking-wider">{formatTime(seconds)}</span>
      <button
        onClick={toggle}
        className="p-1 hover:text-white text-slate-400 transition-colors"
        title={isActive ? '일시 정지' : '타이머 시작'}
      >
        {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-400" />}
      </button>
      <button
        onClick={reset}
        className="p-1 hover:text-white text-slate-400 transition-colors"
        title="타이머 초기화"
      >
        <RotateCcw className="w-3 h-3" />
      </button>
    </div>
  );
};
