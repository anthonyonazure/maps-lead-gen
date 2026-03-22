import { Router, Request, Response } from 'express';
import { checkScraperStatus } from '../providers/gosom-scraper.js';

export const settingsRouter = Router();

// GET /api/settings/scraper-status
settingsRouter.get('/scraper-status', async (_req: Request, res: Response) => {
  const available = await checkScraperStatus();
  res.json({ available });
});

// POST /api/settings/validate-key — test Google API key
settingsRouter.post('/validate-key', async (req: Request, res: Response) => {
  const { apiKey } = req.body;
  if (!apiKey) {
    res.status(400).json({ valid: false, error: 'No API key provided' });
    return;
  }

  try {
    const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=test&key=${apiKey}`;
    const testRes = await fetch(testUrl);
    const data = await testRes.json() as any;

    if (data.status === 'REQUEST_DENIED') {
      res.json({ valid: false, error: data.error_message || 'API key is invalid or restricted' });
      return;
    }

    res.json({ valid: true });
  } catch (err: any) {
    res.json({ valid: false, error: err.message });
  }
});
