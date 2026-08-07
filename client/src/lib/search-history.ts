// Storage helpers for recent searches. These live outside SearchHistory.tsx so
// that file exports only its component: a module that mixes components with
// plain functions cannot be hot-reloaded (react-refresh/only-export-components).
import type { LeadResult } from './types';

export interface SearchEntry {
  query: string;
  location: string;
  timestamp: number;
  resultCount: number;
}

export const HISTORY_STORAGE_KEY = 'search-history';
const CACHE_KEY = 'search-cache';
const MAX_ENTRIES = 100;

function cacheKey(query: string, location: string) {
  return `${query.toLowerCase().trim()}|${location.toLowerCase().trim()}`;
}

export function getHistory(): SearchEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '[]') as SearchEntry[];
  } catch { return []; }
}

export function addToHistory(query: string, location: string, resultCount: number, results: LeadResult[]) {
  const history = getHistory().filter(e => !(e.query === query && e.location === location));
  history.unshift({ query, location, timestamp: Date.now(), resultCount });
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.slice(0, MAX_ENTRIES)));

  // Cache results
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') as Record<string, LeadResult[]>;
    cache[cacheKey(query, location)] = results;
    // No limit — keep all cached searches
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch { /* storage full, skip caching */ }
}

export function getCachedResults(query: string, location: string): LeadResult[] | null {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') as Record<string, LeadResult[]>;
    return cache[cacheKey(query, location)] || null;
  } catch { return null; }
}
