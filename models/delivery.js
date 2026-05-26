const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },

    cartItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
    }],

    deliveryAddress: {
        type: String,
        required: true,
        trim: true
    },

    deliveryStatus: {
        type: String,
        enum: ['pending', 'dispatched', 'in-transit', 'delivered', 'cancelled'],
        default: 'pending'
    },

    trackingNumber: {
        type: String,
        unique: true,
        trim: true
    },

    riderName: {
        type: String,
        trim: true
    },

    riderPhoneNumber: {
        type: String,
        trim: true
    },

    deliveredAt: {
        type: Date
    }
}, { timestamps: true });

const deliveryModel = mongoose.model('Delivery', deliverySchema);

module.exports = deliveryModel;
