export interface LeadResult {
  placeId: string;
  name: string;
  address: string;
  phone: string | null;
  website: string | null;
  rating: number | null;
  reviewCount: number;
  categories: string[];
  googleMapsUrl: string;
  latitude: number;
  longitude: number;
  hoursListed: boolean;
}

export interface SearchParams {
  query: string;
  location: string;
  radiusMiles: number;
  deepSearch: boolean;
  gridSize: number;
  targetResults: number | null;
  dataSource: 'google' | 'scraper';
}

export interface SearchResponse {
  results: LeadResult[];
  meta: {
    totalFound: number;
    deduplicated: number;
    dataSource: string;
    apiCost?: number;
    searchDurationMs: number;
    gridCells?: number;
  };
}

export interface CostEstimate {
  requests: number;
  costPerRequest: number;
  totalCost: number;
  gridCells: number;
  pagesPerCell: number;
}

export interface Filters {
  hasWebsite: 'any' | 'yes' | 'no';
  hasPhone: 'any' | 'yes' | 'no';
  minReviews: number | null;
  maxReviews: number | null;
  minRating: number | null;
  maxRating: number | null;
  categoryFilter: string;
  excludeNames: string;
}

export const DEFAULT_FILTERS: Filters = {
  hasWebsite: 'any',
  hasPhone: 'any',
  minReviews: null,
  maxReviews: null,
  minRating: null,
  maxRating: null,
  categoryFilter: '',
  excludeNames: '',
};
