import { NextRequest } from 'next/server';
import { store } from '@/lib/store';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const user = await getAuthUser(req);
    const err = requireAdmin(user);
    if (err) return err;
    const safeUsers = store.users.map(({ password: _, ...u }) => u);
    return Response.json({ success: true, users: safeUsers });
}
