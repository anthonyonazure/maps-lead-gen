import { useState, useRef, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';

// Common state abbreviations for quick suggestions
const STATE_SUGGESTIONS = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming',
];

interface LocationInputProps {
  values: string[];
  onChange: (values: string[]) => void;
}

export function LocationInput({ values, onChange }: LocationInputProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
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
    const matches = STATE_SUGGESTIONS.filter(s => s.toLowerCase().includes(lower)).slice(0, 8);
    setSuggestions(matches);
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
    if (!values.some(v => v.toLowerCase() === val.toLowerCase())) {
      onChange([...values, val]);
    }
    setInput('');
    setOpen(false);
    inputRef.current?.focus();
  }

  function removeValue(val: string) {
    onChange(values.filter(v => v !== val));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && suggestions[highlightIndex]) {
        addValue(suggestions[highlightIndex]);
      } else if (input.trim()) {
        addValue(input.trim());
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
        {values.map(v => (
          <span key={v} className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">
            <MapPin className="h-2.5 w-2.5" />
            {v}
            <button type="button" onClick={(e) => { e.stopPropagation(); removeValue(v); }} className="hover:text-emerald-600">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => { setInput(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={values.length === 0 ? 'e.g., Phoenix AZ, Dallas TX, or Arizona...' : 'Add more...'}
          className="flex-1 min-w-[150px] outline-none bg-transparent py-0.5 text-sm"
        />
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {suggestions.map((s, i) => {
            const alreadySelected = values.some(v => v.toLowerCase() === s.toLowerCase());
            return (
              <button
                key={s}
                type="button"
                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${
                  alreadySelected ? 'opacity-40 cursor-default' : 'hover:bg-emerald-50 cursor-pointer'
                } ${i === highlightIndex ? 'bg-emerald-50' : ''}`}
                onMouseEnter={() => setHighlightIndex(i)}
                onClick={() => !alreadySelected && addValue(s)}
                disabled={alreadySelected}
              >
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>{s}</span>
                <span className="text-xs text-slate-400 ml-auto">State</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
