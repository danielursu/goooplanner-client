import { PrimeNGPreset } from 'primeng/config';

// Primitive tokens
const primitiveTokens = {
    // Colors
    blue: {
        50: '#f5f9ff',
        100: '#e0f1ff',
        200: '#c7e3ff',
        300: '#96cbff',
        400: '#47a3ff',
        500: '#0a84ff',
        600: '#0060df',
        700: '#003eaa',
        800: '#002275',
        900: '#000f40'
    },
    // Add more color palettes as needed
};

// Semantic tokens
const semanticTokens = {
    primary: {
        color: primitiveTokens.blue[500],
        colorHover: primitiveTokens.blue[600],
        colorActive: primitiveTokens.blue[700]
    },
    // Add more semantic tokens
};

// Component tokens
const componentTokens = {
    button: {
        background: semanticTokens.primary.color,
        backgroundHover: semanticTokens.primary.colorHover,
        backgroundActive: semanticTokens.primary.colorActive
    },
    // Add more component tokens
};

// Color scheme specific tokens
const colorScheme = {
    light: {
        surface: {
            ground: '#f8f9fa',
            section: '#ffffff',
            card: '#ffffff',
            overlay: '#ffffff'
        },
        text: {
            primary: '#495057',
            secondary: '#6c757d'
        }
    },
    dark: {
        surface: {
            ground: '#1e1e1e',
            section: '#262626',
            card: '#2d2d2d',
            overlay: '#2d2d2d'
        },
        text: {
            primary: '#dee2e6',
            secondary: '#9ba2a8'
        }
    }
};

// Export the complete preset
export const gOOOplannerPreset: PrimeNGPreset = {
    colorScheme,
    ...primitiveTokens,
    ...semanticTokens,
    ...componentTokens
};
