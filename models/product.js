const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },

    productPrice: {
        type: Number,
        required: true
    },

    discountPrice: {
        type: Number
    },

    productDescription: {
        type: String,
        required: true,
        trim: true
    },

    productCategory: {
        type: String,
        enum: ['audio', 'chargers', 'smartwatch', 'powerbank', 'cables', 'jumpstarters'],
        required: true,
        lowercase: true,
        trim: true
    },

    productBrand: {
        type: String,
        trim: true
    },

    productQuantity: {
        type: Number,
        required: true,
        min: 0
    },

    productImage: [{
        type: String,
        required: true
    }],

    publicImagesId: [{
        type: String,
        required: true
    }],

    productRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },

    isFeatured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;
