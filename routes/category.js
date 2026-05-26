const router = require('express').Router();

const { createCategory, getAllCategories, getOneCategory, updateCategory, deleteCategory} = require('../Controller/category');
/**
 * @swagger
 * tags:
 *   name: Category
 *   description: API endpoints for user management
 */
// Create Category
/**
 * @swagger
 * /api/v1/category/create-category:
 *   post:
 *     tags:
 *       - Category
 *     summary: Create a category
 *     description: Creates a new product category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - categoryName
 *             properties:
 *               categoryName:
 *                 type: string
 *                 description: Category name
 *                 example: Electronics
 *               categoryImage:
 *                 type: string
 *                 format: binary
 *                 description: Category image
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category created successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Category already exists
 */
router.post('/create-category', createCategory );
// get all categories
/**
 * @swagger
 * /api/v1/category/all-categories:
 *   get:
 *     tags:
 *       - Category
 *     summary: Get all categories
 *     description: Retrieves all product categories
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All categories
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 */
router.get('/all-categories', getAllCategories);
// Get One category
/**
 * @swagger
 * /api/v1/category/one-category/{id}:
 *   get:
 *     tags:
 *       - Category
 *     summary: Get one category
 *     description: Retrieves a category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *           example: 6855ab23c8d9f12345678901
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category found
 *                 data:
 *                   type: object
 *       404:
 *         description: Category not found
 */
router.get('/one-category/:id',getOneCategory);
// update Category
/**
 * @swagger
 * /api/v1/category/update-category/{id}:
 *   put:
 *     tags:
 *       - Category
 *     summary: Update category
 *     description: Updates a category by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
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
 *               categoryName:
 *                 type: string
 *                 example: Phones
 *               categoryImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 */
router.put('/update-category/:id', updateCategory);
// Delete category
/**
 * @swagger
 * /api/v1/category/delete-category/{id}:
 *   delete:
 *     tags:
 *       - Category
 *     summary: Delete category
 *     description: Deletes a category by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *           example: 6855ab23c8d9f12345678901
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete('/delete-category/:id', deleteCategory );

module.exports = router;