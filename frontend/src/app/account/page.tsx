'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import Link from 'next/link';
import { User, Package, Heart, MapPin, Settings, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AccountPage() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) router.push('/login');
    }, [isAuthenticated]);

    if (!isAuthenticated || !user) return null;

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        router.push('/');
    };

    const items = [
        { icon: <Package size={20} />, label: 'My Orders', sub: 'View and track your orders', href: '/orders' },
        { icon: <Heart size={20} />, label: 'Wishlist', sub: 'Products you love', href: '/wishlist' },
        { icon: <MapPin size={20} />, label: 'Addresses', sub: 'Manage delivery addresses', href: '/account/addresses' },
        { icon: <Settings size={20} />, label: 'Settings', sub: 'Account preferences', href: '/account/settings' },
        ...(user.role === 'admin' ? [{ icon: <Settings size={20} />, label: 'Admin Dashboard', sub: 'Manage your store', href: '/admin' }] : []),
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '72px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
                {/* Profile header */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '40px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 800, color: 'white', fontFamily: 'Outfit, sans-serif', flexShrink: 0, boxShadow: '0 0 40px rgba(139,92,246,0.4)' }}>
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>{user.name}</h1>
                            {user.role === 'admin' && (
                                <span className="badge badge-primary">Admin</span>
                            )}
                        </div>
                        <p style={{ margin: '0 0 4px', color: 'var(--text-secondary)', fontSize: '15px' }}>{user.email}</p>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px' }}>Member since {new Date().getFullYear()}</p>
                    </div>
                    <button onClick={handleLogout} id="account-logout-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', cursor: 'pointer', color: '#ef4444', fontWeight: 600, fontSize: '14px' }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>

                {/* Menu items */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {items.map(item => (
                        <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                            <div id={`account-menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`} className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-400)', flexShrink: 0 }}>
                                    {item.icon}
                                </div>
                                <div>
                                    <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>{item.label}</p>
                                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>{item.sub}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
