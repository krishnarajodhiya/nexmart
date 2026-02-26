import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    avatar?: string;
}

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    salePrice?: number;
    image: string;
    quantity: number;
    variant?: string;
    stock: number;
}

export interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription?: string;
    price: number;
    salePrice?: number;
    images: string[];
    category: any;
    brand: string;
    stock: number;
    sku: string;
    tags: string[];
    specifications: { key: string; value: string }[];
    variants: { name: string; options: string[] }[];
    ratings: { average: number; count: number };
    isFeatured: boolean;
    isActive: boolean;
    freeShipping: boolean;
    soldCount: number;
    discountPercent?: number;
}

// Auth Store
interface AuthStore {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            setAuth: (user, token) => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('nexmart_token', token);
                    localStorage.setItem('nexmart_user', JSON.stringify(user));
                }
                set({ user, token, isAuthenticated: true });
            },
            logout: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('nexmart_token');
                    localStorage.removeItem('nexmart_user');
                }
                set({ user: null, token: null, isAuthenticated: false });
            },
            updateUser: (userData) => set((state) => ({ user: state.user ? { ...state.user, ...userData } : null })),
        }),
        { name: 'nexmart-auth' }
    )
);

// Cart Store
interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: CartItem) => void;
    removeItem: (productId: string, variant?: string) => void;
    updateQuantity: (productId: string, quantity: number, variant?: string) => void;
    clearCart: () => void;
    setItems: (items: CartItem[]) => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            addItem: (item) => {
                set((state) => {
                    const existing = state.items.findIndex(i => i.productId === item.productId && i.variant === item.variant);
                    if (existing > -1) {
                        const updated = [...state.items];
                        updated[existing] = { ...updated[existing], quantity: updated[existing].quantity + item.quantity };
                        return { items: updated };
                    }
                    return { items: [...state.items, item] };
                });
            },
            removeItem: (productId, variant) => set((state) => ({
                items: state.items.filter(i => !(i.productId === productId && i.variant === variant))
            })),
            updateQuantity: (productId, quantity, variant) => set((state) => ({
                items: quantity <= 0
                    ? state.items.filter(i => !(i.productId === productId && i.variant === variant))
                    : state.items.map(i => i.productId === productId && i.variant === variant ? { ...i, quantity } : i)
            })),
            clearCart: () => set({ items: [] }),
            setItems: (items) => set({ items }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
            getTotalPrice: () => get().items.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0),
        }),
        { name: 'nexmart-cart' }
    )
);

// Wishlist Store
interface WishlistStore {
    items: string[]; // product IDs
    toggleItem: (productId: string) => void;
    isWishlisted: (productId: string) => boolean;
    setItems: (items: string[]) => void;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            toggleItem: (productId) => set((state) => ({
                items: state.items.includes(productId)
                    ? state.items.filter(id => id !== productId)
                    : [...state.items, productId]
            })),
            isWishlisted: (productId) => get().items.includes(productId),
            setItems: (items) => set({ items }),
        }),
        { name: 'nexmart-wishlist' }
    )
);

// UI Store
interface UIStore {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    mobileMenuOpen: boolean;
    toggleMobileMenu: () => void;
    closeMobileMenu: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    mobileMenuOpen: false,
    toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
    closeMobileMenu: () => set({ mobileMenuOpen: false }),
}));
