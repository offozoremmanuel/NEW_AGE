const router = require('express').Router();
const {
    createDelivery,
    getAllDeliveries,
    getOneDelivery,
    updateDeliveryStatus
} = require('../Controller/delivery');

/**
 * @swagger
 * tags:
 *   name: Delivery
 *   description: API endpoints for order deliveries
 */

/**
 * @swagger
 * /api/v1/delivery/create-delivery:
 *   post:
 *     tags:
 *       - Delivery
 *     summary: Create delivery
 *     description: Creates a delivery record linked to an order and cart items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - cartItems
 *               - deliveryAddress
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: Order ID
 *                 example: 6855e0c8b7f5a2a0fbc12345
 *               cartItems:
 *                 type: array
 *                 description: Cart item IDs included in the delivery
 *                 items:
 *                   type: string
 *                 example:
 *                   - 6855ab23c8d9f12345678901
 *                   - 6855ab23c8d9f12345678902
 *               deliveryAddress:
 *                 type: string
 *                 description: Address where the order should be delivered
 *                 example: Lekki Phase 1, Lagos
 *               riderName:
 *                 type: string
 *                 description: Assigned rider name
 *                 example: Musa Ahmed
 *               riderPhoneNumber:
 *                 type: string
 *                 description: Assigned rider phone number
 *                 example: "08012345678"
 *     responses:
 *       201:
 *         description: Delivery created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Delivery created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     orderId:
 *                       type: string
 *                       example: 6855e0c8b7f5a2a0fbc12345
 *                     cartItems:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - 6855ab23c8d9f12345678901
 *                     deliveryAddress:
 *                       type: string
 *                       example: Lekki Phase 1, Lagos
 *                     deliveryStatus:
 *                       type: string
 *                       enum: [pending, dispatched, in-transit, delivered, cancelled]
 *                       example: pending
 *                     trackingNumber:
 *                       type: string
 *                       example: DEL-1779710000000-123456
 *       400:
 *         description: Required delivery details are missing
 *       404:
 *         description: Order or cart item was not found
 *       500:
 *         description: Server error
 */
router.post('/create-delivery', createDelivery);

/**
 * @swagger
 * /api/v1/delivery:
 *   get:
 *     tags:
 *       - Delivery
 *     summary: Get all deliveries
 *     description: Fetches all delivery records with their linked order and cart items
 *     responses:
 *       200:
 *         description: Deliveries fetched successfully
 *       500:
 *         description: Server error
 */
router.get('/', getAllDeliveries);

/**
 * @swagger
 * /api/v1/delivery/{id}:
 *   get:
 *     tags:
 *       - Delivery
 *     summary: Get one delivery
 *     description: Fetches one delivery by ID with its linked order and cart items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Delivery ID
 *         example: 6855e0c8b7f5a2a0fbc12345
 *     responses:
 *       200:
 *         description: Delivery fetched successfully
 *       404:
 *         description: Delivery not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getOneDelivery);

/**
 * @swagger
 * /api/v1/delivery/update-status/{id}:
 *   put:
 *     tags:
 *       - Delivery
 *     summary: Update delivery status
 *     description: Updates delivery status and optional rider details. When status is delivered, deliveredAt is set automatically.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Delivery ID
 *         example: 6855e0c8b7f5a2a0fbc12345
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deliveryStatus:
 *                 type: string
 *                 enum: [pending, dispatched, in-transit, delivered, cancelled]
 *                 example: dispatched
 *               riderName:
 *                 type: string
 *                 example: Musa Ahmed
 *               riderPhoneNumber:
 *                 type: string
 *                 example: "08012345678"
 *     responses:
 *       200:
 *         description: Delivery updated successfully
 *       404:
 *         description: Delivery not found
 *       500:
 *         description: Server error
 */
router.put('/update-status/:id', updateDeliveryStatus);

module.exports = router;
