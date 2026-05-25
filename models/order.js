const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
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

    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
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