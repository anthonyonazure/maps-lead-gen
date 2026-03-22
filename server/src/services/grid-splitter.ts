import type { BoundingBox, SearchCircle } from '../providers/types.js';

/**
 * Divide a bounding box into an NxN grid of search circles.
 * Each circle is centered on a grid cell and sized to cover it.
 */
export function splitIntoGrid(bounds: BoundingBox, gridSize: number = 2): SearchCircle[] {
  const latStep = (bounds.northeast.lat - bounds.southwest.lat) / gridSize;
  const lngStep = (bounds.northeast.lng - bounds.southwest.lng) / gridSize;

  // Approximate radius to cover each cell (diagonal / 2 in meters)
  const cellLatSpan = latStep * 111_320; // ~111km per degree latitude
  const cellLngSpan = lngStep * 111_320 * Math.cos((bounds.southwest.lat + bounds.northeast.lat) / 2 * Math.PI / 180);
  const cellDiagonal = Math.sqrt(cellLatSpan ** 2 + cellLngSpan ** 2);
  const radiusMeters = Math.min(Math.ceil(cellDiagonal / 2), 50_000); // Places API max 50km

  const circles: SearchCircle[] = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      circles.push({
        lat: bounds.southwest.lat + latStep * (row + 0.5),
        lng: bounds.southwest.lng + lngStep * (col + 0.5),
        radiusMeters,
      });
    }
  }

  return circles;
}
