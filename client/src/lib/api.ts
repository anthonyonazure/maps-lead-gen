import type { SearchResponse, CostEstimate } from './types';

export async function searchPlaces(params: {
  query: string;
  location: string;
  radiusMiles: number;
  deepSearch: boolean;
  gridSize: number;
  targetResults?: number | null;
  dataSource: 'google' | 'scraper';
  apiKey?: string;
}): Promise<SearchResponse> {
  const res = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Search failed');
  }
  return res.json();
}

export async function getCostEstimate(deepSearch: boolean, gridSize: number): Promise<CostEstimate> {
  const res = await fetch('/api/search/estimate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deepSearch, gridSize }),
  });
  return res.json();
}

export async function validateApiKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  const res = await fetch('/api/settings/validate-key', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey }),
  });
  return res.json();
}

export async function checkScraperStatus(): Promise<boolean> {
  const res = await fetch('/api/settings/scraper-status');
  const data = await res.json();
  return data.available;
}

export async function exportCSV(results: any[]): Promise<void> {
  const res = await fetch('/api/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ results }),
  });
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leads.csv';
  a.click();
  URL.revokeObjectURL(url);
}
