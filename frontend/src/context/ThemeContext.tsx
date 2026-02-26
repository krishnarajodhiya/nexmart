'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'dark',
    toggleTheme: () => { },
    isDark: true,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark');
    const [mounted, setMounted] = useState(false);

    // On mount: read saved preference or system preference
    useEffect(() => {
        const saved = localStorage.getItem('nexmart-theme') as Theme | null;
        if (saved === 'light' || saved === 'dark') {
            setTheme(saved);
        } else {
            // Respect OS preference on first visit
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(prefersDark ? 'dark' : 'light');
        }
        setMounted(true);
    }, []);

    // Apply theme to <html> and persist
    useEffect(() => {
        if (!mounted) return;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('nexmart-theme', theme);
    }, [theme, mounted]);

    const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

    // Prevent flash: render children only after mount
    if (!mounted) return null;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
