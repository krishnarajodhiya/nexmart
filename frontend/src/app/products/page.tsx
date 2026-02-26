'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X, ChevronDown, Grid3X3, List, Star, Filter } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { productsAPI, categoriesAPI } from '@/lib/api';
import type { Product } from '@/store';

const SORT_OPTIONS = [
    { id: 'featured', label: 'Featured', value: 'createdAt', order: 'desc' },
    { id: 'price-asc', label: 'Price: Low to High', value: 'price', order: 'asc' },
    { id: 'price-desc', label: 'Price: High to Low', value: 'price', order: 'desc' },
    { id: 'rating', label: 'Top Rated', value: 'rating', order: 'desc' },
    { id: 'popular', label: 'Most Popular', value: 'popular', order: 'desc' },
    { id: 'newest', label: 'Newest', value: 'createdAt', order: 'asc' },
];

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [filterOpen, setFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Filters
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortId, setSortId] = useState('featured');
    const sort = SORT_OPTIONS.find(o => o.id === sortId)?.value || 'createdAt';
    const sortOrder = SORT_OPTIONS.find(o => o.id === sortId)?.order || 'desc';
    const [featured, setFeatured] = useState(searchParams.get('featured') === 'true');

    useEffect(() => {
        categoriesAPI.getAll().then((res: any) => setCategories(res.categories || [])).catch(() => { });
    }, []);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params: Record<string, any> = { page, limit: 12, sort, order: sortOrder };
            if (search) params.search = search;
            if (category) params.category = category;
            if (minPrice) params.minPrice = minPrice;
            if (maxPrice) params.maxPrice = maxPrice;
            if (featured) params.featured = 'true';
            const res = await productsAPI.getAll(params) as any;
            setProducts(res.products || []);
            setTotal(res.total || 0);
            setPages(res.pages || 1);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, sort, sortOrder, search, category, minPrice, maxPrice, featured, sortId]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);
    useEffect(() => { setPage(1); }, [search, category, minPrice, maxPrice, sortId, featured]);

    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchProducts(); };
    const clearFilters = () => { setSearch(''); setCategory(''); setMinPrice(''); setMaxPrice(''); setFeatured(false); };

    const hasFilters = search || category || minPrice || maxPrice || featured;

    return (
        <div style={{ paddingTop: '72px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Header */}
            <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '32px 24px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h1 style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
                                {search ? `Results for "${search}"` : category ? (categories.find(c => c._id === category)?.name || 'Products') : 'All Products'}
                            </h1>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>
                                {loading ? 'Loading...' : `${total} products found`}
                            </p>
                        </div>

                        {/* Search bar */}
                        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: '1', maxWidth: '400px' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    id="products-search"
                                    type="text"
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="input-field"
                                    style={{ paddingLeft: '42px' }}
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{ padding: '12px 20px' }}>Search</button>
                        </form>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px', display: 'flex', gap: '24px' }}>
                {/* Filter Sidebar */}
                <aside style={{ width: '260px', flexShrink: 0 }} className="hidden md:block">
                    <div className="filter-panel" style={{ position: 'sticky', top: '96px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <SlidersHorizontal size={16} /> Filters
                            </h3>
                            {hasFilters && (
                                <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                                    Clear All
                                </button>
                            )}
                        </div>

                        {/* Categories */}
                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label key="all" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', color: !category ? 'var(--primary-400)' : 'var(--text-secondary)', background: !category ? 'rgba(139,92,246,0.1)' : 'transparent', fontWeight: !category ? 600 : 400 }}>
                                    <input type="radio" name="category" value="" checked={!category} onChange={() => setCategory('')} style={{ display: 'none' }} />
                                    All Categories
                                </label>
                                {categories.map(cat => (
                                    <label key={cat._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', color: category === cat._id ? 'var(--primary-400)' : 'var(--text-secondary)', background: category === cat._id ? 'rgba(139,92,246,0.1)' : 'transparent', fontWeight: category === cat._id ? 600 : 400 }}>
                                        <input type="radio" name="category" value={cat._id} checked={category === cat._id} onChange={() => setCategory(cat._id)} style={{ display: 'none' }} />
                                        {cat.icon} {cat.name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price */}
                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price Range</h4>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="input-field" style={{ width: '50%', padding: '10px 12px', fontSize: '13px' }} id="min-price" />
                                <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="input-field" style={{ width: '50%', padding: '10px 12px', fontSize: '13px' }} id="max-price" />
                            </div>
                        </div>

                        {/* Featured */}
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }} id="featured-filter">
                                <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: `2px solid ${featured ? 'var(--primary-500)' : 'var(--border)'}`, background: featured ? 'var(--primary-500)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', cursor: 'pointer' }}
                                    onClick={() => setFeatured(!featured)}>
                                    {featured && <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>✓</span>}
                                </div>
                                <span style={{ color: 'var(--text-secondary)' }}>Featured Only</span>
                            </label>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Toolbar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
                        {/* Active filters */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {category && (
                                <span className="badge badge-primary" style={{ cursor: 'pointer' }} onClick={() => setCategory('')}>
                                    {categories.find(c => c._id === category)?.name} <X size={12} />
                                </span>
                            )}
                            {search && (
                                <span className="badge badge-primary" style={{ cursor: 'pointer' }} onClick={() => setSearch('')}>
                                    "{search}" <X size={12} />
                                </span>
                            )}
                            {(minPrice || maxPrice) && (
                                <span className="badge badge-primary" style={{ cursor: 'pointer' }} onClick={() => { setMinPrice(''); setMaxPrice(''); }}>
                                    ${minPrice || '0'} - ${maxPrice || '∞'} <X size={12} />
                                </span>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: 'auto' }}>
                            {/* Sort */}
                            <select id="sort-select" value={sortId} onChange={e => setSortId(e.target.value)} className="input-field" style={{ width: 'auto', padding: '8px 14px', fontSize: '13px' }}>
                                {SORT_OPTIONS.map(opt => (
                                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                                ))}
                            </select>

                            {/* View mode */}
                            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '4px' }}>
                                <button id="grid-view-btn" onClick={() => setViewMode('grid')} style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: viewMode === 'grid' ? 'rgba(139,92,246,0.3)' : 'transparent', color: viewMode === 'grid' ? 'var(--primary-400)' : 'var(--text-muted)' }}>
                                    <Grid3X3 size={16} />
                                </button>
                                <button id="list-view-btn" onClick={() => setViewMode('list')} style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: viewMode === 'list' ? 'rgba(139,92,246,0.3)' : 'transparent', color: viewMode === 'list' ? 'var(--primary-400)' : 'var(--text-muted)' }}>
                                    <List size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="skeleton" style={{ height: '360px', borderRadius: '20px' }} />
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                            <div style={{ fontSize: '80px', marginBottom: '24px' }}>🔍</div>
                            <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>No products found</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Try adjusting your filters or search terms</p>
                            <button className="btn-primary" onClick={clearFilters}>Clear Filters</button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(240px, 1fr))' : '1fr', gap: '20px' }}>
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary" style={{ padding: '8px 16px' }}>Previous</button>
                            {Array.from({ length: Math.min(pages, 5) }).map((_, i) => {
                                const p = i + 1;
                                return (
                                    <button key={p} id={`page-btn-${p}`} onClick={() => setPage(p)} className={p === page ? 'btn-primary' : 'btn-secondary'} style={{ padding: '8px 14px', minWidth: '40px' }}>{p}</button>
                                );
                            })}
                            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="btn-secondary" style={{ padding: '8px 16px' }}>Next</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
