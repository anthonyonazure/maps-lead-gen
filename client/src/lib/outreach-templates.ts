// Default outreach templates and their storage. Kept out of
// OutreachTemplates.tsx so that file exports only its component
// (react-refresh/only-export-components).
import type { OutreachTemplate } from './lead-pipeline';

const STORAGE_KEY = 'outreach-templates';

export const DEFAULT_TEMPLATES: OutreachTemplate[] = [
  {
    id: 'no-website',
    name: 'No Website',
    subject: 'Quick question about {business_name}',
    body: `Hi there,

I was looking for {business_name} online and noticed you don't have a website yet. In today's market, about 80% of customers check online before visiting a business — you might be missing out on a lot of people who are searching for exactly what you offer.

I help local businesses get online with a professional website that shows up on Google, works great on phones, and includes online booking so customers can schedule with you 24/7.

Would you be open to a quick 10-minute call this week? I can show you what it would look like for your business — no pressure.

Best,
{your_name}`,
  },
  {
    id: 'bad-website',
    name: 'Outdated Website',
    subject: 'Noticed something about {business_name}\'s website',
    body: `Hi there,

I came across {business_name} and checked out your website. I noticed a few things that might be costing you customers:

{gaps}

These are common issues that are easy to fix. I help local businesses upgrade their online presence with modern, fast, mobile-friendly websites that actually convert visitors into customers.

Would you be interested in a free website audit? I can put together a quick report showing what's working and what could be improved — takes about 5 minutes of your time.

Best,
{your_name}`,
  },
  {
    id: 'few-reviews',
    name: 'Few Reviews',
    subject: 'Growing {business_name}\'s online reputation',
    body: `Hi there,

I was looking at {business_name} on Google Maps and noticed you have {reviews} reviews. Most of your competitors in the area have 50-100+, which means they're showing up higher in search results and getting more of the customers searching for your services.

The good news: getting more reviews isn't hard — most businesses just don't have a system for it. I help local businesses set up an automated review request system that gets 3-5x more reviews without any extra work from your team.

Would a quick call make sense? I can show you exactly how it works.

Best,
{your_name}`,
  },
  {
    id: 'full-pitch',
    name: 'Full GHL Pitch',
    subject: 'Helping {business_name} get more customers online',
    body: `Hi there,

I've been looking at local businesses in your area and {business_name} caught my eye. Based on your online presence, I see {gap_count} opportunities to help you attract more customers:

{gaps}

I work with local businesses to build their complete online presence — professional website, Google optimization, automated review requests, and online booking. Everything runs on one platform so you're not juggling 5 different tools.

My clients typically see more website traffic, more reviews, and more bookings within the first 30 days.

Worth a quick conversation? I can put together a free proposal specific to {business_name}.

Best,
{your_name}`,
  },
];

export function loadTemplates(): OutreachTemplate[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as OutreachTemplate[]) : DEFAULT_TEMPLATES;
  } catch { return DEFAULT_TEMPLATES; }
}

export function saveTemplates(templates: OutreachTemplate[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}
