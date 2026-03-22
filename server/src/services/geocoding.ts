import type { GeoLocation, BoundingBox } from '../providers/types.js';

interface GeocodeResult {
  location: GeoLocation;
  bounds: BoundingBox;
  formattedAddress: string;
}

export async function geocodeLocation(location: string, apiKey: string): Promise<GeocodeResult> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json() as any;

  if (data.status !== 'OK' || !data.results?.length) {
    throw new Error(`Geocoding failed for "${location}": ${data.status}`);
  }

  const result = data.results[0];
  const geo = result.geometry;

  // Use viewport as bounds (covers the logical area), fallback to a default box
  const bounds: BoundingBox = geo.viewport
    ? {
        northeast: { lat: geo.viewport.northeast.lat, lng: geo.viewport.northeast.lng },
        southwest: { lat: geo.viewport.southwest.lat, lng: geo.viewport.southwest.lng },
      }
    : {
        northeast: { lat: geo.location.lat + 0.05, lng: geo.location.lng + 0.05 },
        southwest: { lat: geo.location.lat - 0.05, lng: geo.location.lng - 0.05 },
      };

  return {
    location: { lat: geo.location.lat, lng: geo.location.lng },
    bounds,
    formattedAddress: result.formatted_address,
  };
}
