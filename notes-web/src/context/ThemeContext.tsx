import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode } from '../config/environment';

export type AccentColor = 'blue' | 'brown' | 'purple' | 'green' | 'rose';

export const ACCENT_PRESETS: Record<AccentColor, { rgb: string; label: string; swatch: string }> = {
  blue:   { rgb: '59, 130, 246',  label: 'Blue',   swatch: '#3B82F6' },
  brown:  { rgb: '168, 108, 60',  label: 'Brown',  swatch: '#A86C3C' },
  purple: { rgb: '139, 92, 246',  label: 'Purple', swatch: '#8B5CF6' },
  green:  { rgb: '16, 185, 129',  label: 'Green',  swatch: '#10B981' },
  rose:   { rgb: '244, 63, 94',   label: 'Rose',   swatch: '#F43F5E' },
};

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  accentColor: AccentColor;
  setAccentColor: (c: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('theme') as ThemeMode | null) || 'dark';
  });

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    return (localStorage.getItem('accentColor') as AccentColor | null) || 'blue';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
    const preset = ACCENT_PRESETS[accentColor];
    document.documentElement.style.setProperty('--primary-rgb', preset.rgb);
  }, [accentColor]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  const setAccentColor = (c: AccentColor) => setAccentColorState(c);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accentColor, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
