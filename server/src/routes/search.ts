import { Router, Request, Response } from 'express';
import { geocodeLocation } from '../services/geocoding.js';
import { splitIntoGrid } from '../services/grid-splitter.js';
import { searchGooglePlaces } from '../providers/google-places.js';
import { searchWithScraper } from '../providers/gosom-scraper.js';
import type { SearchParams, SearchResponse, SearchCircle } from '../providers/types.js';

export const searchRouter = Router();

const RESULTS_PER_CELL = 60; // Google returns max 60 per query (3 pages x 20)
const COST_PER_REQUEST = 0.032;

/**
 * Given a target result count, calculate the grid size needed.
 * Each grid cell yields up to 60 results. Account for ~30% overlap/dedup.
 */
function calculateGridSize(targetResults: number): number {
  if (targetResults <= 60) return 1;
  // Assume ~30% overlap between adjacent cells, so effective yield is ~42 per cell
  const effectivePerCell = RESULTS_PER_CELL * 0.7;
  const cellsNeeded = Math.ceil(targetResults / effectivePerCell);
  // Grid is NxN, find smallest N where N*N >= cellsNeeded
  const gridSize = Math.ceil(Math.sqrt(cellsNeeded));
  return Math.min(gridSize, 10); // Cap at 10x10 = 100 cells
}

// POST /api/search/estimate — get cost before executing
searchRouter.post('/estimate', async (req: Request, res: Response) => {
  try {
    const { targetResults, deepSearch, gridSize } = req.body as Partial<SearchParams>;

    let cells: number;
    if (targetResults && targetResults > 60) {
      const auto = calculateGridSize(targetResults);
      cells = auto * auto;
    } else if (deepSearch) {
      const g = gridSize ?? 2;
      cells = g * g;
    } else {
      cells = 1;
    }

    const maxPages = 3;
    const requests = cells * maxPages;
    res.json({
      requests,
      costPerRequest: COST_PER_REQUEST,
      totalCost: Math.round(requests * COST_PER_REQUEST * 1000) / 1000,
      gridCells: cells,
      gridSize: Math.ceil(Math.sqrt(cells)),
      pagesPerCell: maxPages,
      estimatedResults: Math.round(cells * RESULTS_PER_CELL * 0.7),
    });
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

    // Smart grid calculation
    let gridSize: number;
    if (params.targetResults && params.targetResults > 60) {
      gridSize = calculateGridSize(params.targetResults);
    } else if (params.deepSearch) {
      gridSize = params.gridSize ?? 2;
    } else {
      gridSize = 1;
    }

    let circles: SearchCircle[];
    if (gridSize > 1) {
      circles = splitIntoGrid(geo.bounds, gridSize);
    } else {
      circles = [{ lat: geo.location.lat, lng: geo.location.lng, radiusMeters }];
    }

    const totalRawBefore = circles.length * RESULTS_PER_CELL; // theoretical max
    const rawResults = await searchGooglePlaces(params.query, circles, params.apiKey);
    const deduplicated = (circles.length * RESULTS_PER_CELL) - rawResults.length;

    const requests = circles.length * 3; // 3 pages per cell max
    const apiCost = Math.round(requests * COST_PER_REQUEST * 1000) / 1000;

    const response: SearchResponse = {
      results: rawResults,
      meta: {
        totalFound: rawResults.length,
        deduplicated: Math.max(0, deduplicated),
        dataSource: 'google',
        apiCost,
        searchDurationMs: Date.now() - start,
        gridCells: circles.length,
      },
    };
    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
