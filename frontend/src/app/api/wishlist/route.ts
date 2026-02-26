import { NextRequest } from 'next/server';
import { store } from '@/lib/store';
import { getAuthUser, requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const user = await getAuthUser(req);
    const err = requireAuth(user);
    if (err) return err;
    const wishlist = store.wishlists[user!._id] || [];
    const products = wishlist.map(id => store.products.find(p => p._id === id)).filter(Boolean);
    return Response.json({ success: true, items: products });
}

export async function POST(req: NextRequest) {
    const user = await getAuthUser(req);
    const err = requireAuth(user);
    if (err) return err;
    const { productId } = await req.json();
    if (!store.wishlists[user!._id]) store.wishlists[user!._id] = [];
    if (!store.wishlists[user!._id].includes(productId)) store.wishlists[user!._id].push(productId);
    return Response.json({ success: true, items: store.wishlists[user!._id] });
}

export async function DELETE(req: NextRequest) {
    const user = await getAuthUser(req);
    const err = requireAuth(user);
    if (err) return err;
    const { productId } = await req.json();
    if (store.wishlists[user!._id]) store.wishlists[user!._id] = store.wishlists[user!._id].filter(id => id !== productId);
    return Response.json({ success: true, items: store.wishlists[user!._id] || [] });
}
