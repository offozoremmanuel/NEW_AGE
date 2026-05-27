const router = require('express').Router();
const {createCustomer, loginCustomer, loginWithGoogle, resetPassword, forgetPassword, updateCustomerProfile} = require('../controller/customer');
const { forgotPasswordValidator, loginValidator, resetPasswordValidator, signUpValidator }= require('../middleware/validator')
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
 *     Customer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The Customer ID
 *           example: 69f6fc59f069dce732d54a15
 *         firstName:
 *           type: string
 *           description: The Customer's First Name
 *           example: Emmanuel
 *         lastName:
 *           type: string
 *           description: The Customer's Last Name
 *           example: Ofozore
 *         email:
 *           type: string
 *           format: email
 *           description: The Customer's Email
 *           example: emmanuel@example.com
 *         phoneNumber:
 *           type: string
 *           description: The Customer's Phone Number. Must be exactly 11 digits.
 *           example: "08012345678"
 *         password:
 *           type: string
 *           description: Must be at least 8 characters and include uppercase and lowercase letters.
 *           example: Password123
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
 *     description: Register a new customer. Phone number must be exactly 11 digits. Password must be at least 8 characters and include uppercase and lowercase letters.
 *     security: []
 *     requestBody:
 *       required: true 
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phoneNumber
 *               - password
 *             properties:
 *               firstName:
 *                 type: string  
 *                 description: The Customer's First Name
 *                 example: Emmanuel
 *               lastName:
 *                 type: string
 *                 description: The Customer's Last Name
 *                 example: Ofozore
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The Customer's Email
 *                 example: emmanuel@example.com
 *               phoneNumber:
 *                 type: string
 *                 description: Must contain only digits and must be exactly 11 digits
 *                 example: "08012345678"
 *               password:
 *                 type: string
 *                 description: Must be at least 8 characters and include uppercase and lowercase letters
 *                 example: Password123
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
 *       400:
 *         description: Validation error or duplicate email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Phone Number must only contain digits and be 11 digits
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
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The Customer's Email
 *                 example: emmanuel@example.com
 *               password:
 *                 type: string
 *                 description: The Customer's Password
 *                 example: Password123
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
 *                 token:
 *                   type: string
 *                   description: JWT token returned after login
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example.signature
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
 *                   example: email must be a valid email
 */
router.post('/login', loginValidator, loginCustomer);
// Update customer profile
/**
 * @swagger
 * /api/v1/customer/update-profile/{id}:
 *   put:
 *     tags:
 *       - Customer
 *     summary: Update customer profile
 *     description: Update a customer's profile picture, gender, and nickname
 *     security: []
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
router.put('/update-profile/:id',upload.single('profilePicture'), updateCustomerProfile)

// Start Google authentication
/**
 * @swagger
 * /api/v1/customer/collect:
 *   get:
 *     tags:
 *       - Customer
 *     summary: Start Google OAuth login
 *     description: Redirects the customer to Google for authentication
 *     security: []
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth consent screen
 */
router.get('/collect', passport.authenticate('google', {scope: ['profile', 'email']}))
// Google authentication callback
/**
 * @swagger
 * /api/v1/customer/googleLogin:
 *   get:
 *     tags:
 *       - Customer
 *     summary: Google OAuth callback
 *     description: Handles Google OAuth callback and returns customer details with JWT token
 *     security: []
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
router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/api/v1/customer/loginsuccess', 
    failureRedirect: '/api/v1/customer/loginfailed'
}))

    router.get('/loginsuccess', (req, res) => {
        res.json({message: 'Login successful', 
            data: req.user})
    })

router.get('/loginfailed', (req, res) => {
        res.json({message: 'Login failed'})
    })
// forgot password
/**
 * @swagger
 * /api/v1/customer/forgot-password:
 *   post:
 *     tags:
 *       - Customer
 *     summary: Send password reset OTP
 *     description: Sends a 6-digit One-Time Password (OTP) to the customer's email address. The OTP is valid for 7 minutes.
 *     security: []
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
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: email must be a valid email
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
router.post('/forgot-password', forgotPasswordValidator, forgetPassword)

// Reset password
/**
 * @swagger
 * /api/v1/customer/request-password-reset:
 *   post:
 *     tags:
 *       - Customer
 *     summary: Reset password using OTP
 *     description: Resets a customer's password after verifying OTP sent to their email
 *     security: []
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
 *                 description: Must be at least 8 characters and include uppercase and lowercase letters
 *                 example: Password123
 *               confirmPassword:
 *                 type: string
 *                 description: Must match the new password
 *                 example: Password123
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
 *       400:
 *         description: Validation error or invalid OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP must only contain digits and be 6 digits
 */
router.post('/request-password-reset',resetPasswordValidator,resetPassword)


module.exports = router;
