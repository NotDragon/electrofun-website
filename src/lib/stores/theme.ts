import { writable } from 'svelte/store';
import type { ThemeMode } from '../colors';

// Theme store
export const theme = writable<ThemeMode>('light');

// Theme management functions
export function setTheme(newTheme: ThemeMode) {
  theme.set(newTheme);
  
  // Update DOM classes
  if (typeof document !== 'undefined') {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  
  // Store in localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', newTheme);
  }
}

// Initialize theme from localStorage or system preference
export function initializeTheme() {
  if (typeof window === 'undefined') return;
  
  // Check localStorage first
  const savedTheme = localStorage.getItem('theme') as ThemeMode;
  if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
    setTheme(savedTheme);
    return;
  }
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  } else {
    setTheme('light');
  }
}

// Listen for system theme changes
export function setupThemeListener() {
  if (typeof window === 'undefined') return;
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    // Only auto-switch if user hasn't manually set a theme
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
} 