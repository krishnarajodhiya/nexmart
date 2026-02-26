import { NextRequest } from 'next/server';
import { store } from '@/lib/store';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('product');
    let reviews = store.reviews;
    if (productId) reviews = reviews.filter(r => r.product === productId);
    return Response.json({ success: true, reviews });
}

export async function POST(req: NextRequest) {
    const user = await getAuthUser(req);
    if (!user) return Response.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    const { productId, rating, title, body } = await req.json();
    const review = { _id: 'rev-' + Date.now(), product: productId, user: user._id, rating, title, body, isVerifiedPurchase: false, helpful: 0, createdAt: new Date().toISOString() };
    store.reviews.push(review);
    return Response.json({ success: true, review }, { status: 201 });
}
