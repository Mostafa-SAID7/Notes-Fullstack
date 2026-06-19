import React from 'react';

interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ label, error, hint, children }) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-400/20 text-red-400 flex items-center justify-center text-[9px] font-bold flex-shrink-0">!</span>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-[var(--muted-foreground)] opacity-60">{hint}</p>
      )}
    </div>
  );
};
