// src/lib/stores/theme.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Initialize theme
const initialTheme = browser ? 
  localStorage.getItem('theme') || 
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  : 'light';

export const theme = writable(initialTheme);

if (browser) {
  // Apply theme classes to document
  const applyTheme = (theme) => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  // Initialize
  applyTheme(initialTheme);

  // Subscribe to changes
  theme.subscribe(currentTheme => {
    localStorage.setItem('theme', currentTheme);
    applyTheme(currentTheme);
  });

  // Watch for system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = (e) => {
    if (!localStorage.getItem('theme')) {
      theme.set(e.matches ? 'dark' : 'light');
    }
  };
  mediaQuery.addEventListener('change', handleChange);
}