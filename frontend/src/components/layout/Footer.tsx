'use client';
import Link from 'next/link';
import { Zap, Twitter, Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    const links = {
        Shop: [
            { label: 'All Products', href: '/products' },
            { label: 'Electronics', href: '/products?category=cat-001' },
            { label: 'Fashion', href: '/products?category=cat-002' },
            { label: 'Home & Garden', href: '/products?category=cat-003' },
            { label: 'Sports', href: '/products?category=cat-004' },
        ],
        Company: [
            { label: 'About Us', href: '/about' },
            { label: 'Careers', href: '/careers' },
            { label: 'Press', href: '/press' },
            { label: 'Blog', href: '/blog' },
        ],
        Support: [
            { label: 'Help Center', href: '/help' },
            { label: 'Track Order', href: '/orders' },
            { label: 'Returns', href: '/returns' },
            { label: 'Contact Us', href: '/contact' },
        ],
        Legal: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Cookie Policy', href: '/cookies' },
        ],
    };

    return (
        <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', marginTop: '80px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 24px 40px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '48px', marginBottom: '48px' }}>
                    {/* Brand */}
                    <div style={{ gridColumn: 'span 2' }}>
                        <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                                <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10 10V7C10 3.68629 12.6863 1 16 1C19.3137 1 22 3.68629 22 7V10" />
                                        <path d="M6 10H26L28 30H4L6 10Z" fill="var(--bg-card)" />
                                        <path d="M18 12L12 20H16L14 26L20 18H16L18 12Z" fill="currentColor" stroke="none" />
                                    </g>
                                </svg>
                            </div>
                            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '24px', letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
                                NexMart
                            </span>
                        </Link>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7', maxWidth: '300px', marginBottom: '24px' }}>
                            The future of e-commerce. Shop millions of products with confidence, speed, and style.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                            {[
                                { icon: <Mail size={14} />, text: 'hello@nexmart.com' },
                                { icon: <Phone size={14} />, text: '+1 (555) 123-4567' },
                                { icon: <MapPin size={14} />, text: 'San Francisco, CA 94102' },
                            ].map(item => (
                                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                    <span style={{ color: 'var(--primary-400)' }}>{item.icon}</span>
                                    {item.text}
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {[Twitter, Instagram, Facebook, Youtube].map((Icon, i) => (
                                <button key={i} style={{
                                    width: '38px', height: '38px', borderRadius: '10px',
                                    background: 'var(--bg-glass)', border: '1px solid var(--border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.2s'
                                }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--primary-500)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--primary-400)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}>
                                    <Icon size={16} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(links).map(([section, items]) => (
                        <div key={section}>
                            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '14px', marginBottom: '16px', letterSpacing: '0.02em' }}>{section}</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {items.map(item => (
                                    <li key={item.href}>
                                        <Link href={item.href} style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}
                                            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--primary-400)'}
                                            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'}>
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter */}
                <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', marginBottom: '40px', display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700 }}>Get exclusive deals in your inbox</h3>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>Subscribe and save up to 30% on your first order.</p>
                    </div>
                    <form style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }} onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Enter your email..." className="input-field" style={{ width: '280px' }} id="newsletter-email" />
                        <button type="submit" className="btn-primary" id="newsletter-submit">Subscribe</button>
                    </form>
                </div>

                {/* Bottom */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
                        © 2024 NexMart. All rights reserved. Built with ❤️ for the future of commerce.
                    </p>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        {['Visa', 'Mastercard', 'PayPal', 'Stripe'].map(payment => (
                            <span key={payment} style={{
                                padding: '4px 10px', background: 'var(--bg-card)',
                                border: '1px solid var(--border)', borderRadius: '6px',
                                fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)'
                            }}>{payment}</span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
