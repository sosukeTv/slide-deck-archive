import { createPresentationData } from '../utils/markdownParser';
import { PresentationData } from '../types/presentation';

const STORAGE_KEY = 'slide_archive_custom_decks_v1';

// Automatically import all markdown files from the content directory
const mdFiles = import.meta.glob('./*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

interface StoredDeck {
  id: string;
  rawMarkdown: string;
}

function getStoredCustomDecks(): StoredDeck[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredDeck[];
  } catch {
    return [];
  }
}

export function saveCustomPresentation(id: string, rawMarkdown: string): PresentationData {
  const existing = getStoredCustomDecks().filter((d) => d.id !== id);
  const updated = [{ id, rawMarkdown }, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return createPresentationData(rawMarkdown, id);
}

export function deleteCustomPresentation(id: string): void {
  const existing = getStoredCustomDecks().filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function isCustomPresentation(id: string): boolean {
  return getStoredCustomDecks().some((d) => d.id === id);
}

export function getAllPresentations(): PresentationData[] {
  const presentations: PresentationData[] = [];

  // 1. Custom presentations saved via browser UI
  const customDecks = getStoredCustomDecks();
  for (const deck of customDecks) {
    presentations.push(createPresentationData(deck.rawMarkdown, deck.id));
  }

  // 2. Built-in markdown files
  for (const [filepath, content] of Object.entries(mdFiles)) {
    const filename = filepath.split('/').pop()?.replace(/\.md$/, '') || 'presentation';
    if (!presentations.some((p) => p.meta.id === filename)) {
      const presentation = createPresentationData(content, filename);
      presentations.push(presentation);
    }
  }

  // Sort by date descending (newest first)
  return presentations.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
}

export function getPresentationById(id: string): PresentationData | undefined {
  const all = getAllPresentations();
  return all.find((p) => p.meta.id === id);
}
