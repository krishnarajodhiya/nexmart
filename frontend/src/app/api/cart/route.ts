import { NextRequest } from 'next/server';
import { store } from '@/lib/store';
import { getAuthUser, requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const user = await getAuthUser(req);
    const err = requireAuth(user);
    if (err) return err;
    const cart = store.carts[user!._id] || { items: [] };
    return Response.json({ success: true, cart });
}

export async function POST(req: NextRequest) {
    const user = await getAuthUser(req);
    const err = requireAuth(user);
    if (err) return err;
    const { productId, quantity = 1, variant } = await req.json();
    const product = store.products.find(p => p._id === productId);
    if (!product) return Response.json({ success: false, message: 'Product not found' }, { status: 404 });
    if (!store.carts[user!._id]) store.carts[user!._id] = { items: [] };
    const cart = store.carts[user!._id];
    const existing = cart.items.find((i: any) => i.productId === productId && JSON.stringify(i.variant) === JSON.stringify(variant));
    if (existing) { existing.quantity += quantity; } else { cart.items.push({ productId, quantity, variant, name: product.name, price: product.price, salePrice: product.salePrice, image: product.images[0] }); }
    return Response.json({ success: true, cart });
}

export async function DELETE(req: NextRequest) {
    const user = await getAuthUser(req);
    const err = requireAuth(user);
    if (err) return err;
    store.carts[user!._id] = { items: [] };
    return Response.json({ success: true, cart: { items: [] } });
}
