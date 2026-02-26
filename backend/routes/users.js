const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// GET profile
router.get('/profile', protect, (req, res) => {
    const { users } = require('../data/store');
    const user = global.useInMemory ? users.find(u => u._id === req.user._id) : req.user;
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const { password, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
});

// UPDATE profile
router.put('/profile', protect, async (req, res) => {
    try {
        const { name, phone, avatar } = req.body;
        if (global.useInMemory) {
            const { users } = require('../data/store');
            const idx = users.findIndex(u => u._id === req.user._id);
            if (idx === -1) return res.status(404).json({ success: false, message: 'User not found' });
            if (name) users[idx].name = name;
            if (phone) users[idx].phone = phone;
            if (avatar) users[idx].avatar = avatar;
            const { password, ...safeUser } = users[idx];
            return res.json({ success: true, user: safeUser });
        }
        const User = require('../models/User');
        const user = await User.findByIdAndUpdate(req.user._id, { name, phone, avatar }, { new: true });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ADD address
router.post('/address', protect, (req, res) => {
    const { users } = require('../data/store');
    const idx = users.findIndex(u => u._id === req.user._id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'User not found' });
    const address = { _id: 'addr-' + Date.now(), ...req.body };
    if (address.isDefault) users[idx].addresses.forEach(a => a.isDefault = false);
    users[idx].addresses.push(address);
    res.json({ success: true, addresses: users[idx].addresses });
});

// GET all users (admin)
router.get('/', protect, authorize('admin'), (req, res) => {
    const { users } = require('../data/store');
    const safeUsers = users.map(({ password, ...u }) => u);
    res.json({ success: true, users: safeUsers });
});

// GET stats (admin)
router.get('/admin/stats', protect, authorize('admin'), (req, res) => {
    const { users, products, orders, categories } = require('../data/store');
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const stats = {
        totalUsers: users.length, totalProducts: products.length,
        totalOrders: orders.length, totalCategories: categories.length,
        totalRevenue,
        recentOrders: orders.slice(-5).reverse(),
        topProducts: products.sort((a, b) => b.soldCount - a.soldCount).slice(0, 5),
        ordersByStatus: {
            pending: orders.filter(o => o.orderStatus === 'pending').length,
            confirmed: orders.filter(o => o.orderStatus === 'confirmed').length,
            shipped: orders.filter(o => o.orderStatus === 'shipped').length,
            delivered: orders.filter(o => o.orderStatus === 'delivered').length,
        }
    };
    res.json({ success: true, stats });
});

module.exports = router;
