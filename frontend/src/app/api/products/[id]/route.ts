import { NextRequest } from 'next/server';
import { store } from '@/lib/store';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const product = store.products.find(p => p._id === id || p.slug === id);
        if (!product) return Response.json({ success: false, message: 'Product not found' }, { status: 404 });
        const cat = store.categories.find(c => c._id === product.category);
        const enriched = { ...product, category: cat || product.category, discountPercent: product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0 };
        return Response.json({ success: true, product: enriched });
    } catch (err: any) {
        return Response.json({ success: false, message: err.message }, { status: 500 });
    }
}
