import type { LeadResult, ScoringConfig } from './types.js';

const BATCH_SIZE = 20;

interface AIScoredLead {
  placeId: string;
  aiAdjustment: number; // -20 to +20
  summary: string;
}

function buildPrompt(leads: LeadResult[]): string {
  const leadsJson = leads.map(l => ({
    id: l.placeId,
    name: l.name,
    address: l.address,
    website: l.website || 'NONE',
    phone: l.phone || 'NONE',
    rating: l.rating,
    reviews: l.reviewCount,
    categories: l.categories.join(', '),
    hoursListed: l.hoursListed,
    currentScore: l.score,
  }));

  return `You are a lead scoring assistant. Analyze these business leads and for each one provide:
1. An adjustment to their current score (-20 to +20 points) based on opportunity signals
2. A 1-sentence summary of why this is or isn't a good lead

Consider: businesses without websites need web services, low review counts suggest newer/smaller businesses, poor ratings suggest they need help, category specificity suggests niche opportunities.

Respond with ONLY a JSON array, no markdown:
[{"id": "placeId", "adj": 5, "summary": "Small practice, no web presence — high opportunity"}]

Leads to score:
${JSON.stringify(leadsJson)}`;
}

function parseAIResponse(text: string): AIScoredLead[] {
  // Strip markdown code fences if present
  const cleaned = text.replace(/```json?\s*/g, '').replace(/```/g, '').trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item: any) => ({
      placeId: item.id || item.placeId || '',
      aiAdjustment: Math.max(-20, Math.min(20, Number(item.adj || item.adjustment || 0))),
      summary: String(item.summary || ''),
    }));
  } catch {
    return [];
  }
}

async function callOpenAI(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
  const data = await res.json() as any;
  return data.choices?.[0]?.message?.content || '';
}

async function callAnthropic(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic error: ${res.status}`);
  const data = await res.json() as any;
  return data.content?.[0]?.text || '';
}

async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
  const data = await res.json() as any;
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callProvider(prompt: string, provider: string, apiKey: string): Promise<string> {
  switch (provider) {
    case 'openai': return callOpenAI(prompt, apiKey);
    case 'anthropic': return callAnthropic(prompt, apiKey);
    case 'gemini': return callGemini(prompt, apiKey);
    default: throw new Error(`Unknown AI provider: ${provider}`);
  }
}

export async function aiScoreLeads(
  leads: LeadResult[],
  config: ScoringConfig,
): Promise<LeadResult[]> {
  if (!config.useAI || config.aiProvider === 'none' || !config.aiApiKey) {
    return leads;
  }

  const scored = [...leads];
  const aiMap = new Map<string, AIScoredLead>();

  // Process in batches
  for (let i = 0; i < leads.length; i += BATCH_SIZE) {
    const batch = leads.slice(i, i + BATCH_SIZE);
    try {
      const prompt = buildPrompt(batch);
      const response = await callProvider(prompt, config.aiProvider, config.aiApiKey);
      const parsed = parseAIResponse(response);
      for (const item of parsed) {
        aiMap.set(item.placeId, item);
      }
    } catch (err: any) {
      console.error(`AI scoring batch ${i} failed:`, err.message);
      // Continue with remaining batches
    }
  }

  // Apply AI adjustments
  for (let i = 0; i < scored.length; i++) {
    const ai = aiMap.get(scored[i].placeId);
    if (ai) {
      const baseScore = scored[i].score ?? 0;
      scored[i] = {
        ...scored[i],
        score: Math.max(0, Math.min(100, baseScore + ai.aiAdjustment)),
        aiSummary: ai.summary,
      };
    }
  }

  return scored;
}
