import { Router, Request, Response } from 'express';
import { scoreLeads } from '../services/scoring.js';
import { aiScoreLeads } from '../providers/ai-scoring.js';
import type { LeadResult, ScoringConfig } from '../providers/types.js';
import { errorMessage } from '../services/unknown.js';

export const scoreRouter = Router();

// POST /api/score — score a batch of leads
scoreRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { results, config } = req.body as { results: LeadResult[]; config: ScoringConfig };

    if (!results?.length) {
      res.status(400).json({ error: 'No results to score' });
      return;
    }

    // Step 1: Rule-based scoring
    let scored = scoreLeads(results, config);

    // Step 2: AI enhancement (if enabled)
    if (config.useAI && config.aiProvider !== 'none' && config.aiApiKey) {
      scored = await aiScoreLeads(scored, config);
    }

    res.json({ results: scored });
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});
