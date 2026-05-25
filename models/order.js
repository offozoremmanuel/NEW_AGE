const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: true
    },

    products: [

        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },

            quantity: {
                type: Number,
                required: true
            },

            price: {
                type: Number,
                required: true
            }
        }
    ],

    totalPrice: {
        type: Number,
        required: true
    },

    reference: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },

    checkoutUrl: {
        type: String,
        trim: true
    },

    paymentStatus: {
        type: String,
        enum: ['pending', 'processing', 'paid', 'failed'],
        default: 'pending'
    },

    orderStatus: {
        type: String,
        enum: [
            'processing',
            'shipped',
            'delivered',
            'cancelled'
        ],
        default: 'processing'
    },

    deliveryAddress: {
        type: String,
        required: true
    }

}, { timestamps: true });

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;
