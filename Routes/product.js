const router = require('express').Router();

const {upload} = require('../middleware/multer')

const { createProduct, getAllProducts, getOneProduct, updateProduct, deleteProduct } = require('../Controller/product')
// Tags
/**
 * @swagger
 * tags:
 *   name: Product
 *   description: API endpoints for user management
 */
// create product
/**
 * @swagger
 * /api/v1/product/create-product:
 *   post:
 *     tags:
 *       - Product
 *     summary: Create a new product
 *     description: Creates a new product with image upload using multer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - productName
 *               - productPrice
 *               - productDescription
 *               - productCategory
 *               - productQuantity
 *               - productImage
 *             properties:
 *               productName:
 *                 type: string
 *                 description: Product name
 *                 example: iPhone 15 Pro Max
 *               productPrice:
 *                 type: number
 *                 description: Product price
 *                 example: 1500000
 *               productDescription:
 *                 type: string
 *                 description: Product description
 *                 example: Latest Apple smartphone with advanced features
 *               productCategory:
 *                 type: string
 *                 description: Product category
 *                 example: Electronics
 *               productQuantity:
 *                 type: number
 *                 description: Available product quantity
 *                 example: 10
 *               productImage:
 *                 type: string
 *                 format: binary
 *                 description: Product image file
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6855ab23c8d9f12345678901
 *                     productName:
 *                       type: string
 *                       example: iPhone 15 Pro Max
 *                     productPrice:
 *                       type: number
 *                       example: 1500000
 *                     productDescription:
 *                       type: string
 *                       example: Latest Apple smartphone with advanced features
 *                     productCategory:
 *                       type: string
 *                       example: Electronics
 *                     productQuantity:
 *                       type: number
 *                       example: 10
 *                     productImage:
 *                       type: string
 *                       example: uploads/iphone.jpg
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
router.post('/register', upload.fields([{ name: 'image', maxCount: 3 }]), createProduct);
// getAllProducts
/**
 * @swagger
 * /api/v1/product/get-all-products:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get all products
 *     description: Retrieves all products from the database
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All products
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6855ab23c8d9f12345678901
 *                       productName:
 *                         type: string
 *                         example: iPhone 15 Pro Max
 *                       productPrice:
 *                         type: number
 *                         example: 1500000
 *                       productDescription:
 *                         type: string
 *                         example: Latest Apple smartphone with advanced features
 *                       productCategory:
 *                         type: string
 *                         example: Electronics
 *                       productQuantity:
 *                         type: number
 *                         example: 10
 *                       productImage:
 *                         type: string
 *                         example: uploads/iphone.jpg
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
router.get('/get-all-products', getAllProducts)
// getOneProduct
/**
 * @swagger
 * /api/v1/product/get-one-product/{id}:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get one product
 *     description: Retrieves a single product using its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *           example: 6855ab23c8d9f12345678901
 *     responses:
 *       200:
 *         description: Product found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product found
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6855ab23c8d9f12345678901
 *                     productName:
 *                       type: string
 *                       example: iPhone 15 Pro Max
 *                     productPrice:
 *                       type: number
 *                       example: 1500000
 *                     productDescription:
 *                       type: string
 *                       example: Latest Apple smartphone with advanced features
 *                     productCategory:
 *                       type: string
 *                       example: Electronics
 *                     productQuantity:
 *                       type: number
 *                       example: 10
 *                     productImage:
 *                       type: string
 *                       example: uploads/iphone.jpg
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
router.get('/get-one-product/:id', getOneProduct)
// updateProduct
/**
 * @swagger
 * /api/v1/product/update-product/{id}:
 *   put:
 *     tags:
 *       - Product
 *     summary: Update a product
 *     description: Updates an existing product including image upload
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *           example: 6855ab23c8d9f12345678901
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *                 description: Product name
 *                 example: Samsung Galaxy S24
 *               productPrice:
 *                 type: number
 *                 description: Product price
 *                 example: 1200000
 *               productDescription:
 *                 type: string
 *                 description: Product description
 *                 example: Latest Samsung smartphone
 *               productCategory:
 *                 type: string
 *                 description: Product category
 *                 example: Electronics
 *               productQuantity:
 *                 type: number
 *                 description: Product quantity
 *                 example: 15
 *               productImage:
 *                 type: string
 *                 format: binary
 *                 description: Product image
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product updated
 *                 data:
 *                   type: object
 *                   properties:
 *                     productName:
 *                       type: string
 *                       example: Samsung Galaxy S24
 *                     productPrice:
 *                       type: number
 *                       example: 1200000
 *                     productDescription:
 *                       type: string
 *                       example: Latest Samsung smartphone
 *                     productCategory:
 *                       type: string
 *                       example: Electronics
 *                     productQuantity:
 *                       type: number
 *                       example: 15
 *                     productImage:
 *                       type: string
 *                       example: uploads/samsung.jpg
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
router.put('/update-product/:id', upload.fields([{ name: 'image', maxCount: 3 }]), updateProduct)
// deleteProduct
/**
 * @swagger
 * /api/v1/product/delete-product/{id}:
 *   delete:
 *     tags:
 *       - Product
 *     summary: Delete a product
 *     description: Deletes a product from the database using its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *           example: 6855ab23c8d9f12345678901
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted
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
router.delete('/delete-product/:id', deleteProduct)

module.exports = router;