import { useState } from 'react';
import { Plus, Trash2, Edit2, X, Save, MessageSquare } from 'lucide-react';
import type { OutreachTemplate } from '../lib/lead-pipeline';
import { DEFAULT_TEMPLATES, loadTemplates, saveTemplates } from '../lib/outreach-templates';

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
