// Persistence for lead status and notes. Kept out of LeadPipeline.tsx so that
// file exports only its component (react-refresh/only-export-components).
import type { LeadStatus } from './types';

export interface OutreachTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

interface PipelineEntry {
  status: LeadStatus;
  notes: string;
}

const STORAGE_KEY = 'lead-pipeline';

export function loadPipelineData(): Record<string, PipelineEntry> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Record<string, PipelineEntry>; }
  catch { return {}; }
}

export function savePipelineData(data: Record<string, PipelineEntry>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getLeadStatus(placeId: string): LeadStatus {
  const data = loadPipelineData();
  return data[placeId]?.status || 'new';
}

export function getLeadNotes(placeId: string): string {
  const data = loadPipelineData();
  return data[placeId]?.notes || '';
}
