const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/', protect, (req, res) => {
    const { wishlists, products } = require('../data/store');
    const list = wishlists[req.user._id] || [];
    const items = products.filter(p => list.includes(p._id));
    res.json({ success: true, wishlist: items });
});

router.post('/toggle/:productId', protect, (req, res) => {
    const { wishlists } = require('../data/store');
    if (!wishlists[req.user._id]) wishlists[req.user._id] = [];
    const list = wishlists[req.user._id];
    const idx = list.indexOf(req.params.productId);
    let action;
    if (idx > -1) { list.splice(idx, 1); action = 'removed'; }
    else { list.push(req.params.productId); action = 'added'; }
    res.json({ success: true, action, wishlist: list, message: `Product ${action} from wishlist` });
});

router.delete('/:productId', protect, (req, res) => {
    const { wishlists } = require('../data/store');
    if (wishlists[req.user._id]) {
        wishlists[req.user._id] = wishlists[req.user._id].filter(id => id !== req.params.productId);
    }
    res.json({ success: true, message: 'Removed from wishlist' });
});

module.exports = router;
