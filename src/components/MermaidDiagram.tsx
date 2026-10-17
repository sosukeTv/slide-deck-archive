import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
  className?: string;
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  themeVariables: {
    primaryColor: '#3b82f6',
    primaryTextColor: '#1e293b',
    primaryBorderColor: '#2563eb',
    lineColor: '#64748b',
    secondaryColor: '#f1f5f9',
    tertiaryColor: '#ffffff'
  },
  securityLevel: 'loose',
  fontFamily: 'Pretendard, sans-serif'
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
          setError('다이어그램 렌더링 중 오류가 발생했습니다.');
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
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`mermaid-wrapper flex justify-center items-center my-6 overflow-x-auto p-4 bg-white/80 rounded-xl border border-slate-100 shadow-sm ${className}`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};
