import { Router, Request, Response } from 'express';
import { geocodeLocation } from '../services/geocoding.js';
import { splitIntoGrid } from '../services/grid-splitter.js';
import { estimateCost } from '../services/cost-estimator.js';
import { searchGooglePlaces } from '../providers/google-places.js';
import { searchWithScraper } from '../providers/gosom-scraper.js';
import type { SearchParams, SearchResponse, SearchCircle } from '../providers/types.js';

export const searchRouter = Router();

// POST /api/search/estimate — get cost before executing
searchRouter.post('/estimate', async (req: Request, res: Response) => {
  try {
    const { deepSearch, gridSize } = req.body as Partial<SearchParams>;
    const estimate = estimateCost(!!deepSearch, gridSize ?? 2);
    res.json(estimate);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/search — execute search
searchRouter.post('/', async (req: Request, res: Response) => {
  const start = Date.now();

  try {
    const params = req.body as SearchParams;

    if (!params.query || !params.location) {
      res.status(400).json({ error: 'query and location are required' });
      return;
    }

    if (params.dataSource === 'scraper') {
      const results = await searchWithScraper(params.query, params.location);
      const response: SearchResponse = {
        results,
        meta: {
          totalFound: results.length,
          deduplicated: 0,
          dataSource: 'scraper',
          searchDurationMs: Date.now() - start,
        },
      };
      res.json(response);
      return;
    }

    // Google Places API
    if (!params.apiKey) {
      res.status(400).json({ error: 'apiKey is required for Google Places search' });
      return;
    }

    const geo = await geocodeLocation(params.location, params.apiKey);
    const radiusMiles = params.radiusMiles ?? 10;
    const radiusMeters = Math.min(radiusMiles * 1609.34, 50_000);

    let circles: SearchCircle[];
    if (params.deepSearch) {
      circles = splitIntoGrid(geo.bounds, params.gridSize ?? 2);
    } else {
      circles = [{ lat: geo.location.lat, lng: geo.location.lng, radiusMeters }];
    }

    const rawResults = await searchGooglePlaces(params.query, circles, params.apiKey);
    const estimate = estimateCost(!!params.deepSearch, params.gridSize ?? 2);

    const response: SearchResponse = {
      results: rawResults,
      meta: {
        totalFound: rawResults.length,
        deduplicated: 0,
        dataSource: 'google',
        apiCost: estimate.totalCost,
        searchDurationMs: Date.now() - start,
        gridCells: circles.length,
      },
    };
    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
