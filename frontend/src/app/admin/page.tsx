'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { usersAPI, productsAPI, ordersAPI, categoriesAPI } from '@/lib/api';
import { BarChart3, Package, Users, ShoppingBag, DollarSign, TrendingUp, Eye, Edit2, Trash2, Plus, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

type AdminTab = 'overview' | 'products' | 'orders' | 'users';

export default function AdminPage() {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [tab, setTab] = useState<AdminTab>('overview');
    const [stats, setStats] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') { router.push('/'); return; }
        loadData();
    }, [isAuthenticated, user]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsRes, prodRes, ordRes, usrRes] = await Promise.all([
                usersAPI.getAdminStats() as any,
                productsAPI.getAll({ limit: 50 }) as any,
                ordersAPI.getAll() as any,
                usersAPI.getAdminStats() as any, // reuse for now
            ]);
            setStats(statsRes.stats);
            setProducts(prodRes.products || []);
            setOrders(ordRes.orders || []);
        } catch (err) { toast.error('Failed to load data'); }
        setLoading(false);
    };

    if (!isAuthenticated || user?.role !== 'admin') return null;

    const STAT_CARDS = stats ? [
        { label: 'Total Revenue', value: `$${stats.totalRevenue?.toFixed(0) || 0}`, icon: <DollarSign size={22} />, gradient: 'linear-gradient(135deg, #667eea, #764ba2)', change: '+12.5%' },
        { label: 'Total Orders', value: stats.totalOrders || 0, icon: <ShoppingBag size={22} />, gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', change: '+8.3%' },
        { label: 'Total Products', value: stats.totalProducts || 0, icon: <Package size={22} />, gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', change: '+3.2%' },
        { label: 'Total Users', value: stats.totalUsers || 0, icon: <Users size={22} />, gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)', change: '+15.7%' },
    ] : [];

    const TAB_LABELS: { key: AdminTab; label: string; icon: any }[] = [
        { key: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
        { key: 'products', label: 'Products', icon: <Package size={16} /> },
        { key: 'orders', label: 'Orders', icon: <ShoppingBag size={16} /> },
        { key: 'users', label: 'Users', icon: <Users size={16} /> },
    ];

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Delete this product?')) return;
        try {
            await productsAPI.delete(id);
            setProducts(prev => prev.filter(p => p._id !== id));
            toast.success('Product deleted');
        } catch (err: any) { toast.error(err.message); }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '72px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1 style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>Admin Dashboard</h1>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>Welcome back, {user?.name} 👋</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link href="/products"><button className="btn-ghost"><Eye size={16} /> View Store</button></Link>
                    </div>
                </div>

                {/* Tab navigation */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '32px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '4px', width: 'fit-content' }}>
                    {TAB_LABELS.map(({ key, label, icon }) => (
                        <button
                            key={key}
                            id={`admin-tab-${key}`}
                            onClick={() => setTab(key)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                fontSize: '14px', fontWeight: 600, transition: 'all 0.2s',
                                background: tab === key ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : 'transparent',
                                color: tab === key ? 'white' : 'var(--text-secondary)',
                            }}
                        >
                            {icon} {label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                        {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: '140px', borderRadius: '16px' }} />)}
                    </div>
                ) : (
                    <>
                        {/* OVERVIEW */}
                        {tab === 'overview' && stats && (
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                                    {STAT_CARDS.map(card => (
                                        <div key={card.label} className="stat-card" id={`stat-${card.label.toLowerCase().replace(/\s+/g, '-')}`}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: card.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                                    {card.icon}
                                                </div>
                                                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--success)', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '100px' }}>
                                                    {card.change}
                                                </span>
                                            </div>
                                            <p style={{ margin: '0 0 4px', fontSize: '30px', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>{card.value}</p>
                                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px' }}>{card.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Status */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px' }}>
                                        <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700 }}>Orders by Status</h3>
                                        {Object.entries(stats.ordersByStatus || {}).map(([status, count]) => (
                                            <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: status === 'delivered' ? 'var(--success)' : status === 'shipped' ? 'var(--accent-500)' : status === 'confirmed' ? 'var(--primary-500)' : 'var(--warning)' }} />
                                                    <span style={{ fontSize: '14px', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{status}</span>
                                                </div>
                                                <span style={{ fontSize: '16px', fontWeight: 700 }}>{count as number}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px' }}>
                                        <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700 }}>Top Products</h3>
                                        {stats.topProducts?.slice(0, 5).map((p: any) => (
                                            <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                                                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{p.soldCount} sold</p>
                                                </div>
                                                <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--primary-400)', marginLeft: '12px' }}>${(p.salePrice || p.price).toFixed(0)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PRODUCTS */}
                        {tab === 'products' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>All Products ({products.length})</h2>
                                </div>
                                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Category</th>
                                                <th>Price</th>
                                                <th>Stock</th>
                                                <th>Rating</th>
                                                <th>Sold</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.slice(0, 20).map(product => (
                                                <tr key={product._id}>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <img src={product.images?.[0]} alt={product.name} style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                            <div>
                                                                <p style={{ margin: 0, fontWeight: 600, fontSize: '13px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
                                                                <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{product.sku}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ color: 'var(--text-muted)' }}>
                                                        {typeof product.category === 'object' ? product.category?.name : product.category}
                                                    </td>
                                                    <td>
                                                        <div>
                                                            {product.salePrice ? (
                                                                <>
                                                                    <span style={{ color: '#f97316', fontWeight: 700 }}>${product.salePrice}</span>
                                                                    <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '12px', marginLeft: '6px' }}>${product.price}</span>
                                                                </>
                                                            ) : (
                                                                <span style={{ fontWeight: 700 }}>${product.price}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span style={{ color: product.stock < 10 ? '#f59e0b' : product.stock === 0 ? '#ef4444' : 'var(--success)', fontWeight: 600 }}>
                                                            {product.stock}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <Star size={13} fill="#f59e0b" color="#f59e0b" />
                                                            <span>{product.ratings?.average?.toFixed(1)}</span>
                                                            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>({product.ratings?.count})</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ fontWeight: 600 }}>{product.soldCount?.toLocaleString()}</td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <Link href={`/products/${product._id}`}>
                                                                <button id={`view-product-${product._id}`} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', transition: 'color 0.2s' }}
                                                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--primary-400)'}
                                                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}>
                                                                    <Eye size={16} />
                                                                </button>
                                                            </Link>
                                                            <button id={`delete-product-${product._id}`} onClick={() => handleDeleteProduct(product._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', transition: 'color 0.2s' }}
                                                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#ef4444'}
                                                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}>
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ORDERS */}
                        {tab === 'orders' && (
                            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
                                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>All Orders ({orders.length})</h2>
                                </div>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Order #</th>
                                            <th>Date</th>
                                            <th>Items</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Payment</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.length === 0 ? (
                                            <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No orders yet</td></tr>
                                        ) : orders.slice(0, 20).map(order => (
                                            <tr key={order._id} id={`admin-order-${order._id}`}>
                                                <td><span style={{ fontWeight: 700, color: 'var(--primary-400)', fontSize: '13px' }}>{order.orderNumber}</span></td>
                                                <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td>{order.items?.length} items</td>
                                                <td style={{ fontWeight: 700 }}>${order.total?.toFixed(2)}</td>
                                                <td>
                                                    <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, background: order.orderStatus === 'delivered' ? 'rgba(16,185,129,0.15)' : order.orderStatus === 'shipped' ? 'rgba(6,182,212,0.15)' : order.orderStatus === 'cancelled' ? 'rgba(239,68,68,0.15)' : 'rgba(139,92,246,0.15)', color: order.orderStatus === 'delivered' ? 'var(--success)' : order.orderStatus === 'shipped' ? 'var(--accent-500)' : order.orderStatus === 'cancelled' ? '#ef4444' : 'var(--primary-400)' }}>
                                                        {order.orderStatus}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, background: order.paymentStatus === 'paid' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: order.paymentStatus === 'paid' ? 'var(--success)' : '#f59e0b' }}>
                                                        {order.paymentStatus}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
