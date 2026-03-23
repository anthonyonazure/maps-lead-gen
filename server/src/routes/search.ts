import { Router, Request, Response } from 'express';
import { geocodeLocation } from '../services/geocoding.js';
import { splitIntoGrid } from '../services/grid-splitter.js';
import { searchGooglePlaces } from '../providers/google-places.js';
import { searchWithScraper } from '../providers/gosom-scraper.js';
import { searchSerpApi } from '../providers/serpapi.js';
import type { SearchParams, SearchResponse, SearchCircle, LeadResult } from '../providers/types.js';

export const searchRouter = Router();

const RESULTS_PER_CELL = 60;
const COST_PER_REQUEST = 0.032;

function calculateGridSize(targetResults: number): number {
  if (targetResults <= 60) return 1;
  const effectivePerCell = RESULTS_PER_CELL * 0.7;
  const cellsNeeded = Math.ceil(targetResults / effectivePerCell);
  const gridSize = Math.ceil(Math.sqrt(cellsNeeded));
  return Math.min(gridSize, 10);
}

function dedupeResults(results: LeadResult[]): LeadResult[] {
  const seen = new Set<string>();
  return results.filter(r => {
    if (seen.has(r.placeId)) return false;
    seen.add(r.placeId);
    return true;
  });
}

/** Split pipe-separated location string into individual locations */
function parseLocations(location: string): string[] {
  return location.split('|').map(l => l.trim()).filter(Boolean);
}

// POST /api/search/estimate
searchRouter.post('/estimate', async (req: Request, res: Response) => {
  try {
    const { targetResults, deepSearch, gridSize, location } = req.body as Partial<SearchParams>;
    const locationCount = location ? parseLocations(location).length : 1;

    let cellsPerLocation: number;
    if (targetResults && targetResults > 60) {
      const auto = calculateGridSize(targetResults);
      cellsPerLocation = auto * auto;
    } else if (deepSearch) {
      const g = gridSize ?? 2;
      cellsPerLocation = g * g;
    } else {
      cellsPerLocation = 1;
    }

    const totalCells = cellsPerLocation * locationCount;
    const requests = totalCells * 3;
    res.json({
      requests,
      costPerRequest: COST_PER_REQUEST,
      totalCost: Math.round(requests * COST_PER_REQUEST * 1000) / 1000,
      gridCells: totalCells,
      gridSize: Math.ceil(Math.sqrt(cellsPerLocation)),
      locations: locationCount,
      pagesPerCell: 3,
      estimatedResults: Math.round(totalCells * RESULTS_PER_CELL * 0.7),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/search
searchRouter.post('/', async (req: Request, res: Response) => {
  const start = Date.now();

  try {
    const params = req.body as SearchParams;

    if (!params.query || !params.location) {
      res.status(400).json({ error: 'query and location are required' });
      return;
    }

    const locations = parseLocations(params.location);

    if (params.dataSource === 'scraper') {
      const allResults: LeadResult[] = [];
      for (const loc of locations) {
        const results = await searchWithScraper(params.query, loc);
        allResults.push(...results);
      }
      const deduped = dedupeResults(allResults);
      res.json({
        results: deduped,
        meta: { totalFound: deduped.length, deduplicated: allResults.length - deduped.length, dataSource: 'scraper', searchDurationMs: Date.now() - start },
      } as SearchResponse);
      return;
    }

    if (params.dataSource === 'serpapi') {
      if (!params.serpApiKey) { res.status(400).json({ error: 'SerpAPI key is required' }); return; }
      const allResults: LeadResult[] = [];
      const maxPerLocation = Math.ceil((params.targetResults || 60) / locations.length);
      for (const loc of locations) {
        const geo = await geocodeLocation(loc, params.apiKey || params.serpApiKey);
        const results = await searchSerpApi(params.query, geo.location, params.serpApiKey, maxPerLocation);
        allResults.push(...results);
      }
      const deduped = dedupeResults(allResults);
      res.json({
        results: deduped,
        meta: { totalFound: deduped.length, deduplicated: allResults.length - deduped.length, dataSource: 'serpapi', searchDurationMs: Date.now() - start },
      } as SearchResponse);
      return;
    }

    // Google Places API
    if (!params.apiKey) {
      res.status(400).json({ error: 'apiKey is required for Google Places search' });
      return;
    }

    const radiusMiles = params.radiusMiles ?? 10;
    const radiusMeters = Math.min(radiusMiles * 1609.34, 50_000);

    let gridSize: number;
    if (params.targetResults && params.targetResults > 60) {
      gridSize = calculateGridSize(Math.ceil(params.targetResults / locations.length));
    } else if (params.deepSearch) {
      gridSize = params.gridSize ?? 2;
    } else {
      gridSize = 1;
    }

    const allResults: LeadResult[] = [];
    let totalCircles = 0;

    for (const loc of locations) {
      const geo = await geocodeLocation(loc, params.apiKey);

      let circles: SearchCircle[];
      if (gridSize > 1) {
        circles = splitIntoGrid(geo.bounds, gridSize);
      } else {
        circles = [{ lat: geo.location.lat, lng: geo.location.lng, radiusMeters }];
      }
      totalCircles += circles.length;

      const results = await searchGooglePlaces(params.query, circles, params.apiKey);
      allResults.push(...results);
    }

    const deduped = dedupeResults(allResults);
    const requests = totalCircles * 3;
    const apiCost = Math.round(requests * COST_PER_REQUEST * 1000) / 1000;

    res.json({
      results: deduped,
      meta: {
        totalFound: deduped.length,
        deduplicated: allResults.length - deduped.length,
        dataSource: 'google',
        apiCost,
        searchDurationMs: Date.now() - start,
        gridCells: totalCircles,
      },
    } as SearchResponse);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
