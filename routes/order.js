const router = require('express').Router();

const { createOrder, verifyPayment } = require('../Controller/order');
/**
 * @swagger
 * tags:
 *   name: User
 *   description: API endpoints for user management
 */
//  create order
/**
 * @swagger
 * /api/v1/order/create-order:
 *   post:
 *     tags:
 *       - Order
 *     summary: Place an order
 *     description: Creates a new customer order and initializes Korapay payment
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
 *               - email
 *               - products
 *               - deliveryAddress
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: Customer ID
 *                 example: 6855e0c8b7f5a2a0fbc12345
 *               email:
 *                 type: string
 *                 description: Customer email
 *                 example: johndoe@gmail.com
 *               deliveryAddress:
 *                 type: string
 *                 description: Customer delivery address
 *                 example: Lekki Phase 1, Lagos
 *               products:
 *                 type: array
 *                 description: List of ordered products
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: Product ID
 *                       example: 6855ab23c8d9f12345678901
 *                     quantity:
 *                       type: number
 *                       description: Quantity of product ordered
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     customerId:
 *                       type: string
 *                       example: 6855e0c8b7f5a2a0fbc12345
 *                     totalPrice:
 *                       type: number
 *                       example: 250000
 *                     deliveryAddress:
 *                       type: string
 *                       example: Lekki Phase 1, Lagos
 *                 paymentLink:
 *                   type: string
 *                   description: Korapay checkout URL
 *                   example: https://checkout.korapay.com/pay/123456
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
router.post('/create-order', createOrder);
// Verify Payments
/**
 * @swagger
 * /api/v1/order/verify-payment:
 *   get:
 *     tags:
 *       - Order
 *     summary: Verify payment status
 *     description: Verifies a payment made through Korapay using the payment reference
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: reference
 *         required: true
 *         description: Payment reference generated during checkout
 *         schema:
 *           type: string
 *           example: KORA-123456789
 *     responses:
 *       200:
 *         description: Payment verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment successful
 *                 status:
 *                   type: string
 *                   example: successful
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order not found
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
router.get('/verify-payment', verifyPayment);

module.exports = router;