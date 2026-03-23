import { useState } from 'react';
import { Plus, Trash2, Edit2, X, Save, MessageSquare } from 'lucide-react';
import type { OutreachTemplate } from './LeadPipeline';

const STORAGE_KEY = 'outreach-templates';

const DEFAULT_TEMPLATES: OutreachTemplate[] = [
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
    return stored ? JSON.parse(stored) : DEFAULT_TEMPLATES;
  } catch { return DEFAULT_TEMPLATES; }
}

function saveTemplates(templates: OutreachTemplate[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

interface OutreachTemplatesProps {
  onClose: () => void;
}

export function OutreachTemplates({ onClose }: OutreachTemplatesProps) {
  const [templates, setTemplates] = useState<OutreachTemplate[]>(loadTemplates);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<OutreachTemplate | null>(null);

  const handleSave = () => {
    if (!editForm) return;
    const updated = templates.map(t => t.id === editForm.id ? editForm : t);
    if (!templates.find(t => t.id === editForm.id)) {
      updated.push(editForm);
    }
    setTemplates(updated);
    saveTemplates(updated);
    setEditing(null);
    setEditForm(null);
  };

  const handleDelete = (id: string) => {
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    saveTemplates(updated);
  };

  const handleAdd = () => {
    const newTemplate: OutreachTemplate = {
      id: `custom-${Date.now()}`,
      name: 'New Template',
      subject: '{business_name} — ',
      body: 'Hi there,\n\n\n\nBest,\n{your_name}',
    };
    setEditForm(newTemplate);
    setEditing(newTemplate.id);
  };

  const handleReset = () => {
    setTemplates(DEFAULT_TEMPLATES);
    saveTemplates(DEFAULT_TEMPLATES);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-purple-600" />
          <h2 className="text-sm font-semibold text-slate-900">Outreach Templates</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="text-xs text-slate-400 hover:text-slate-600">Reset to defaults</button>
          <button onClick={handleAdd} className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700">
            <Plus className="h-3 w-3" /> Add
          </button>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded"><X className="h-4 w-4 text-slate-500" /></button>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        Variables: <code className="bg-slate-100 px-1 rounded">{'{business_name}'}</code> <code className="bg-slate-100 px-1 rounded">{'{gaps}'}</code> <code className="bg-slate-100 px-1 rounded">{'{reviews}'}</code> <code className="bg-slate-100 px-1 rounded">{'{rating}'}</code> <code className="bg-slate-100 px-1 rounded">{'{email}'}</code> <code className="bg-slate-100 px-1 rounded">{'{phone}'}</code> <code className="bg-slate-100 px-1 rounded">{'{website}'}</code> <code className="bg-slate-100 px-1 rounded">{'{platform}'}</code> <code className="bg-slate-100 px-1 rounded">{'{gap_count}'}</code> <code className="bg-slate-100 px-1 rounded">{'{your_name}'}</code>
      </p>

      {editing && editForm ? (
        <div className="border border-purple-200 rounded-lg p-4 space-y-3 bg-purple-50/30">
          <input
            value={editForm.name}
            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
            placeholder="Template name"
            className="w-full px-3 py-1.5 border rounded-lg text-sm"
          />
          <input
            value={editForm.subject}
            onChange={e => setEditForm({ ...editForm, subject: e.target.value })}
            placeholder="Email subject"
            className="w-full px-3 py-1.5 border rounded-lg text-sm"
          />
          <textarea
            value={editForm.body}
            onChange={e => setEditForm({ ...editForm, body: e.target.value })}
            rows={8}
            className="w-full px-3 py-2 border rounded-lg text-sm font-mono resize-none"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => { setEditing(null); setEditForm(null); }} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={handleSave} className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 inline-flex items-center gap-1"><Save className="h-3 w-3" /> Save</button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {templates.map(t => (
            <div key={t.id} className="flex items-center justify-between px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">
              <div>
                <p className="text-sm font-medium text-slate-700">{t.name}</p>
                <p className="text-xs text-slate-400 truncate max-w-md">{t.subject}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { setEditing(t.id); setEditForm(t); }} className="p-1.5 hover:bg-slate-200 rounded"><Edit2 className="h-3.5 w-3.5 text-slate-500" /></button>
                <button onClick={() => handleDelete(t.id)} className="p-1.5 hover:bg-red-100 rounded"><Trash2 className="h-3.5 w-3.5 text-red-400" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
