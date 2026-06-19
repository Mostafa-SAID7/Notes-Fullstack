import React, { useState, useRef, useEffect } from 'react';
import { MdExpandMore, MdCheck } from 'react-icons/md';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value, options, onChange, disabled = false, className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.value === value) ?? options[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(o => !o)}
        className={`
          w-full flex items-center justify-between gap-2
          bg-[var(--input)] border border-[var(--border)] rounded-lg
          px-3 py-2 text-sm text-[var(--foreground)]
          hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/40
          transition-all duration-150 cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">{selected?.label}</span>
        <MdExpandMore
          size={18}
          className={`flex-shrink-0 text-[var(--muted-foreground)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="
            absolute z-50 mt-1 w-full
            bg-[var(--card)] border border-[var(--border)] rounded-xl
            shadow-xl overflow-hidden
            animate-scale-in origin-top
          "
          role="listbox"
        >
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => { onChange(option.value); setIsOpen(false); }}
              className={`
                w-full flex items-center justify-between gap-2
                px-3 py-2.5 text-sm text-left
                transition-colors duration-100 cursor-pointer
                ${option.value === value
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-[var(--foreground)] hover:bg-[var(--surface-2)]'
                }
              `}
            >
              {option.label}
              {option.value === value && <MdCheck size={16} className="flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
