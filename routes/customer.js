const router = require('express').Router();
const {createCustomer, loginCustomer, loginWithGoogle, resetPassword, forgetPassword, updateCustomerProfile} = require('../controller/customer');
const { resetPasswordValidator, signUpValidator }= require('../middleware/validator')
const {loginProfile, profile}=require('../middleware/passport')
const {upload} = require('../middleware/multer')

// tags
/**
 * @swagger
 * tags:
 *   name: Customer
 *   description: API endpoints for customer management
 */

// Apply to all Customer routes
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The User ID
 *           example: 69f6fc59f069dce732d54a15
 *         name:
 *           type: string
 *           description: The User's First Name
 *           example: John
 *         email:
 *           type: string
 *           description: The User's Email
 *           example: example@example.com
 *         phoneNumber:
 *           type: string
 *           description: The User's Phone Number
 *           example: +2348012345678
 *         password:
 *           type: string
 *           description: The User's Password
 *           example: password123
 *         confirmPassword:
 *           type: string
 *           description: The User's Confirm Password
 *           example: password123
 *              
 */

// Register a new user
/**
 * @swagger
 * /api/v1/customer:
 *   post:
 *     tags:
 *       - Customer
 *     summary: Customer registration
 *     description: Register a new customer with name, email, phone number, password, and confirm password
 *     requestBody:
 *       required: true 
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string  
 *                 description: The Customer's First Name
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: The Customer's Last Name
 *                 example: Doe
 *               email:
 *                 type: string
 *                 description: The Customer's Email
 *                 example: example@example.com
 *               phoneNumber:
 *                 type: string
 *                 description: The Customer's Phone Number
 *                 example: +2348012345678
 *               password:
 *                 type: string
 *                 description: The Customer's Password
 *                 example: password123
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *                   example: Customer created successfully
 */
router.post('/',signUpValidator, createCustomer);
// Log in a customer
/**
 * @swagger
 * /api/v1/customer/login:
 *   post:
 *     tags:
 *       - Customer
 *     summary: Customer login
 *     description: Login a customer with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The Customer's Email
 *                 example: example@example.com
 *               password:
 *                 type: string
 *                 description: The Customer's Password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *                   example: Login successful
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Bad request
 */
router.post('/login', loginCustomer);
// Update customer profile
/**
 * @swagger
 * /api/v1/customer/update-profile/{id}:
 *   put:
 *     tags:
 *       - Customer
 *     summary: Update customer profile
 *     description: Update a customer's profile picture, gender, and nickname
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *         example: 69f6fc59f069dce732d54a15
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Customer profile picture
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 description: Customer gender
 *                 example: male
 *               nickName:
 *                 type: string
 *                 description: Customer nickname
 *                 example: Johnny
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *       404:
 *         description: Customer not found
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
router.put('/update-profile/:id', upload.single('profilePicture'), updateCustomerProfile)

// Start Google authentication
/**
 * @swagger
 * /api/v1/customer/auth/google:
 *   get:
 *     tags:
 *       - Customer
 *     summary: Start Google OAuth login
 *     description: Redirects the customer to Google for authentication
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth consent screen
 */
router.get('/auth/google', profile)
// Google authentication callback
/**
 * @swagger
 * /api/v1/customer/auth/google/callback:
 *   get:
 *     tags:
 *       - Customer
 *     summary: Google OAuth callback
 *     description: Handles Google OAuth callback and returns customer details with JWT token
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: login successful
 *                 customer:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Customer ID
 *                       example: 6855e0c8b7f5a2a0fbc12345
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@gmail.com
 *                     phoneNumber:
 *                       type: string
 *                       example: +2348012345678
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: something went wrong
 */
router.get('/auth/google/callback', loginProfile, loginWithGoogle)
// forgot password
/**
 * @swagger
 * /api/v1/customer/forgot-password:
 *   post:
 *     tags:
 *       - Customer
 *     summary: Send password reset OTP
 *     description: Sends a 6-digit One-Time Password (OTP) to the customer's email address. The OTP is valid for 7 minutes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Customer email address
 *                 example: johndoe@gmail.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully
 *       404:
 *         description: Customer account was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: invalid credentials
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong
 */
router.post('/forgot-password', forgetPassword)

// Reset password
/**
 * @swagger
 * /api/v1/customer/request-password-reset:
 *   post:
 *     tags:
 *       - Customer
 *     summary: Reset password using OTP
 *     description: Resets a customer's password after verifying OTP sent to their email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Customer email address
 *                 example: johndoe@gmail.com
 *               otp:
 *                 type: string
 *                 description: One-Time Password sent to email
 *                 example: "123456"
 *               password:
 *                 type: string
 *                 description: New password
 *                 example: Newpassword123
 *               confirmPassword:
 *                 type: string
 *                 description: Must match the new password
 *                 example: Newpassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 */
router.post('/request-password-reset',resetPasswordValidator,resetPassword)


module.exports = router;
