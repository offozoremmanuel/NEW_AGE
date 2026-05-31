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
        const { id } = req.params;
        const { cartItems, email } = req.body;

        if (!id) {
            return res.status(400).json({
                message: 'Customer ID is required'
            });
        }

        if (!email) {
            return res.status(400).json({
                message: 'Email is required'
            });
        }

        if (!cartItems) {
            return res.status(400).json({
                message: 'Cart items are required'
            });
        }

        const normalizedCartItems = Array.isArray(cartItems) ? cartItems : [cartItems];

        if (normalizedCartItems.length === 0) {
            return res.status(400).json({
                message: 'At least one cart item is required'
            });
        }

        if (normalizedCartItems.some((cartItem) => !cartItem)) {
            return res.status(400).json({
                message: 'Cart item ID is required'
            });
        }

        const customer = await customerModel.findById(id);

        if (!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            });
        }

        const carts = await CartModel.find({
            _id: { $in: normalizedCartItems },
            customerId: id
        });

        if (carts.length !== normalizedCartItems.length) {
            return res.status(404).json({
                message: 'One or more cart items were not found'
            });
        }

        const amount = carts.reduce((total, cart) => total + cart.totalPrice, 0);
        const reference = generateReference();

        const payment = await Payment.create({
            customerId: id,
            cartItems: normalizedCartItems,
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
            redirect_url: `http://localhost:6677/api/v1/payment/verify-payment/${payment._id}`
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
        console.log(error.message || error);
        res.status(500).json({
            message: 'something went wrong'
        });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: 'Payment ID is required'
            });
        }

        const payment = await Payment.findById(id);

        if (!payment) {
            return res.status(404).json({
                message: 'Payment not found'
            });
        }

        const { data } = await axios.get(
            `https://api.korapay.com/merchant/api/v1/charges/${payment.reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.KORA_API_KEY}`
                }
            }
        );

        if (data.status === true && data.data.status === 'success') {
            payment.status = 'successful';
            await payment.save();

            return res.status(200).json({
                message: 'Payment successful',
                status: payment.status,
                data: payment
            });
        }

        if (data.status === true && data.data.status === 'processing') {
            payment.status = 'processing';
            await payment.save();

            return res.status(200).json({
                message: 'Payment is processing',
                status: payment.status,
                data: payment
            });
        }

        if (data.status === true && data.data.status === 'failed') {
            payment.status = 'failed';
            await payment.save();

            return res.status(200).json({
                message: 'Payment failed',
                status: payment.status,
                data: payment
            });
        }

        payment.status = 'failed';
        await payment.save();

        return res.status(200).json({
            message: 'Unable to verify payment',
            status: payment.status,
            data: payment
        });
    } catch (error) {
        console.log(error.message || error);
        res.status(500).json({
            message: 'something went wrong'
        });
    }
};
