const axios = require('axios');
const Payment = require('../models/payment');
const CartModel = require('../models/cart');
const customerModel = require('../models/customer');
const otpGen = require('otp-generator');

const generateReference = () => {
    const code = otpGen.generate(10, {
        digits: true,
        upperCaseAlphabets: true,
        lowerCaseAlphabets: false,
        specialChars: false
    });

    return `PAY-NEW-AGE${Date.now()}-${code}`;
};

exports.initializePayment = async (req, res) => {
    try {
        const { customerId, cartItems, email } = req.body;

        if (!customerId || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0 || !email) {
            return res.status(400).json({
                message: 'customerId, email, and cartItems are required'
            });
        }

        const customer = await customerModel.findById(customerId);

        if (!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            });
        }

        const carts = await CartModel.find({
            _id: { $in: cartItems },
            customerId
        });

        if (carts.length !== cartItems.length) {
            return res.status(404).json({
                message: 'One or more cart items were not found'
            });
        }

        const amount = carts.reduce((total, cart) => total + cart.totalPrice, 0);
        const reference = generateReference();

        const payment = await Payment.create({
            customerId,
            cartItems,
            amount,
            reference
        });

        const payload = {
            amount,
            currency: payment.currency,
            reference,
            customer: {
                email,
                name: `${customer.firstName} ${customer.lastName}`
            },
            redirect_url: 'http://localhost:6677/api/v1/payment/verify-payment'
        };

        const { data } = await axios.post(
            'https://api.korapay.com/merchant/api/v1/charges/initialize',
            payload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.KORA_API_KEY}`
                }
            }
        );

        payment.checkoutUrl = data.data.checkout_url;
        await payment.save();

        res.status(201).json({
            message: 'Payment initialized successfully',
            data: payment,
            paymentLink: payment.checkoutUrl
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { reference } = req.query;

        if (!reference) {
            return res.status(400).json({
                message: 'Payment reference is required'
            });
        }

        const payment = await Payment.findOne({ reference });

        if (!payment) {
            return res.status(404).json({
                message: 'Payment not found'
            });
        }

        const { data } = await axios.get(
            `https://api.korapay.com/merchant/api/v1/charges/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.KORA_SK}`
                }
            }
        );

        if (data.status === true && data.data.status === 'success') {
            payment.status = 'successful';
        } else if (data.status === true && data.data.status === 'processing') {
            payment.status = 'processing';
        } else {
            payment.status = 'failed';
        }

        await payment.save();

        res.status(200).json({
            message: 'Payment verification completed',
            status: payment.status,
            data: payment
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
