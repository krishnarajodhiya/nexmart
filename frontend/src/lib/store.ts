// In-memory store — shared singleton across all Next.js API route handlers
// Data resets on cold-start (fine for demo). For production, replace with a real DB.

export interface Category {
    _id: string; name: string; slug: string; description: string;
    icon: string; image: string; isActive: boolean; sortOrder: number; parent: null | string;
}

export interface Product {
    _id: string; name: string; slug: string; description: string; shortDescription: string;
    price: number; salePrice: number | null;
    images: string[]; category: string; brand: string; stock: number; sku: string;
    tags: string[]; specifications: { key: string; value: string }[];
    variants: { name: string; options: string[] }[];
    ratings: { average: number; count: number };
    isFeatured: boolean; isActive: boolean; freeShipping: boolean; soldCount: number;
}

export interface User {
    _id: string; name: string; email: string; password: string;
    role: 'admin' | 'user'; avatar: string;
    addresses: { type: string; street: string; city: string; state: string; zipCode: string; country: string; isDefault: boolean }[];
    wishlist: string[]; createdAt: string;
}

export interface Order {
    _id: string; orderNumber: string; userId: string;
    items: any[]; shippingAddress: any; paymentMethod: string;
    paymentStatus: string; orderStatus: string;
    subtotal: number; shippingCost: number; tax: number; total: number;
    couponCode?: string; notes?: string; estimatedDelivery: string;
    statusHistory: { status: string; timestamp: string; note?: string }[];
    createdAt: string;
}

export interface Review {
    _id: string; product: string; user: string; rating: number;
    title: string; body: string; isVerifiedPurchase: boolean; helpful: number; createdAt: string;
}

// ---- Seed data ----
const _categories: Category[] = [
    { _id: 'cat-001', name: 'Electronics', slug: 'electronics', description: 'Latest gadgets and electronics', icon: '💻', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', isActive: true, sortOrder: 1, parent: null },
    { _id: 'cat-002', name: 'Fashion', slug: 'fashion', description: 'Trendy clothing and accessories', icon: '👗', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', isActive: true, sortOrder: 2, parent: null },
    { _id: 'cat-003', name: 'Home & Garden', slug: 'home-garden', description: 'Everything for your home', icon: '🏠', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', isActive: true, sortOrder: 3, parent: null },
    { _id: 'cat-004', name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Gear up for adventure', icon: '⚽', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400', isActive: true, sortOrder: 4, parent: null },
    { _id: 'cat-005', name: 'Beauty & Health', slug: 'beauty-health', description: 'Feel your best every day', icon: '💄', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', isActive: true, sortOrder: 5, parent: null },
    { _id: 'cat-006', name: 'Books & Media', slug: 'books-media', description: 'Knowledge and entertainment', icon: '📚', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', isActive: true, sortOrder: 6, parent: null },
    { _id: 'cat-007', name: 'Toys & Games', slug: 'toys-games', description: 'Fun for all ages', icon: '🎮', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', isActive: true, sortOrder: 7, parent: null },
    { _id: 'cat-008', name: 'Automotive', slug: 'automotive', description: 'Car accessories and parts', icon: '🚗', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400', isActive: true, sortOrder: 8, parent: null },
];

const _products: Product[] = [
    { _id: 'prod-001', name: 'Premium Wireless Headphones Pro', slug: 'premium-wireless-headphones-pro', description: 'Experience immersive sound with our flagship wireless headphones featuring 40-hour battery life, active noise cancellation, and Hi-Res Audio certification.', shortDescription: 'Premium ANC headphones with 40hr battery & Hi-Res Audio', price: 349.99, salePrice: 279.99, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800'], category: 'cat-001', brand: 'AudioMax', stock: 48, sku: 'SKU-AWH-001', tags: ['headphones', 'wireless', 'noise-cancelling', 'premium'], specifications: [{ key: 'Driver Size', value: '40mm' }, { key: 'Battery Life', value: '40 hours' }, { key: 'Connectivity', value: 'Bluetooth 5.2' }, { key: 'Weight', value: '250g' }], variants: [{ name: 'Color', options: ['Midnight Black', 'Pearl White', 'Rose Gold'] }], ratings: { average: 4.8, count: 324 }, isFeatured: true, isActive: true, freeShipping: true, soldCount: 1240 },
    { _id: 'prod-002', name: 'Smart Watch Series X Pro', slug: 'smart-watch-series-x-pro', description: 'The most advanced smartwatch ever. Features health monitoring, GPS, always-on display, and 18-day battery life. Water resistant to 100m.', shortDescription: 'Advanced smartwatch with health monitoring & 18-day battery', price: 599.99, salePrice: 499.99, images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800'], category: 'cat-001', brand: 'TechWear', stock: 62, sku: 'SKU-SWX-002', tags: ['smartwatch', 'fitness', 'health', 'GPS'], specifications: [{ key: 'Display', value: '1.9" AMOLED' }, { key: 'Battery', value: '18 days' }, { key: 'Water Resistance', value: '100m ATM' }], variants: [{ name: 'Size', options: ['41mm', '45mm'] }, { name: 'Color', options: ['Black', 'Silver', 'Gold'] }], ratings: { average: 4.9, count: 511 }, isFeatured: true, isActive: true, freeShipping: true, soldCount: 2300 },
    { _id: 'prod-003', name: '4K Ultra HD Gaming Monitor 27"', slug: '4k-ultra-hd-gaming-monitor-27', description: 'Dominate your game with our 27-inch 4K IPS gaming monitor. Featuring 1ms response time, 144Hz refresh rate, and DisplayHDR 600 certification.', shortDescription: '27" 4K IPS gaming monitor, 144Hz, 1ms, DisplayHDR 600', price: 799.99, salePrice: null, images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800'], category: 'cat-001', brand: 'PixelMaster', stock: 23, sku: 'SKU-MON-003', tags: ['monitor', 'gaming', '4K', 'HDR'], specifications: [{ key: 'Resolution', value: '3840x2160' }, { key: 'Panel', value: 'IPS' }, { key: 'Refresh Rate', value: '144Hz' }], variants: [], ratings: { average: 4.7, count: 189 }, isFeatured: true, isActive: true, freeShipping: true, soldCount: 456 },
    { _id: 'prod-004', name: "Men's Premium Leather Jacket", slug: 'mens-premium-leather-jacket', description: 'Elevate your style with our genuine leather jacket. Full-grain cowhide leather with YKK zippers, quilted lining, and multiple pockets.', shortDescription: 'Full-grain leather jacket with YKK zippers and quilted lining', price: 459.99, salePrice: 369.99, images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800'], category: 'cat-002', brand: 'LeatherCraft', stock: 35, sku: 'SKU-LJM-004', tags: ['leather', 'jacket', 'premium', 'fashion'], specifications: [{ key: 'Material', value: 'Full-grain cowhide' }, { key: 'Lining', value: 'Quilted polyester' }], variants: [{ name: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] }, { name: 'Color', options: ['Black', 'Brown'] }], ratings: { average: 4.6, count: 267 }, isFeatured: true, isActive: true, freeShipping: false, soldCount: 890 },
    { _id: 'prod-005', name: 'Minimalist Desk Lamp with Wireless Charging', slug: 'minimalist-desk-lamp-wireless-charging', description: 'Beautiful desk lamp with built-in 15W wireless charging pad, 4 color temperatures, 10 brightness levels, and USB-A/USB-C ports.', shortDescription: 'LED desk lamp with 15W wireless charging, 4 color modes', price: 89.99, salePrice: 69.99, images: ['https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800'], category: 'cat-003', brand: 'LightPro', stock: 120, sku: 'SKU-DL-005', tags: ['lamp', 'wireless-charging', 'desk', 'home'], specifications: [{ key: 'Wattage', value: '12W LED' }, { key: 'Wireless Charging', value: '15W Qi' }], variants: [{ name: 'Color', options: ['White', 'Black', 'Silver'] }], ratings: { average: 4.7, count: 432 }, isFeatured: false, isActive: true, freeShipping: true, soldCount: 1560 },
    { _id: 'prod-006', name: 'Professional Yoga Mat Premium', slug: 'professional-yoga-mat-premium', description: 'Eco-friendly professional yoga mat made from natural rubber. Features 6mm cushioning, non-slip alignment lines, and carrying strap.', shortDescription: 'Natural rubber yoga mat, 6mm, non-slip, eco-friendly', price: 79.99, salePrice: null, images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'], category: 'cat-004', brand: 'ZenFit', stock: 87, sku: 'SKU-YM-006', tags: ['yoga', 'fitness', 'eco-friendly', 'sports'], specifications: [{ key: 'Material', value: 'Natural rubber' }, { key: 'Thickness', value: '6mm' }], variants: [{ name: 'Color', options: ['Purple', 'Blue', 'Green', 'Black'] }], ratings: { average: 4.5, count: 198 }, isFeatured: false, isActive: true, freeShipping: false, soldCount: 723 },
    { _id: 'prod-007', name: 'Luxury Skincare Set - 5 Piece', slug: 'luxury-skincare-set-5-piece', description: 'Complete luxury skincare routine with Vitamin C serum, hyaluronic acid moisturizer, retinol night cream, eye cream, and SPF 50 sunscreen.', shortDescription: 'Complete 5-piece luxury skincare set for all skin types', price: 189.99, salePrice: 149.99, images: ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800'], category: 'cat-005', brand: 'LuminSkin', stock: 54, sku: 'SKU-SK-007', tags: ['skincare', 'beauty', 'luxury', 'set'], specifications: [{ key: 'Contents', value: '5 products' }, { key: 'Skin Type', value: 'All skin types' }], variants: [], ratings: { average: 4.8, count: 345 }, isFeatured: true, isActive: true, freeShipping: true, soldCount: 1100 },
    { _id: 'prod-008', name: 'Mechanical Gaming Keyboard RGB', slug: 'mechanical-gaming-keyboard-rgb', description: 'Full-size mechanical keyboard with Cherry MX Red switches, per-key RGB lighting, aluminum frame, and macro programmability.', shortDescription: 'Mechanical keyboard, Cherry MX Red, per-key RGB, aluminum', price: 179.99, salePrice: 149.99, images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800'], category: 'cat-001', brand: 'TypeMaster', stock: 41, sku: 'SKU-KB-008', tags: ['keyboard', 'gaming', 'mechanical', 'RGB'], specifications: [{ key: 'Switch', value: 'Cherry MX Red' }, { key: 'Layout', value: 'Full-size 104 key' }], variants: [{ name: 'Switch', options: ['Red (Linear)', 'Blue (Clicky)', 'Brown (Tactile)'] }], ratings: { average: 4.7, count: 421 }, isFeatured: false, isActive: true, freeShipping: true, soldCount: 980 },
    { _id: 'prod-009', name: 'Stainless Steel Water Bottle Insulated', slug: 'stainless-steel-water-bottle-insulated', description: 'Double-wall vacuum insulated stainless steel bottle. Keeps drinks cold 24hrs, hot 12hrs. BPA-free, leak-proof lid, 32oz capacity.', shortDescription: '32oz insulated bottle, cold 24hrs, hot 12hrs, BPA-free', price: 44.99, salePrice: 34.99, images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800'], category: 'cat-004', brand: 'HydroMax', stock: 200, sku: 'SKU-WB-009', tags: ['bottle', 'water', 'insulated', 'eco'], specifications: [{ key: 'Capacity', value: '32 oz' }, { key: 'Material', value: 'Stainless Steel 18/8' }], variants: [{ name: 'Color', options: ['Ocean Blue', 'Midnight Black', 'Forest Green', 'Rose Quartz'] }], ratings: { average: 4.9, count: 872 }, isFeatured: false, isActive: true, freeShipping: true, soldCount: 3200 },
    { _id: 'prod-010', name: 'Wireless Ergonomic Mouse Pro', slug: 'wireless-ergonomic-mouse-pro', description: 'Scientifically designed ergonomic mouse reduces wrist strain by 45%. Features adjustable DPI up to 4000, 70hr battery, silent clicks.', shortDescription: 'Ergonomic wireless mouse, 4000 DPI, 70hr battery, silent', price: 89.99, salePrice: 74.99, images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=800'], category: 'cat-001', brand: 'ErgoTech', stock: 76, sku: 'SKU-MS-010', tags: ['mouse', 'ergonomic', 'wireless', 'office'], specifications: [{ key: 'DPI', value: '400-4000' }, { key: 'Battery', value: '70 hours' }], variants: [{ name: 'Color', options: ['Black', 'White'] }], ratings: { average: 4.6, count: 234 }, isFeatured: false, isActive: true, freeShipping: true, soldCount: 670 },
    { _id: 'prod-011', name: 'Portable Bluetooth Speaker 360°', slug: 'portable-bluetooth-speaker-360', description: '360° omnidirectional sound with deep bass. Waterproof IPX7, 20hr battery, dual pairing, and built-in power bank to charge your devices.', shortDescription: '360° sound, IPX7 waterproof, 20hr battery, power bank', price: 129.99, salePrice: 99.99, images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800'], category: 'cat-001', brand: 'SoundWave', stock: 58, sku: 'SKU-SP-011', tags: ['speaker', 'bluetooth', 'portable', 'waterproof'], specifications: [{ key: 'Sound', value: '360° omnidirectional' }, { key: 'Battery', value: '20 hours' }, { key: 'Waterproof', value: 'IPX7' }], variants: [{ name: 'Color', options: ['Black', 'Blue', 'Red', 'Green'] }], ratings: { average: 4.5, count: 567 }, isFeatured: true, isActive: true, freeShipping: true, soldCount: 1890 },
    { _id: 'prod-012', name: "Women's Running Shoes Ultralight", slug: 'womens-running-shoes-ultralight', description: 'Engineered mesh upper for breathability, responsive foam midsole, and durable rubber outsole. 20% lighter than competitors.', shortDescription: 'Ultralight running shoes with responsive foam and mesh upper', price: 129.99, salePrice: null, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'], category: 'cat-002', brand: 'SpeedRun', stock: 94, sku: 'SKU-RS-012', tags: ['shoes', 'running', 'women', 'sports'], specifications: [{ key: 'Upper', value: 'Engineered mesh' }, { key: 'Drop', value: '8mm' }], variants: [{ name: 'Size', options: ['5', '6', '7', '8', '9', '10'] }, { name: 'Color', options: ['Pink/White', 'Black/Gold', 'Blue/White'] }], ratings: { average: 4.7, count: 398 }, isFeatured: false, isActive: true, freeShipping: false, soldCount: 1450 },
];

const _reviews: Review[] = [
    { _id: 'rev-001', product: 'prod-001', user: 'admin-001', rating: 5, title: "Best headphones I've ever owned!", body: 'The ANC is incredible, sound quality is pristine, and the battery life is outstanding. Worth every penny!', isVerifiedPurchase: true, helpful: 45, createdAt: new Date().toISOString() },
    { _id: 'rev-002', product: 'prod-001', user: 'user-001', rating: 4, title: 'Great headphones, minor issues', body: 'Sound quality is excellent but the headband feels slightly tight initially. Gets comfortable after breaking in.', isVerifiedPurchase: true, helpful: 23, createdAt: new Date().toISOString() },
    { _id: 'rev-003', product: 'prod-002', user: 'admin-001', rating: 5, title: 'Game-changing smartwatch', body: 'The health tracking features are incredibly accurate and the battery life is amazing. Highly recommend!', isVerifiedPurchase: true, helpful: 67, createdAt: new Date().toISOString() },
];

const _users: User[] = [
    { _id: 'admin-001', name: 'Admin User', email: 'admin@nexmart.com', password: '$2b$12$TED/bIW/Is6rnJOaHfeEmuouuIMj/.jUIg4Mb/UTIiCNFgOFZuIYG', role: 'admin', avatar: '', addresses: [], wishlist: [], createdAt: new Date().toISOString() },
    { _id: 'user-001', name: 'Demo User', email: 'user@nexmart.com', password: '$2b$12$TED/bIW/Is6rnJOaHfeEmuouuIMj/.jUIg4Mb/UTIiCNFgOFZuIYG', role: 'user', avatar: '', addresses: [{ type: 'home', street: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA', isDefault: true }], wishlist: [], createdAt: new Date().toISOString() },
];

// Module-level singletons (shared across requests in same function instance)
declare global {
    // eslint-disable-next-line no-var
    var __nexmart_store: {
        categories: Category[];
        products: Product[];
        reviews: Review[];
        users: User[];
        orders: Order[];
        carts: Record<string, { items: any[] }>;
        wishlists: Record<string, string[]>;
    } | undefined;
}

if (!global.__nexmart_store) {
    global.__nexmart_store = {
        categories: _categories,
        products: _products,
        reviews: _reviews,
        users: _users,
        orders: [],
        carts: {},
        wishlists: {},
    };
}

export const store = global.__nexmart_store;
