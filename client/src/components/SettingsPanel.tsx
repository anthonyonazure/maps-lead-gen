import { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { validateApiKey, checkScraperStatus } from '../lib/api';

interface SettingsPanelProps {
  onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gmaps-api-key') || '');
  const [keyStatus, setKeyStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [keyError, setKeyError] = useState('');
  const [scraperAvailable, setScraperAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    checkScraperStatus().then(setScraperAvailable).catch(() => setScraperAvailable(false));
  }, []);

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      localStorage.removeItem('gmaps-api-key');
      setKeyStatus('idle');
      return;
    }

    setKeyStatus('checking');
    const result = await validateApiKey(apiKey.trim());
    if (result.valid) {
      localStorage.setItem('gmaps-api-key', apiKey.trim());
      setKeyStatus('valid');
    } else {
      setKeyStatus('invalid');
      setKeyError(result.error || 'Invalid key');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Settings</h2>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
          <X className="h-5 w-5 text-slate-500" />
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">Google Places API Key</label>
        <div className="flex gap-2">
          <input
            type="password"
            value={apiKey}
            onChange={e => { setApiKey(e.target.value); setKeyStatus('idle'); }}
            placeholder="AIza..."
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button
            onClick={handleSaveKey}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {keyStatus === 'checking' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
          </button>
        </div>
        {keyStatus === 'valid' && (
          <p className="text-sm text-green-600 flex items-center gap-1"><Check className="h-4 w-4" /> API key valid</p>
        )}
        {keyStatus === 'invalid' && (
          <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {keyError}</p>
        )}
        <p className="text-xs text-slate-400">
          Enable "Places API (New)" and "Geocoding API" in your Google Cloud Console.
          $200/mo free credit covers ~6,250 searches.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">Scraper (Docker)</label>
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
