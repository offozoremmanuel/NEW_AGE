const router = require('express').Router();
const { initializePayment, verifyPayment } = require('../controller/payment');
const {checkLogin} = require('../middleware/authentication')

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: API endpoints for payment initialization and verification
 */

/**
 * @swagger
 * /api/v1/payment/initialize-payment/{id}:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Initialize payment
 *     description: Creates a payment record for the customer in the path parameter, calculates the total from the supplied cart items, and initializes Korapay checkout.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *         example: 6855e0c8b7f5a2a0fbc12345
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - cartItems
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Customer email address
 *                 example: johndoe@gmail.com
 *               cartItems:
 *                 oneOf:
 *                   - type: string
 *                   - type: array
 *                     items:
 *                       type: string
 *                 description: One cart item ID or a list of cart item IDs to pay for
 *                 example:
 *                   - 6855ab23c8d9f12345678901
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
 *                     _id:
 *                       type: string
 *                       description: Payment ID used to verify the payment
 *                       example: 6860c9d9c8d9f12345678901
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
 *                       example: PAY-NEW-AGE1779710000000-AB12345678
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
 *                   example: email and cartItems are required
 *       404:
 *         description: Customer or cart item was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customer not found
 *       500:
 *         description: Server error
 */
router.post('/initialize-payment/:id', checkLogin, initializePayment);

/**
 * @swagger
 * /api/v1/payment/verify-payment/{id}:
 *   get:
 *     tags:
 *       - Payment
 *     summary: Verify payment
 *     description: Verifies a Korapay payment using the payment ID in the path parameter. The saved payment reference is used internally to check Korapay, then the payment status is updated.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *         example: 6855e0c8b7f5a2a0fbc12345
 *     responses:
 *       200:
 *         description: Payment verification completed. The message depends on the Korapay status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - Payment successful
 *                     - Payment is processing
 *                     - Payment failed
 *                     - Unable to verify payment
 *                   example: Payment successful
 *                 status:
 *                   type: string
 *                   enum: [processing, successful, failed]
 *                   example: successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     reference:
 *                       type: string
 *                       example: PAY-NEW-AGE1779710000000-AB12345678
 *                     amount:
 *                       type: number
 *                       example: 25000
 *                     currency:
 *                       type: string
 *                       example: NGN
 *                     status:
 *                       type: string
 *                       enum: [processing, successful, failed]
 *                       example: successful
 *       400:
 *         description: Payment ID is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment ID is required
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
router.get('/verify-payment/:id',checkLogin, verifyPayment);

module.exports = router;
