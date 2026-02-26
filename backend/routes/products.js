const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// GET /api/products - list with filters, search, pagination
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 12, category, search, minPrice, maxPrice, sort = 'createdAt', order = 'desc', featured, brand } = req.query;

        if (global.useInMemory) {
            const { products, categories } = require('../data/store');
            let filtered = products.filter(p => p.isActive);
            if (category) filtered = filtered.filter(p => p.category === category || categories.find(c => c._id === p.category && c.slug === category));
            if (search) {
                const q = search.toLowerCase();
                filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)));
            }
            if (minPrice) filtered = filtered.filter(p => (p.salePrice || p.price) >= parseFloat(minPrice));
            if (maxPrice) filtered = filtered.filter(p => (p.salePrice || p.price) <= parseFloat(maxPrice));
            if (featured === 'true') filtered = filtered.filter(p => p.isFeatured);
            if (brand) filtered = filtered.filter(p => p.brand.toLowerCase() === brand.toLowerCase());

            // Sort
            filtered.sort((a, b) => {
                if (sort === 'price') return order === 'asc' ? (a.salePrice || a.price) - (b.salePrice || b.price) : (b.salePrice || b.price) - (a.salePrice || a.price);
                if (sort === 'rating') return order === 'asc' ? a.ratings.average - b.ratings.average : b.ratings.average - a.ratings.average;
                if (sort === 'popular') return b.soldCount - a.soldCount;
                return order === 'asc' ? 1 : -1;
            });

            const total = filtered.length;
            const start = (parseInt(page) - 1) * parseInt(limit);
            const paginated = filtered.slice(start, start + parseInt(limit));

            // Enrich with category info
            const enriched = paginated.map(p => ({
                ...p,
                category: categories.find(c => c._id === p.category) || p.category,
                discountPercent: p.salePrice ? Math.round(((p.price - p.salePrice) / p.price) * 100) : 0
            }));

            return res.json({ success: true, products: enriched, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
        }

        // MongoDB mode
        const Product = require('../models/Product');
        const query = { isActive: true };
        if (category) query.category = category;
        if (search) query.$text = { $search: search };
        if (minPrice || maxPrice) query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        if (featured === 'true') query.isFeatured = true;
        if (brand) query.brand = new RegExp(brand, 'i');

        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .populate('category', 'name slug')
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit));

        res.json({ success: true, products, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/products/featured
router.get('/featured', async (req, res) => {
    try {
        if (global.useInMemory) {
            const { products, categories } = require('../data/store');
            const featured = products.filter(p => p.isFeatured && p.isActive).slice(0, 8).map(p => ({
                ...p, category: categories.find(c => c._id === p.category) || p.category,
                discountPercent: p.salePrice ? Math.round(((p.price - p.salePrice) / p.price) * 100) : 0
            }));
            return res.json({ success: true, products: featured });
        }
        const Product = require('../models/Product');
        const products = await Product.find({ isFeatured: true, isActive: true }).populate('category', 'name slug').limit(8);
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        if (global.useInMemory) {
            const { products, categories } = require('../data/store');
            const product = products.find(p => p._id === req.params.id || p.slug === req.params.id);
            if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
            const enriched = { ...product, category: categories.find(c => c._id === product.category) || product.category, discountPercent: product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0 };
            return res.json({ success: true, product: enriched });
        }
        const Product = require('../models/Product');
        const product = await Product.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }] }).populate('category');
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/products - admin only
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        if (global.useInMemory) {
            const { products } = require('../data/store');
            const product = { _id: 'prod-' + Date.now(), ...req.body, ratings: { average: 0, count: 0 }, soldCount: 0, isActive: true, createdAt: new Date().toISOString() };
            products.push(product);
            return res.status(201).json({ success: true, product });
        }
        const Product = require('../models/Product');
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /api/products/:id - admin only
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        if (global.useInMemory) {
            const { products } = require('../data/store');
            const idx = products.findIndex(p => p._id === req.params.id);
            if (idx === -1) return res.status(404).json({ success: false, message: 'Product not found' });
            products[idx] = { ...products[idx], ...req.body };
            return res.json({ success: true, product: products[idx] });
        }
        const Product = require('../models/Product');
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE /api/products/:id - admin only
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        if (global.useInMemory) {
            const { products } = require('../data/store');
            const idx = products.findIndex(p => p._id === req.params.id);
            if (idx !== -1) products.splice(idx, 1);
            return res.json({ success: true, message: 'Product deleted' });
        }
        const Product = require('../models/Product');
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
