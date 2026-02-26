const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (global.useInMemory) {
            // Check store users (which contains both admin and demo user)
            const { users } = require('../data/store');
            const found = users.find(u => u._id === decoded.id);
            // Fallback: construct a minimal user object from the token if not in store (e.g. newly registered)
            req.user = found || { _id: decoded.id, role: decoded.role, name: 'User', email: '' };
        } else {
            const User = require('../models/User');
            req.user = await User.findById(decoded.id);
        }

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Token is invalid or expired' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
