'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, Tag } from 'lucide-react';
import { useCartStore, useAuthStore } from '@/store';
import { cartAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CartSidebar() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
    const { isAuthenticated } = useAuthStore();

    const subtotal = getTotalPrice();
    const shipping = subtotal > 99 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const handleRemove = async (productId: string, variant?: string) => {
        removeItem(productId, variant);
        if (isAuthenticated) {
            try { await cartAPI.remove(productId); } catch { }
        }
        toast.success('Removed from cart');
    };

    const handleQtyChange = async (productId: string, quantity: number, variant?: string) => {
        updateQuantity(productId, quantity, variant);
        if (isAuthenticated) {
            try { await cartAPI.update({ productId, quantity, variant }); } catch { }
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="overlay animate-fade-in" onClick={closeCart} />
            <div className="cart-sidebar animate-slide-in-right" id="cart-sidebar">
                {/* Header */}
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShoppingBag size={18} color="var(--primary-400)" />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Your Cart</h2>
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>{items.length} items</p>
                        </div>
                    </div>
                    <button id="close-cart-btn" onClick={closeCart} className="btn-ghost" style={{ padding: '8px' }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Items */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                    {items.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
                            <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Your cart is empty</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>Add some products to get started!</p>
                            <Link href="/products" onClick={closeCart}>
                                <button className="btn-primary" id="shop-now-btn">Browse Products</button>
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {/* Free shipping banner */}
                            {subtotal < 99 && (
                                <div style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Tag size={14} color="var(--primary-400)" />
                                    <span style={{ fontSize: '13px', color: 'var(--primary-400)' }}>
                                        Add <strong>₹{(99 - subtotal).toFixed(2)}</strong> more for free shipping!
                                    </span>
                                </div>
                            )}

                            {items.map((item) => (
                                <div key={`${item.productId}-${item.variant}`} className="glass-card" style={{ padding: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ width: '70px', height: '70px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: 'var(--bg-secondary)' }}>
                                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                                        {item.variant && <p style={{ margin: '0 0 8px', fontSize: '11px', color: 'var(--text-muted)' }}>{item.variant}</p>}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                            <div className="qty-selector" style={{ borderRadius: '8px' }}>
                                                <button className="qty-btn" style={{ width: '32px', height: '32px', fontSize: '16px' }} onClick={() => handleQtyChange(item.productId, item.quantity - 1, item.variant)}>
                                                    <Minus size={12} />
                                                </button>
                                                <span className="qty-value" style={{ minWidth: '28px', fontSize: '13px' }}>{item.quantity}</span>
                                                <button className="qty-btn" style={{ width: '32px', height: '32px', fontSize: '16px' }} onClick={() => handleQtyChange(item.productId, item.quantity + 1, item.variant)}>
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                            <span style={{ fontWeight: 700, fontSize: '14px', color: item.salePrice ? '#f97316' : 'var(--text-primary)' }}>₹{((item.salePrice || item.price) * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    <button onClick={() => handleRemove(item.productId, item.variant)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', flexShrink: 0, transition: 'color 0.2s' }}
                                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'}
                                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'}>
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                            {[
                                { label: 'Subtotal', value: `₹${subtotal.toFixed(2)}` },
                                { label: 'Shipping', value: shipping === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : `₹${shipping.toFixed(2)}` },
                                { label: 'Tax (8%)', value: `₹${tax.toFixed(2)}` },
                            ].map(row => (
                                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{row.value}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '4px' }}>
                                <span style={{ fontWeight: 700, fontSize: '16px' }}>Total</span>
                                <span style={{ fontWeight: 700, fontSize: '18px', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                        <Link href="/checkout" onClick={closeCart}>
                            <button id="checkout-btn" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px', borderRadius: '14px' }}>
                                Proceed to Checkout <ArrowRight size={18} />
                            </button>
                        </Link>
                        <button onClick={() => { clearCart(); toast.success('Cart cleared'); }} style={{ width: '100%', marginTop: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', padding: '8px' }}>
                            Clear cart
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
