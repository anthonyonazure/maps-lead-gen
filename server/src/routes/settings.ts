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
  if (!apiKey) { res.status(400).json({ valid: false, error: 'No API key provided' }); return; }

  try {
    const testRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=test&key=${apiKey}`);
    const data = await testRes.json() as any;
    if (data.status === 'REQUEST_DENIED') {
      res.json({ valid: false, error: data.error_message || 'Invalid or restricted key' });
      return;
    }
    res.json({ valid: true });
  } catch (err: any) {
    res.json({ valid: false, error: err.message });
  }
});

// POST /api/settings/validate-serpapi-key
settingsRouter.post('/validate-serpapi-key', async (req: Request, res: Response) => {
  const { apiKey } = req.body;
  if (!apiKey) { res.status(400).json({ valid: false, error: 'No key provided' }); return; }

  try {
    const testRes = await fetch(`https://serpapi.com/account?api_key=${apiKey}`);
    if (!testRes.ok) { res.json({ valid: false, error: 'Invalid SerpAPI key' }); return; }
    res.json({ valid: true });
  } catch (err: any) {
    res.json({ valid: false, error: err.message });
  }
});

// POST /api/settings/validate-openai-key
settingsRouter.post('/validate-openai-key', async (req: Request, res: Response) => {
  const { apiKey } = req.body;
  if (!apiKey) { res.status(400).json({ valid: false, error: 'No key provided' }); return; }

  try {
    const testRes = await fetch('https://api.openai.com/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    res.json({ valid: testRes.ok, error: testRes.ok ? undefined : 'Invalid OpenAI key' });
  } catch (err: any) {
    res.json({ valid: false, error: err.message });
  }
});

// POST /api/settings/validate-anthropic-key
settingsRouter.post('/validate-anthropic-key', async (req: Request, res: Response) => {
  const { apiKey } = req.body;
  if (!apiKey) { res.status(400).json({ valid: false, error: 'No key provided' }); return; }

  try {
    // Anthropic doesn't have a lightweight validation endpoint, so we send a minimal request
    const testRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1, messages: [{ role: 'user', content: 'hi' }] }),
    });
    res.json({ valid: testRes.ok || testRes.status === 400, error: testRes.status === 401 ? 'Invalid Anthropic key' : undefined });
  } catch (err: any) {
    res.json({ valid: false, error: err.message });
  }
});

// POST /api/settings/validate-gemini-key
settingsRouter.post('/validate-gemini-key', async (req: Request, res: Response) => {
  const { apiKey } = req.body;
  if (!apiKey) { res.status(400).json({ valid: false, error: 'No key provided' }); return; }

  try {
    const testRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    res.json({ valid: testRes.ok, error: testRes.ok ? undefined : 'Invalid Gemini key' });
  } catch (err: any) {
    res.json({ valid: false, error: err.message });
  }
});
