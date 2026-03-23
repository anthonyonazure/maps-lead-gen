import { Sliders, Sparkles, Zap } from 'lucide-react';
import type { ScoringConfig as ScoringConfigType } from '../lib/types';

interface ScoringConfigProps {
  config: ScoringConfigType;
  onChange: (config: ScoringConfigType) => void;
  onScore: () => void;
  scoring: boolean;
  hasResults: boolean;
}

const AI_PROVIDERS = [
  { value: 'none', label: 'Rule-based only (free)', link: '' },
  { value: 'openai', label: 'OpenAI (GPT-4o-mini)', link: 'https://platform.openai.com/api-keys' },
  { value: 'anthropic', label: 'Claude (Haiku)', link: 'https://console.anthropic.com/settings/keys' },
  { value: 'gemini', label: 'Gemini (Flash)', link: 'https://aistudio.google.com/apikey' },
] as const;

function WeightSlider({ label, value, onChange, description }: {
  label: string; value: number; onChange: (v: number) => void; description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-32 shrink-0">
        <span className="text-xs font-medium text-slate-700">{label}</span>
        <p className="text-[10px] text-slate-400 leading-tight">{description}</p>
      </div>
      <input
        type="range"
        min={0}
        max={50}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 accent-blue-600"
      />
      <span className="text-xs font-mono text-slate-600 w-6 text-right">{value}</span>
    </div>
  );
}

export function ScoringConfig({ config, onChange, onScore, scoring, hasResults }: ScoringConfigProps) {
  const aiProvider = AI_PROVIDERS.find(p => p.value === config.aiProvider);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-semibold text-slate-900">Lead Scoring</span>
        </div>
        <button
          onClick={onScore}
          disabled={!hasResults || scoring}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {scoring ? (
            <><div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Scoring...</>
          ) : (
            <><Zap className="h-3.5 w-3.5" /> Score Leads</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <WeightSlider label="No website" value={config.noWebsite} onChange={v => onChange({ ...config, noWebsite: v })} description="Needs web services" />
        <WeightSlider label="No phone" value={config.noPhone} onChange={v => onChange({ ...config, noPhone: v })} description="Incomplete profile" />
        <WeightSlider label="Low reviews" value={config.lowReviews} onChange={v => onChange({ ...config, lowReviews: v })} description={`Under ${config.lowReviewThreshold} reviews`} />
        <WeightSlider label="Low rating" value={config.lowRating} onChange={v => onChange({ ...config, lowRating: v })} description={`Under ${config.lowRatingThreshold} stars`} />
        <WeightSlider label="No hours" value={config.noHours} onChange={v => onChange({ ...config, noHours: v })} description="Hours not listed" />
        <WeightSlider label="Few categories" value={config.fewCategories} onChange={v => onChange({ ...config, fewCategories: v })} description="1 or fewer categories" />
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span>Low review threshold:</span>
        <input type="number" value={config.lowReviewThreshold} onChange={e => onChange({ ...config, lowReviewThreshold: Number(e.target.value) })} className="w-16 px-1.5 py-0.5 border rounded text-xs" />
        <span className="ml-3">Low rating threshold:</span>
        <input type="number" value={config.lowRatingThreshold} onChange={e => onChange({ ...config, lowRatingThreshold: Number(e.target.value) })} step={0.5} min={0} max={5} className="w-16 px-1.5 py-0.5 border rounded text-xs" />
      </div>

      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-medium text-slate-700">AI Enhancement (Optional)</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={config.aiProvider}
            onChange={e => onChange({ ...config, aiProvider: e.target.value as any, useAI: e.target.value !== 'none' })}
            className="px-2 py-1.5 border border-slate-300 rounded-lg text-sm"
          >
            {AI_PROVIDERS.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          {aiProvider?.link && (
            <a href={aiProvider.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
              Get API key
            </a>
          )}
        </div>
        {config.aiProvider !== 'none' && (
          <p className="text-xs text-slate-400 mt-2">
            AI adds a 1-line summary and adjusts scores. Set your {config.aiProvider} API key in Settings.
            Costs ~${config.aiProvider === 'gemini' ? '0.10' : config.aiProvider === 'openai' ? '0.15' : '0.25'}/1000 leads.
          </p>
        )}
      </div>
    </div>
  );
}
