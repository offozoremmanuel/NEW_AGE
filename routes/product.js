const router = require('express').Router();
const upload = require('../middleware/multer');
const {
    createProduct,
    createProductByCategory,
    getAllProducts,
    getProductsByCategory,
    getOneProduct,
    updateProduct,
    deleteProduct
} = require('../controller/product');

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: API endpoints for products
 */

router.post('/register', upload.fields([{ name: 'image', maxCount: 3 }]), createProduct);
router.post('/category/:category/register', upload.fields([{ name: 'image', maxCount: 3 }]), createProductByCategory);

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
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get('/get-one-product/:id', getOneProduct);

router.put('/update-product/:id', upload.fields([{ name: 'image', maxCount: 3 }]), updateProduct);
router.delete('/delete-product/:id', deleteProduct);

module.exports = router;
