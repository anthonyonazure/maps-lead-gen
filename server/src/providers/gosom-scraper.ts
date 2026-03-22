import type { LeadResult } from './types.js';

const SCRAPER_BASE_URL = process.env.SCRAPER_URL || 'http://localhost:8080';

export async function checkScraperStatus(): Promise<boolean> {
  try {
    const res = await fetch(`${SCRAPER_BASE_URL}/api/v1/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

interface ScraperJob {
  id: string;
  status: string;
}

export async function searchWithScraper(query: string, location: string): Promise<LeadResult[]> {
  // Create job
  const createRes = await fetch(`${SCRAPER_BASE_URL}/api/v1/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      queries: [`${query} in ${location}`],
      max_places: 200,
      language: 'en',
    }),
  });

  if (!createRes.ok) {
    throw new Error(`Scraper job creation failed: ${createRes.status}`);
  }

  const job = (await createRes.json()) as ScraperJob;

  // Poll for completion
  const maxWait = 5 * 60 * 1000; // 5 minutes
  const start = Date.now();

  while (Date.now() - start < maxWait) {
    await new Promise(r => setTimeout(r, 2000));

    const statusRes = await fetch(`${SCRAPER_BASE_URL}/api/v1/jobs/${job.id}`);
    if (!statusRes.ok) continue;

    const status = (await statusRes.json()) as ScraperJob;
    if (status.status === 'completed') {
      return await downloadResults(job.id);
    }
    if (status.status === 'failed') {
      throw new Error('Scraper job failed');
    }
  }

  throw new Error('Scraper job timed out after 5 minutes');
}

async function downloadResults(jobId: string): Promise<LeadResult[]> {
  const res = await fetch(`${SCRAPER_BASE_URL}/api/v1/jobs/${jobId}/download`);
  if (!res.ok) throw new Error(`Failed to download scraper results: ${res.status}`);

  const text = await res.text();
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const results: LeadResult[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = values[idx] ?? ''; });

    results.push({
      placeId: row['place_id'] || row['id'] || `scraper-${i}`,
      name: row['name'] || row['title'] || '',
      address: row['address'] || row['full_address'] || '',
      phone: row['phone'] || row['phone_number'] || null,
      website: row['website'] || row['web_site'] || null,
      rating: row['rating'] ? parseFloat(row['rating']) : null,
      reviewCount: parseInt(row['reviews'] || row['reviews_count'] || '0', 10) || 0,
      categories: (row['category'] || row['categories'] || '').split(';').map(c => c.trim()).filter(Boolean),
      googleMapsUrl: row['google_maps_url'] || row['url'] || '',
      latitude: parseFloat(row['latitude'] || row['lat'] || '0') || 0,
      longitude: parseFloat(row['longitude'] || row['lng'] || '0') || 0,
      hoursListed: !!(row['hours'] || row['opening_hours']),
    });
  }

  return results;
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}
