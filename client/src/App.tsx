import { useState, useMemo, useCallback } from 'react';
import { SearchForm } from './components/SearchForm';
import { ResultsTable } from './components/ResultsTable';
import { FilterBar } from './components/FilterBar';
import { SettingsPanel } from './components/SettingsPanel';
import { CostTracker } from './components/CostTracker';
import { SearchHistory, addToHistory, getCachedResults } from './components/SearchHistory';
import { ScoringConfig } from './components/ScoringConfig';
import { LeadPipeline } from './components/LeadPipeline';
import { OutreachTemplates, loadTemplates } from './components/OutreachTemplates';
import { ExportDialog } from './components/ExportDialog';
import { MapPin, Settings, Download, Globe, Mail, MessageSquare } from 'lucide-react';
import type { LeadResult, Filters, SearchResponse, ScoringConfig as ScoringConfigType } from './lib/types';
import { DEFAULT_FILTERS, DEFAULT_SCORING_CONFIG } from './lib/types';
import { searchPlaces, scoreResults, enrichWebsites, enrichEmails } from './lib/api';

type SortField = keyof LeadResult;
type SortDir = 'asc' | 'desc';

export default function App() {
  const [results, setResults] = useState<LeadResult[]>([]);
  const [meta, setMeta] = useState<SearchResponse['meta'] | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [sessionCost, setSessionCost] = useState(0);
  const [searchCount, setSearchCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const pageSize = 25;
  const [scoringConfig, setScoringConfig] = useState<ScoringConfigType>(DEFAULT_SCORING_CONFIG);
  const [scoring, setScoring] = useState(false);
  const [enriching, setEnriching] = useState<string | null>(null);
  const [pipelineLead, setPipelineLead] = useState<LeadResult | null>(null);
  const [exportData, setExportData] = useState<{ results: LeadResult[]; label: string } | null>(null);

  const apiKey = localStorage.getItem('gmaps-api-key') || '';

  const handleSearch = useCallback(async (params: {
    query: string;
    location: string;
    radiusMiles: number;
    deepSearch: boolean;
    gridSize: number;
    targetResults: number | null;
    dataSource: 'google' | 'scraper' | 'serpapi';
  }, preFilters?: Partial<Filters>) => {
    setLoading(true);
    setError(null);
    setResults([]);
    setMeta(null);
    setFilters({ ...DEFAULT_FILTERS, ...preFilters });
    setSelectedIds(new Set());
    setPage(0);

    try {
      const cached = getCachedResults(params.query, params.location);
      if (cached) {
        setResults(cached);
        setMeta({ totalFound: cached.length, deduplicated: 0, dataSource: params.dataSource, searchDurationMs: 0 });
        setLoading(false);
        return;
      }

      const serpApiKey = localStorage.getItem('serpapi-key') || '';
      const response = await searchPlaces({
        ...params,
        apiKey: params.dataSource === 'google' ? apiKey : undefined,
        serpApiKey: params.dataSource === 'serpapi' ? serpApiKey : undefined,
      });
      setResults(response.results);
      setMeta(response.meta);
      setSearchCount(c => c + 1);
      addToHistory(params.query, params.location, response.results.length, response.results);
      if (response.meta.apiCost) {
        setSessionCost(c => c + response.meta.apiCost!);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const filteredResults = useMemo(() => {
    let filtered = results;

    if (filters.hasWebsite === 'yes') filtered = filtered.filter(r => r.website);
    if (filters.hasWebsite === 'no') filtered = filtered.filter(r => !r.website);
    if (filters.hasPhone === 'yes') filtered = filtered.filter(r => r.phone);
    if (filters.hasPhone === 'no') filtered = filtered.filter(r => !r.phone);
    if (filters.minReviews !== null) filtered = filtered.filter(r => r.reviewCount >= filters.minReviews!);
    if (filters.maxReviews !== null) filtered = filtered.filter(r => r.reviewCount <= filters.maxReviews!);
    if (filters.minRating !== null) filtered = filtered.filter(r => (r.rating ?? 0) >= filters.minRating!);
    if (filters.maxRating !== null) filtered = filtered.filter(r => (r.rating ?? 0) <= filters.maxRating!);
    if (filters.categoryFilter) {
      const term = filters.categoryFilter.toLowerCase();
      filtered = filtered.filter(r => r.categories.some(c => c.toLowerCase().includes(term)));
    }
    if (filters.excludeNames) {
      const excluded = filters.excludeNames.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      filtered = filtered.filter(r => !excluded.some(ex => r.name.toLowerCase().includes(ex)));
    }

    filtered = [...filtered].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

    return filtered;
  }, [results, filters, sortField, sortDir]);

  const handleScore = async () => {
    setScoring(true);
    try {
      const aiApiKey = scoringConfig.aiProvider !== 'none'
        ? localStorage.getItem(`${scoringConfig.aiProvider}-key`) || ''
        : undefined;
      const scored = await scoreResults(results, { ...scoringConfig, aiApiKey });
      setResults(scored);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setScoring(false);
    }
  };

  const handleEnrichWebsites = async () => {
    setEnriching('websites');
    try {
      const enriched = await enrichWebsites(results);
      setResults(enriched);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEnriching(null);
    }
  };

  const handleEnrichEmails = async () => {
    const hunterKey = localStorage.getItem('hunter-key') || '';
    if (!hunterKey) { setError('Set your Hunter.io API key in Settings first'); return; }
    setEnriching('emails');
    try {
      const enriched = await enrichEmails(results, hunterKey);
      setResults(enriched);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEnriching(null);
    }
  };

  const handleLeadUpdate = (updated: LeadResult) => {
    setResults(prev => prev.map(r => r.placeId === updated.placeId ? updated : r));
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">Maps Lead Gen</h1>
          </div>
          <div className="flex items-center gap-3">
            <CostTracker sessionCost={sessionCost} searchCount={searchCount} lastSearchCost={meta?.apiCost} />
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              title="Outreach Templates"
            >
              <MessageSquare className="h-5 w-5 text-purple-500" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Settings className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
        {showTemplates && <OutreachTemplates onClose={() => setShowTemplates(false)} />}

        <SearchForm onSearch={handleSearch} loading={loading} hasApiKey={!!apiKey} />
        <SearchHistory onRerun={(query, location) => {
          handleSearch({ query, location, radiusMiles: 10, deepSearch: false, gridSize: 2, targetResults: null, dataSource: 'google' });
        }} />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">&times;</button>
          </div>
        )}

        {results.length > 0 && (
          <>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-sm text-slate-600">
                Showing <span className="font-semibold text-slate-900">{filteredResults.length}</span>
                {filteredResults.length !== results.length && <> of {results.length}</>} results
                {meta?.deduplicated ? (
                  <span className="ml-2 text-slate-400">({meta.deduplicated} dupes removed)</span>
                ) : null}
                {meta?.searchDurationMs === 0 && (
                  <span className="ml-2 text-emerald-500 font-medium">(cached)</span>
                )}
                {meta?.searchDurationMs !== undefined && meta.searchDurationMs > 0 && (
                  <span className="ml-2 text-slate-400">in {(meta.searchDurationMs / 1000).toFixed(1)}s</span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleEnrichWebsites}
                  disabled={!!enriching}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {enriching === 'websites' ? 'Checking...' : 'Check Sites'}
                </button>
                <button
                  onClick={handleEnrichEmails}
                  disabled={!!enriching}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {enriching === 'emails' ? 'Finding...' : 'Find Emails'}
                </button>
                {selectedIds.size > 0 && (
                  <button
                    onClick={() => setExportData({ results: filteredResults.filter(r => selectedIds.has(r.placeId)), label: `Export ${selectedIds.size} Selected` })}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export Selected ({selectedIds.size})
                  </button>
                )}
                <button
                  onClick={() => setExportData({ results: filteredResults, label: `Export All (${filteredResults.length})` })}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export All ({filteredResults.length})
                </button>
              </div>
            </div>

            <ScoringConfig
              config={scoringConfig}
              onChange={setScoringConfig}
              onScore={handleScore}
              scoring={scoring}
              hasResults={results.length > 0}
            />

            <FilterBar filters={filters} onChange={(f) => { setFilters(f); setPage(0); }} />
            <ResultsTable
              results={filteredResults}
              sortField={sortField}
              sortDir={sortDir}
              onSort={handleSort}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onLeadClick={(lead) => setPipelineLead(lead)}
            />
          </>
        )}

        {!loading && results.length === 0 && !error && (
          <div className="text-center py-20 text-slate-400">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Search for businesses to get started</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-20">
            <div className="h-8 w-8 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-slate-500">Searching Google Maps...</p>
          </div>
        )}
      </main>

      {pipelineLead && (
        <LeadPipeline
          lead={pipelineLead}
          onUpdate={handleLeadUpdate}
          onClose={() => setPipelineLead(null)}
          outreachTemplates={loadTemplates()}
        />
      )}

      {exportData && (
        <ExportDialog
          results={exportData.results}
          label={exportData.label}
          onClose={() => setExportData(null)}
        />
      )}
    </div>
  );
}
