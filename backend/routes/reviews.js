const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/product/:productId', async (req, res) => {
    try {
        if (global.useInMemory) {
            const { reviews, users } = require('../data/store');
            const productReviews = reviews.filter(r => r.product === req.params.productId).map(r => ({
                ...r, user: users.find(u => u._id === r.user) || { name: 'Demo User', avatar: '' }
            }));
            return res.json({ success: true, reviews: productReviews });
        }
        const Review = require('../models/Review');
        const reviews = await Review.find({ product: req.params.productId, isApproved: true }).populate('user', 'name avatar');
        res.json({ success: true, reviews });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/', protect, async (req, res) => {
    try {
        const { productId, rating, title, body } = req.body;
        if (global.useInMemory) {
            const { reviews, products } = require('../data/store');
            const existing = reviews.find(r => r.product === productId && r.user === req.user._id);
            if (existing) return res.status(400).json({ success: false, message: 'You already reviewed this product' });
            const review = { _id: 'rev-' + Date.now(), product: productId, user: req.user._id, rating, title, body, isVerifiedPurchase: false, helpful: 0, createdAt: new Date().toISOString() };
            reviews.push(review);
            // Update product rating
            const productReviews = reviews.filter(r => r.product === productId);
            const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
            const prod = products.find(p => p._id === productId);
            if (prod) { prod.ratings.average = Math.round(avg * 10) / 10; prod.ratings.count = productReviews.length; }
            return res.status(201).json({ success: true, review: { ...review, user: { name: req.user.name, avatar: req.user.avatar } } });
        }
        const Review = require('../models/Review');
        const review = await Review.create({ product: productId, user: req.user._id, rating, title, body });
        res.status(201).json({ success: true, review });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
