import { Router, Request, Response } from 'express';
import { batchCheckWebsites } from '../services/website-check.js';
import { batchFindEmails } from '../services/email-finder.js';
import type { LeadResult } from '../providers/types.js';

export const enrichRouter = Router();

// POST /api/enrich/websites — check website quality for leads
enrichRouter.post('/websites', async (req: Request, res: Response) => {
  try {
    const { results } = req.body as { results: LeadResult[] };
    if (!results?.length) { res.status(400).json({ error: 'No results' }); return; }

    const checks = await batchCheckWebsites(results);
    const enriched = results.map(r => {
      const check = checks.get(r.placeId);
      return check ? { ...r, websiteAnalysis: check } : r;
    });

    res.json({ results: enriched });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/enrich/emails — find contact emails for leads
enrichRouter.post('/emails', async (req: Request, res: Response) => {
  try {
    const { results, hunterApiKey } = req.body as { results: LeadResult[]; hunterApiKey: string };
    if (!results?.length) { res.status(400).json({ error: 'No results' }); return; }
    if (!hunterApiKey) { res.status(400).json({ error: 'Hunter.io API key required' }); return; }

    const emails = await batchFindEmails(
      results.map(r => ({ placeId: r.placeId, website: r.website, name: r.name })),
      hunterApiKey,
    );

    const enriched = results.map(r => {
      const found = emails.get(r.placeId);
      return found ? { ...r, contactEmail: found.email, emailConfidence: found.confidence, emailSource: found.source } : r;
    });

    res.json({ results: enriched });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
