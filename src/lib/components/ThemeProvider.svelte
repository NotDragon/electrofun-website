<script lang="ts">
  import { onMount } from 'svelte';
  import { theme, initializeTheme, setupThemeListener } from '../stores/theme';
  import type { ThemeMode } from '../colors';

  let currentTheme: ThemeMode = 'light';
  let cssLink: HTMLLinkElement | null = null;

  // Subscribe to theme changes
  const unsubscribe = theme.subscribe((newTheme) => {
    currentTheme = newTheme;
    loadThemeCSS(newTheme);
  });

  function loadThemeCSS(themeMode: ThemeMode) {
    if (typeof document === 'undefined') return;

    // Remove existing theme CSS
    const existingLink = document.querySelector('link[data-theme]');
    if (existingLink) {
      existingLink.remove();
    }

    // Create new link element
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/src/lib/colors-${themeMode}.css`;
    link.setAttribute('data-theme', themeMode);
    
    // Add to head
    document.head.appendChild(link);
    cssLink = link;
  }

  onMount(() => {
    initializeTheme();
    setupThemeListener();
    loadThemeCSS(currentTheme);

    return () => {
      unsubscribe();
      if (cssLink) {
        cssLink.remove();
      }
    };
  });
</script>

<!-- This component doesn't render anything, it just manages theme CSS --> 