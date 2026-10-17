import { createPresentationData } from '../utils/markdownParser';
import { PresentationData } from '../types/presentation';

// Automatically import all markdown files from the content directory
const mdFiles = import.meta.glob('./*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export function getAllPresentations(): PresentationData[] {
  const presentations: PresentationData[] = [];

  for (const [filepath, content] of Object.entries(mdFiles)) {
    // Extract default ID from filename e.g. "./2026-10-security-leak.md" -> "2026-10-security-leak"
    const filename = filepath.split('/').pop()?.replace(/\.md$/, '') || 'presentation';
    const presentation = createPresentationData(content, filename);
    presentations.push(presentation);
  }

  // Sort by date descending (newest first)
  return presentations.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
}

export function getPresentationById(id: string): PresentationData | undefined {
  const all = getAllPresentations();
  return all.find(p => p.meta.id === id);
}
