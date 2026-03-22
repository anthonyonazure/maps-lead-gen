import type { LeadResult, SearchCircle } from './types.js';

const FIELD_MASK = 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.types,places.googleMapsUri,places.location,places.currentOpeningHours';

interface PlacesResponse {
  places?: GooglePlace[];
  nextPageToken?: string;
}

interface GooglePlace {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  types?: string[];
  googleMapsUri?: string;
  location?: { latitude: number; longitude: number };
  currentOpeningHours?: { openNow?: boolean };
}

function normalizePlace(place: GooglePlace): LeadResult {
  return {
    placeId: place.id,
    name: place.displayName?.text ?? '',
    address: place.formattedAddress ?? '',
    phone: place.nationalPhoneNumber ?? null,
    website: place.websiteUri ?? null,
    rating: place.rating ?? null,
    reviewCount: place.userRatingCount ?? 0,
    categories: (place.types ?? []).filter(t => !t.startsWith('point_of_interest') && t !== 'establishment'),
    googleMapsUrl: place.googleMapsUri ?? `https://www.google.com/maps/place/?q=place_id:${place.id}`,
    latitude: place.location?.latitude ?? 0,
    longitude: place.location?.longitude ?? 0,
    hoursListed: !!place.currentOpeningHours,
  };
}

async function searchSingleArea(
  query: string,
  circle: SearchCircle,
  apiKey: string,
): Promise<LeadResult[]> {
  const results: LeadResult[] = [];
  let pageToken: string | undefined;

  for (let page = 0; page < 3; page++) {
    const body: Record<string, any> = {
      textQuery: query,
      locationBias: {
        circle: {
          center: { latitude: circle.lat, longitude: circle.lng },
          radius: circle.radiusMeters,
        },
      },
      maxResultCount: 20,
    };

    if (pageToken) {
      body.pageToken = pageToken;
    }

    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': FIELD_MASK,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Places API error (${res.status}): ${error}`);
    }

    const data = (await res.json()) as PlacesResponse;

    if (data.places) {
      results.push(...data.places.map(normalizePlace));
    }

    pageToken = data.nextPageToken;
    if (!pageToken) break;

    // Small delay between pages per API docs
    await new Promise(r => setTimeout(r, 300));
  }

  return results;
}

export async function searchGooglePlaces(
  query: string,
  circles: SearchCircle[],
  apiKey: string,
): Promise<LeadResult[]> {
  const allResults: LeadResult[] = [];
  const seen = new Set<string>();

  // Run searches with concurrency limit of 3
  const concurrency = 3;
  for (let i = 0; i < circles.length; i += concurrency) {
    const batch = circles.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(circle => searchSingleArea(query, circle, apiKey))
    );

    for (const results of batchResults) {
      for (const result of results) {
        if (!seen.has(result.placeId)) {
          seen.add(result.placeId);
          allResults.push(result);
        }
      }
    }
  }

  return allResults;
}
