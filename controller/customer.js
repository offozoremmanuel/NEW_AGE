const customerModel = require('../models/customer');
const bcrypt = require('bcrypt')
const cloudinary = require('../middleware/cloudinary')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const {emailTemplate,resetPasswordTemplate,resetPasswordSuccessfulTemplate} = require('../email')
const {brevo} = require('../utils/brevo')


exports.createCustomer = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber} = req.body;
        const existingCustomer = await customerModel.findOne({email: email.toLowerCase()});

if (existingCustomer) {
    return res.status(400).json({
        message: 'Email already exists'
    });
}

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newCustomer = new customerModel({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber
        })
        await newCustomer.save();

        res.status(201).json({
            message: 'Customer created successfully',
            customer: newCustomer
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'something went wrong',
        })
        
    }
}
exports.loginCustomer = async (req, res) => {
   
    try {
        const { email, password } = req.body;
        const customer = await customerModel.findOne({ email });

        if (!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            })
        }
        if (!customer.password) {
            return res.status(401).json({
                message: 'Please login with Google'
            })
        }
        const PasswordValid = await bcrypt.compare(password, customer.password);

        if (!PasswordValid) {
            return res.status(401).json({
                message: 'Invalid password'
            })
        }
         // Generate token
        const token = jwt.sign(
            {
                id: customer._id,
                role: customer.role
            },
            process.env.SECRET_KEY,
            {
                expiresIn: '1d'
            }
        );
        res.status(200).json({
            message: 'Login successful',
            customer: {
                id: customer._id,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                phoneNumber: customer.phoneNumber
            },
            token
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'something went wrong',
        })
    }
}

exports.loginWithGoogle = async (req, res) => {
    try {
        const token = await jwt.sign({
            id: req.user._id,
            role:req.user.role
        },process.env.SECRET_KEY,{expiresIn: '1d'}) 
        res.status(200).json({
            message: 'login successful',
            customer: {
                id: req.user._id,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                phoneNumber: req.user.phoneNumber
            },
            token
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'something went wrong',
        })
    }
}

exports.forgetPassword = async (req, res) => {
    try {
        const {email} = req.body
        const customer = await customerModel.findOne({ email: email.toLowerCase() })

        if (customer == null){
            return res.status(404).json({
                message: 'invalid credentials'
            })
        }
        // Generate OTP
        const OTP = Math.round(Math.random() * 1e6).toString().padStart(6, "0");
        // Save OTP and expiration time to user document
        customer.otp = OTP
        customer.otpExpire = Date.now() +( 1000 * 60 * 7) // OTP valid for 7 minutes
        console.log(OTP)
        const data = {
            name: customer.firstName + " " + customer.lastName,
            otp:OTP
        }

        // Send OTP via email
        await brevo(email,customer.firstName + " " + customer.lastName, resetPasswordTemplate(data));
        // save the changes to our database
        await customer.save()

        res.status(200).json({
            message: 'OTP sent successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}
exports.resetPassword = async (req, res) => {
    try {
        const {email, otp, password} = req.body
        const customer = await customerModel.findOne({ email: email.toLowerCase() })
        // Check if user exists
        if (customer == null){
            return res.status(404).json({
                message: 'invalid credentials'
            })
        }
        if(Date.now() > customer.otpExpire || customer.otp !== otp){
            return res.status(400).json({
                message:'invalid OTP'
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        customer.password = hashedPassword
        await customer.save()
        
        const data = {
            name: customer.firstName + " " + customer.lastName,
            otp:customer.otp
        }
        await brevo(email,customer.firstName + " " + customer.lastName, resetPasswordSuccessfulTemplate(data));
        res.status(200).json({
            message: 'Password reset successfully'
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}
 
exports.updateCustomerProfile = async (req, res) =>{
    let filePath;
    try {
        const {gender,nickName} = req.body;
        const {id} = req.params

        const customer = await customerModel.findById(id)
        if (!customer){
            return res.status(404).json({
                message: 'Customer not found'
            })
        }

        const updateData = {}
        if (gender) updateData.gender = gender
        if (nickName) updateData.nickName = nickName

        if (req.file) {
            filePath = req.file.path
            const uploadToCloudinary = await cloudinary.uploader.upload(filePath);
            updateData.profilePicture = {
                secureUrl: uploadToCloudinary.secure_url,
                publicId: uploadToCloudinary.public_id
            }
        }

        const updatedCustomer = await customerModel.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        })
        
       
        res.status(200).json({
            message: 'Profile updated successfully',
            customer: updatedCustomer
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong'
        })
    } finally {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
    }
}
