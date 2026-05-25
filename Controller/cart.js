const Cart = require('../models/cart');
const Product = require('../models/product');

exports.addToCart = async (req, res) => {

    try {

        const { customerId, productId, quantity } = req.body;

        // check product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        const cartItemExist = await Cart.findOne({
            customerId,
            productId
        });

        if (cartItemExist) {
            cartItemExist.quantity += quantity;
            cartItemExist.totalPrice =
                cartItemExist.quantity * product.price;

            await cartItemExist.save();

            return res.status(200).json({
                message: 'Item already in cart, quantity updated',
                data: cartItemExist
            });
        }

        // create new cart item
        const cartItem = await Cart.create({

            customerId,
            productId,
            quantity,

            totalPrice: quantity * product.price
        });

        res.status(201).json({
            message: 'Product added to cart',
            data: cartItem
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};