import { NextRequest } from 'next/server';
import { store } from '@/lib/store';
import { getAuthUser, requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const user = await getAuthUser(req);
    const err = requireAuth(user);
    if (err) return err;
    const orders = user!.role === 'admin' ? store.orders : store.orders.filter(o => o.userId === user!._id);
    return Response.json({ success: true, orders: orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) });
}

export async function POST(req: NextRequest) {
    const user = await getAuthUser(req);
    const err = requireAuth(user);
    if (err) return err;
    try {
        const { items, shippingAddress, paymentMethod, couponCode, notes } = await req.json();
        if (!items?.length) return Response.json({ success: false, message: 'No order items' }, { status: 400 });
        const subtotal = items.reduce((sum: number, item: any) => sum + (item.salePrice || item.price) * item.quantity, 0);
        const shippingCost = subtotal > 99 ? 0 : 9.99;
        const tax = subtotal * 0.08;
        const total = subtotal + shippingCost + tax;
        const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
        const order = {
            _id: 'ord-' + Date.now(), orderNumber, userId: user!._id,
            items, shippingAddress, paymentMethod: paymentMethod || 'card',
            paymentStatus: 'paid', orderStatus: 'confirmed',
            subtotal, shippingCost, tax, total, couponCode, notes,
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            statusHistory: [{ status: 'confirmed', timestamp: new Date().toISOString(), note: 'Order placed successfully' }],
            createdAt: new Date().toISOString()
        };
        store.orders.push(order);
        if (store.carts[user!._id]) store.carts[user!._id] = { items: [] };
        return Response.json({ success: true, order }, { status: 201 });
    } catch (err: any) {
        return Response.json({ success: false, message: err.message }, { status: 500 });
    }
}
