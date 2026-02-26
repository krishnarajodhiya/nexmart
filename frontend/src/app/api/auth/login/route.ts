import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { store } from '@/lib/store';
import { signToken, getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        if (!email || !password)
            return Response.json({ success: false, message: 'Please provide email and password' }, { status: 400 });

        const user = store.users.find(u => u.email === email);
        if (!user) return Response.json({ success: false, message: 'Invalid credentials' }, { status: 401 });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return Response.json({ success: false, message: 'Invalid credentials' }, { status: 401 });

        const token = await signToken(user._id, user.role);
        const { password: _, ...safeUser } = user;
        return Response.json({ success: true, token, user: safeUser });
    } catch (err: any) {
        return Response.json({ success: false, message: err.message }, { status: 500 });
    }
}
