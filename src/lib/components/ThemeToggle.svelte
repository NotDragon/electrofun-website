<script lang="ts">
  import { theme, setTheme } from '../stores/theme';
  import type { ThemeMode } from '../colors';

  let currentTheme: ThemeMode = 'light';

  // Subscribe to theme changes
  const unsubscribe = theme.subscribe((newTheme) => {
    currentTheme = newTheme;
  });

  function toggleTheme() {
    const newTheme: ThemeMode = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }

  import { onDestroy } from 'svelte';
  onDestroy(() => {
    unsubscribe();
  });
</script>

<button
  on:click={toggleTheme}
  class="theme-toggle transition-colors focus-ring"
  aria-label="Toggle theme"
  title="Toggle light/dark theme"
>
  {#if currentTheme === 'light'}
    <!-- Moon icon for dark mode -->
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  {:else}
    <!-- Sun icon for light mode -->
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  {/if}
</button>

<style>
  .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.5rem;
    background-color: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    cursor: pointer;
  }

  .theme-toggle:hover {
    background-color: var(--secondary-background);
    border-color: var(--primary-color);
  }

  .theme-toggle:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
</style> 