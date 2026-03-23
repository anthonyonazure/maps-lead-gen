import { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { validateKey, checkScraperStatus } from '../lib/api';

interface SettingsPanelProps {
  onClose: () => void;
}

const API_KEYS = [
  { id: 'gmaps-api-key', provider: 'google', label: 'Google Places API', link: 'https://console.cloud.google.com/apis/credentials', hint: 'Enable Places API (New) + Geocoding API. $200/mo free credit.' },
  { id: 'serpapi-key', provider: 'serpapi', label: 'SerpAPI', link: 'https://serpapi.com/manage-api-key', hint: '$50/mo for 5000 searches, or pay-as-you-go.' },
  { id: 'openai-key', provider: 'openai', label: 'OpenAI (for AI scoring)', link: 'https://platform.openai.com/api-keys', hint: 'Uses GPT-4o-mini. ~$0.15 per 1000 leads scored.' },
  { id: 'anthropic-key', provider: 'anthropic', label: 'Anthropic / Claude (for AI scoring)', link: 'https://console.anthropic.com/settings/keys', hint: 'Uses Claude Haiku. ~$0.25 per 1000 leads scored.' },
  { id: 'gemini-key', provider: 'gemini', label: 'Google Gemini (for AI scoring)', link: 'https://aistudio.google.com/apikey', hint: 'Uses Gemini 2.0 Flash. ~$0.10 per 1000 leads scored.' },
];

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [keys, setKeys] = useState<Record<string, string>>(() => {
    const stored: Record<string, string> = {};
    API_KEYS.forEach(k => { stored[k.id] = localStorage.getItem(k.id) || ''; });
    return stored;
  });
  const [statuses, setStatuses] = useState<Record<string, 'idle' | 'checking' | 'valid' | 'invalid'>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [scraperAvailable, setScraperAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    checkScraperStatus().then(setScraperAvailable).catch(() => setScraperAvailable(false));
  }, []);

  const handleSave = async (keyConfig: typeof API_KEYS[0]) => {
    const value = keys[keyConfig.id]?.trim();
    if (!value) {
      localStorage.removeItem(keyConfig.id);
      setStatuses(s => ({ ...s, [keyConfig.id]: 'idle' }));
      return;
    }

    setStatuses(s => ({ ...s, [keyConfig.id]: 'checking' }));
    const result = await validateKey(keyConfig.provider, value);
    if (result.valid) {
      localStorage.setItem(keyConfig.id, value);
      setStatuses(s => ({ ...s, [keyConfig.id]: 'valid' }));
    } else {
      setStatuses(s => ({ ...s, [keyConfig.id]: 'invalid' }));
      setErrors(e => ({ ...e, [keyConfig.id]: result.error || 'Invalid key' }));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Settings — API Keys</h2>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
          <X className="h-5 w-5 text-slate-500" />
        </button>
      </div>

      {API_KEYS.map(keyConfig => {
        const status = statuses[keyConfig.id] || 'idle';
        return (
          <div key={keyConfig.id} className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700">{keyConfig.label}</label>
              <a href={keyConfig.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline inline-flex items-center gap-0.5">
                Get key <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="flex gap-2">
              <input
                type="password"
                value={keys[keyConfig.id]}
                onChange={e => { setKeys(k => ({ ...k, [keyConfig.id]: e.target.value })); setStatuses(s => ({ ...s, [keyConfig.id]: 'idle' })); }}
                placeholder="Paste key here..."
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <button
                onClick={() => handleSave(keyConfig)}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                {status === 'checking' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
              </button>
            </div>
            {status === 'valid' && <p className="text-xs text-green-600 flex items-center gap-1"><Check className="h-3 w-3" /> Valid</p>}
            {status === 'invalid' && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors[keyConfig.id]}</p>}
            <p className="text-xs text-slate-400">{keyConfig.hint}</p>
          </div>
        );
      })}

      <div className="border-t border-slate-100 pt-4 space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Scraper (Docker)</label>
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${scraperAvailable ? 'bg-green-500' : 'bg-red-400'}`} />
          <span className="text-sm text-slate-600">
            {scraperAvailable === null ? 'Checking...' : scraperAvailable ? 'Running' : 'Not running'}
          </span>
        </div>
        {!scraperAvailable && scraperAvailable !== null && (
          <p className="text-xs text-slate-400">
            Start with: <code className="bg-slate-100 px-1 rounded">docker run -d -p 8080:8080 gosom/google-maps-scraper</code>
          </p>
        )}
      </div>
    </div>
  );
}
