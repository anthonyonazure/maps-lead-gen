import type { LeadResult, ScoringConfig } from '../providers/types.js';

export function scoreLeads(results: LeadResult[], config: ScoringConfig): LeadResult[] {
  return results.map(lead => {
    const breakdown: Record<string, number> = {};
    let total = 0;

    if (!lead.website) {
      breakdown.noWebsite = config.noWebsite;
      total += config.noWebsite;
    }

    if (!lead.phone) {
      breakdown.noPhone = config.noPhone;
      total += config.noPhone;
    }

    if (lead.reviewCount < config.lowReviewThreshold) {
      breakdown.lowReviews = config.lowReviews;
      total += config.lowReviews;
    }

    if (lead.rating !== null && lead.rating < config.lowRatingThreshold) {
      breakdown.lowRating = config.lowRating;
      total += config.lowRating;
    }

    if (!lead.hoursListed) {
      breakdown.noHours = config.noHours;
      total += config.noHours;
    }

    if (lead.categories.length <= 1) {
      breakdown.fewCategories = config.fewCategories;
      total += config.fewCategories;
    }

    // Normalize to 0-100 scale
    const maxPossible = config.noWebsite + config.noPhone + config.lowReviews
      + config.lowRating + config.noHours + config.fewCategories;
    const score = maxPossible > 0 ? Math.round((total / maxPossible) * 100) : 0;

    return {
      ...lead,
      score,
      scoreBreakdown: breakdown,
    };
  });
}
