// Electrofun Color System - Dynamic Theme Support

export interface ColorPalette {
  brand: {
    primary: string;
    primarySecond: string;
    primaryLight: string;
    primaryDark: string;
    accent: string;
  };
  neutrals: {
    background: string;
    secondaryBackground: string;
    surface: string;
    border: string;
    text: string;
    muted: string;
  };
  status: {
    danger: string;
    warning: string;
  };
}

// Light theme colors
export const lightColors: ColorPalette = {
  brand: {
    primary: '#06b6d4',
    primarySecond: '#0891b2',
    primaryLight: '#2dd4bf',
    primaryDark: '#0e7490',
    accent: '#fdca40'
  },
  neutrals: {
    background: '#ffffff',
    secondaryBackground: '#f8fafc',
    surface: '#ffffff',
    border: '#e2e8f0',
    text: '#0f172a',
    muted: '#64748b'
  },
  status: {
    danger: '#ef4444',
    warning: '#f59e0b'
  }
};

// Dark theme colors
export const darkColors: ColorPalette = {
  brand: {
    primary: '#06b6d4',
    primarySecond: '#0891b2',
    primaryLight: '#2dd4bf',
    primaryDark: '#0e7490',
    accent: '#fdca40'
  },
  neutrals: {
    background: '#0f172a',
    secondaryBackground: '#1e293b',
    surface: '#1e293b',
    border: '#334155',
    text: '#f8fafc',
    muted: '#94a3b8'
  },
  status: {
    danger: '#ef4444',
    warning: '#f59e0b'
  }
};

// Theme management
export type ThemeMode = 'light' | 'dark';

// Get colors based on current theme
export function getColors(theme: ThemeMode): ColorPalette {
  return theme === 'dark' ? darkColors : lightColors;
}

// Get current theme (can be extended to read from localStorage, etc.)
export function getCurrentTheme(): ThemeMode {
  if (typeof window !== 'undefined') {
    // Check for manual dark mode class
    if (document.documentElement.classList.contains('dark')) {
      return 'dark';
    }
    // Check for system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
}

// Utility functions
export function getColor(theme: ThemeMode, category: keyof ColorPalette, variant: string): string {
  const colors = getColors(theme);
  return colors[category][variant as keyof ColorPalette[keyof ColorPalette]];
}

// CSS variable helpers
export function getCSSVariable(name: string): string {
  return `var(--${name})`;
}

export const cssVars = {
  // Brand colors
  primaryColor: getCSSVariable('primary-color'),
  primarySecond: getCSSVariable('primary-second'),
  primaryLight: getCSSVariable('primary-light'),
  primaryDark: getCSSVariable('primary-dark'),
  accent: getCSSVariable('accent'),

  // Neutral colors
  background: getCSSVariable('background'),
  secondaryBackground: getCSSVariable('secondary-background'),
  surface: getCSSVariable('surface'),
  border: getCSSVariable('border'),
  text: getCSSVariable('text'),
  muted: getCSSVariable('muted'),

  // Status colors
  danger: getCSSVariable('danger'),
  warning: getCSSVariable('warning')
};

// Type exports
export type ColorCategory = keyof ColorPalette;