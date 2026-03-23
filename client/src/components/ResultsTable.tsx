import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, Globe, Phone, ChevronDown, ChevronRight, AlertTriangle, Star } from 'lucide-react';
import { ScoreBadge } from './ScoreBadge';
import type { LeadResult } from '../lib/types';

type SortField = keyof LeadResult;
type SortDir = 'asc' | 'desc';

interface ResultsTableProps {
  results: LeadResult[];
  sortField: SortField;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onLeadClick?: (lead: LeadResult) => void;
}

export function ResultsTable({ results, sortField, sortDir, onSort, selectedIds, onSelectionChange, page, pageSize, onPageChange, onLeadClick }: ResultsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalPages = Math.ceil(results.length / pageSize);
  const pagedResults = results.slice(page * pageSize, (page + 1) * pageSize);
  const allPageSelected = pagedResults.length > 0 && pagedResults.every(r => selectedIds.has(r.placeId));

  const toggleAll = () => {
    const next = new Set(selectedIds);
    if (allPageSelected) {
      pagedResults.forEach(r => next.delete(r.placeId));
    } else {
      pagedResults.forEach(r => next.add(r.placeId));
    }
    onSelectionChange(next);
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-100 border-b border-slate-200">
              <th className="px-3 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={toggleAll}
                  className="rounded border-slate-300"
                />
              </th>
              <th className="w-8 px-1 py-3"></th>
              <SortHeader field="name" label="Business" current={sortField} dir={sortDir} onSort={onSort} />
              <th className="text-left px-3 py-3 font-medium text-slate-600">Address</th>
              <SortHeader field="phone" label="Phone" current={sortField} dir={sortDir} onSort={onSort} />
              <SortHeader field="website" label="Website" current={sortField} dir={sortDir} onSort={onSort} />
              <SortHeader field="rating" label="Rating" current={sortField} dir={sortDir} onSort={onSort} />
              <SortHeader field="reviewCount" label="Reviews" current={sortField} dir={sortDir} onSort={onSort} />
              <SortHeader field="score" label="Score" current={sortField} dir={sortDir} onSort={onSort} />
              <th className="text-left px-3 py-3 font-medium text-slate-600">Categories</th>
              <th className="px-3 py-3 font-medium text-slate-600 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {pagedResults.map((r, i) => (
              <>
                <tr
                  key={r.placeId}
                  className={`border-b border-slate-100 hover:bg-blue-50/60 transition-colors cursor-pointer ${i % 2 === 1 ? 'bg-slate-50/60' : ''} ${selectedIds.has(r.placeId) ? 'bg-blue-50/40' : ''}`}
                  onClick={() => setExpandedId(expandedId === r.placeId ? null : r.placeId)}
                >
                  <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(r.placeId)}
                      onChange={() => toggleOne(r.placeId)}
                      className="rounded border-slate-300"
                    />
                  </td>
                  <td className="px-1 py-2.5 text-slate-400">
                    {expandedId === r.placeId ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  </td>
                  <td className="px-3 py-2.5 font-medium text-slate-900 max-w-[200px] truncate">
                    {r.name}
                  </td>
                  <td className="px-3 py-2.5 text-slate-600 max-w-[250px] truncate">{r.address}</td>
                  <td className="px-3 py-2.5">
                    {r.phone ? (
                      <span className="inline-flex items-center gap-1 text-slate-700">
                        <Phone className="h-3 w-3 text-slate-400" />
                        {r.phone}
                      </span>
                    ) : (
                      <span className="text-slate-300">--</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    {r.website ? (
                      <a
                        href={r.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        onClick={e => e.stopPropagation()}
                      >
                        <Globe className="h-3 w-3" />
                        <span className="max-w-[150px] truncate">{r.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span>
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full font-semibold border border-orange-200">
                        <AlertTriangle className="h-3 w-3" />
                        No website
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {r.rating ? (
                      <span className="inline-flex items-center gap-1 text-slate-700">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        {r.rating.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-slate-300">--</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-center font-mono text-slate-700">
                    {r.reviewCount}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {r.score !== undefined ? <ScoreBadge score={r.score} /> : <span className="text-slate-300">--</span>}
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
                  <td className="px-3 py-2.5 flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    {onLeadClick && (
                      <button
                        onClick={() => onLeadClick(r)}
                        className="px-2 py-0.5 text-xs bg-purple-50 text-purple-700 rounded border border-purple-200 hover:bg-purple-100 font-medium"
                      >
                        Manage
                      </button>
                    )}
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
                {expandedId === r.placeId && (
                  <tr key={`${r.placeId}-detail`} className="bg-slate-50/80">
                    <td colSpan={11} className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs font-medium text-slate-500 mb-1">Full Address</p>
                          <p className="text-slate-700">{r.address}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 mb-1">Phone</p>
                          <p className="text-slate-700">{r.phone || 'Not listed'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 mb-1">Website</p>
                          {r.website ? (
                            <a href={r.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{r.website}</a>
                          ) : (
                            <p className="text-orange-700 font-medium">No website</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 mb-1">Rating</p>
                          <p className="text-slate-700">{r.rating ? `${r.rating.toFixed(1)} / 5` : 'No rating'} ({r.reviewCount} reviews)</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 mb-1">Hours Listed</p>
                          <p className="text-slate-700">{r.hoursListed ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 mb-1">All Categories</p>
                          <div className="flex flex-wrap gap-1">
                            {r.categories.map(c => (
                              <span key={c} className="px-1.5 py-0.5 bg-slate-200 text-slate-700 text-xs rounded">
                                {c.replace(/_/g, ' ')}
                              </span>
                            ))}
                            {r.categories.length === 0 && <span className="text-slate-400">None</span>}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 mb-1">Coordinates</p>
                          <p className="text-slate-700 font-mono text-xs">{r.latitude.toFixed(6)}, {r.longitude.toFixed(6)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 mb-1">Place ID</p>
                          <p className="text-slate-500 font-mono text-xs truncate">{r.placeId}</p>
                        </div>
                        {r.contactEmail && (
                          <div>
                            <p className="text-xs font-medium text-slate-500 mb-1">Contact Email</p>
                            <p className="text-blue-600">{r.contactEmail} <span className="text-xs text-slate-400">({r.emailConfidence}% confidence)</span></p>
                          </div>
                        )}
                        {r.websiteAnalysis && (
                          <div className="md:col-span-2">
                            <p className="text-xs font-medium text-slate-500 mb-1">Website Analysis</p>
                            <div className="flex flex-wrap gap-1">
                              <span className={`px-1.5 py-0.5 text-xs rounded ${r.websiteAnalysis.hasSSL ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {r.websiteAnalysis.hasSSL ? 'SSL' : 'No SSL'}
                              </span>
                              <span className={`px-1.5 py-0.5 text-xs rounded ${r.websiteAnalysis.hasMobileViewport ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {r.websiteAnalysis.hasMobileViewport ? 'Mobile OK' : 'Not Mobile'}
                              </span>
                              <span className={`px-1.5 py-0.5 text-xs rounded ${r.websiteAnalysis.hasBooking ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                                {r.websiteAnalysis.hasBooking ? 'Has Booking' : 'No Booking'}
                              </span>
                              {r.websiteAnalysis.platform && (
                                <span className="px-1.5 py-0.5 text-xs rounded bg-slate-100 text-slate-600">{r.websiteAnalysis.platform}</span>
                              )}
                              {r.websiteAnalysis.loadTimeMs && (
                                <span className={`px-1.5 py-0.5 text-xs rounded ${r.websiteAnalysis.loadTimeMs > 3000 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                  {(r.websiteAnalysis.loadTimeMs / 1000).toFixed(1)}s load
                                </span>
                              )}
                              <span className={`px-1.5 py-0.5 text-xs rounded font-medium ${r.websiteAnalysis.techScore < 50 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                Tech: {r.websiteAnalysis.techScore}/100
                              </span>
                            </div>
                          </div>
                        )}
                        {r.aiSummary && (
                          <div className="md:col-span-3">
                            <p className="text-xs font-medium text-slate-500 mb-1">AI Assessment</p>
                            <p className="text-slate-700 text-sm italic">{r.aiSummary}</p>
                          </div>
                        )}
                        {r.scoreBreakdown && Object.keys(r.scoreBreakdown).length > 0 && (
                          <div className="md:col-span-3">
                            <p className="text-xs font-medium text-slate-500 mb-1">Score Breakdown</p>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(r.scoreBreakdown).map(([key, val]) => (
                                <span key={key} className="px-1.5 py-0.5 bg-purple-50 text-purple-700 text-xs rounded border border-purple-200">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}: +{val}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
          <span className="text-xs text-slate-500">
            {page * pageSize + 1}–{Math.min((page + 1) * pageSize, results.length)} of {results.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
              className="px-3 py-1 text-sm rounded border border-slate-300 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i;
              } else if (page < 3) {
                pageNum = i;
              } else if (page > totalPages - 4) {
                pageNum = totalPages - 7 + i;
              } else {
                pageNum = page - 3 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-1 text-sm rounded border ${page === pageNum ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 hover:bg-slate-100'}`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 text-sm rounded border border-slate-300 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
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
