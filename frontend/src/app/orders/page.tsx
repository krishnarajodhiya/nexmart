'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Clock, Truck, Check, ChevronRight, ExternalLink } from 'lucide-react';
import { useAuthStore } from '@/store';
import { ordersAPI } from '@/lib/api';
import Link from 'next/link';

const STATUS_INFO: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    pending: { label: 'Pending', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: <Clock size={14} /> },
    confirmed: { label: 'Confirmed', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', icon: <Check size={14} /> },
    processing: { label: 'Processing', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', icon: <Package size={14} /> },
    shipped: { label: 'Shipped', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', icon: <Truck size={14} /> },
    delivered: { label: 'Delivered', color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: <Check size={14} /> },
    cancelled: { label: 'Cancelled', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: <ChevronRight size={14} /> },
};

export default function OrdersPage() {
    const { isAuthenticated, user } = useAuthStore();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    useEffect(() => {
        if (!isAuthenticated) { router.push('/login'); return; }
        ordersAPI.getAll().then((res: any) => setOrders(res.orders || [])).catch(() => { }).finally(() => setLoading(false));
    }, [isAuthenticated]);

    if (!isAuthenticated) return null;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '72px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
                <h1 style={{ margin: '0 0 32px', fontSize: '28px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>My Orders</h1>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '16px' }} />)}
                    </div>
                ) : orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                        <div style={{ fontSize: '80px', marginBottom: '24px' }}>📦</div>
                        <h2 style={{ margin: '0 0 12px', fontSize: '24px', fontWeight: 700 }}>No orders yet</h2>
                        <p style={{ color: 'var(--text-muted)', margin: '0 0 24px' }}>Start shopping to see your orders here</p>
                        <Link href="/products"><button id="orders-shop-btn" className="btn-primary">Start Shopping</button></Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1fr 400px' : '1fr', gap: '24px', alignItems: 'start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {orders.map(order => {
                                const statusInfo = STATUS_INFO[order.orderStatus] || STATUS_INFO.pending;
                                return (
                                    <div
                                        key={order._id}
                                        id={`order-${order._id}`}
                                        style={{ background: 'var(--bg-card)', border: `1px solid ${selectedOrder?._id === order._id ? 'var(--primary-500)' : 'var(--border)'}`, borderRadius: '16px', padding: '20px', cursor: 'pointer', transition: 'all 0.2s' }}
                                        onClick={() => setSelectedOrder(order === selectedOrder ? null : order)}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                                            <div>
                                                <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '15px' }}>{order.orderNumber}</p>
                                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <span style={{ ...statusInfo, display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, background: statusInfo.bg, color: statusInfo.color, border: 'none' }}>
                                                    {statusInfo.icon} {statusInfo.label}
                                                </span>
                                                <span style={{ fontWeight: 800, fontSize: '18px', fontFamily: 'Outfit, sans-serif', color: 'var(--primary-400)' }}>₹{order.total?.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            {order.items?.slice(0, 4).map((item: any, i: number) => (
                                                <div key={i} style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-secondary)', flexShrink: 0 }}>
                                                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                </div>
                                            ))}
                                            {order.items?.length > 4 && (
                                                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
                                                    +{order.items.length - 4}
                                                </div>
                                            )}
                                            <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                                                {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                                            </span>
                                            <ChevronRight size={16} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order detail panel */}
                        {selectedOrder && (
                            <div className="animate-slide-in-right" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px', position: 'sticky', top: '100px' }}>
                                <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700 }}>Order Details</h3>

                                {/* Status timeline */}
                                <div style={{ marginBottom: '24px' }}>
                                    {['confirmed', 'processing', 'shipped', 'delivered'].map((s, i) => {
                                        const done = ['confirmed', 'processing', 'shipped', 'delivered'].indexOf(selectedOrder.orderStatus) >= i;
                                        return (
                                            <div key={s} style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'flex-start' }}>
                                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: done ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : 'var(--bg-secondary)', border: done ? 'none' : '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    {done && <Check size={12} color="white" />}
                                                </div>
                                                <div>
                                                    <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 600, textTransform: 'capitalize', color: done ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s}</p>
                                                    {done && <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Shipping */}
                                <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px', marginBottom: '20px' }}>
                                    <p style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Delivery To</p>
                                    <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
                                        {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                                    </p>
                                </div>

                                {/* Items */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                                    {selectedOrder.items?.map((item: any, i: number) => (
                                        <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                            <div style={{ flex: 1 }}>
                                                <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 600 }}>{item.name}</p>
                                                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>x{item.quantity}</p>
                                            </div>
                                            <span style={{ fontSize: '13px', fontWeight: 700 }}>₹{((item.salePrice || item.price) * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Total */}
                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '16px' }}>
                                        <span>Total</span>
                                        <span style={{ color: 'var(--primary-400)' }}>₹{selectedOrder.total?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
