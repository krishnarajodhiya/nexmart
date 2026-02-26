'use client';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Truck, Eye } from 'lucide-react';
import { useCartStore, useWishlistStore, useAuthStore, type Product } from '@/store';
import { cartAPI, wishlistAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const { addItem, openCart } = useCartStore();
    const { toggleItem, isWishlisted } = useWishlistStore();
    const { isAuthenticated } = useAuthStore();
    const [imageError, setImageError] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);

    const wishlisted = isWishlisted(product._id);
    const effectivePrice = product.salePrice || product.price;
    const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.stock === 0) { toast.error('Out of stock'); return; }
        setAddingToCart(true);
        addItem({
            productId: product._id,
            name: product.name,
            price: product.price,
            salePrice: product.salePrice,
            image: product.images?.[0] || '',
            quantity: 1,
            stock: product.stock,
        });
        if (isAuthenticated) {
            try { await cartAPI.add({ productId: product._id, quantity: 1 }); } catch { }
        }
        toast.success('Added to cart!', { icon: '🛒' });
        openCart();
        setAddingToCart(false);
    };

    const handleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(product._id);
        if (isAuthenticated) {
            try { wishlisted ? await wishlistAPI.remove(product._id) : await wishlistAPI.add(product._id); } catch { }
        }
        toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!', { icon: wishlisted ? '💔' : '❤️' });
    };

    const renderStars = (avg: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                size={12}
                fill={i < Math.floor(avg) ? '#f59e0b' : 'none'}
                color={i < Math.floor(avg) ? '#f59e0b' : 'var(--text-muted)'}
            />
        ));
    };

    return (
        <Link href={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
            <div className="product-card" id={`product-card-${product._id}`}>
                {/* Image */}
                <div className="product-image-wrapper">
                    <img
                        src={imageError ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' : (product.images?.[0] || '')}
                        alt={product.name}
                        onError={() => setImageError(true)}
                        loading="lazy"
                    />
                    {/* Badges */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {discount > 0 && <span className="badge badge-sale">{discount}% OFF</span>}
                        {product.freeShipping && (
                            <span className="badge" style={{ background: 'rgba(16,185,129,0.85)', color: 'white', fontSize: '10px', gap: '4px' }}>
                                <Truck size={10} /> Free Ship
                            </span>
                        )}
                        {product.stock < 10 && product.stock > 0 && (
                            <span className="badge" style={{ background: 'rgba(245,158,11,0.85)', color: 'white', fontSize: '10px' }}>
                                Only {product.stock} left!
                            </span>
                        )}
                        {product.stock === 0 && <span className="badge" style={{ background: 'rgba(100,100,120,0.9)', color: 'white' }}>Out of Stock</span>}
                    </div>

                    {/* Wishlist button */}
                    <button
                        id={`wishlist-btn-${product._id}`}
                        onClick={handleWishlist}
                        style={{
                            position: 'absolute', top: '12px', right: '12px',
                            width: '38px', height: '38px', borderRadius: '50%',
                            background: wishlisted ? 'rgba(239,68,68,0.9)' : 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', transition: 'all 0.3s',
                            color: wishlisted ? 'white' : 'rgba(255,255,255,0.7)',
                        }}
                    >
                        <Heart size={16} fill={wishlisted ? 'white' : 'none'} />
                    </button>

                    {/* Quick view overlay */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        padding: '16px',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                        display: 'flex', gap: '8px',
                        transform: 'translateY(100%)',
                        transition: 'transform 0.3s ease',
                    }} className="product-actions">
                        <button
                            id={`add-to-cart-btn-${product._id}`}
                            onClick={handleAddToCart}
                            disabled={addingToCart || product.stock === 0}
                            className="btn-primary"
                            style={{ flex: 1, padding: '10px 16px', fontSize: '13px', borderRadius: '10px' }}
                        >
                            <ShoppingCart size={15} />
                            {product.stock === 0 ? 'Out of Stock' : addingToCart ? 'Adding...' : 'Add to Cart'}
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div style={{ padding: '16px' }}>
                    <p style={{ margin: '0 0 4px', fontSize: '11px', color: 'var(--primary-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {typeof product.category === 'object' ? product.category?.name : product.brand}
                    </p>
                    <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                        <div className="star-rating">{renderStars(product.ratings?.average || 0)}</div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {product.ratings?.average?.toFixed(1)} ({product.ratings?.count || 0})
                        </span>
                    </div>

                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className={product.salePrice ? 'price-sale' : 'price-regular'} style={{ fontSize: '18px' }}>
                                ${effectivePrice.toFixed(2)}
                            </span>
                            {product.salePrice && (
                                <span className="price-original">${product.price.toFixed(2)}</span>
                            )}
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={addingToCart || product.stock === 0}
                            style={{
                                width: '38px', height: '38px', borderRadius: '10px',
                                background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                                color: 'var(--primary-400)', transition: 'all 0.2s',
                                opacity: product.stock === 0 ? 0.5 : 1
                            }}
                            onMouseEnter={e => { if (product.stock > 0) { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.3)'; } }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.15)'; }}
                        >
                            <ShoppingCart size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .product-card:hover .product-actions {
          transform: translateY(0) !important;
        }
      `}</style>
        </Link>
    );
}
