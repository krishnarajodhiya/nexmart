'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, Share2, ChevronLeft, ChevronRight, Check, Minus, Plus, Package, Award } from 'lucide-react';
import { useCartStore, useWishlistStore, useAuthStore } from '@/store';
import { productsAPI, reviewsAPI } from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addItem, openCart } = useCartStore();
    const { toggleItem, isWishlisted } = useWishlistStore();
    const { isAuthenticated, user } = useAuthStore();

    const [product, setProduct] = useState<any>(null);
    const [related, setRelated] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
    const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
    const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            try {
                const res = await productsAPI.getById(id as string) as any;
                setProduct(res.product);
                // Set default variants
                if (res.product?.variants?.length > 0) {
                    const defaults: Record<string, string> = {};
                    res.product.variants.forEach((v: any) => { if (v.options.length > 0) defaults[v.name] = v.options[0]; });
                    setSelectedVariants(defaults);
                }
                // Fetch reviews and related
                const [reviewsRes, relatedRes] = await Promise.all([
                    reviewsAPI.getByProduct(id as string) as any,
                    productsAPI.getAll({ category: res.product.category?._id || res.product.category, limit: 4 }) as any,
                ]);
                setReviews(reviewsRes.reviews || []);
                setRelated((relatedRes.products || []).filter((p: any) => p._id !== id).slice(0, 4));
            } catch (err) {
                toast.error('Product not found');
                router.push('/products');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        if (product.stock === 0) { toast.error('Out of stock'); return; }
        const variantStr = Object.entries(selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ');
        addItem({
            productId: product._id,
            name: product.name,
            price: product.price,
            salePrice: product.salePrice,
            image: product.images?.[0] || '',
            quantity,
            variant: variantStr,
            stock: product.stock,
        });
        toast.success('Added to cart!', { icon: '🛒' });
        openCart();
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) { toast.error('Please login to review'); router.push('/login'); return; }
        setSubmittingReview(true);
        try {
            const res = await reviewsAPI.create({ productId: id, ...reviewForm }) as any;
            setReviews(prev => [res.review, ...prev]);
            setReviewForm({ rating: 5, title: '', body: '' });
            toast.success('Review submitted!');
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div style={{ paddingTop: '72px', maxWidth: '1400px', margin: '0 auto', padding: '96px 24px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                    <div className="skeleton" style={{ aspectRatio: '1', borderRadius: '20px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[80, 60, 40, 100, 60].map((w, i) => <div key={i} className="skeleton" style={{ height: '24px', width: `${w}%`, borderRadius: '8px' }} />)}
                    </div>
                </div>
            </div>
        );
    }

    if (!product) return null;

    const effectivePrice = product.salePrice || product.price;
    const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;
    const wishlisted = isWishlisted(product._id);

    const renderStars = (rating: number, size = 16) => Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} fill={i < Math.floor(rating) ? '#f59e0b' : 'none'} color={i < Math.floor(rating) ? '#f59e0b' : 'var(--text-muted)'} />
    ));

    return (
        <div style={{ paddingTop: '72px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
                {/* Breadcrumb */}
                <nav style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '32px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</a>
                    <ChevronRight size={14} />
                    <a href="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Products</a>
                    <ChevronRight size={14} />
                    <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
                </nav>

                {/* Main product section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', marginBottom: '64px' }}>
                    {/* Images */}
                    <div>
                        <div style={{ borderRadius: '20px', overflow: 'hidden', background: 'var(--bg-secondary)', marginBottom: '12px', aspectRatio: '1', position: 'relative' }}>
                            <img
                                src={product.images?.[activeImage]}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'; }}
                            />
                            {discount > 0 && (
                                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                                    <span className="badge badge-sale" style={{ fontSize: '14px', padding: '6px 14px' }}>{discount}% OFF</span>
                                </div>
                            )}
                            {/* Navigation arrows */}
                            {product.images?.length > 1 && (
                                <>
                                    <button onClick={() => setActiveImage(i => Math.max(0, i - 1))} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button onClick={() => setActiveImage(i => Math.min((product.images?.length || 1) - 1, i + 1))} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>
                        {/* Thumbnails */}
                        {product.images?.length > 1 && (
                            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                                {product.images.map((img: string, i: number) => (
                                    <button key={i} id={`thumb-${i}`} onClick={() => setActiveImage(i)} style={{
                                        width: '72px', height: '72px', flexShrink: 0,
                                        borderRadius: '10px', overflow: 'hidden',
                                        border: `2px solid ${i === activeImage ? 'var(--primary-500)' : 'var(--border)'}`,
                                        cursor: 'pointer', padding: 0, background: 'var(--bg-secondary)'
                                    }}>
                                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product info */}
                    <div>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                            {product.brand && <span className="badge badge-primary">{product.brand}</span>}
                            {product.freeShipping && <span className="badge badge-free-ship"><Truck size={12} /> Free Shipping</span>}
                            {product.stock < 10 && product.stock > 0 && <span className="badge" style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>Only {product.stock} left!</span>}
                        </div>

                        <h1 style={{ margin: '0 0 16px', fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 800, lineHeight: 1.2, fontFamily: 'Outfit, sans-serif' }}>
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', gap: '2px' }}>{renderStars(product.ratings?.average || 0)}</div>
                            <span style={{ fontWeight: 700, fontSize: '15px' }}>{product.ratings?.average?.toFixed(1)}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>({product.ratings?.count || 0} reviews)</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>•</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{product.soldCount?.toLocaleString()} sold</span>
                        </div>

                        {/* Price */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', padding: '20px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                            <span style={{ fontSize: '36px', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: product.salePrice ? '#f97316' : 'var(--text-primary)' }}>
                                ${effectivePrice.toFixed(2)}
                            </span>
                            {product.salePrice && (
                                <>
                                    <span className="price-original" style={{ fontSize: '20px' }}>${product.price.toFixed(2)}</span>
                                    <span className="badge badge-sale" style={{ fontSize: '14px' }}>Save ${(product.price - product.salePrice).toFixed(2)}</span>
                                </>
                            )}
                        </div>

                        {/* Variants */}
                        {product.variants?.map((variant: any) => (
                            <div key={variant.name} style={{ marginBottom: '20px' }}>
                                <p style={{ margin: '0 0 10px', fontWeight: 600, fontSize: '14px' }}>
                                    {variant.name}: <span style={{ color: 'var(--primary-400)', fontWeight: 700 }}>{selectedVariants[variant.name]}</span>
                                </p>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {variant.options.map((opt: string) => (
                                        <button
                                            key={opt}
                                            id={`variant-${variant.name}-${opt}`}
                                            onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: opt }))}
                                            style={{
                                                padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                                                border: `2px solid ${selectedVariants[variant.name] === opt ? 'var(--primary-500)' : 'var(--border)'}`,
                                                background: selectedVariants[variant.name] === opt ? 'rgba(139,92,246,0.15)' : 'var(--bg-card)',
                                                color: selectedVariants[variant.name] === opt ? 'var(--primary-400)' : 'var(--text-secondary)',
                                            }}
                                        >
                                            {opt}
                                            {selectedVariants[variant.name] === opt && <Check size={12} style={{ marginLeft: '6px' }} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Quantity */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                            <span style={{ fontWeight: 600, fontSize: '14px' }}>Quantity</span>
                            <div className="qty-selector">
                                <button className="qty-btn" id="qty-minus" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                                    <Minus size={14} />
                                </button>
                                <span className="qty-value">{quantity}</span>
                                <button className="qty-btn" id="qty-plus" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>
                                    <Plus size={14} />
                                </button>
                            </div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                            </span>
                        </div>

                        {/* CTA Buttons */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                            <button
                                id="add-to-cart-detail-btn"
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="btn-primary"
                                style={{ flex: 1, padding: '16px', fontSize: '15px', borderRadius: '14px', opacity: product.stock === 0 ? 0.5 : 1 }}
                            >
                                <ShoppingCart size={18} />
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                            <button
                                id="wishlist-detail-btn"
                                onClick={() => { toggleItem(product._id); toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!', { icon: wishlisted ? '💔' : '❤️' }); }}
                                style={{
                                    width: '52px', height: '52px', borderRadius: '14px',
                                    border: `2px solid ${wishlisted ? '#ef4444' : 'var(--border)'}`,
                                    background: wishlisted ? 'rgba(239,68,68,0.1)' : 'var(--bg-card)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: wishlisted ? '#ef4444' : 'var(--text-secondary)', transition: 'all 0.3s'
                                }}
                            >
                                <Heart size={20} fill={wishlisted ? '#ef4444' : 'none'} />
                            </button>
                        </div>

                        {/* Trust badges */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                            {[
                                { icon: <Truck size={16} />, text: product.freeShipping ? 'Free Delivery' : 'Standard Delivery' },
                                { icon: <Shield size={16} />, text: '2-Year Warranty' },
                                { icon: <RotateCcw size={16} />, text: '30-Day Returns' },
                            ].map(({ icon, text }) => (
                                <div key={text} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '12px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                                    <span style={{ color: 'var(--primary-400)' }}>{icon}</span>
                                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ marginBottom: '48px' }}>
                    <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--border)', marginBottom: '32px' }}>
                        {(['description', 'specs', 'reviews'] as const).map(tab => (
                            <button
                                key={tab}
                                id={`tab-${tab}`}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '14px 24px', border: 'none', background: 'none', cursor: 'pointer',
                                    fontSize: '14px', fontWeight: 600, textTransform: 'capitalize',
                                    color: activeTab === tab ? 'var(--primary-400)' : 'var(--text-muted)',
                                    borderBottom: `2px solid ${activeTab === tab ? 'var(--primary-500)' : 'transparent'}`,
                                    marginBottom: '-1px', transition: 'all 0.2s'
                                }}
                            >
                                {tab === 'reviews' ? `Reviews (${reviews.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'description' && (
                        <div style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.8', maxWidth: '800px' }}>
                            <p>{product.description}</p>
                            {product.tags?.length > 0 && (
                                <div style={{ display: 'flex', gap: '8px', marginTop: '24px', flexWrap: 'wrap' }}>
                                    {product.tags.map((tag: string) => (
                                        <span key={tag} className="badge badge-primary" style={{ fontSize: '13px' }}>#{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'specs' && (
                        <div style={{ maxWidth: '600px' }}>
                            {product.specifications?.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)' }}>No specifications available.</p>
                            ) : (
                                <table className="data-table" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                    <tbody>
                                        {product.specifications?.map((spec: any, i: number) => (
                                            <tr key={i}>
                                                <td style={{ fontWeight: 600, color: 'var(--text-secondary)', width: '40%', background: 'var(--bg-secondary)' }}>{spec.key}</td>
                                                <td>{spec.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                            {/* Rating summary */}
                            {reviews.length > 0 && (
                                <div style={{ display: 'flex', gap: '32px', marginBottom: '32px', padding: '24px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ margin: '0 0 4px', fontSize: '52px', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: 'var(--primary-400)' }}>{product.ratings?.average?.toFixed(1)}</p>
                                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>{renderStars(product.ratings?.average || 0)}</div>
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px' }}>{reviews.length} reviews</p>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        {[5, 4, 3, 2, 1].map(star => {
                                            const count = reviews.filter(r => r.rating === star).length;
                                            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                            return (
                                                <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', width: '16px' }}>{star}</span>
                                                    <Star size={12} fill="#f59e0b" color="#f59e0b" />
                                                    <div style={{ flex: 1, height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                                                        <div style={{ width: `${pct}%`, height: '100%', background: '#f59e0b', borderRadius: '4px', transition: 'width 0.5s' }} />
                                                    </div>
                                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', width: '32px' }}>{count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Write a review */}
                            <div style={{ marginBottom: '32px', padding: '24px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700 }}>Write a Review</h3>
                                <form id="review-form" onSubmit={handleSubmitReview}>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Your Rating</label>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <button key={s} type="button" id={`review-star-${s}`} onClick={() => setReviewForm(f => ({ ...f, rating: s }))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                                                    <Star size={28} fill={s <= reviewForm.rating ? '#f59e0b' : 'none'} color={s <= reviewForm.rating ? '#f59e0b' : 'var(--text-muted)'} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '12px' }}>
                                        <input id="review-title" type="text" placeholder="Review title" value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} required className="input-field" />
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <textarea id="review-body" placeholder="Share your experience with this product..." value={reviewForm.body} onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))} required rows={4} className="input-field" style={{ resize: 'vertical', fontFamily: 'inherit' }} />
                                    </div>
                                    <button type="submit" id="submit-review-btn" className="btn-primary" disabled={submittingReview}>
                                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            </div>

                            {/* Reviews list */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {reviews.length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px' }}>No reviews yet. Be the first to review!</p>
                                ) : reviews.map((review: any) => (
                                    <div key={review._id} style={{ padding: '20px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: 'white' }}>
                                                    {(review.user?.name || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>{review.user?.name || 'Anonymous'}</p>
                                                    {review.isVerifiedPurchase && (
                                                        <span style={{ fontSize: '11px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <Check size={10} /> Verified Purchase
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '2px' }}>{renderStars(review.rating, 14)}</div>
                                        </div>
                                        <h4 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 700 }}>{review.title}</h4>
                                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7' }}>{review.body}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Related products */}
                {related.length > 0 && (
                    <div>
                        <h2 style={{ margin: '0 0 24px', fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>Related Products</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                            {related.map(p => <ProductCard key={p._id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
