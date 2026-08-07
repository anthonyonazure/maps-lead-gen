import type { GeoLocation, BoundingBox } from '../providers/types.js';

interface GeocodeResult {
  location: GeoLocation;
  bounds: BoundingBox;
  formattedAddress: string;
}

/** The slice of the Google Geocoding API response this module actually reads. */
interface GeocodeApiResponse {
  status?: string;
  results?: {
    formatted_address?: string;
    geometry?: {
      location?: GeoLocation;
      viewport?: { northeast: GeoLocation; southwest: GeoLocation };
    };
  }[];
}

export async function geocodeLocation(location: string, apiKey: string): Promise<GeocodeResult> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;
  const res = await fetch(url);
  const data = (await res.json()) as GeocodeApiResponse;

  const result = data.results?.[0];
  const geo = result?.geometry;
  const point = geo?.location;
  if (data.status !== 'OK' || !result || !geo || !point) {
    throw new Error(`Geocoding failed for "${location}": ${data.status ?? 'no result'}`);
  }

  // Use viewport as bounds (covers the logical area), fallback to a default box
  const bounds: BoundingBox = geo.viewport
    ? {
        northeast: { lat: geo.viewport.northeast.lat, lng: geo.viewport.northeast.lng },
        southwest: { lat: geo.viewport.southwest.lat, lng: geo.viewport.southwest.lng },
      }
    : {
        northeast: { lat: point.lat + 0.05, lng: point.lng + 0.05 },
        southwest: { lat: point.lat - 0.05, lng: point.lng - 0.05 },
      };

  return {
    location: { lat: point.lat, lng: point.lng },
    bounds,
    formattedAddress: result.formatted_address ?? location,
  };
}
