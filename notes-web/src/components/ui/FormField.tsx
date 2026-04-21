import React from 'react';

interface FormFieldProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

/**
 * FormField component - Wrapper for form inputs with error display
 * Responsibilities: Display input with validation error
 */
export const FormField: React.FC<FormFieldProps> = ({ label, error, children }) => {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>}
      {children}
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};
