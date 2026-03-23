export interface SearchParams {
  query: string;
  location: string;
  radiusMiles?: number;
  deepSearch?: boolean;
  gridSize?: number;
  targetResults?: number;
  dataSource: 'google' | 'scraper' | 'serpapi';
  apiKey?: string;
  serpApiKey?: string;
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
  score?: number;
  scoreBreakdown?: Record<string, number>;
  aiSummary?: string;
  contactEmail?: string | null;
  emailConfidence?: number;
  emailSource?: string;
  websiteAnalysis?: {
    reachable: boolean;
    hasSSL: boolean;
    loadTimeMs: number | null;
    platform: string | null;
    hasMobileViewport: boolean;
    hasContactForm: boolean;
    hasBooking: boolean;
    techScore: number;
  };
  leadStatus?: 'new' | 'contacted' | 'replied' | 'meeting' | 'won' | 'lost';
  notes?: string;
}

export interface ScoringConfig {
  noWebsite: number;
  noPhone: number;
  lowReviews: number;
  lowReviewThreshold: number;
  lowRating: number;
  lowRatingThreshold: number;
  noHours: number;
  fewCategories: number;
  useAI: boolean;
  aiProvider: 'openai' | 'anthropic' | 'gemini' | 'none';
  aiApiKey?: string;
}

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  noWebsite: 30,
  noPhone: 10,
  lowReviews: 20,
  lowReviewThreshold: 20,
  lowRating: 15,
  lowRatingThreshold: 3.5,
  noHours: 5,
  fewCategories: 5,
  useAI: false,
  aiProvider: 'none',
};

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
    dataSource: 'google' | 'scraper' | 'serpapi';
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
