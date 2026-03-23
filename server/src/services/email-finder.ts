export interface EmailResult {
  email: string | null;
  confidence: number;
  source: string;
}

/**
 * Try to find a contact email for a business using Hunter.io API.
 * Falls back to constructing common patterns from the domain.
 */
export async function findEmail(
  website: string | null,
  businessName: string,
  apiKey: string,
): Promise<EmailResult> {
  if (!website) {
    return { email: null, confidence: 0, source: 'none' };
  }

  // Extract domain from URL
  let domain: string;
  try {
    domain = new URL(website).hostname.replace(/^www\./, '');
  } catch {
    return { email: null, confidence: 0, source: 'invalid_url' };
  }

  // Skip generic hosting domains
  const genericDomains = ['facebook.com', 'instagram.com', 'yelp.com', 'google.com', 'wix.com', 'squarespace.com', 'godaddy.com'];
  if (genericDomains.some(d => domain.includes(d))) {
    return { email: null, confidence: 0, source: 'social_profile' };
  }

  try {
    // Hunter.io domain search
    const res = await fetch(`https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${apiKey}&limit=1`);
    if (!res.ok) {
      if (res.status === 401) throw new Error('Invalid Hunter.io API key');
      throw new Error(`Hunter.io error: ${res.status}`);
    }

    const data = await res.json() as any;
    const emails = data?.data?.emails || [];

    if (emails.length > 0) {
      return {
        email: emails[0].value,
        confidence: emails[0].confidence || 50,
        source: 'hunter.io',
      };
    }

    // No results from Hunter — try common patterns
    const patterns = ['info', 'contact', 'hello', 'admin', 'office'];
    return {
      email: `${patterns[0]}@${domain}`,
      confidence: 15,
      source: 'pattern_guess',
    };
  } catch (err: any) {
    if (err.message.includes('Invalid Hunter.io')) throw err;
    return { email: null, confidence: 0, source: 'error' };
  }
}

export async function batchFindEmails(
  leads: { placeId: string; website: string | null; name: string }[],
  apiKey: string,
  concurrency: number = 3,
): Promise<Map<string, EmailResult>> {
  const results = new Map<string, EmailResult>();

  for (let i = 0; i < leads.length; i += concurrency) {
    const batch = leads.slice(i, i + concurrency);
    const found = await Promise.all(
      batch.map(l => findEmail(l.website, l.name, apiKey).then(r => ({ placeId: l.placeId, result: r })))
    );
    for (const { placeId, result } of found) {
      results.set(placeId, result);
    }
    // Rate limit: Hunter.io allows ~15 req/sec on paid plans
    if (i + concurrency < leads.length) {
      await new Promise(r => setTimeout(r, 300));
    }
  }

  return results;
}
