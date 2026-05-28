const router = require('express').Router();
const { initializePayment, verifyPayment } = require('../controller/payment');

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: API endpoints for payment initialization and verification
 */

/**
 * @swagger
 * /api/v1/payment/initialize-payment:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Initialize payment
 *     description: Creates a payment record from customer cart items and initializes Korapay checkout
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - email
 *               - cartItems
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: Customer ID
 *                 example: 6855e0c8b7f5a2a0fbc12345
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Customer email address
 *                 example: johndoe@gmail.com
 *               cartItems:
 *                 type: array
 *                 description: List of cart item IDs to pay for
 *                 items:
 *                   type: string
 *                 example:
 *                   - 6855ab23c8d9f12345678901
 *                   - 6855ab23c8d9f12345678902
 *     responses:
 *       201:
 *         description: Payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment initialized successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     customerId:
 *                       type: string
 *                       example: 6855e0c8b7f5a2a0fbc12345
 *                     cartItems:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - 6855ab23c8d9f12345678901
 *                     amount:
 *                       type: number
 *                       example: 25000
 *                     currency:
 *                       type: string
 *                       example: NGN
 *                     reference:
 *                       type: string
 *                       example: PAY-1779710000000-1234567890
 *                     paymentProvider:
 *                       type: string
 *                       example: korapay
 *                     checkoutUrl:
 *                       type: string
 *                       example: https://checkout.korapay.com/pay/example
 *                     status:
 *                       type: string
 *                       example: pending
 *                 paymentLink:
 *                   type: string
 *                   description: Korapay checkout URL
 *                   example: https://checkout.korapay.com/pay/example
 *       400:
 *         description: Required payment details are missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: customerId, email, and cartItems are required
 *       404:
 *         description: Customer or cart item was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: One or more cart items were not found
 *       500:
 *         description: Server error
 */
router.post('/initialize-payment', initializePayment);

/**
 * @swagger
 * /api/v1/payment/verify-payment:
 *   get:
 *     tags:
 *       - Payment
 *     summary: Verify payment
 *     description: Verifies a Korapay payment using the payment reference and updates the saved payment status
 *     parameters:
 *       - in: query
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment reference returned when payment was initialized
 *         example: PAY-1779710000000-1234567890
 *     responses:
 *       200:
 *         description: Payment verification completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment verification completed
 *                 status:
 *                   type: string
 *                   enum: [processing, successful, failed]
 *                   example: successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     reference:
 *                       type: string
 *                       example: PAY-1779710000000-1234567890
 *                     amount:
 *                       type: number
 *                       example: 25000
 *                     currency:
 *                       type: string
 *                       example: NGN
 *                     status:
 *                       type: string
 *                       example: successful
 *       400:
 *         description: Payment reference is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment reference is required
 *       404:
 *         description: Payment was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment not found
 *       500:
 *         description: Server error
 */
router.get('/verify-payment', verifyPayment);

module.exports = router;
