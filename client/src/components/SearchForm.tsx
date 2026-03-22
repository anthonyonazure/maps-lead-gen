import { useState } from 'react';
import { Search, Zap } from 'lucide-react';

interface SearchFormProps {
  onSearch: (params: {
    query: string;
    location: string;
    radiusMiles: number;
    deepSearch: boolean;
    gridSize: number;
    dataSource: 'google' | 'scraper';
  }) => void;
  loading: boolean;
  hasApiKey: boolean;
}

export function SearchForm({ onSearch, loading, hasApiKey }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [radiusMiles, setRadiusMiles] = useState(10);
  const [deepSearch, setDeepSearch] = useState(false);
  const [gridSize, setGridSize] = useState(2);
  const [dataSource, setDataSource] = useState<'google' | 'scraper'>('google');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !location.trim()) return;
    onSearch({ query: query.trim(), location: location.trim(), radiusMiles, deepSearch, gridSize, dataSource });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {dataSource === 'google' && !hasApiKey && (
        <p className="text-sm text-amber-600">Set your Google API key in Settings first.</p>
      )}

      <button
        type="submit"
        disabled={loading || (dataSource === 'google' && !hasApiKey)}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Search className="h-4 w-4" />
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}
