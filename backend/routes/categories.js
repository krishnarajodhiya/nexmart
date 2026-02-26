const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        if (global.useInMemory) {
            const { categories } = require('../data/store');
            return res.json({ success: true, categories: categories.filter(c => c.isActive) });
        }
        const Category = require('../models/Category');
        const categories = await Category.find({ isActive: true }).sort('sortOrder');
        res.json({ success: true, categories });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        if (global.useInMemory) {
            const { categories } = require('../data/store');
            const cat = categories.find(c => c._id === req.params.id || c.slug === req.params.id);
            if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
            return res.json({ success: true, category: cat });
        }
        const Category = require('../models/Category');
        const category = await Category.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }] });
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        res.json({ success: true, category });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        if (global.useInMemory) {
            const { categories } = require('../data/store');
            const cat = { _id: 'cat-' + Date.now(), ...req.body, slug: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), isActive: true };
            categories.push(cat);
            return res.status(201).json({ success: true, category: cat });
        }
        const Category = require('../models/Category');
        const category = await Category.create(req.body);
        res.status(201).json({ success: true, category });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
