import { useState } from 'react';
import { X, Save, Mail, Phone, Globe, MessageSquare } from 'lucide-react';
import type { LeadResult } from '../lib/types';

const STATUSES = [
  { value: 'new', label: 'New', color: 'bg-slate-100 text-slate-700' },
  { value: 'contacted', label: 'Contacted', color: 'bg-blue-100 text-blue-700' },
  { value: 'replied', label: 'Replied', color: 'bg-amber-100 text-amber-700' },
  { value: 'meeting', label: 'Meeting', color: 'bg-purple-100 text-purple-700' },
  { value: 'won', label: 'Won', color: 'bg-green-100 text-green-700' },
  { value: 'lost', label: 'Lost', color: 'bg-red-100 text-red-700' },
] as const;

interface LeadPipelineProps {
  lead: LeadResult;
  onUpdate: (lead: LeadResult) => void;
  onClose: () => void;
  outreachTemplates: OutreachTemplate[];
}

export interface OutreachTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

const STORAGE_KEY = 'lead-pipeline';

function loadPipelineData(): Record<string, { status: string; notes: string }> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function savePipelineData(data: Record<string, { status: string; notes: string }>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getLeadStatus(placeId: string): string {
  const data = loadPipelineData();
  return data[placeId]?.status || 'new';
}

export function getLeadNotes(placeId: string): string {
  const data = loadPipelineData();
  return data[placeId]?.notes || '';
}

function fillTemplate(template: string, lead: LeadResult): string {
  const gaps: string[] = [];
  if (!lead.website) gaps.push('no website');
  if (!lead.phone) gaps.push('no phone listed');
  if (lead.reviewCount < 10) gaps.push(`only ${lead.reviewCount} reviews`);
  if (lead.rating && lead.rating < 4) gaps.push(`${lead.rating} star rating`);
  if (lead.websiteAnalysis && !lead.websiteAnalysis.hasMobileViewport) gaps.push('not mobile-friendly');
  if (lead.websiteAnalysis && !lead.websiteAnalysis.hasSSL) gaps.push('no SSL certificate');
  if (lead.websiteAnalysis && lead.websiteAnalysis.loadTimeMs && lead.websiteAnalysis.loadTimeMs > 3000) gaps.push('slow website');

  return template
    .replace(/\{business_name\}/g, lead.name)
    .replace(/\{address\}/g, lead.address)
    .replace(/\{phone\}/g, lead.phone || 'N/A')
    .replace(/\{website\}/g, lead.website || 'none')
    .replace(/\{rating\}/g, lead.rating?.toFixed(1) || 'N/A')
    .replace(/\{reviews\}/g, String(lead.reviewCount))
    .replace(/\{email\}/g, lead.contactEmail || '')
    .replace(/\{gaps\}/g, gaps.join(', ') || 'none identified')
    .replace(/\{gap_count\}/g, String(gaps.length))
    .replace(/\{platform\}/g, lead.websiteAnalysis?.platform || 'unknown');
}

export function LeadPipeline({ lead, onUpdate, onClose, outreachTemplates }: LeadPipelineProps) {
  const pipelineData = loadPipelineData();
  const existing = pipelineData[lead.placeId] || { status: 'new', notes: '' };
  const [status, setStatus] = useState(existing.status);
  const [notes, setNotes] = useState(existing.notes);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');

  const handleSave = () => {
    const data = loadPipelineData();
    data[lead.placeId] = { status, notes };
    savePipelineData(data);
    onUpdate({ ...lead, leadStatus: status as any, notes });
  };

  const handleGenerateOutreach = () => {
    const template = outreachTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;
    setGeneratedMessage(fillTemplate(template.body, lead));
  };

  const gaps: string[] = [];
  if (!lead.website) gaps.push('No website');
  if (lead.websiteAnalysis && !lead.websiteAnalysis.hasSSL) gaps.push('No SSL');
  if (lead.websiteAnalysis && !lead.websiteAnalysis.hasMobileViewport) gaps.push('Not mobile-friendly');
  if (lead.websiteAnalysis && lead.websiteAnalysis.loadTimeMs && lead.websiteAnalysis.loadTimeMs > 3000) gaps.push('Slow site');
  if (lead.websiteAnalysis && !lead.websiteAnalysis.hasBooking) gaps.push('No online booking');
  if (lead.reviewCount < 10) gaps.push(`Only ${lead.reviewCount} reviews`);
  if (lead.rating && lead.rating < 4) gaps.push(`${lead.rating} star rating`);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{lead.name}</h2>
              <p className="text-sm text-slate-500">{lead.address}</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded"><X className="h-5 w-5" /></button>
          </div>

          {/* Contact info */}
          <div className="flex flex-wrap gap-3 text-sm">
            {lead.phone && <span className="flex items-center gap-1 text-slate-700"><Phone className="h-3.5 w-3.5" />{lead.phone}</span>}
            {lead.contactEmail && <span className="flex items-center gap-1 text-blue-600"><Mail className="h-3.5 w-3.5" />{lead.contactEmail}</span>}
            {lead.website && <a href={lead.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline"><Globe className="h-3.5 w-3.5" />{lead.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</a>}
          </div>

          {/* Gaps / opportunities */}
          {gaps.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1.5">Opportunities ({gaps.length})</p>
              <div className="flex flex-wrap gap-1">
                {gaps.map(g => (
                  <span key={g} className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded-full border border-orange-200 font-medium">{g}</span>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1.5">Lead Status</p>
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map(s => (
                <button
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${status === s.value ? s.color + ' border-current ring-2 ring-offset-1 ring-current/20' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1.5">Notes</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add notes about this lead..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Outreach */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-purple-500" />
              <p className="text-sm font-medium text-slate-700">Generate Outreach</p>
            </div>
            <div className="flex gap-2 mb-2">
              <select
                value={selectedTemplate}
                onChange={e => setSelectedTemplate(e.target.value)}
                className="flex-1 px-2 py-1.5 border border-slate-300 rounded-lg text-sm"
              >
                <option value="">Select a template...</option>
                {outreachTemplates.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <button
                onClick={handleGenerateOutreach}
                disabled={!selectedTemplate}
                className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                Generate
              </button>
            </div>
            {generatedMessage && (
              <div className="relative">
                <textarea
                  value={generatedMessage}
                  onChange={e => setGeneratedMessage(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none font-mono"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(generatedMessage)}
                  className="absolute top-2 right-2 px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded hover:bg-slate-200"
                >
                  Copy
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={() => { handleSave(); onClose(); }} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 inline-flex items-center gap-1">
              <Save className="h-3.5 w-3.5" /> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
