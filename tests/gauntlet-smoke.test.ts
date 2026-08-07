import { test, expect } from "bun:test";

import { scoreLeads } from "../server/src/services/scoring.js";
import { splitIntoGrid } from "../server/src/services/grid-splitter.js";
import { estimateCost } from "../server/src/services/cost-estimator.js";
import { asString, errorMessage, readStringField } from "../server/src/services/unknown.js";
import { DEFAULT_SCORING_CONFIG, type LeadResult } from "../server/src/providers/types.js";

/**
 * The gauntlet scaffolded a smoke test that imported electron/main.cjs. That
 * entrypoint calls app.whenReady() at module scope, so importing it outside an
 * Electron runtime always throws - the test could never pass, and it proved
 * nothing about this codebase anyway. These cover the pure logic instead:
 * scoring, grid splitting, cost estimation, and the unknown-value narrowing
 * that every route handler depends on.
 */

function lead(overrides: Partial<LeadResult> = {}): LeadResult {
  return {
    placeId: "p1",
    name: "Test Business",
    address: "1 Main St",
    phone: "555-0100",
    website: "https://example.com",
    rating: 4.8,
    reviewCount: 250,
    categories: ["dentist", "health"],
    googleMapsUrl: "https://maps.google.com/?cid=1",
    latitude: 33.4,
    longitude: -111.8,
    hoursListed: true,
    ...overrides,
  };
}

test("a fully-established business scores zero opportunity", () => {
  const [scored] = scoreLeads([lead()], DEFAULT_SCORING_CONFIG);
  expect(scored?.score).toBe(0);
  expect(scored?.scoreBreakdown).toEqual({});
});

test("every gap present scores 100 and is itemised", () => {
  const [scored] = scoreLeads(
    [lead({ website: null, phone: null, rating: 2, reviewCount: 1, hoursListed: false, categories: ["cafe"] })],
    DEFAULT_SCORING_CONFIG,
  );
  expect(scored?.score).toBe(100);
  expect(Object.keys(scored?.scoreBreakdown ?? {}).sort()).toEqual(
    ["fewCategories", "lowRating", "lowReviews", "noHours", "noPhone", "noWebsite"],
  );
});

test("a missing rating is not treated as a bad rating", () => {
  const [scored] = scoreLeads([lead({ rating: null })], DEFAULT_SCORING_CONFIG);
  expect(scored?.scoreBreakdown?.lowRating).toBeUndefined();
});

test("scoring does not mutate the leads it is given", () => {
  const original = lead({ website: null });
  scoreLeads([original], DEFAULT_SCORING_CONFIG);
  expect(original.score).toBeUndefined();
});

test("splitIntoGrid returns one circle per cell, inside the bounds", () => {
  const bounds = {
    northeast: { lat: 34, lng: -111 },
    southwest: { lat: 33, lng: -112 },
  };
  const circles = splitIntoGrid(bounds, 3);
  expect(circles).toHaveLength(9);
  for (const c of circles) {
    expect(c.lat).toBeGreaterThan(bounds.southwest.lat);
    expect(c.lat).toBeLessThan(bounds.northeast.lat);
    expect(c.lng).toBeGreaterThan(bounds.southwest.lng);
    expect(c.lng).toBeLessThan(bounds.northeast.lng);
    // The Places API rejects anything above 50km.
    expect(c.radiusMeters).toBeLessThanOrEqual(50_000);
    expect(c.radiusMeters).toBeGreaterThan(0);
  }
});

test("a huge bounding box still clamps the radius to the API maximum", () => {
  const circles = splitIntoGrid({ northeast: { lat: 49, lng: -66 }, southwest: { lat: 25, lng: -125 } }, 1);
  expect(circles[0]?.radiusMeters).toBe(50_000);
});

test("estimateCost charges one cell unless deep search is on", () => {
  const shallow = estimateCost(false, 4);
  expect(shallow.gridCells).toBe(1);
  expect(shallow.requests).toBe(3);

  const deep = estimateCost(true, 4);
  expect(deep.gridCells).toBe(16);
  expect(deep.requests).toBe(48);
  expect(deep.totalCost).toBeCloseTo(48 * shallow.costPerRequest, 3);
});

test("errorMessage survives values that are not Errors", () => {
  expect(errorMessage(new Error("boom"))).toBe("boom");
  expect(errorMessage("boom")).toBe("boom");
  expect(errorMessage(undefined)).toBe("undefined");
});

test("readStringField only accepts non-empty strings", () => {
  expect(readStringField({ apiKey: "abc" }, "apiKey")).toBe("abc");
  expect(readStringField({ apiKey: "" }, "apiKey")).toBeNull();
  expect(readStringField({ apiKey: 42 }, "apiKey")).toBeNull();
  expect(readStringField(null, "apiKey")).toBeNull();
  expect(readStringField("not an object", "apiKey")).toBeNull();
});

test("asString falls back rather than stringifying an object", () => {
  expect(asString("ok")).toBe("ok");
  expect(asString({})).toBe("");
  expect(asString(undefined, "fallback")).toBe("fallback");
});
