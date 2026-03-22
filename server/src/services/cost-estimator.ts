import type { CostEstimate } from '../providers/types.js';

const COST_PER_REQUEST = 0.032; // Text Search (New) Pro tier
const MAX_PAGES_PER_QUERY = 3;

export function estimateCost(deepSearch: boolean, gridSize: number = 2): CostEstimate {
  const gridCells = deepSearch ? gridSize * gridSize : 1;
  const requests = gridCells * MAX_PAGES_PER_QUERY;

  return {
    requests,
    costPerRequest: COST_PER_REQUEST,
    totalCost: Math.round(requests * COST_PER_REQUEST * 1000) / 1000,
    gridCells,
    pagesPerCell: MAX_PAGES_PER_QUERY,
  };
}
