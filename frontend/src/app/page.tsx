'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Users, Package, ShieldCheck, Truck, Headphones, RotateCcw, TrendingUp, Zap, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { productsAPI, categoriesAPI } from '@/lib/api';
import { useTheme } from '@/context/ThemeContext';
import type { Product } from '@/store';

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
}

const HERO_SLIDES = [
  {
    title: 'The Future of', highlight: 'Shopping Is Here',
    sub: 'Discover millions of products with lightning-fast delivery, unbeatable prices, and the smoothest checkout experience ever built.',
    badge: '⚡ New Arrivals Every Day',
    cta: 'Shop Now',
    href: '/products',
    darkGradient: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0a1628 100%)',
    lightGradient: 'linear-gradient(135deg, #f4f4f8 0%, #ede9fe 50%, #e0f2fe 100%)',
    accent: '#8b5cf6',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=700',
  },
  {
    title: 'Premium Electronics', highlight: 'At Your Fingertips',
    sub: 'From the latest smartphones to professional audio gear, explore our curated collection of cutting-edge tech.',
    badge: '🔥 Up to 40% Off Electronics',
    cta: 'Explore Electronics',
    href: '/products?category=cat-001',
    darkGradient: 'linear-gradient(135deg, #0a0a0f 0%, #0a1628 50%, #001a2e 100%)',
    lightGradient: 'linear-gradient(135deg, #f4f4f8 0%, #e0f2fe 50%, #d1fae5 100%)',
    accent: '#06b6d4',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=700',
  },
  {
    title: 'Style That Speaks', highlight: 'Volume',
    sub: 'Elevate your wardrobe with our premium fashion collection. Timeless pieces, modern styles, unmatched quality.',
    badge: '👗 New Season Collection',
    cta: 'Explore Fashion',
    href: '/products?category=cat-002',
    darkGradient: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a1a 50%, #0a0a1a 100%)',
    lightGradient: 'linear-gradient(135deg, #f4f4f8 0%, #fce7f3 50%, #ede9fe 100%)',
    accent: '#a855f7',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=700',
  },
];

const TRUST_BADGES = [
  { icon: <Truck size={22} />, title: 'Free Shipping', sub: 'On orders over $99' },
  { icon: <RotateCcw size={22} />, title: '30-Day Returns', sub: 'Hassle-free returns' },
  { icon: <ShieldCheck size={22} />, title: 'Secure Payment', sub: '256-bit SSL encryption' },
  { icon: <Headphones size={22} />, title: '24/7 Support', sub: 'Always here to help' },
];

const STATS = [
  { value: '2M+', label: 'Happy Customers', icon: <Users size={20} /> },
  { value: '500K+', label: 'Products', icon: <Package size={20} /> },
  { value: '4.9★', label: 'Average Rating', icon: <Star size={20} /> },
  { value: '99%', label: 'Satisfaction Rate', icon: <TrendingUp size={20} /> },
];

export default function HomePage() {
  const { isDark } = useTheme();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productsAPI.getFeatured() as any,
          categoriesAPI.getAll() as any,
        ]);
        setFeaturedProducts(prodRes.products || []);
        setCategories((catRes.categories || []).slice(0, 8));
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(s => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];
  const slideGradient = isDark ? slide.darkGradient : slide.lightGradient;

  return (
    <div style={{ paddingTop: '72px' }}>
      {/* ========= HERO ========= */}
      <section style={{ minHeight: '90vh', background: slideGradient, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', transition: 'background 1s ease' }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: `radial-gradient(circle, ${slide.accent}22 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        {/* Grid overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(139,92,246,0.06) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center', width: '100%' }}>
          <div className="animate-fade-in-up">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '100px', marginBottom: '24px' }}>
              <Zap size={14} color={slide.accent} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: slide.accent }}>{slide.badge}</span>
            </div>
            <h1 style={{ margin: '0 0 24px', fontSize: 'clamp(38px, 5vw, 68px)', fontWeight: 900, lineHeight: '1.1', fontFamily: 'Outfit, sans-serif' }}>
              <span style={{ color: 'white' }}>{slide.title}{' '}</span>
              <span className="gradient-text">
                {slide.highlight}
              </span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: '1.7', marginBottom: '40px', maxWidth: '520px' }}>
              {slide.sub}
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link href={slide.href}>
                <button id={`hero-cta-btn-${currentSlide}`} className="btn-primary" style={{ padding: '16px 36px', fontSize: '16px', borderRadius: '14px' }}>
                  {slide.cta} <ArrowRight size={18} />
                </button>
              </Link>
              <Link href="/products">
                <button className="btn-secondary" style={{ padding: '16px 36px', fontSize: '16px', borderRadius: '14px' }}>
                  Browse All <ChevronRight size={18} />
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '32px', marginTop: '48px', flexWrap: 'wrap' }}>
              {STATS.map(s => (
                <div key={s.label}>
                  <p style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 900, fontFamily: 'Outfit, sans-serif', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="animate-fade-in" style={{ position: 'relative' }}>
            <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', boxShadow: `0 40px 120px ${slide.accent}33`, position: 'relative' }}>
              <img src={slide.image} alt="Hero" style={{ width: '100%', height: '460px', objectFit: 'cover', display: 'block' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            {/* Floating badge */}
            <div style={{ position: 'absolute', bottom: '24px', left: '24px', background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔥</div>
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>Trending Today</p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>1,247 sold in last 24h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
          {HERO_SLIDES.map((_, i) => (
            <button key={i} id={`slide-dot-${i}`} onClick={() => setCurrentSlide(i)} style={{
              width: i === currentSlide ? '28px' : '8px',
              height: '8px', borderRadius: '4px',
              background: i === currentSlide ? 'var(--primary-500)' : 'rgba(255,255,255,0.2)',
              border: 'none', cursor: 'pointer', transition: 'all 0.3s'
            }} />
          ))}
        </div>
      </section>

      {/* ========= TRUST BADGES ========= */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
            {TRUST_BADGES.map((badge, i) => (
              <div key={badge.title} style={{
                display: 'flex', alignItems: 'center', gap: '16px', padding: '28px 24px',
                borderRight: i < 3 ? '1px solid var(--border)' : 'none'
              }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-400)', flexShrink: 0 }}>
                  {badge.icon}
                </div>
                <div>
                  <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '14px' }}>{badge.title}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{badge.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========= CATEGORIES ========= */}
      <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 24px 0' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div className="section-tag">
              <Package size={14} /> All Categories
            </div>
            <h2 style={{ margin: 0, fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>
              Shop by <span className="gradient-text">Category</span>
            </h2>
          </div>
          <Link href="/products"><button className="btn-ghost">View All <ArrowRight size={16} /></button></Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
          {loading ? Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '140px', borderRadius: '16px' }} />
          )) : categories.map((cat, i) => (
            <Link key={cat._id} href={`/products?category=${cat._id}`} style={{ textDecoration: 'none' }}>
              <div id={`category-card-${cat._id}`} className="glass-card" style={{ padding: '24px 16px', textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px', display: 'block' }}>{cat.icon || '📦'}</div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========= FEATURED PRODUCTS ========= */}
      <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 24px 0' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div className="section-tag">
              <Star size={14} /> Curated for You
            </div>
            <h2 style={{ margin: 0, fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>
              Featured <span className="gradient-text">Products</span>
            </h2>
          </div>
          <Link href="/products?featured=true"><button className="btn-ghost">View All <ArrowRight size={16} /></button></Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '380px', borderRadius: '20px' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ========= PROMO BANNER ========= */}
      <section style={{ maxWidth: '1400px', margin: '80px auto 0', padding: '0 24px' }}>
        <div style={{ borderRadius: '28px', background: 'linear-gradient(135deg, #4c1d95 0%, #1e1245 50%, #0a1628 100%)', padding: '60px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(139,92,246,0.3)' }}>
          <div style={{ position: 'absolute', top: '-40%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr auto', gap: '40px', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: 'var(--primary-400)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Limited Time Offer</p>
              <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>
                Get 20% off your <span style={{ color: '#a78bfa' }}>first order</span>
              </h2>
              <p style={{ margin: '0 0 32px', color: 'var(--text-secondary)', fontSize: '16px' }}>
                Use code <strong style={{ color: 'white', fontFamily: 'monospace', background: 'rgba(139,92,246,0.3)', padding: '2px 8px', borderRadius: '6px' }}>WELCOME20</strong> at checkout. New customers only.
              </p>
              <Link href="/register">
                <button id="promo-cta-btn" className="btn-primary" style={{ padding: '16px 36px', fontSize: '16px' }}>
                  Claim Your Discount <ArrowRight size={18} />
                </button>
              </Link>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '100px', lineHeight: 1 }}>🎁</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========= LATEST PRODUCTS ========= */}
      <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 24px' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div className="section-tag">
              <TrendingUp size={14} /> Most Popular
            </div>
            <h2 style={{ margin: 0, fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>
              Trending <span className="gradient-text">Now</span>
            </h2>
          </div>
          <Link href="/products?sort=popular"><button className="btn-ghost">See All Trending <ArrowRight size={16} /></button></Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '380px', borderRadius: '20px' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
