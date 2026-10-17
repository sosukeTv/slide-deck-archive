import { marked } from 'marked';
import { PresentationData, PresentationMeta } from '../types/presentation';

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: true,
});

export interface ContentBlock {
  type: 'html' | 'mermaid' | 'youtube';
  content: string;
}

/**
 * Splits raw markdown into frontmatter and body
 */
export function parseFrontmatter(rawContent: string): { meta: Partial<PresentationMeta>; body: string } {
  const normalized = rawContent.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    return { meta: {}, body: normalized };
  }

  const frontmatterStr = match[1];
  const body = match[2];

  const meta: Record<string, any> = {};
  const lines = frontmatterStr.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    let val: any = trimmed.slice(colonIdx + 1).trim();

    // Remove inline comments if outside quotes
    if (!val.startsWith('"') && !val.startsWith("'") && !val.startsWith('[')) {
      val = val.split('#')[0].trim();
    }

    // Remove quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }

    // Array parse (e.g. tags: ["a", "b"])
    if (val.startsWith('[') && val.endsWith(']')) {
      try {
        val = JSON.parse(val.replace(/'/g, '"'));
      } catch {
        val = val.slice(1, -1).split(',').map((s: string) => s.trim().replace(/^['"]|['"]$/g, ''));
      }
    }

    meta[key] = val;
  }

  return { meta, body };
}

/**
 * Splits body text into slides separated by `\n---\n`
 */
export function parseSlides(body: string): string[] {
  const normalized = body.replace(/\r\n/g, '\n');
  const rawSlides = normalized.split(/\n---\n/);
  return rawSlides.map(s => s.trim()).filter(s => s.length > 0);
}

/**
 * Parses a single slide or markdown segment into mixed blocks (HTML + Mermaid + YouTube)
 */
export function parseSlideToBlocks(markdown: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');

  let currentTextLines: string[] = [];
  let inMermaid = false;
  let currentMermaidLines: string[] = [];

  const flushText = () => {
    if (currentTextLines.length > 0) {
      const text = currentTextLines.join('\n').trim();
      if (text) {
        const html = marked.parse(text) as string;
        blocks.push({ type: 'html', content: html });
      }
      currentTextLines = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check YouTube placeholder: {{youtube:ID}}
    const ytMatch = line.trim().match(/^\{\{youtube:([a-zA-Z0-9_-]+)\}\}$/);
    if (ytMatch) {
      flushText();
      blocks.push({ type: 'youtube', content: ytMatch[1] });
      continue;
    }

    // Mermaid block begin
    if (line.trim().startsWith('```mermaid')) {
      flushText();
      inMermaid = true;
      currentMermaidLines = [];
      continue;
    }

    // Mermaid block end
    if (inMermaid && line.trim() === '```') {
      inMermaid = false;
      blocks.push({ type: 'mermaid', content: currentMermaidLines.join('\n') });
      currentMermaidLines = [];
      continue;
    }

    if (inMermaid) {
      currentMermaidLines.push(line);
    } else {
      currentTextLines.push(line);
    }
  }

  flushText();
  return blocks;
}

/**
 * Parses full raw markdown file into PresentationData
 */
export function createPresentationData(rawMarkdown: string, defaultId: string): PresentationData {
  const { meta, body } = parseFrontmatter(rawMarkdown);
  const slides = parseSlides(body);

  const fullMeta: PresentationMeta = {
    id: meta.id || defaultId,
    title: meta.title || '無題のプレゼンテーション',
    subtitle: meta.subtitle,
    date: meta.date || new Date().toISOString().split('T')[0],
    category: meta.category || 'Tech',
    author: meta.author || 'Presenter',
    description: meta.description || '',
    tags: meta.tags || [],
    youtubeId: meta.youtubeId,
    youtubeTitle: meta.youtubeTitle,
    thumbnail: meta.thumbnail || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    slidesCount: slides.length
  };

  return {
    meta: fullMeta,
    rawMarkdown,
    slides
  };
}
