import { useState, useRef, useEffect } from 'react';
import { X, MapPin, ChevronRight } from 'lucide-react';
import { US_STATES, STATE_CITIES } from '../lib/us-cities';

interface LocationInputProps {
  values: string[];
  onChange: (values: string[]) => void;
}

interface Suggestion {
  label: string;
  type: 'state' | 'city';
  state?: string;
  cityCount?: number;
}

export function LocationInput({ values, onChange }: LocationInputProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }
    const lower = input.toLowerCase();
    const matches: Suggestion[] = [];

    // Match states first — show them with city count
    for (const state of US_STATES) {
      if (state.toLowerCase().includes(lower)) {
        const cities = STATE_CITIES[state];
        matches.push({ label: state, type: 'state', cityCount: cities?.length || 0 });
      }
    }

    setSuggestions(matches.slice(0, 12));
    setHighlightIndex(-1);
  }, [input]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function addValue(val: string) {
    // Auto-detect state names and expand to cities
    const matchedState = US_STATES.find(s => s.toLowerCase() === val.toLowerCase());
    if (matchedState) {
      addState(matchedState);
      return;
    }
    if (!values.some(v => v.toLowerCase() === val.toLowerCase())) {
      onChange([...values, val]);
    }
    setInput('');
    setOpen(false);
    inputRef.current?.focus();
  }

  function addState(state: string) {
    // Add all cities in the state with state abbreviation
    const cities = STATE_CITIES[state] || [];
    const stateAbbr = getStateAbbr(state);
    const newLocations = cities.map(c => `${c}, ${stateAbbr}`);
    const existing = new Set(values.map(v => v.toLowerCase()));
    const toAdd = newLocations.filter(l => !existing.has(l.toLowerCase()));
    onChange([...values, ...toAdd]);
    setInput('');
    setOpen(false);
    inputRef.current?.focus();
  }

  function removeValue(val: string) {
    onChange(values.filter(v => v !== val));
  }

  function clearAll() {
    onChange([]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && suggestions[highlightIndex]) {
        const s = suggestions[highlightIndex];
        if (s.type === 'state') {
          addState(s.label);
        } else {
          addValue(s.label);
        }
      } else if (input.trim()) {
        // Check if it's a state name (case-insensitive)
        const matchedState = US_STATES.find(s => s.toLowerCase() === input.trim().toLowerCase());
        if (matchedState) {
          addState(matchedState);
        } else {
          addValue(input.trim());
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'Backspace' && !input && values.length > 0) {
      removeValue(values[values.length - 1]);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        className="flex flex-wrap gap-1 px-2 py-1.5 border border-slate-300 rounded-lg text-sm min-h-[38px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {values.length > 5 ? (
          <>
            {values.slice(0, 3).map(v => (
              <span key={v} className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">
                <MapPin className="h-2.5 w-2.5" />
                {v}
                <button type="button" onClick={(e) => { e.stopPropagation(); removeValue(v); }} className="hover:text-emerald-600">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-xs font-medium">
              +{values.length - 3} more
            </span>
            <button type="button" onClick={(e) => { e.stopPropagation(); clearAll(); }} className="text-xs text-slate-400 hover:text-red-500 ml-1">
              Clear all
            </button>
          </>
        ) : (
          values.map(v => (
            <span key={v} className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">
              <MapPin className="h-2.5 w-2.5" />
              {v}
              <button type="button" onClick={(e) => { e.stopPropagation(); removeValue(v); }} className="hover:text-emerald-600">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))
        )}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => { setInput(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={values.length === 0 ? 'Type a state, city, or zip...' : 'Add more...'}
          className="flex-1 min-w-[150px] outline-none bg-transparent py-0.5 text-sm"
        />
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {suggestions.map((s, i) => (
            <button
              key={s.label}
              type="button"
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-emerald-50 cursor-pointer ${i === highlightIndex ? 'bg-emerald-50' : ''}`}
              onMouseEnter={() => setHighlightIndex(i)}
              onClick={() => s.type === 'state' ? addState(s.label) : addValue(s.label)}
            >
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="flex-1">{s.label}</span>
              {s.type === 'state' && (
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-0.5">
                  Add {s.cityCount} cities <ChevronRight className="h-3 w-3" />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function getStateAbbr(state: string): string {
  const abbrs: Record<string, string> = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
    'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
    'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
    'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
    'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
    'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
    'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
    'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
  };
  return abbrs[state] || state;
}
