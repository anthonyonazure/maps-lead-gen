import { useState } from 'react';
import { X, Download, Check } from 'lucide-react';
import type { LeadResult } from '../lib/types';
import { exportCSV } from '../lib/api';
import type { ExportColumn } from '../lib/api';

const ALL_COLUMNS: ExportColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'address', label: 'Address' },
  { key: 'phone', label: 'Phone' },
  { key: 'contactEmail', label: 'Email' },
  { key: 'website', label: 'Website' },
  { key: 'rating', label: 'Rating' },
  { key: 'reviewCount', label: 'Review Count' },
  { key: 'score', label: 'Score' },
  { key: 'aiSummary', label: 'AI Summary' },
  { key: 'sitePlatform', label: 'Site Platform' },
  { key: 'mobileFriendly', label: 'Mobile Friendly' },
  { key: 'hasSSL', label: 'Has SSL' },
  { key: 'hasBooking', label: 'Has Booking' },
  { key: 'loadTime', label: 'Load Time' },
  { key: 'leadStatus', label: 'Lead Status' },
  { key: 'notes', label: 'Notes' },
  { key: 'categories', label: 'Categories' },
  { key: 'googleMapsUrl', label: 'Google Maps URL' },
];

const DEFAULT_SELECTED = ['name', 'address', 'phone', 'contactEmail', 'website', 'rating', 'reviewCount', 'score', 'categories', 'googleMapsUrl'];
const STORAGE_KEY = 'export-columns';

function loadSavedColumns(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_SELECTED;
  } catch { return DEFAULT_SELECTED; }
}

interface ExportDialogProps {
  results: LeadResult[];
  onClose: () => void;
  label: string;
}

export function ExportDialog({ results, onClose, label }: ExportDialogProps) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(loadSavedColumns()));

  const toggle = (key: string) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelected(next);
  };

  const selectAll = () => setSelected(new Set(ALL_COLUMNS.map(c => c.key)));
  const selectNone = () => setSelected(new Set());

  const handleExport = () => {
    const cols = ALL_COLUMNS.filter(c => selected.has(c.key)).map(c => c.key);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cols));
    exportCSV(results, cols);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">{label} — Choose Columns</h2>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded"><X className="h-4 w-4 text-slate-500" /></button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button onClick={selectAll} className="text-blue-600 hover:underline">Select all</button>
            <span className="text-slate-300">|</span>
            <button onClick={selectNone} className="text-blue-600 hover:underline">Select none</button>
            <span className="flex-1" />
            <span className="text-slate-400">{selected.size} of {ALL_COLUMNS.length} selected</span>
          </div>

          <div className="grid grid-cols-2 gap-1 max-h-72 overflow-y-auto">
            {ALL_COLUMNS.map(col => (
              <button
                key={col.key}
                onClick={() => toggle(col.key)}
                className={`flex items-center gap-2 px-2.5 py-1.5 text-sm text-left rounded transition-colors ${
                  selected.has(col.key) ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span className={`flex-shrink-0 h-4 w-4 rounded border flex items-center justify-center ${
                  selected.has(col.key) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                }`}>
                  {selected.has(col.key) && <Check className="h-3 w-3" />}
                </span>
                {col.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExport}
            disabled={selected.size === 0}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export {results.length} leads ({selected.size} columns)
          </button>
        </div>
      </div>
    </div>
  );
}
