import axios from 'axios';

// In production (Vercel), API calls are relative to the same domain.
// In development, this points to localhost:3000 (Next.js dev server).
// No separate backend needed!
const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach JWT token
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('nexmart_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor: handle errors
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || error.message || 'Something went wrong';
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('nexmart_token');
                localStorage.removeItem('nexmart_user');
            }
        }
        return Promise.reject(new Error(message));
    }
);

// Auth
export const authAPI = {
    register: (data: { name: string; email: string; password: string }) => api.post('/auth/register', data),
    login: (data: { email: string; password: string }) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
};

// Products
export const productsAPI = {
    getAll: (params?: Record<string, any>) => api.get('/products', { params }),
    getFeatured: () => api.get('/products?featured=true&limit=8'),
    getById: (id: string) => api.get(`/products/${id}`),
    create: (data: any) => api.post('/products', data),
    update: (id: string, data: any) => api.put(`/products/${id}`, data),
    delete: (id: string) => api.delete(`/products/${id}`),
};

// Categories
export const categoriesAPI = {
    getAll: () => api.get('/categories'),
    getById: (id: string) => api.get(`/categories/${id}`),
    create: (data: any) => api.post('/categories', data),
};

// Cart
export const cartAPI = {
    get: () => api.get('/cart'),
    add: (data: { productId: string; quantity: number; variant?: string }) => api.post('/cart', data),
    update: (data: { productId: string; quantity: number; variant?: string }) => api.post('/cart', data),
    remove: (productId: string) => api.post('/cart', { productId, quantity: -999 }),
    clear: () => api.delete('/cart'),
};

// Orders
export const ordersAPI = {
    getAll: () => api.get('/orders'),
    getById: (id: string) => api.get(`/orders/${id}`),
    create: (data: any) => api.post('/orders', data),
    updateStatus: (id: string, status: string, note?: string) => api.patch(`/orders/${id}/status`, { status, note }),
};

// Reviews
export const reviewsAPI = {
    getByProduct: (productId: string) => api.get(`/reviews?product=${productId}`),
    create: (data: any) => api.post('/reviews', data),
};

// Wishlist
export const wishlistAPI = {
    get: () => api.get('/wishlist'),
    add: (productId: string) => api.post('/wishlist', { productId }),
    remove: (productId: string) => api.delete('/wishlist', { data: { productId } }),
};

// Users (admin)
export const usersAPI = {
    getProfile: () => api.get('/auth/me'),
    updateProfile: (data: any) => api.put('/auth/me', data),
    getAll: () => api.get('/users'),
    getAdminStats: () => api.get('/users'),
};

export default api;
