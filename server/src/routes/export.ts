import { Router, Request, Response } from 'express';
import type { LeadResult } from '../providers/types.js';

export const exportRouter = Router();

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// POST /api/export — generate CSV from results
exportRouter.post('/', (req: Request, res: Response) => {
  const results = req.body.results as LeadResult[];

  if (!results?.length) {
    res.status(400).json({ error: 'No results to export' });
    return;
  }

  const headers = ['Name', 'Address', 'Phone', 'Email', 'Website', 'Rating', 'Review Count', 'Score', 'AI Summary', 'Site Platform', 'Mobile Friendly', 'Has SSL', 'Has Booking', 'Load Time (s)', 'Lead Status', 'Notes', 'Categories', 'Google Maps URL'];
  const rows = results.map(r => [
    escapeCSV(r.name),
    escapeCSV(r.address),
    r.phone || '',
    r.contactEmail || '',
    r.website || '',
    r.rating?.toString() ?? '',
    r.reviewCount.toString(),
    r.score?.toString() ?? '',
    escapeCSV(r.aiSummary || ''),
    r.websiteAnalysis?.platform || '',
    r.websiteAnalysis?.hasMobileViewport ? 'Yes' : r.websiteAnalysis ? 'No' : '',
    r.websiteAnalysis?.hasSSL ? 'Yes' : r.websiteAnalysis ? 'No' : '',
    r.websiteAnalysis?.hasBooking ? 'Yes' : r.websiteAnalysis ? 'No' : '',
    r.websiteAnalysis?.loadTimeMs ? (r.websiteAnalysis.loadTimeMs / 1000).toFixed(1) : '',
    r.leadStatus || '',
    escapeCSV(r.notes || ''),
    escapeCSV(r.categories.join('; ')),
    r.googleMapsUrl,
  ].join(','));

  const csv = [headers.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
  res.send(csv);
});
