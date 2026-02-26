'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Truck, Check, Lock, ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore, useAuthStore } from '@/store';
import { ordersAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

type Step = 'address' | 'payment' | 'confirm' | 'success';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const { isAuthenticated, user } = useAuthStore();
    const [step, setStep] = useState<Step>('address');
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [orderNumber, setOrderNumber] = useState('');

    const [address, setAddress] = useState({
        street: '', city: '', state: '', zipCode: '', country: 'USA',
    });
    const [payment, setPayment] = useState({ method: 'card', cardNumber: '', expiry: '', cvv: '', name: '' });

    const subtotal = getTotalPrice();
    const shipping = subtotal > 99 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    if (!isAuthenticated) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '72px' }}>
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ fontSize: '80px', marginBottom: '24px' }}>🔐</div>
                    <h2 style={{ marginBottom: '16px', fontSize: '24px', fontWeight: 700 }}>Please sign in to checkout</h2>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <Link href="/login"><button className="btn-primary" id="checkout-login-btn">Sign In</button></Link>
                        <Link href="/products"><button className="btn-secondary">Continue Shopping</button></Link>
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0 && step !== 'success') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '72px' }}>
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ fontSize: '80px', marginBottom: '24px' }}>🛒</div>
                    <h2 style={{ marginBottom: '16px' }}>Your cart is empty</h2>
                    <Link href="/products"><button className="btn-primary" id="checkout-browse-btn">Start Shopping</button></Link>
                </div>
            </div>
        );
    }

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const orderItems = items.map(item => ({
                product: item.productId,
                name: item.name,
                image: item.image,
                price: item.price,
                salePrice: item.salePrice,
                quantity: item.quantity,
                variant: item.variant,
            }));
            const res = await ordersAPI.create({ items: orderItems, shippingAddress: address, paymentMethod: payment.method }) as any;
            setOrderId(res.order._id);
            setOrderNumber(res.order.orderNumber);
            clearCart();
            setStep('success');
        } catch (err: any) {
            toast.error(err.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const stepIndex = { address: 0, payment: 1, confirm: 2, success: 3 };
    const STEPS = ['Delivery', 'Payment', 'Confirm'];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '72px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>

                {step !== 'success' && (
                    <>
                        <h1 style={{ margin: '0 0 40px', fontSize: '28px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
                            Checkout
                        </h1>

                        {/* Step indicator */}
                        <div className="step-indicator" style={{ marginBottom: '48px' }}>
                            {STEPS.map((s, i) => (
                                <>
                                    <div key={s} className={`step ${i < stepIndex[step] ? 'completed' : i === stepIndex[step] ? 'active' : 'inactive'}`}>
                                        <div className="step-num">{i < stepIndex[step] ? <Check size={16} /> : i + 1}</div>
                                        <span style={{ fontSize: '14px', fontWeight: 600, color: i <= stepIndex[step] ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s}</span>
                                    </div>
                                    {i < STEPS.length - 1 && <div className={`step-line ${i < stepIndex[step] ? 'completed' : ''}`} />}
                                </>
                            ))}
                        </div>
                    </>
                )}

                {step === 'success' ? (
                    <div className="animate-fade-in-up" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto', paddingTop: '48px' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', fontSize: '48px' }}>
                            🎉
                        </div>
                        <h2 style={{ margin: '0 0 12px', fontSize: '32px', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>Order Placed!</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '16px' }}>Thank you for your order, {user?.name}!</p>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>
                            Order #{orderNumber} is being processed. You'll receive a confirmation email shortly.
                        </p>
                        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px' }}>Estimated Delivery</p>
                            <p style={{ margin: '4px 0 0', fontWeight: 700, fontSize: '18px' }}>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <Link href="/orders"><button id="view-orders-btn" className="btn-primary" style={{ padding: '14px 32px' }}>Track Order <ArrowRight size={16} /></button></Link>
                            <Link href="/products"><button className="btn-secondary" style={{ padding: '14px 32px' }}>Continue Shopping</button></Link>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>
                        {/* Left panel */}
                        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px' }}>

                            {/* Address Step */}
                            {step === 'address' && (
                                <div>
                                    <h2 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Truck size={20} color="var(--primary-400)" /> Delivery Address
                                    </h2>
                                    <form id="address-form" onSubmit={(e) => { e.preventDefault(); setStep('payment'); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        {[
                                            { key: 'street', label: 'Street Address', placeholder: '123 Main St', full: true },
                                            { key: 'city', label: 'City', placeholder: 'New York' },
                                            { key: 'state', label: 'State', placeholder: 'NY' },
                                            { key: 'zipCode', label: 'ZIP Code', placeholder: '10001' },
                                            { key: 'country', label: 'Country', placeholder: 'USA' },
                                        ].map(field => (
                                            <div key={field.key} style={{ gridColumn: field.full ? '1 / -1' : undefined }}>
                                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>{field.label}</label>
                                                <input
                                                    id={`address-${field.key}`}
                                                    type="text"
                                                    placeholder={field.placeholder}
                                                    value={(address as any)[field.key]}
                                                    onChange={e => setAddress(a => ({ ...a, [field.key]: e.target.value }))}
                                                    required
                                                    className="input-field"
                                                />
                                            </div>
                                        ))}
                                        <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
                                            <button type="submit" id="continue-to-payment-btn" className="btn-primary" style={{ padding: '14px 32px', fontSize: '15px' }}>
                                                Continue to Payment <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Payment Step */}
                            {step === 'payment' && (
                                <div>
                                    <h2 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <CreditCard size={20} color="var(--primary-400)" /> Payment Method
                                    </h2>
                                    {/* Payment methods */}
                                    <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
                                        {[
                                            { value: 'card', label: '💳 Credit/Debit Card' },
                                            { value: 'paypal', label: '🅿️ PayPal' },
                                            { value: 'cod', label: '💵 Cash on Delivery' },
                                        ].map(opt => (
                                            <button
                                                key={opt.value}
                                                id={`payment-${opt.value}`}
                                                type="button"
                                                onClick={() => setPayment(p => ({ ...p, method: opt.value }))}
                                                style={{
                                                    padding: '12px 20px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                                                    border: `2px solid ${payment.method === opt.value ? 'var(--primary-500)' : 'var(--border)'}`,
                                                    background: payment.method === opt.value ? 'rgba(139,92,246,0.15)' : 'var(--bg-secondary)',
                                                    color: payment.method === opt.value ? 'var(--primary-400)' : 'var(--text-secondary)',
                                                }}
                                            >{opt.label}</button>
                                        ))}
                                    </div>

                                    {payment.method === 'card' && (
                                        <form id="payment-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                            <div style={{ gridColumn: '1/-1' }}>
                                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Cardholder Name</label>
                                                <input id="card-name" type="text" placeholder="John Doe" value={payment.name} onChange={e => setPayment(p => ({ ...p, name: e.target.value }))} className="input-field" />
                                            </div>
                                            <div style={{ gridColumn: '1/-1' }}>
                                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Card Number</label>
                                                <input id="card-number" type="text" placeholder="1234 5678 9012 3456" value={payment.cardNumber} onChange={e => setPayment(p => ({ ...p, cardNumber: e.target.value }))} maxLength={19} className="input-field" />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Expiry Date</label>
                                                <input id="card-expiry" type="text" placeholder="MM/YY" value={payment.expiry} onChange={e => setPayment(p => ({ ...p, expiry: e.target.value }))} maxLength={5} className="input-field" />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>CVV</label>
                                                <input id="card-cvv" type="password" placeholder="•••" value={payment.cvv} onChange={e => setPayment(p => ({ ...p, cvv: e.target.value }))} maxLength={4} className="input-field" />
                                            </div>
                                        </form>
                                    )}

                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 16px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', marginBottom: '24px' }}>
                                        <Lock size={16} color="var(--success)" />
                                        <span style={{ fontSize: '13px', color: 'var(--success)' }}>Your payment info is encrypted with 256-bit SSL</span>
                                    </div>

                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button onClick={() => setStep('address')} className="btn-secondary"><ArrowLeft size={16} /> Back</button>
                                        <button id="continue-to-confirm-btn" onClick={() => setStep('confirm')} className="btn-primary" style={{ flex: 1, padding: '14px' }}>
                                            Review Order <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Confirm Step */}
                            {step === 'confirm' && (
                                <div>
                                    <h2 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 700 }}>Review & Confirm</h2>

                                    <div style={{ marginBottom: '24px', padding: '20px', background: 'var(--bg-secondary)', borderRadius: '14px' }}>
                                        <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)' }}>DELIVERY TO</h3>
                                        <p style={{ margin: 0, fontSize: '15px' }}>{address.street}, {address.city}, {address.state} {address.zipCode}, {address.country}</p>
                                    </div>

                                    <div style={{ marginBottom: '24px', padding: '20px', background: 'var(--bg-secondary)', borderRadius: '14px' }}>
                                        <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)' }}>PAYMENT</h3>
                                        <p style={{ margin: 0, fontSize: '15px' }}>{payment.method === 'card' ? '💳 Credit/Debit Card' : payment.method === 'paypal' ? '🅿️ PayPal' : '💵 Cash on Delivery'}</p>
                                    </div>

                                    <div style={{ marginBottom: '24px', padding: '20px', background: 'var(--bg-secondary)', borderRadius: '14px' }}>
                                        <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)' }}>ORDER ITEMS ({items.length})</h3>
                                        {items.map(item => (
                                            <div key={item.productId} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                                                <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>{item.name}</p>
                                                    {item.variant && <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{item.variant}</p>}
                                                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>x{item.quantity}</p>
                                                </div>
                                                <span style={{ fontWeight: 700, fontSize: '14px' }}>${((item.salePrice || item.price) * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button onClick={() => setStep('payment')} className="btn-secondary"><ArrowLeft size={16} /> Back</button>
                                        <button id="place-order-btn" onClick={handlePlaceOrder} disabled={loading} className="btn-primary" style={{ flex: 1, padding: '14px', fontSize: '15px' }}>
                                            <Lock size={16} />
                                            {loading ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px', position: 'sticky', top: '100px' }}>
                            <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShoppingBag size={18} color="var(--primary-400)" /> Order Summary
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                                {items.slice(0, 3).map(item => (
                                    <div key={item.productId} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <img src={item.image} alt={item.name} style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                                            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>x{item.quantity}</p>
                                        </div>
                                        <span style={{ fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>${((item.salePrice || item.price) * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                {items.length > 3 && <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>+{items.length - 3} more items</p>}
                            </div>
                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {[
                                    { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
                                    { label: 'Shipping', value: shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`, special: shipping === 0 },
                                    { label: 'Tax (8%)', value: `$${tax.toFixed(2)}` },
                                ].map(row => (
                                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                                        <span style={{ color: row.special ? 'var(--success)' : 'var(--text-primary)', fontWeight: 500 }}>{row.value}</span>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '4px' }}>
                                    <span style={{ fontWeight: 700, fontSize: '16px' }}>Total</span>
                                    <span style={{ fontWeight: 900, fontSize: '20px', fontFamily: 'Outfit, sans-serif', color: 'var(--primary-400)' }}>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
