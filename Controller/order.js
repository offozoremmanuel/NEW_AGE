const Order = require('../models/order');
const Product = require('../models/product');
const customerModel = require('../models/customer');
const axios = require('axios');
const otpGen = require('otp-generator');

const generateReference = () => {
    return `ORDER-${Date.now()}-${otpGen.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    })}`;
};

exports.createOrder = async (req, res) => {

    try {

        const {
            customerId,
            email,
            products,
            deliveryAddress
        } = req.body;

        if (!customerId || !email || !products || !Array.isArray(products) || products.length === 0 || !deliveryAddress) {
            return res.status(400).json({
                message: 'customerId, email, products, and deliveryAddress are required'
            });
        }

        const customer = await customerModel.findById(customerId);

        if (!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            });
        }

        let totalPrice = 0;

        const orderedProducts = [];
        for (const item of products) {
            const product = await Product.findById(
                item.productId
            );

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

        // create order
        const reference = generateReference();
        const order = await Order.create({

            customerId,

            products: orderedProducts,

            totalPrice,

            deliveryAddress,

            reference
        });




        // initialize korapay payment
          const payload = {
            amount: totalPrice,
            customer: {
                email,
                name: customer.firstName + " " + customer.lastName
            },
            redirect_url: 'http://localhost:6677/api/v1/order/verify-payment',
            currency: 'NGN',
            reference
        };
        const { data } = await axios.post('https://api.korapay.com/merchant/api/v1/charges/initialize', payload, {
            headers: {
                Authorization:  `Bearer ${process.env.KORA_API_KEY}`
            }
        });

        order.checkoutUrl = data.data.checkout_url;
        await order.save();

        res.status(201).json({

            message: 'Order created successfully',
            data: order,
            paymentLink: order.checkoutUrl
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
        const order = await Order.findOne({
            reference
        });

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            })
        };

        const { data } = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`,
            {
                headers: {
                Authorization: `Bearer ${process.env.KORA_API_KEY}`
            }}
        );

        console.log(data);

        if (data.status === true && data.data.status === 'processing') {
            order.paymentStatus = 'processing'
            await order.save();
           return res.status(200).json({
            message: 'Payment is being processed',
            status: 'processing'
           })
        };

        if (data.status === true && data.data.status === 'success') {
            order.paymentStatus = 'paid'
            await order.save();
           return res.status(200).json({
            message: 'Payment successful',
            status: 'paid'
           })
        };

        order.paymentStatus = 'failed'
        await order.save();

        return res.status(200).json({
            message: 'Payment failed',
            status: 'failed'
        })
    } catch (error) {
        next({
                message: error.message,
                statusCode: 500
            })
    }
}


