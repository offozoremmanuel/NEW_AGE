const router = require('express').Router();
const { addToCart } = require('../controller/cart');
/**
 * @swagger
 * tags:
 *   name: Product
 *   description: API endpoints for user management
 */

/**
 * @swagger
 * /api/v1/cart/add-to-cart:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Add product to cart
 *     description: Adds a product to a customer's cart or updates quantity if product already exists in cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - productId
 *               - quantity
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: Customer ID
 *                 example: 6855ab23c8d9f12345678901
 *               productId:
 *                 type: string
 *                 description: Product ID
 *                 example: 6855ab23c8d9f98765432101
 *               quantity:
 *                 type: number
 *                 description: Quantity of product
 *                 example: 2
 *     responses:
 *       201:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product added to cart
 *                 data:
 *                   type: object
 *                   properties:
 *                     customerId:
 *                       type: string
 *                       example: 6855ab23c8d9f12345678901
 *                     productId:
 *                       type: string
 *                       example: 6855ab23c8d9f98765432101
 *                     quantity:
 *                       type: number
 *                       example: 2
 *                     totalPrice:
 *                       type: number
 *                       example: 400000
 *       200:
 *         description: Cart updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Item already in cart, quantity updated
 *                 data:
 *                   type: object
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong
 */
router.post('/add-to-cart', addToCart);

module.exports = router;