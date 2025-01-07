import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'gOOOplanner-theme';
    private isDarkMode = signal(this.getInitialTheme());

    constructor() {
        // Apply initial theme
        this.applyTheme(this.isDarkMode());

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', e => {
                if (localStorage.getItem(this.THEME_KEY) === null) {
                    this.setTheme(e.matches);
                }
            });
    }

    private getInitialTheme(): boolean {
        const savedTheme = localStorage.getItem(this.THEME_KEY);
        if (savedTheme !== null) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    private applyTheme(isDark: boolean) {
        if (isDark) {
            document.documentElement.classList.add('app-dark');
        } else {
            document.documentElement.classList.remove('app-dark');
        }
    }

    setTheme(isDark: boolean) {
        this.isDarkMode.set(isDark);
        localStorage.setItem(this.THEME_KEY, isDark ? 'dark' : 'light');
        this.applyTheme(isDark);
    }

    toggleTheme() {
        this.setTheme(!this.isDarkMode());
    }

    isDark() {
        return this.isDarkMode();
    }
}
