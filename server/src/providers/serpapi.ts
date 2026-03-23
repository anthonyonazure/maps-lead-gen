import type { LeadResult, GeoLocation } from './types.js';

interface SerpApiResult {
  place_id?: string;
  title?: string;
  address?: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviews?: number;
  type?: string;
  types?: string[];
  gps_coordinates?: { latitude: number; longitude: number };
  operating_hours?: Record<string, string>;
  thumbnail?: string;
}

interface SerpApiResponse {
  local_results?: SerpApiResult[];
  serpapi_pagination?: { next?: string };
  error?: string;
}

function normalizeResult(r: SerpApiResult): LeadResult {
  return {
    placeId: r.place_id || `serpapi-${r.title}-${r.address}`,
    name: r.title || '',
    address: r.address || '',
    phone: r.phone || null,
    website: r.website || null,
    rating: r.rating ?? null,
    reviewCount: r.reviews ?? 0,
    categories: r.types || (r.type ? [r.type] : []),
    googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${r.place_id || ''}`,
    latitude: r.gps_coordinates?.latitude ?? 0,
    longitude: r.gps_coordinates?.longitude ?? 0,
    hoursListed: !!r.operating_hours,
  };
}

export async function searchSerpApi(
  query: string,
  location: GeoLocation,
  apiKey: string,
  maxResults: number = 60,
): Promise<LeadResult[]> {
  const results: LeadResult[] = [];
  const seen = new Set<string>();
  let start = 0;

  while (results.length < maxResults) {
    const params = new URLSearchParams({
      engine: 'google_maps',
      q: query,
      ll: `@${location.lat},${location.lng},14z`,
      type: 'search',
      api_key: apiKey,
      start: String(start),
    });

    const res = await fetch(`https://serpapi.com/search?${params}`);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`SerpAPI error (${res.status}): ${text}`);
    }

    const data = (await res.json()) as SerpApiResponse;

    if (data.error) {
      throw new Error(`SerpAPI: ${data.error}`);
    }

    const batch = data.local_results || [];
    if (batch.length === 0) break;

    for (const r of batch) {
      const lead = normalizeResult(r);
      if (!seen.has(lead.placeId)) {
        seen.add(lead.placeId);
        results.push(lead);
      }
    }

    if (!data.serpapi_pagination?.next) break;
    start += 20;

    // Small delay between pages
    await new Promise(r => setTimeout(r, 200));
  }

  return results.slice(0, maxResults);
}
