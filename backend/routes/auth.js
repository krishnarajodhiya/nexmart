const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Please provide name, email and password' });

        if (global.useInMemory) {
            const { users } = require('../data/store');
            if (users.find(u => u.email === email)) return res.status(400).json({ success: false, message: 'Email already registered' });
            const hashed = await bcrypt.hash(password, 12);
            const newUser = { _id: 'user-' + Date.now(), name, email, password: hashed, role: 'user', avatar: '', addresses: [], wishlist: [], createdAt: new Date().toISOString() };
            users.push(newUser);
            const token = signToken(newUser._id, newUser.role);
            return res.status(201).json({ success: true, token, user: { _id: newUser._id, name, email, role: 'user', avatar: '' } });
        }

        const User = require('../models/User');
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });
        const user = await User.create({ name, email, password });
        const token = user.getJWTToken();
        res.status(201).json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide email and password' });

        if (global.useInMemory) {
            const { users } = require('../data/store');
            const user = users.find(u => u.email === email);
            if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
            const token = signToken(user._id, user.role);
            return res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
        }

        const User = require('../models/User');
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        const token = user.getJWTToken();
        res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/me', require('../middleware/auth').protect, async (req, res) => {
    try {
        if (global.useInMemory) {
            const { users } = require('../data/store');
            const user = users.find(u => u._id === req.user._id);
            const { password, ...safeUser } = user || req.user;
            return res.json({ success: true, user: safeUser });
        }
        const User = require('../models/User');
        const user = await User.findById(req.user._id);
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
