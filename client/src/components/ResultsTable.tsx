import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, Globe, Phone } from 'lucide-react';
import type { LeadResult } from '../lib/types';

type SortField = keyof LeadResult;
type SortDir = 'asc' | 'desc';

interface ResultsTableProps {
  results: LeadResult[];
  sortField: SortField;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
}

export function ResultsTable({ results, sortField, sortDir, onSort }: ResultsTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <SortHeader field="name" label="Business" current={sortField} dir={sortDir} onSort={onSort} />
              <th className="text-left px-3 py-3 font-medium text-slate-600">Address</th>
              <SortHeader field="phone" label="Phone" current={sortField} dir={sortDir} onSort={onSort} />
              <SortHeader field="website" label="Website" current={sortField} dir={sortDir} onSort={onSort} />
              <SortHeader field="rating" label="Rating" current={sortField} dir={sortDir} onSort={onSort} />
              <SortHeader field="reviewCount" label="Reviews" current={sortField} dir={sortDir} onSort={onSort} />
              <th className="text-left px-3 py-3 font-medium text-slate-600">Categories</th>
              <th className="px-3 py-3 font-medium text-slate-600 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.placeId} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-3 py-2.5 font-medium text-slate-900 max-w-[200px] truncate">
                  {r.name}
                </td>
                <td className="px-3 py-2.5 text-slate-600 max-w-[250px] truncate">{r.address}</td>
                <td className="px-3 py-2.5">
                  {r.phone ? (
                    <span className="inline-flex items-center gap-1 text-slate-700">
                      <Phone className="h-3 w-3" />
                      {r.phone}
                    </span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  {r.website ? (
                    <a
                      href={r.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <Globe className="h-3 w-3" />
                      <span className="max-w-[150px] truncate">{r.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full font-medium">
                      No website
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-center">
                  {r.rating ? (
                    <span className="text-slate-700">{r.rating.toFixed(1)}</span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-center font-mono text-slate-700">
                  {r.reviewCount}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {r.categories.slice(0, 3).map(c => (
                      <span key={c} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                        {c.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <a
                    href={r.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-blue-600"
                    title="Open in Google Maps"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortHeader({ field, label, current, dir, onSort }: {
  field: SortField;
  label: string;
  current: SortField;
  dir: SortDir;
  onSort: (f: SortField) => void;
}) {
  const isActive = current === field;
  return (
    <th className="text-left px-3 py-3 font-medium text-slate-600">
      <button
        onClick={() => onSort(field)}
        className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors"
      >
        {label}
        {isActive ? (
          dir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-30" />
        )}
      </button>
    </th>
  );
}
