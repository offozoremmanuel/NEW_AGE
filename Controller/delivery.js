const Delivery = require('../models/delivery');
const Order = require('../models/order');
const Cart = require('../models/cart');
const otpGen = require('otp-generator');

const generateTrackingNumber = () => {
    return `DEL-${Date.now()}-${otpGen.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    })}`;
};

exports.createDelivery = async (req, res) => {
    try {
        const { orderId, cartItems, deliveryAddress, riderName, riderPhoneNumber } = req.body;

        if (!orderId || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0 || !deliveryAddress) {
            return res.status(400).json({
                message: 'orderId, cartItems, and deliveryAddress are required'
            });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        const carts = await Cart.find({
            _id: { $in: cartItems }
        });

        if (carts.length !== cartItems.length) {
            return res.status(404).json({
                message: 'One or more cart items were not found'
            });
        }

        const delivery = await Delivery.create({
            orderId,
            cartItems,
            deliveryAddress,
            riderName,
            riderPhoneNumber,
            trackingNumber: generateTrackingNumber()
        });

        res.status(201).json({
            message: 'Delivery created successfully',
            data: delivery
        });
    } catch (error) {
        console.log(error.message || error);
        res.status(500).json({
            message: 'something went wrong'
        });
    }
};

exports.getAllDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.find()
            .populate('orderId')
            .populate('cartItems');

        res.status(200).json({
            message: 'Deliveries fetched successfully',
            data: deliveries
        });
    } catch (error) {
        console.log(error.message || error);
        res.status(500).json({
            message: 'something went wrong'
        });
    }
};

exports.getOneDelivery = async (req, res) => {
    try {
        const { id } = req.params;

        const delivery = await Delivery.findById(id)
            .populate('orderId')
            .populate('cartItems');

        if (!delivery) {
            return res.status(404).json({
                message: 'Delivery not found'
            });
        }

        res.status(200).json({
            message: 'Delivery fetched successfully',
            data: delivery
        });
    } catch (error) {
        console.log(error.message || error);
        res.status(500).json({
            message: 'something went wrong'
        });
    }
};

exports.updateDeliveryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { deliveryStatus, riderName, riderPhoneNumber } = req.body;

        const updateData = {};
        if (deliveryStatus) updateData.deliveryStatus = deliveryStatus;
        if (riderName) updateData.riderName = riderName;
        if (riderPhoneNumber) updateData.riderPhoneNumber = riderPhoneNumber;
        if (deliveryStatus === 'delivered') updateData.deliveredAt = new Date();

        const delivery = await Delivery.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!delivery) {
            return res.status(404).json({
                message: 'Delivery not found'
            });
        }

        res.status(200).json({
            message: 'Delivery updated successfully',
            data: delivery
        });
    } catch (error) {
        console.log(error.message || error);
        res.status(500).json({
            message: 'something went wrong'
        });
    }
};
