import { Router, Request, Response } from 'express';
import type { LeadResult } from '../providers/types.js';

export const exportRouter = Router();

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export interface ExportColumn {
  key: string;
  label: string;
}

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
  { key: 'loadTime', label: 'Load Time (s)' },
  { key: 'leadStatus', label: 'Lead Status' },
  { key: 'notes', label: 'Notes' },
  { key: 'categories', label: 'Categories' },
  { key: 'googleMapsUrl', label: 'Google Maps URL' },
];

function getFieldValue(r: LeadResult, key: string): string {
  switch (key) {
    case 'name': return escapeCSV(r.name);
    case 'address': return escapeCSV(r.address);
    case 'phone': return r.phone || '';
    case 'contactEmail': return r.contactEmail || '';
    case 'website': return r.website || '';
    case 'rating': return r.rating?.toString() ?? '';
    case 'reviewCount': return r.reviewCount.toString();
    case 'score': return r.score?.toString() ?? '';
    case 'aiSummary': return escapeCSV(r.aiSummary || '');
    case 'sitePlatform': return r.websiteAnalysis?.platform || '';
    case 'mobileFriendly': return r.websiteAnalysis?.hasMobileViewport ? 'Yes' : r.websiteAnalysis ? 'No' : '';
    case 'hasSSL': return r.websiteAnalysis?.hasSSL ? 'Yes' : r.websiteAnalysis ? 'No' : '';
    case 'hasBooking': return r.websiteAnalysis?.hasBooking ? 'Yes' : r.websiteAnalysis ? 'No' : '';
    case 'loadTime': return r.websiteAnalysis?.loadTimeMs ? (r.websiteAnalysis.loadTimeMs / 1000).toFixed(1) : '';
    case 'leadStatus': return r.leadStatus || '';
    case 'notes': return escapeCSV(r.notes || '');
    case 'categories': return escapeCSV(r.categories.join('; '));
    case 'googleMapsUrl': return r.googleMapsUrl;
    default: return '';
  }
}

// GET /api/export/columns — list all available columns
exportRouter.get('/columns', (_req: Request, res: Response) => {
  res.json(ALL_COLUMNS);
});

// POST /api/export — generate CSV from results with selected columns
exportRouter.post('/', (req: Request, res: Response) => {
  const { results, columns } = req.body as { results: LeadResult[]; columns?: string[] };

  if (!results?.length) {
    res.status(400).json({ error: 'No results to export' });
    return;
  }

  // Use selected columns or default to all
  const selectedColumns = columns?.length
    ? ALL_COLUMNS.filter(c => columns.includes(c.key))
    : ALL_COLUMNS;

  const headers = selectedColumns.map(c => c.label);
  const rows = results.map(r =>
    selectedColumns.map(c => getFieldValue(r, c.key)).join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
  res.send(csv);
});
