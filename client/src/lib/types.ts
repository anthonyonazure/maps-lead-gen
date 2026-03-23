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

export interface SearchParams {
  query: string;
  location: string;
  radiusMiles: number;
  deepSearch: boolean;
  gridSize: number;
  targetResults: number | null;
  dataSource: 'google' | 'scraper' | 'serpapi';
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
