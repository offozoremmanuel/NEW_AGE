const router = require('express').Router();
const {createCustomer, loginCustomer, loginWithGoogle, resetPassword, forgetPassword, updateCustomerProfile} = require('../controller/customer');
const { resetPasswordValidator, signUpValidator }= require('../middleware/validator')
const {loginProfile, profile}=require('../middleware/passport')
const {upload} = require('../middleware/multer')

router.post('/',signUpValidator, createCustomer);
router.post('/login', loginCustomer);
router.put('/update-profile/:id', upload.single('profilePicture'), updateCustomerProfile)

 router.get('/auth/google', profile)
router.get('/auth/google/callback', loginProfile, loginWithGoogle)

router.post('/forgot-password', forgetPassword)
router.post('/request-password-reset',resetPasswordValidator,resetPassword)


module.exports = router;
