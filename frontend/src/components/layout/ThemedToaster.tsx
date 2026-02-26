'use client';
import { Toaster } from 'react-hot-toast';
import { useTheme } from '@/context/ThemeContext';

export default function ThemedToaster() {
    const { isDark } = useTheme();

    return (
        <Toaster
            position="top-right"
            toastOptions={{
                style: {
                    background: isDark ? '#16161f' : '#ffffff',
                    color: isDark ? '#f1f0ff' : '#1a1a2e',
                    border: isDark
                        ? '1px solid rgba(255,255,255,0.08)'
                        : '1px solid rgba(139,92,246,0.15)',
                    borderRadius: '12px',
                    boxShadow: isDark
                        ? '0 20px 60px rgba(0,0,0,0.5)'
                        : '0 20px 60px rgba(139,92,246,0.12)',
                },
                success: { iconTheme: { primary: '#10b981', secondary: isDark ? '#fff' : '#fff' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
        />
    );
}
