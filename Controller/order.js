const userModel = require('../models/userModel');
// const menuModel = require('../models/menuModel');
const orderModel = require('../models/order');
const otpGen = require('otp-generator');
const reference = otpGen.generate(10, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
const axios = require('axios');

exports.placeOrder = async (req, res, next) => {
    try {
        console.log("request ip: ",req.socket)
        const { id } = req.user;
        const { menuId } = req.params;
        const { quantity } = req.body;
        const user = await userModel.findById(id);
        console.log("my user: ", user)
        const menu = await menuModel.findById(menuId);

        if (!user) {
            return next({
                message: `User not found`,
                statusCode: 404
            })
        };

        if (!menu) {
            return next({
                message: `Menu not found`,
                statusCode: 404
            })
        };

        const payload = {
            amount: menu.amount * quantity,
            customer: {
                email: user.email,
                name: user.name
            },
            redirect_url: 'http://localhost:9065/api/order',
            currency: 'NGN',
            reference: reference
        };

        const { data } = await axios.post('https://api.korapay.com/merchant/api/v1/charges/initialize', payload, {
            headers: {
                Authorization:  `Bearer ${process.env.KORA_SK}`
            }
        });

        console.log(data)

        const order = new orderModel({
            restaurantId : menu.restaurantId,
            userId: user._id,
            menuId: menu._id,
            quantity,
            total: menu.amount * quantity,
            reference: data.data.reference
        });

        await order.save();

       return next({
        message: 'Order placed successfully',
        statusCode: 200
       })
    } catch (error) {
        // console.log(error)
        next({
                message: error.message,
                statusCode: 500
            })
    }
};

exports.verifyPayment = async (req, res, next) => {
    try {
        const { reference } = req.query;
        const order = await orderModel.findOne({
            reference
        });

        if (!order) {
            return next({
                message: `No order found`,
                statusCode: 404
            })
        };

        const { data } = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`,
            {
                headers: {
                Authorization: `Bearer ${process.env.KORA_SK}`
            }}
        );

        console.log(data);

        if (data.status === true && data.data.status === 'processing') {
            order.status = 'processing'
            await order.save();
            return next({
                message: 'Payment is still processing',
                statusCode: 200
            })
        };

        if (data.status === true && data.data.status === 'success') {
            order.status = 'successful'
            await order.save();
           return next({
            message: 'Payment successful',
            statusCode: 200
           })
        };
    } catch (error) {
        next({
                message: error.message,
                statusCode: 500
            })
    }
}