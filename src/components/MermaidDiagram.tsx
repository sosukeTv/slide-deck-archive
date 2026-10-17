import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
  className?: string;
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'Inter, Noto Sans JP, sans-serif'
});

export const MermaidDiagram: React.FC<MermaidProps> = ({ chart, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      if (!chart.trim()) return;
      const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
      try {
        const { svg } = await mermaid.render(uniqueId, chart.trim());
        if (isMounted) {
          setSvgContent(svg);
          setError(null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const errMsg = err instanceof Error ? err.message : String(err);
          console.warn('Mermaid render error:', errMsg);
          setError('図表のレンダリング中にエラーが発生しました。');
        }
      }
    };

    renderChart();
    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-600 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`mermaid-wrapper flex justify-center items-center my-6 overflow-x-auto p-6 bg-zinc-50 rounded-2xl border border-zinc-200/70 ${className}`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};
