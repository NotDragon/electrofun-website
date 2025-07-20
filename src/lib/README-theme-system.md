# Dynamic Theme System

This project now uses a dynamic theme system with separate CSS files for light and dark themes.

## Files Structure

```
src/lib/
├── colors-light.css      # Light theme CSS variables
├── colors-dark.css       # Dark theme CSS variables
├── colors.ts             # TypeScript color definitions and utilities
├── stores/
│   └── theme.ts          # Svelte store for theme management
└── components/
    ├── ThemeProvider.svelte  # Dynamic CSS loader
    └── ThemeToggle.svelte    # Theme toggle button
```

## How It Works

### 1. Theme Files
- **`colors-light.css`**: Contains all CSS variables for light theme
- **`colors-dark.css`**: Contains all CSS variables for dark theme
- Each file defines the same variable names but with different color values

### 2. Theme Management
- **`theme.ts`**: Svelte store that manages the current theme state
- **`ThemeProvider.svelte`**: Dynamically loads the appropriate CSS file based on theme
- **`ThemeToggle.svelte`**: Button component to switch between themes

### 3. Usage in Components

#### Using CSS Variables (Recommended)
```svelte
<style>
  .my-component {
    background-color: var(--background);
    color: var(--text);
    border: 1px solid var(--border);
  }
  
  .my-button {
    background-color: var(--primary-color);
    color: white;
  }
</style>
```

#### Using TypeScript Colors
```typescript
import { getCurrentTheme, getColors } from '$lib/colors';

// Get current theme
const theme = getCurrentTheme(); // 'light' | 'dark'

// Get colors for specific theme
const colors = getColors(theme);
const primaryColor = colors.brand.primary;

// Get specific color
const backgroundColor = getColor(theme, 'neutrals', 'background');
```

## Available CSS Variables

### Brand Colors
- `--primary-color`: Main turquoise color
- `--primary-second`: Secondary turquoise
- `--primary-light`: Light turquoise
- `--primary-dark`: Dark turquoise
- `--accent`: Golden yellow accent

### Neutral Colors
- `--background`: Main background color
- `--secondary-background`: Secondary background
- `--surface`: Surface/card background
- `--border`: Border color
- `--text`: Main text color
- `--muted`: Muted text color

### Status Colors
- `--danger`: Error/danger color
- `--warning`: Warning color

## Theme Switching

The theme automatically:
1. Checks localStorage for saved preference
2. Falls back to system preference
3. Updates when user clicks theme toggle
4. Persists selection in localStorage

## Adding New Colors

1. Add the color to both `colors-light.css` and `colors-dark.css`
2. Add the color to the `ColorPalette` interface in `colors.ts`
3. Add the color to both `lightColors` and `darkColors` objects

Example:
```css
/* colors-light.css */
:root {
  --my-new-color: #some-light-color;
}

/* colors-dark.css */
:root {
  --my-new-color: #some-dark-color;
}
```

```typescript
// colors.ts
export interface ColorPalette {
  // ... existing properties
  myNewColor: string;
}

export const lightColors: ColorPalette = {
  // ... existing properties
  myNewColor: '#some-light-color'
};

export const darkColors: ColorPalette = {
  // ... existing properties
  myNewColor: '#some-dark-color'
};
``` 