'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingCart, Heart, Search, User, Menu, X, LogOut, Package, Settings, ChevronDown, Zap, Sun, Moon } from 'lucide-react';
import { useAuthStore, useCartStore, useWishlistStore, useUIStore } from '@/store';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuthStore();
    const { getTotalItems, openCart } = useCartStore();
    const { items: wishlistItems } = useWishlistStore();
    const { searchQuery, setSearchQuery, mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
    const { isDark, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const cartCount = getTotalItems();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { closeMobileMenu(); }, [pathname]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
            setSearchOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        router.push('/');
        setUserMenuOpen(false);
    };

    const navLinks = [
        { label: 'Products', href: '/products' },
        { label: 'Electronics', href: '/products?category=cat-001' },
        { label: 'Fashion', href: '/products?category=cat-002' },
        { label: 'Deals', href: '/products?sort=popular' },
    ];

    const navBg = scrolled
        ? isDark
            ? 'rgba(10, 10, 15, 0.95)'
            : 'rgba(255, 255, 255, 0.95)'
        : 'transparent';

    return (
        <>
            <nav
                id="main-navbar"
                style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0,
                    zIndex: 500,
                    transition: 'all 0.3s',
                    background: navBg,
                    backdropFilter: scrolled ? 'blur(20px)' : 'none',
                    borderBottom: scrolled ? '1px solid var(--border)' : 'none',
                }}
            >
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', height: '72px', gap: '32px' }}>

                        {/* Logo */}
                        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--text-primary)'
                                }}>
                                    <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            {/* Bag handles */}
                                            <path d="M10 10V7C10 3.68629 12.6863 1 16 1C19.3137 1 22 3.68629 22 7V10" />
                                            {/* Bag body */}
                                            <path d="M6 10H26L28 30H4L6 10Z" fill="var(--bg-card)" />
                                            {/* Lightning bolt */}
                                            <path d="M18 12L12 20H16L14 26L20 18H16L18 12Z" fill="currentColor" stroke="none" />
                                        </g>
                                    </svg>
                                </div>
                                <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '24px', letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
                                    NexMart
                                </span>
                            </div>
                        </Link>

                        {/* Desktop nav links */}
                        <div style={{ display: 'flex', gap: '4px', flex: 1 }} className="hidden md:flex">
                            {navLinks.map(link => (
                                <Link key={link.href} href={link.href} className="nav-link" style={{ textDecoration: 'none' }}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>

                            {/* Search */}
                            {searchOpen ? (
                                <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                        ref={searchRef}
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        autoFocus
                                        className="input-field"
                                        style={{ width: '220px', padding: '8px 14px', fontSize: '14px' }}
                                        id="search-input"
                                    />
                                    <button type="button" className="btn-ghost" onClick={() => setSearchOpen(false)} style={{ padding: '8px' }}>
                                        <X size={18} />
                                    </button>
                                </form>
                            ) : (
                                <button id="search-btn" className="btn-ghost" onClick={() => setSearchOpen(true)} style={{ padding: '10px' }}>
                                    <Search size={20} />
                                </button>
                            )}

                            {/* Wishlist */}
                            <Link href="/wishlist" style={{ position: 'relative', textDecoration: 'none' }}>
                                <button id="wishlist-btn" className="btn-ghost" style={{ padding: '10px' }}>
                                    <Heart size={20} />
                                    {wishlistItems.length > 0 && (
                                        <span style={{
                                            position: 'absolute', top: '4px', right: '4px',
                                            width: '16px', height: '16px',
                                            background: 'linear-gradient(135deg, #ef4444, #f97316)',
                                            borderRadius: '50%', fontSize: '10px', fontWeight: 700,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                                        }}>{wishlistItems.length}</span>
                                    )}
                                </button>
                            </Link>

                            {/* Cart */}
                            <button id="cart-btn" className="btn-ghost" onClick={openCart} style={{ padding: '10px', position: 'relative' }}>
                                <ShoppingCart size={20} />
                                {cartCount > 0 && (
                                    <span style={{
                                        position: 'absolute', top: '4px', right: '4px',
                                        width: '18px', height: '18px',
                                        background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                                        borderRadius: '50%', fontSize: '10px', fontWeight: 700,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                                    }}>{cartCount}</span>
                                )}
                            </button>

                            {/* ☀️/🌙 Theme Toggle */}
                            <button
                                id="theme-toggle-btn"
                                onClick={toggleTheme}
                                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                                style={{
                                    padding: '8px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(139,92,246,0.08)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '40px',
                                    height: '40px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    color: 'var(--text-secondary)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary-500)';
                                    (e.currentTarget as HTMLElement).style.color = 'var(--primary-400)';
                                    (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.12)';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                                    (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                                    (e.currentTarget as HTMLElement).style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(139,92,246,0.08)';
                                }}
                            >
                                {/* Animated icon swap */}
                                <span style={{
                                    position: 'absolute',
                                    transform: isDark ? 'translateY(0) rotate(0deg)' : 'translateY(-40px) rotate(90deg)',
                                    transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
                                    display: 'flex',
                                }}>
                                    <Moon size={18} />
                                </span>
                                <span style={{
                                    position: 'absolute',
                                    transform: isDark ? 'translateY(40px) rotate(-90deg)' : 'translateY(0) rotate(0deg)',
                                    transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
                                    display: 'flex',
                                }}>
                                    <Sun size={18} />
                                </span>
                            </button>

                            {/* User */}
                            {isAuthenticated ? (
                                <div style={{ position: 'relative' }}>
                                    <button
                                        id="user-menu-btn"
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                            padding: '6px 12px', background: 'rgba(139, 92, 246, 0.1)',
                                            border: '1px solid rgba(139, 92, 246, 0.3)',
                                            borderRadius: '100px', cursor: 'pointer', color: 'var(--text-primary)'
                                        }}
                                    >
                                        <div style={{
                                            width: '28px', height: '28px', borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '12px', fontWeight: 700, color: 'white'
                                        }}>
                                            {user?.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span style={{ fontSize: '14px', fontWeight: 500 }} className="hidden md:inline">{user?.name.split(' ')[0]}</span>
                                        <ChevronDown size={14} style={{ opacity: 0.6 }} />
                                    </button>

                                    {userMenuOpen && (
                                        <>
                                            <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setUserMenuOpen(false)} />
                                            <div style={{
                                                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                                                background: 'var(--bg-card)', border: '1px solid var(--border)',
                                                borderRadius: '16px', padding: '8px', minWidth: '200px',
                                                zIndex: 20, boxShadow: isDark
                                                    ? '0 20px 60px rgba(0,0,0,0.5)'
                                                    : '0 20px 60px rgba(139,92,246,0.15)'
                                            }}>
                                                <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid var(--border)', marginBottom: '8px' }}>
                                                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{user?.name}</p>
                                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{user?.email}</p>
                                                </div>
                                                {[
                                                    { icon: <User size={15} />, label: 'Profile', href: '/account' },
                                                    { icon: <Package size={15} />, label: 'My Orders', href: '/orders' },
                                                    ...(user?.role === 'admin' ? [{ icon: <Settings size={15} />, label: 'Admin Panel', href: '/admin' }] : []),
                                                ].map(item => (
                                                    <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }} onClick={() => setUserMenuOpen(false)}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '14px', transition: 'all 0.2s' }}
                                                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-glass-hover)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
                                                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}>
                                                            {item.icon} {item.label}
                                                        </div>
                                                    </Link>
                                                ))}
                                                <div style={{ borderTop: '1px solid var(--border)', marginTop: '8px', paddingTop: '8px' }}>
                                                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', borderRadius: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '14px' }}
                                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'}
                                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}>
                                                        <LogOut size={15} /> Logout
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Link href="/login"><button id="login-btn" className="btn-secondary" style={{ padding: '8px 20px', fontSize: '14px' }}>Login</button></Link>
                                    <Link href="/register"><button id="signup-btn" className="btn-primary" style={{ padding: '8px 20px', fontSize: '14px' }}>Sign Up</button></Link>
                                </div>
                            )}

                            {/* Mobile menu toggle */}
                            <button id="mobile-menu-btn" className="btn-ghost md:hidden" onClick={toggleMobileMenu} style={{ padding: '10px' }}>
                                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div style={{
                        background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)',
                        padding: '16px 24px'
                    }}>
                        {navLinks.map(link => (
                            <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                                <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '15px' }}>
                                    {link.label}
                                </div>
                            </Link>
                        ))}
                        {/* Theme toggle in mobile menu */}
                        <div
                            onClick={toggleTheme}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '15px' }}
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                            Switch to {isDark ? 'Light' : 'Dark'} Mode
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}
