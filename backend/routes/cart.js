const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// GET cart
router.get('/', protect, (req, res) => {
    const { carts } = require('../data/store');
    const cart = carts[req.user._id] || { items: [] };
    res.json({ success: true, cart });
});

// ADD to cart
router.post('/add', protect, (req, res) => {
    const { carts, products } = require('../data/store');
    const { productId, quantity = 1, variant = '' } = req.body;

    if (!carts[req.user._id]) carts[req.user._id] = { items: [] };
    const cart = carts[req.user._id];

    const product = products.find(p => p._id === productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const existingIdx = cart.items.findIndex(i => i.productId === productId && i.variant === variant);
    if (existingIdx > -1) {
        cart.items[existingIdx].quantity += quantity;
    } else {
        cart.items.push({
            productId, quantity, variant,
            name: product.name,
            price: product.price,
            salePrice: product.salePrice,
            image: product.images[0],
            stock: product.stock
        });
    }

    res.json({ success: true, cart, message: 'Added to cart' });
});

// UPDATE cart item
router.put('/update', protect, (req, res) => {
    const { carts } = require('../data/store');
    const { productId, quantity, variant = '' } = req.body;

    if (!carts[req.user._id]) return res.status(404).json({ success: false, message: 'Cart not found' });
    const cart = carts[req.user._id];

    const idx = cart.items.findIndex(i => i.productId === productId && i.variant === variant);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Item not in cart' });

    if (quantity <= 0) {
        cart.items.splice(idx, 1);
    } else {
        cart.items[idx].quantity = quantity;
    }

    res.json({ success: true, cart });
});

// REMOVE from cart
router.delete('/remove/:productId', protect, (req, res) => {
    const { carts } = require('../data/store');
    if (!carts[req.user._id]) return res.json({ success: true, cart: { items: [] } });
    carts[req.user._id].items = carts[req.user._id].items.filter(i => i.productId !== req.params.productId);
    res.json({ success: true, cart: carts[req.user._id] });
});

// CLEAR cart
router.delete('/clear', protect, (req, res) => {
    const { carts } = require('../data/store');
    carts[req.user._id] = { items: [] };
    res.json({ success: true, cart: { items: [] }, message: 'Cart cleared' });
});

module.exports = router;
