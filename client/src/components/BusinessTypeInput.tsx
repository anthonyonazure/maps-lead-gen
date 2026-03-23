import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { searchBusinessTypes, type BusinessTypeOption } from '../lib/business-types';

interface BusinessTypeInputProps {
  values: string[];
  onChange: (values: string[]) => void;
}

export function BusinessTypeInput({ values, onChange }: BusinessTypeInputProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<BusinessTypeOption[]>([]);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSuggestions(searchBusinessTypes(input));
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
    const label = val.replace(/_/g, ' ');
    if (!values.some(v => v.toLowerCase() === label.toLowerCase())) {
      onChange([...values, label]);
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
        addValue(suggestions[highlightIndex].label);
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
          <span key={v} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
            {v}
            <button type="button" onClick={(e) => { e.stopPropagation(); removeValue(v); }} className="hover:text-blue-600">
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
          placeholder={values.length === 0 ? 'e.g., chiropractor, dentist...' : 'Add more...'}
          className="flex-1 min-w-[120px] outline-none bg-transparent py-0.5 text-sm"
        />
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {suggestions.map((s, i) => {
            const alreadySelected = values.some(v => v.toLowerCase() === s.label.toLowerCase());
            return (
              <button
                key={s.value}
                type="button"
                className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between ${
                  alreadySelected ? 'opacity-40 cursor-default' : 'hover:bg-blue-50 cursor-pointer'
                } ${i === highlightIndex ? 'bg-blue-50' : ''}`}
                onMouseEnter={() => setHighlightIndex(i)}
                onClick={() => !alreadySelected && addValue(s.label)}
                disabled={alreadySelected}
              >
                <span>{s.label}</span>
                <span className="text-xs text-slate-400">{s.category}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
