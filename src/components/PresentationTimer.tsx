import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export const PresentationTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
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
    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono text-zinc-300 bg-zinc-800/80 border border-zinc-700/60">
      <span className="font-medium text-white tabular-nums">{formatTime(seconds)}</span>
      <button
        onClick={toggle}
        className="p-0.5 hover:text-white text-zinc-400 transition-colors"
        title={isActive ? '一時停止' : '開始'}
      >
        {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
      </button>
      <button
        onClick={reset}
        className="p-0.5 hover:text-white text-zinc-400 transition-colors"
        title="リセット"
      >
        <RotateCcw className="w-3 h-3" />
      </button>
    </div>
  );
};
