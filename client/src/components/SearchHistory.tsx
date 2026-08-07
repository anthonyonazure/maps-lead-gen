import { History, X } from 'lucide-react';

import { getHistory, HISTORY_STORAGE_KEY } from '../lib/search-history';

interface SearchHistoryProps {
  onRerun: (query: string, location: string) => void;
}

export function SearchHistory({ onRerun }: SearchHistoryProps) {
  const history = getHistory();
  if (history.length === 0) return null;

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
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
