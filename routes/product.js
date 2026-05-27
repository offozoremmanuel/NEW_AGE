const router = require('express').Router();
const { upload } = require('../middleware/multer');
const {
    createProduct,
    createProductByCategory,
    getAllProducts,
    getProductsByCategory,
    getOneProduct,
    updateProduct,
    deleteProduct
} = require('../controller/product');

const upload = require('../middleware/multer')

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
 * /api/v1/product/register:
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
router.post('/register', upload.fields([{ name: 'images', maxCount: 3 }]), createProduct);
// getAllProducts
/**
 * @swagger
 * /api/v1/product/get-all-products:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get all products
 *     description: Retrieves all products. You can filter products by category or featured status.
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *           enum: [audio, chargers, smartwatch, powerbank, cables, jumpstarters]
 *         description: Product category to filter by
 *         example: audio
 *       - in: query
 *         name: featured
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filter featured products
 *         example: true
 *     responses:
 *       200:
 *         description: Products fetched successfully
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
 *                         example: Oraimo Watch Pro
 *                       productPrice:
 *                         type: number
 *                         example: 45000
 *                       discountPrice:
 *                         type: number
 *                         example: 38000
 *                       productDescription:
 *                         type: string
 *                         example: Smartwatch with health tracking and long battery life
 *                       productCategory:
 *                         type: string
 *                         enum: [audio, chargers, smartwatch, powerbank, cables, jumpstarters]
 *                         example: smartwatch
 *                       productBrand:
 *                         type: string
 *                         example: Oraimo
 *                       productQuantity:
 *                         type: number
 *                         example: 20
 *                       productImage:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example:
 *                           - https://res.cloudinary.com/demo/image/upload/watch.jpg
 *                       productRating:
 *                         type: number
 *                         example: 4.5
 *                       isFeatured:
 *                         type: boolean
 *                         example: true
 *       500:
 *         description: Server error
 */
router.get('/get-all-products', getAllProducts);

/**
 * @swagger
 * /api/v1/product/category/{category}:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get products by category
 *     description: Retrieves products that belong to one category.
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [audio, chargers, smartwatch, powerbank, cables, jumpstarters]
 *         description: Product category
 *         example: chargers
 *     responses:
 *       200:
 *         description: Category products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: chargers products
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid product category
 *       500:
 *         description: Server error
 */
router.get('/category/:category', getProductsByCategory);

/**
 * @swagger
 * /api/v1/product/get-one-product/{id}:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get one product
 *     description: Retrieves one product by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: 6855ab23c8d9f12345678901
 *     responses:
 *       200:
 *         description: Product fetched successfully
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
 *                       example: Oraimo FreePods
 *                     productPrice:
 *                       type: number
 *                       example: 25000
 *                     discountPrice:
 *                       type: number
 *                       example: 21000
 *                     productDescription:
 *                       type: string
 *                       example: Wireless earbuds with clear audio
 *                     productCategory:
 *                       type: string
 *                       example: audio
 *                     productBrand:
 *                       type: string
 *                       example: Oraimo
 *                     productQuantity:
 *                       type: number
 *                       example: 30
 *                     productImage:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - https://res.cloudinary.com/demo/image/upload/freepods.jpg
 *                     productRating:
 *                       type: number
 *                       example: 4.7
 *                     isFeatured:
 *                       type: boolean
 *                       example: false
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get('/get-one-product/:id', getOneProduct);

router.put('/update-product/:id', upload.fields([{ name: 'image', maxCount: 3 }]), updateProduct);
router.delete('/delete-product/:id', deleteProduct);

module.exports = router;
