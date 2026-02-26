'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlistStore, useCartStore, useAuthStore } from '@/store';
import { wishlistAPI, productsAPI } from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';
import toast from 'react-hot-toast';
import type { Product } from '@/store';

export default function WishlistPage() {
    const { items: wishlistIds, toggleItem } = useWishlistStore();
    const { addItem, openCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            if (wishlistIds.length === 0) { setLoading(false); return; }
            try {
                const all = await productsAPI.getAll({ limit: 50 }) as any;
                const wishlistProducts = (all.products || []).filter((p: Product) => wishlistIds.includes(p._id));
                setProducts(wishlistProducts);
            } catch { }
            setLoading(false);
        };
        fetchWishlistProducts();
    }, [wishlistIds]);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '72px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1 style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: 800, fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Heart size={28} color="#ef4444" fill="#ef4444" /> My Wishlist
                        </h1>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>{wishlistIds.length} saved items</p>
                    </div>
                    {wishlistIds.length > 0 && (
                        <button id="add-all-to-cart-btn" className="btn-primary" style={{ padding: '12px 24px' }}>
                            <ShoppingCart size={16} /> Add All to Cart
                        </button>
                    )}
                </div>

                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                        {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: '360px', borderRadius: '20px' }} />)}
                    </div>
                ) : wishlistIds.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                        <div style={{ fontSize: '80px', marginBottom: '24px' }}>💔</div>
                        <h2 style={{ margin: '0 0 12px', fontSize: '24px', fontWeight: 700 }}>Your wishlist is empty</h2>
                        <p style={{ color: 'var(--text-muted)', margin: '0 0 24px' }}>Save items you love and shop them later</p>
                        <Link href="/products"><button id="wishlist-browse-btn" className="btn-primary">Browse Products</button></Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                        {products.map(product => <ProductCard key={product._id} product={product} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
