const Order = require('../models/order');
const Product = require('../models/product');
const axios = require('axios');
const otpGen = require('otp-generator');
const reference = otpGen.generate(6, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });


exports.createOrder = createOrder = async (req, res) => {

    try {

        const {
            customerId,
            email,
            products,
            deliveryAddress
        } = req.body;

        let totalPrice = 0;

        const orderedProducts = [];
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

        // create order
        exports.placeOrder = await Order.create({

            customerId,

            products: orderedProducts,

            totalPrice,

            deliveryAddress
        });




        // initialize korapay payment
          const payload = {
            amount: menu.amount * quantity,
            customer: {
                email: user.email,
                name: user.firstName + " " + user.lastName
            },
            redirect_url: 'http://localhost:6677/api/order',
            currency: 'NGN',
            reference: reference
        };
        const { data } = await axios.post('https://api.korapay.com/merchant/api/v1/charges/initialize', payload, {
            headers: {
                Authorization:  `Bearer ${process.env.KORA_API_KEY}`
            }
        });
        res.status(201).json({

            message: 'Order created successfully',
            data: order,
            paymentLink: payment.data.data.checkout_url
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

exports.verifyPayment = async (req, res, next) => {
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
            order.status = 'processing'
            await order.save();
           return res.status(200).json({
            message: 'Payment is being processed',
            status: 'processing'
           })
        };

        if (data.status === true && data.data.status === 'success') {
            order.status = 'successful'
            await order.save();
           return res.status(200).json({
            message: 'Payment successful',
            status: 'successful'
           })
        };
    } catch (error) {
        next({
                message: error.message,
                statusCode: 500
            })
    }
}

