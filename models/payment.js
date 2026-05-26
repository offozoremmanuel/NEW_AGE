const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: true
    },

    cartItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
    }],

    amount: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: 'NGN',
        uppercase: true,
        trim: true
    },

    reference: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    paymentProvider: {
        type: String,
        enum: ['korapay'],
        default: 'korapay'
    },

    checkoutUrl: {
        type: String,
        trim: true
    },

    status: {
        type: String,
        enum: ['pending', 'processing', 'successful', 'failed'],
        default: 'pending'
    }
}, { timestamps: true });

const paymentModel = mongoose.model('Payment', paymentSchema);

module.exports = paymentModel;
