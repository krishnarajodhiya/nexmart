'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap, ArrowRight, Check } from 'lucide-react';
import { useAuthStore } from '@/store';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authAPI.login(form) as any;
            setAuth(res.user, res.token);
            toast.success(`Welcome back, ${res.user.name}! 👋`);
            router.push('/');
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '24px', paddingTop: '96px' }}>
            {/* Background */}
            <div style={{ position: 'fixed', top: '10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', bottom: '10%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

            <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: '440px' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                            <svg width="44" height="44" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10 10V7C10 3.68629 12.6863 1 16 1C19.3137 1 22 3.68629 22 7V10" />
                                    <path d="M6 10H26L28 30H4L6 10Z" fill="var(--bg-card)" />
                                    <path d="M18 12L12 20H16L14 26L20 18H16L18 12Z" fill="currentColor" stroke="none" />
                                </g>
                            </svg>
                        </div>
                        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '28px', letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>NexMart</span>
                    </Link>
                    <h1 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>Welcome back</h1>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px' }}>Sign in to your account to continue</p>
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '36px' }}>
                    {/* Demo credentials hint */}
                    <div style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', fontSize: '13px', color: 'var(--primary-400)' }}>
                        <p style={{ margin: '0 0 4px', fontWeight: 700 }}>Demo Credentials</p>
                        <p style={{ margin: 0 }}>User: user@nexmart.com / admin123</p>
                        <p style={{ margin: 0 }}>Admin: admin@nexmart.com / admin123</p>
                    </div>

                    <form id="login-form" onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</label>
                            <input
                                id="login-email"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                required
                                className="input-field"
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
                                <a href="/forgot-password" style={{ fontSize: '13px', color: 'var(--primary-400)', textDecoration: 'none' }}>Forgot password?</a>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                    required
                                    className="input-field"
                                    style={{ paddingRight: '48px' }}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} id="toggle-password" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" id="login-submit-btn" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px', borderRadius: '14px' }} disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'} {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <p style={{ margin: '20px 0 0', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
                        Don't have an account?{' '}
                        <Link href="/register" style={{ color: 'var(--primary-400)', fontWeight: 600, textDecoration: 'none' }}>Create one free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
