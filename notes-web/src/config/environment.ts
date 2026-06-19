/**
 * Environment configuration
 * Centralized configuration for API endpoints and app settings
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

export const environment = {
  api: {
    baseUrl: API_BASE_URL,
    timeout: 30000,
  },
  app: {
    name: 'Notes App',
    version: '1.0.0',
    description: 'A modern, clean notes application',
  },
  theme: {
    defaultMode: 'dark' as const,
    supportedModes: ['light', 'dark'] as const,
  },
};

export type ThemeMode = typeof environment.theme.supportedModes[number];
