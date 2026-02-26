import { NextRequest } from 'next/server';
import { store } from '@/lib/store';

function enrich(p: any) {
    const cat = store.categories.find(c => c._id === p.category);
    return { ...p, category: cat || p.category, discountPercent: p.salePrice ? Math.round(((p.price - p.salePrice) / p.price) * 100) : 0 };
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const category = searchParams.get('category') || '';
        const search = searchParams.get('search') || '';
        const minPrice = searchParams.get('minPrice') || '';
        const maxPrice = searchParams.get('maxPrice') || '';
        const sort = searchParams.get('sort') || 'createdAt';
        const order = searchParams.get('order') || 'desc';
        const featured = searchParams.get('featured') === 'true';

        let filtered = store.products.filter(p => p.isActive);
        if (category) filtered = filtered.filter(p => p.category === category || store.categories.find(c => c._id === p.category && c.slug === category));
        if (search) { const q = search.toLowerCase(); filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q))); }
        if (minPrice) filtered = filtered.filter(p => (p.salePrice || p.price) >= parseFloat(minPrice));
        if (maxPrice) filtered = filtered.filter(p => (p.salePrice || p.price) <= parseFloat(maxPrice));
        if (featured) filtered = filtered.filter(p => p.isFeatured);

        filtered.sort((a, b) => {
            if (sort === 'price') return order === 'asc' ? (a.salePrice || a.price) - (b.salePrice || b.price) : (b.salePrice || b.price) - (a.salePrice || a.price);
            if (sort === 'rating') return order === 'asc' ? a.ratings.average - b.ratings.average : b.ratings.average - a.ratings.average;
            if (sort === 'popular') return b.soldCount - a.soldCount;
            return order === 'asc' ? 1 : -1;
        });

        const total = filtered.length;
        const paginated = filtered.slice((page - 1) * limit, (page - 1) * limit + limit);
        return Response.json({ success: true, products: paginated.map(enrich), total, page, pages: Math.ceil(total / limit) });
    } catch (err: any) {
        return Response.json({ success: false, message: err.message }, { status: 500 });
    }
}
