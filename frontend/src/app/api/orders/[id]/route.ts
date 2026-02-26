import { NextRequest } from 'next/server';
import { store } from '@/lib/store';
import { getAuthUser, requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = await getAuthUser(req);
    const err = requireAuth(user);
    if (err) return err;
    const { id } = await params;
    const order = store.orders.find(o => o._id === id || o.orderNumber === id);
    if (!order) return Response.json({ success: false, message: 'Order not found' }, { status: 404 });
    return Response.json({ success: true, order });
}
