const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({

    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    quantity: {
        type: Number,
        default: 1
    },

    totalPrice: {
        type: Number,
        required: true
    }

}, { timestamps: true });

const cartModel = mongoose.model('Cart', cartSchema);

module.exports = cartModel