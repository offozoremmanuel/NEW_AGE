const router = require('express').Router();
const { addToCart } = require('../Controller/cart');

router.post('/add-to-cart', addToCart);

module.exports = router;