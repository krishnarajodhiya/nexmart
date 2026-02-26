const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    images: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String, default: '' },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, unique: true },
    tags: [String],
    specifications: [{
        key: String,
        value: String
    }],
    variants: [{
        name: String,
        options: [String]
    }],
    ratings: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0 }
    },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    freeShipping: { type: Boolean, default: false },
    weight: { type: Number },
    dimensions: {
        length: Number,
        width: Number,
        height: Number
    },
    soldCount: { type: Number, default: 0 },
}, { timestamps: true });

// Auto-generate slug
productSchema.pre('save', function (next) {
    if (this.isModified('name') || this.isNew) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    }
    if (!this.sku) {
        this.sku = 'SKU-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
    next();
});

// Discount percentage virtual
productSchema.virtual('discountPercent').get(function () {
    if (this.salePrice && this.salePrice < this.price) {
        return Math.round(((this.price - this.salePrice) / this.price) * 100);
    }
    return 0;
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
