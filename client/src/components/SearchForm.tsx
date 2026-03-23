import { useState } from 'react';
import { Search, Zap } from 'lucide-react';
import type { Filters } from '../lib/types';

interface SearchFormProps {
  onSearch: (params: {
    query: string;
    location: string;
    radiusMiles: number;
    deepSearch: boolean;
    gridSize: number;
    targetResults: number | null;
    dataSource: 'google' | 'scraper' | 'serpapi';
  }, filters: Partial<Filters>) => void;
  loading: boolean;
  hasApiKey: boolean;
}

export function SearchForm({ onSearch, loading, hasApiKey }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [radiusMiles, setRadiusMiles] = useState(10);
  const [hasWebsite, setHasWebsite] = useState<'any' | 'yes' | 'no'>('any');
  const [minReviews, setMinReviews] = useState('');
  const [maxReviews, setMaxReviews] = useState('');
  const [excludeNames, setExcludeNames] = useState('');
  const [targetResults, setTargetResults] = useState('');
  const [deepSearch, setDeepSearch] = useState(false);
  const [gridSize, setGridSize] = useState(2);
  const [dataSource, setDataSource] = useState<'google' | 'scraper' | 'serpapi'>('google');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !location.trim()) return;
    const target = targetResults ? Number(targetResults) : null;
    onSearch(
      { query: query.trim(), location: location.trim(), radiusMiles, deepSearch, gridSize, targetResults: target, dataSource },
      {
        hasWebsite,
        minReviews: minReviews ? Number(minReviews) : null,
        maxReviews: maxReviews ? Number(maxReviews) : null,
        excludeNames,
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Business Type</label>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g., chiropractor, behavioral health, dentist"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="e.g., Phoenix, AZ or 85004"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Target Results</label>
          <input
            type="number"
            value={targetResults}
            onChange={e => setTargetResults(e.target.value)}
            placeholder="e.g., 200, 500, 1000 (blank = default 60)"
            min={1}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Radius:</label>
          <select
            value={radiusMiles}
            onChange={e => setRadiusMiles(Number(e.target.value))}
            className="px-2 py-1 border border-slate-300 rounded-lg text-sm"
          >
            {[5, 10, 15, 20, 25, 30].map(m => (
              <option key={m} value={m}>{m} miles</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Source:</label>
          <select
            value={dataSource}
            onChange={e => setDataSource(e.target.value as 'google' | 'scraper')}
            className="px-2 py-1 border border-slate-300 rounded-lg text-sm"
          >
            <option value="google">Google Places API</option>
            <option value="serpapi">SerpAPI</option>
            <option value="scraper">Scraper (Docker)</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={deepSearch}
            onChange={e => setDeepSearch(e.target.checked)}
            className="rounded"
          />
          <Zap className="h-3.5 w-3.5" />
          Deep search
        </label>

        {deepSearch && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Grid:</label>
            <select
              value={gridSize}
              onChange={e => setGridSize(Number(e.target.value))}
              className="px-2 py-1 border border-slate-300 rounded-lg text-sm"
            >
              <option value={2}>2x2 (4 cells)</option>
              <option value={3}>3x3 (9 cells)</option>
              <option value={4}>4x4 (16 cells)</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Website:</label>
          <select
            value={hasWebsite}
            onChange={e => setHasWebsite(e.target.value as 'any' | 'yes' | 'no')}
            className="px-2 py-1 border border-slate-300 rounded-lg text-sm"
          >
            <option value="any">Any</option>
            <option value="yes">Has website</option>
            <option value="no">No website</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Reviews:</label>
          <input
            type="number"
            value={minReviews}
            onChange={e => setMinReviews(e.target.value)}
            placeholder="Min"
            min={0}
            className="px-2 py-1 border border-slate-300 rounded-lg text-sm w-20"
          />
          <span className="text-slate-400">—</span>
          <input
            type="number"
            value={maxReviews}
            onChange={e => setMaxReviews(e.target.value)}
            placeholder="Max"
            min={0}
            className="px-2 py-1 border border-slate-300 rounded-lg text-sm w-20"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Exclude:</label>
          <input
            type="text"
            value={excludeNames}
            onChange={e => setExcludeNames(e.target.value)}
            placeholder="e.g., The Joint, HealthSource"
            className="px-2 py-1 border border-slate-300 rounded-lg text-sm w-64"
          />
        </div>
      </div>

      {dataSource === 'google' && !hasApiKey && (
        <p className="text-sm text-amber-600">Set your Google API key in Settings first.</p>
      )}
      {dataSource === 'serpapi' && !localStorage.getItem('serpapi-key') && (
        <p className="text-sm text-amber-600">Set your SerpAPI key in Settings first.</p>
      )}

      <button
        type="submit"
        disabled={loading || (dataSource === 'google' && !hasApiKey) || (dataSource === 'serpapi' && !localStorage.getItem('serpapi-key'))}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Search className="h-4 w-4" />
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}
