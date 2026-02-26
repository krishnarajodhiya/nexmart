import { NextRequest } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import { store } from './store';

const SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'nexmart-secret-key-change-in-production'
);

export async function signToken(id: string, role: string) {
    return new SignJWT({ id, role })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('30d')
        .sign(SECRET);
}

export async function verifyToken(token: string) {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { id: string; role: string };
}

export async function getAuthUser(req: NextRequest) {
    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) return null;
    const token = auth.slice(7);
    try {
        const payload = await verifyToken(token);
        const user = store.users.find(u => u._id === payload.id);
        return user || null;
    } catch {
        return null;
    }
}

export function requireAuth(user: any) {
    if (!user) {
        return Response.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }
    return null;
}

export function requireAdmin(user: any) {
    const authErr = requireAuth(user);
    if (authErr) return authErr;
    if (user.role !== 'admin') {
        return Response.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }
    return null;
}
