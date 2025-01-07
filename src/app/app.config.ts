import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import Aura from '@primeng/themes/aura';

// Custom theme configuration extending Aura
const customAuraPreset = {
    ...Aura,
    // Override primary colors
    primary: {
        color: '#0a84ff',        // Base primary color
        colorHover: '#0060df',   // Hover state
        colorActive: '#003eaa',  // Active state
        textColor: '#ffffff'     // Text on primary background
    },
    // You can override specific component tokens that use primary color
    button: {
        ...Aura.button,
        background: 'var(--p-primary-color)',
        backgroundHover: 'var(--p-primary-color-hover)',
        backgroundActive: 'var(--p-primary-color-active)',
        textColor: 'var(--p-primary-text-color)'
    }
};

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(),
        provideRouter(routes, withComponentInputBinding()),
        provideAnimationsAsync(),
        providePrimeNG({ 
            theme: {
                preset: customAuraPreset,
                options: {
                    prefix: 'p',
                    darkModeSelector: '.app-dark',
                    cssLayer: {
                        name: 'gooo-theme',
                        order: 'gooo-theme, primeng'
                    }
                }
            },
            ripple: true
        })
    ]
};