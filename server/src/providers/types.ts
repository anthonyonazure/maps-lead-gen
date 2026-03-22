export interface SearchParams {
  query: string;
  location: string;
  radiusMiles?: number;
  deepSearch?: boolean;
  gridSize?: number;
  targetResults?: number;
  dataSource: 'google' | 'scraper';
  apiKey?: string;
}

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

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface SearchCircle extends GeoLocation {
  radiusMeters: number;
}

export interface BoundingBox {
  northeast: GeoLocation;
  southwest: GeoLocation;
}

export interface SearchResponse {
  results: LeadResult[];
  meta: {
    totalFound: number;
    deduplicated: number;
    dataSource: 'google' | 'scraper';
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
