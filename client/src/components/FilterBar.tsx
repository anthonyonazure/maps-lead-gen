import { X } from 'lucide-react';
import type { Filters } from '../lib/types';
import { DEFAULT_FILTERS } from '../lib/types';

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const hasActive = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-700">Filters</span>
        {hasActive && (
          <button
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-4">
        <FilterSelect
          label="Website"
          value={filters.hasWebsite}
          onChange={v => onChange({ ...filters, hasWebsite: v as Filters['hasWebsite'] })}
          options={[
            { value: 'any', label: 'Any' },
            { value: 'yes', label: 'Has website' },
            { value: 'no', label: 'No website' },
          ]}
        />
        <FilterSelect
          label="Phone"
          value={filters.hasPhone}
          onChange={v => onChange({ ...filters, hasPhone: v as Filters['hasPhone'] })}
          options={[
            { value: 'any', label: 'Any' },
            { value: 'yes', label: 'Has phone' },
            { value: 'no', label: 'No phone' },
          ]}
        />
        <NumberInput
          label="Min reviews"
          value={filters.minReviews}
          onChange={v => onChange({ ...filters, minReviews: v })}
        />
        <NumberInput
          label="Max reviews"
          value={filters.maxReviews}
          onChange={v => onChange({ ...filters, maxReviews: v })}
        />
        <NumberInput
          label="Min rating"
          value={filters.minRating}
          onChange={v => onChange({ ...filters, minRating: v })}
          step={0.5}
          max={5}
        />
        <NumberInput
          label="Max rating"
          value={filters.maxRating}
          onChange={v => onChange({ ...filters, maxRating: v })}
          step={0.5}
          max={5}
        />
        <div>
          <label className="block text-xs text-slate-500 mb-1">Category</label>
          <input
            type="text"
            value={filters.categoryFilter}
            onChange={e => onChange({ ...filters, categoryFilter: e.target.value })}
            placeholder="e.g., health"
            className="px-2 py-1 border border-slate-300 rounded text-sm w-28"
          />
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="px-2 py-1 border border-slate-300 rounded text-sm"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function NumberInput({ label, value, onChange, step = 1, max }: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  step?: number;
  max?: number;
}) {
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1">{label}</label>
      <input
        type="number"
        value={value ?? ''}
        onChange={e => onChange(e.target.value ? Number(e.target.value) : null)}
        placeholder="—"
        step={step}
        min={0}
        max={max}
        className="px-2 py-1 border border-slate-300 rounded text-sm w-20"
      />
    </div>
  );
}
