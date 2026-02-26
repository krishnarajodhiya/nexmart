import { store } from '@/lib/store';

export async function GET() {
    try {
        return Response.json({ success: true, categories: store.categories.filter(c => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder) });
    } catch (err: any) {
        return Response.json({ success: false, message: err.message }, { status: 500 });
    }
}
