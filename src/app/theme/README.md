# gOOOplanner Theme Documentation

This application uses PrimeNG's Aura theme with custom modifications for brand consistency and dark mode support.

## Theme Structure

The theme is built on PrimeNG's Aura preset with customized primary colors and dark mode support:

```typescript
primary: {
    color: '#0a84ff',      // Base primary color
    colorHover: '#0060df', // Hover state
    colorActive: '#003eaa' // Active state
}
```

## CSS Variables

### Color Variables
- `--p-primary-color`: Primary brand color (#0a84ff)
- `--p-primary-color-hover`: Primary color hover state (#0060df)
- `--p-primary-color-active`: Primary color active state (#003eaa)
- `--p-primary-text-color`: Text color on primary background (#ffffff)

### Surface Colors (Aura Theme)
- `--p-surface-ground`: Background color
- `--p-surface-section`: Section background
- `--p-surface-card`: Card background
- `--p-surface-overlay`: Overlay background
- `--p-surface-border`: Border color

### Text Colors
- `--p-text-color`: Primary text color
- `--p-text-color-secondary`: Secondary text color

## Usage

### 1. In Components

```scss
.my-component {
    // Use PrimeNG CSS variables
    background: var(--p-surface-card);
    color: var(--p-text-color);
    border: 1px solid var(--p-surface-border);
}

.custom-button {
    background: var(--p-primary-color);
    color: var(--p-primary-text-color);
    
    &:hover {
        background: var(--p-primary-color-hover);
    }
}
```

### 2. Dark Mode

The application supports both system preference and manual dark mode toggle:

```typescript
// Inject the ThemeService
constructor(private themeService: ThemeService) {}

// Toggle theme
toggleDarkMode() {
    this.themeService.toggleTheme();
}

// Check current theme
isDarkMode() {
    return this.themeService.isDark();
}
```

### 3. Best Practices

1. **Always use CSS variables** instead of hardcoded colors
2. **Respect dark mode** by using surface variables instead of fixed colors
3. **Use semantic variables** when available (e.g., `--p-primary-color` instead of specific hex values)
4. **Test in both themes** to ensure proper contrast and readability

## Theme Customization

To modify the theme:

1. Update the `customAuraPreset` in `app.config.ts` for global changes
2. Use component-specific overrides in your SCSS files for local changes
3. Always test changes in both light and dark modes