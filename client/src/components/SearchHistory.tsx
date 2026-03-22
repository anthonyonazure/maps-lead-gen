import { History, X } from 'lucide-react';

import type { LeadResult } from '../lib/types';

interface SearchEntry {
  query: string;
  location: string;
  timestamp: number;
  resultCount: number;
}

interface SearchHistoryProps {
  onRerun: (query: string, location: string) => void;
}

const STORAGE_KEY = 'search-history';
const CACHE_KEY = 'search-cache';
const MAX_ENTRIES = 100;

function cacheKey(query: string, location: string) {
  return `${query.toLowerCase().trim()}|${location.toLowerCase().trim()}`;
}

export function getHistory(): SearchEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

export function addToHistory(query: string, location: string, resultCount: number, results: LeadResult[]) {
  const history = getHistory().filter(e => !(e.query === query && e.location === location));
  history.unshift({ query, location, timestamp: Date.now(), resultCount });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_ENTRIES)));

  // Cache results
  try {
    const cache: Record<string, LeadResult[]> = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    cache[cacheKey(query, location)] = results;
    // No limit — keep all cached searches
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch { /* storage full, skip caching */ }
}

export function getCachedResults(query: string, location: string): LeadResult[] | null {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    return cache[cacheKey(query, location)] || null;
  } catch { return null; }
}

export function SearchHistory({ onRerun }: SearchHistoryProps) {
  const history = getHistory();
  if (history.length === 0) return null;

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <History className="h-3.5 w-3.5 text-slate-400" />
      {history.map((entry, i) => (
        <button
          key={i}
          onClick={() => onRerun(entry.query, entry.location)}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:bg-blue-50 hover:border-blue-200 transition-colors"
          title={`${entry.resultCount} results — ${new Date(entry.timestamp).toLocaleString()}`}
        >
          {entry.query} in {entry.location}
          <span className="text-slate-400">({entry.resultCount})</span>
        </button>
      ))}
      <button onClick={clearHistory} className="text-slate-300 hover:text-slate-500" title="Clear history">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
