'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap, ArrowRight, Check } from 'lucide-react';
import { useAuthStore } from '@/store';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const PERKS = ['Free shipping on orders ₹99+', 'Exclusive member discounts', 'Easy order tracking', 'Save wishlists forever'];

export default function RegisterPage() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
        if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        setLoading(true);
        try {
            const res = await authAPI.register({ name: form.name, email: form.email, password: form.password }) as any;
            setAuth(res.user, res.token);
            toast.success(`Welcome to NexMart, ${res.user.name}! 🎉`);
            router.push('/');
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '24px', paddingTop: '96px' }}>
            <div style={{ position: 'fixed', top: '10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

            <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: '900px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
                {/* Left - Benefits */}
                <div>
                    <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
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
                    <h1 style={{ margin: '0 0 16px', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 900, fontFamily: 'Outfit, sans-serif', lineHeight: 1.2 }}>
                        Join the future of <span className="gradient-text">shopping</span>
                    </h1>
                    <p style={{ margin: '0 0 32px', color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.7' }}>
                        Create your free account and unlock exclusive deals, track orders, and shop smarter.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {PERKS.map(perk => (
                            <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Check size={13} color="var(--primary-400)" />
                                </div>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{perk}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right - Form */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '36px' }}>
                    <h2 style={{ margin: '0 0 24px', fontSize: '22px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>Create your account</h2>
                    <form id="register-form" onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
                            <input id="register-name" type="text" placeholder="John Doe" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="input-field" />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</label>
                            <input id="register-email" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="input-field" />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input id="register-password" type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required className="input-field" style={{ paddingRight: '48px' }} />
                                <button type="button" id="toggle-reg-password" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Confirm Password</label>
                            <input id="register-confirm-password" type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} required className="input-field" />
                        </div>
                        <button type="submit" id="register-submit-btn" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px', borderRadius: '14px' }} disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Free Account'} {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>
                    <p style={{ margin: '16px 0 0', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
                        By creating an account, you agree to our <a href="/terms" style={{ color: 'var(--primary-400)', textDecoration: 'none' }}>Terms</a> and <a href="/privacy" style={{ color: 'var(--primary-400)', textDecoration: 'none' }}>Privacy Policy</a>
                    </p>
                    <p style={{ margin: '12px 0 0', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
                        Already have an account?{' '}
                        <Link href="/login" style={{ color: 'var(--primary-400)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
