const orderModel = require('../models/order');
const productModel = require('../models/product');
const axios = require('axios');
const otpGen = require('otp-generator');

const reference = otpGen.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false
});

const createOrder = async (req, res) => {
    try {

        const {
            customerId,
            email,
            products,
            deliveryAddress
        } = req.body;

        let totalPrice = 0;

        const orderedProducts = [];

        // LOOP THROUGH PRODUCTS
        for (const item of products) {

            const product = await productModel
            .findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            totalPrice += product.productPrice * item.quantity;

            orderedProducts.push({
                productId: product._id,
                quantity: item.quantity,
                price: product.productPrice
            });
        }

        // CREATE ORDER
        const placeOrder = await orderModel.create({
            customerId,
            email,
            products: orderedProducts,
            totalPrice,
            deliveryAddress,
            reference
        });

        // INITIALIZE KORAPAY PAYMENT
        const payload = {
            amount: totalPrice,
            customer: {
                email: email
            },
            redirect_url: 'http://localhost:6677/api/v1/order/verify-payment',
            currency: 'NGN',
            reference: reference
        };

        const { data } = await axios.post(
            'https://api.korapay.com/merchant/api/v1/charges/initialize',
            payload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.KORA_SK}`
                }
            }
        );

        res.status(201).json({
            message: 'Order created successfully',
            data: placeOrder,
            paymentLink: data.data.checkout_url
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

const verifyPayment = async (req, res, next) => {
    try {

        const { reference } = req.query;

        const order = await orderModel.findOne({
            reference
        });

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
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

        if (data.status === true && data.data.status === 'processing') {

            order.status = 'processing';

            await order.save();

            return res.status(200).json({
                message: 'Payment is being processed',
                status: 'processing'
            });
        }

        if (data.status === true && data.data.status === 'success') {

            order.status = 'successful';

            await order.save();

            return res.status(200).json({
                message: 'Payment successful',
                status: 'successful'
            });
        }

    } catch (error) {

       return res.status(500).json({
        error: error.message
       })
    }
};
module.exports = {createOrder, verifyPayment}