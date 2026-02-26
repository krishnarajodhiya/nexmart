import { NextRequest } from 'next/server';
import { store } from '@/lib/store';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const user = await getAuthUser(req);
        if (!user) return Response.json({ success: false, message: 'Not authenticated' }, { status: 401 });
        const { password: _, ...safeUser } = user;
        return Response.json({ success: true, user: safeUser });
    } catch (err: any) {
        return Response.json({ success: false, message: err.message }, { status: 500 });
    }
}
