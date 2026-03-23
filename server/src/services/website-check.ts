import type { LeadResult } from '../providers/types.js';

export interface WebsiteAnalysis {
  url: string;
  reachable: boolean;
  hasSSL: boolean;
  loadTimeMs: number | null;
  platform: string | null;
  hasMobileViewport: boolean;
  hasContactForm: boolean;
  hasBooking: boolean;
  techScore: number; // 0-100, higher = better site
}

const PLATFORM_SIGNATURES: [string, RegExp][] = [
  ['WordPress', /wp-content|wordpress/i],
  ['Wix', /wix\.com|wixsite/i],
  ['Squarespace', /squarespace/i],
  ['GoDaddy', /godaddy|secureserver/i],
  ['Weebly', /weebly/i],
  ['Shopify', /shopify/i],
  ['Webflow', /webflow/i],
];

const BOOKING_PATTERNS = /book|appointment|schedule|calendly|acuity|setmore|vagaro|mindbody|jane\.app|intakeq/i;
const CONTACT_FORM_PATTERNS = /contact.*form|form.*contact|<form|type="submit"|action=.*mailto|contact-form/i;

export async function checkWebsite(url: string): Promise<WebsiteAnalysis> {
  const result: WebsiteAnalysis = {
    url,
    reachable: false,
    hasSSL: url.startsWith('https'),
    loadTimeMs: null,
    platform: null,
    hasMobileViewport: false,
    hasContactForm: false,
    hasBooking: false,
    techScore: 0,
  };

  try {
    const start = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LeadGenBot/1.0)' },
      redirect: 'follow',
    });
    clearTimeout(timeout);

    result.loadTimeMs = Date.now() - start;
    result.reachable = res.ok;

    if (!res.ok) return result;

    // Check final URL for SSL (may have redirected)
    result.hasSSL = res.url.startsWith('https');

    const html = await res.text();

    // Platform detection
    for (const [name, pattern] of PLATFORM_SIGNATURES) {
      if (pattern.test(html) || pattern.test(res.url)) {
        result.platform = name;
        break;
      }
    }

    // Mobile viewport
    result.hasMobileViewport = /viewport.*width.*device-width/i.test(html);

    // Contact form
    result.hasContactForm = CONTACT_FORM_PATTERNS.test(html);

    // Booking/scheduling
    result.hasBooking = BOOKING_PATTERNS.test(html);

    // Calculate tech score (lower = worse site = better lead)
    let score = 100;
    if (!result.hasSSL) score -= 25;
    if (result.loadTimeMs > 3000) score -= 20;
    else if (result.loadTimeMs > 2000) score -= 10;
    if (!result.hasMobileViewport) score -= 25;
    if (!result.hasContactForm) score -= 10;
    if (!result.hasBooking) score -= 10;
    // Older platforms tend to mean the site is neglected
    if (result.platform === 'GoDaddy' || result.platform === 'Weebly') score -= 10;
    result.techScore = Math.max(0, score);
  } catch {
    // Site unreachable or errored
    result.reachable = false;
  }

  return result;
}

export async function batchCheckWebsites(leads: LeadResult[], concurrency: number = 5): Promise<Map<string, WebsiteAnalysis>> {
  const results = new Map<string, WebsiteAnalysis>();
  const leadsWithSites = leads.filter(l => l.website);

  for (let i = 0; i < leadsWithSites.length; i += concurrency) {
    const batch = leadsWithSites.slice(i, i + concurrency);
    const checks = await Promise.all(
      batch.map(l => checkWebsite(l.website!).then(r => ({ placeId: l.placeId, result: r })))
    );
    for (const { placeId, result } of checks) {
      results.set(placeId, result);
    }
  }

  return results;
}
