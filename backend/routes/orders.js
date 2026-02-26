const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// GET all orders (admin) or user orders
router.get('/', protect, async (req, res) => {
    try {
        if (global.useInMemory) {
            const { orders } = require('../data/store');
            const userOrders = req.user.role === 'admin' ? orders : orders.filter(o => o.userId === req.user._id);
            return res.json({ success: true, orders: userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
        }
        const Order = require('../models/Order');
        const query = req.user.role === 'admin' ? {} : { user: req.user._id };
        const orders = await Order.find(query).populate('user', 'name email').sort('-createdAt');
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET single order
router.get('/:id', protect, async (req, res) => {
    try {
        if (global.useInMemory) {
            const { orders } = require('../data/store');
            const order = orders.find(o => o._id === req.params.id);
            if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
            return res.json({ success: true, order });
        }
        const Order = require('../models/Order');
        const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.product');
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// CREATE order
router.post('/', protect, async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, couponCode, notes } = req.body;
        if (!items || items.length === 0) return res.status(400).json({ success: false, message: 'No order items' });

        const subtotal = items.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);
        const shippingCost = subtotal > 99 ? 0 : 9.99;
        const tax = subtotal * 0.08;
        const total = subtotal + shippingCost + tax;
        const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
        const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        if (global.useInMemory) {
            const { orders, carts } = require('../data/store');
            const order = {
                _id: 'ord-' + Date.now(), orderNumber, userId: req.user._id,
                items, shippingAddress, paymentMethod: paymentMethod || 'card',
                paymentStatus: 'paid', orderStatus: 'confirmed',
                subtotal, shippingCost, tax, total, couponCode, notes, estimatedDelivery,
                statusHistory: [{ status: 'confirmed', timestamp: new Date().toISOString(), note: 'Order placed successfully' }],
                createdAt: new Date().toISOString()
            };
            orders.push(order);
            if (carts[req.user._id]) carts[req.user._id] = { items: [] };
            return res.status(201).json({ success: true, order });
        }

        const Order = require('../models/Order');
        const order = await Order.create({ user: req.user._id, orderNumber, items, shippingAddress, paymentMethod, subtotal, shippingCost, tax, total, couponCode, notes, estimatedDelivery, paymentStatus: 'paid', orderStatus: 'confirmed' });
        res.status(201).json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// UPDATE order status (admin)
router.patch('/:id/status', protect, authorize('admin'), async (req, res) => {
    try {
        const { status, note } = req.body;
        if (global.useInMemory) {
            const { orders } = require('../data/store');
            const order = orders.find(o => o._id === req.params.id);
            if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
            order.orderStatus = status;
            order.statusHistory.push({ status, timestamp: new Date().toISOString(), note });
            return res.json({ success: true, order });
        }
        const Order = require('../models/Order');
        const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: status, $push: { statusHistory: { status, note } } }, { new: true });
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
