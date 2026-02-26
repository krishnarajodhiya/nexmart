import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { store } from '@/lib/store';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();
        if (!name || !email || !password)
            return Response.json({ success: false, message: 'Please provide name, email and password' }, { status: 400 });

        if (store.users.find(u => u.email === email))
            return Response.json({ success: false, message: 'Email already registered' }, { status: 400 });

        const hashed = await bcrypt.hash(password, 12);
        const newUser = {
            _id: 'user-' + Date.now(), name, email, password: hashed,
            role: 'user' as const, avatar: '', addresses: [], wishlist: [], createdAt: new Date().toISOString()
        };
        store.users.push(newUser);
        const token = await signToken(newUser._id, newUser.role);
        const { password: _, ...safeUser } = newUser;
        return Response.json({ success: true, token, user: safeUser }, { status: 201 });
    } catch (err: any) {
        return Response.json({ success: false, message: err.message }, { status: 500 });
    }
}
