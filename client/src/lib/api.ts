import type { SearchResponse, CostEstimate, LeadResult, ScoringConfig } from './types';

export async function searchPlaces(params: {
  query: string;
  location: string;
  radiusMiles: number;
  deepSearch: boolean;
  gridSize: number;
  targetResults?: number | null;
  dataSource: 'google' | 'scraper' | 'serpapi';
  apiKey?: string;
  serpApiKey?: string;
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

export async function scoreResults(results: LeadResult[], config: ScoringConfig & { aiApiKey?: string }): Promise<LeadResult[]> {
  const res = await fetch('/api/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ results, config }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Scoring failed');
  }
  const data = await res.json();
  return data.results;
}

export async function validateKey(provider: string, apiKey: string): Promise<{ valid: boolean; error?: string }> {
  const endpoints: Record<string, string> = {
    google: '/api/settings/validate-key',
    serpapi: '/api/settings/validate-serpapi-key',
    openai: '/api/settings/validate-openai-key',
    anthropic: '/api/settings/validate-anthropic-key',
    gemini: '/api/settings/validate-gemini-key',
  };
  const url = endpoints[provider];
  if (!url) return { valid: false, error: 'Unknown provider' };

  const res = await fetch(url, {
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
