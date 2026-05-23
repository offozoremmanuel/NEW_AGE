const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const sendMail = require('../utils/nodemailer');
const otpGenerator = require('otp-generator');
const { signUpTemplate } = require('../utils/emailTemplate');
const jwt = require('jsonwebtoken')

exports.register = async(req, res, next) => {
    try {
        const {firstName, lastName, email, phoneNumber, password, confirmPassword} = req.body;

        const emailExists = await userModel.findOne({ email: email.toLowerCase()})
        if (emailExists) {
            return next({
                message: `User with email: ${email} already exists`,
                statusCode: 400
            })
        }
        if (password !== confirmPassword) {
            return next({
                message: `Password does not match`,
                statusCode: 400
            })
    }

        const OTP = otpGenerator.generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

        const expiresAt = new Date(Date.now() + 10 * 60000);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userModel.create({
            name, 
            email, 
            phoneNumber, 
            otp: OTP,
            password: hashedPassword,  
            otpExpiresAt: expiresAt
        });
        const emailOptions = {
            email: user.email,
            subject: 'Welcome to New Age, where appliances live',
            html: signUpTemplate(user.name, OTP)
        }
         
        
         await sendMail(emailOptions);
        const data = {
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber
        }

      return next({
        message: 'User created succcessfully',
        statusCode: 201
      })
    } catch (error) {
        next({
                message: error.message,
                statusCode: 500
            })
    }
};

exports.verifyEmail = async (req, res, next) => {
    try {
       const { email, otp } = req.body;
       
       const user = await userModel.findOne({ email })
       if (!user) {
       return next({
        message: 'User not found',                                                                                                                                                                                                                                                                                                                                                                                                                                                    
        statusCode: 404
       })
       }
       if (new Date() > user.otpExpiresAt || user.otp != otp ) {
        return next({
            message: 'Invalid OTP',
            statusCode: 403
        })
       }
       
       user.isVerified = true;
       user.otp = null
       user.otpExpiresAt = null

       await user.save()

      return next ({
        message: 'User verified successfully',
        statusCode: 200
      })
    } catch (error) {
        next({
                message: error.message,
                statusCode: 500
            })
    }
};

exports.resendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email })
        if (!user) {
        return next ({
            message: 'User not found',
            statusCode: 404 
        })
        }

        const OTP = otpGenerator.generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })

        const expiresAt = new Date(Date.now() + 10 * 60000);

        user.otp = OTP;
        user.otpExpiresAt = expiresAt;

        const emailOptions = {
            email: user.email,
            subject: 'New otp confirmation',
            html: signUpTemplate(user.name, OTP)
        }

        await sendMail(emailOptions);

        await user.save()

       return next({
        message:  'OTP sent successfully',
        statusCode: 200
       })
    } catch (error) {
     return next({
        error: error.message,
        statusCode: 500
     })
    }
};

exports.login = async( req, res, next ) => {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email })
        if (!user) {
           return next({
            message: 'User not found',
            statusCode: 404
           })
        }

        if (user.isVerified == false) {
           return next({
            message: 'Please verify your email to continue',
            statusCode: 403
           })
        }
        if(user.lockUntil > Date.now()) {
            return next({
                message: `User account is locked until ${user.lockUntil}`,
                statusCode: 403
            })
        }

        const passwordCorrect = await bcrypt.compare(password, user.password);

        if (!passwordCorrect) {
            // Increment login attempts and lock acccount if neccessary
            user.loginAttempts += 1;
            if(user.loginAttempts >= 5) {
                user.lockUntil = new Date(Date.now() + 2 * 60000);
                user.loginAttempts = 0;
            }
            await user.save();
            console.log(user.loginAttempts);
           return next({
            message: 'Invalid Credentials',
            statusCode: 400
           })     
        }
        user.loginAttempts = 0;
        await user.save();

        const token = await jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1day'});

       return next({
        message: 'LoginSuccessfull',
        data: token,
        statusCode: 200
       })
    } catch (error) {
       return res.status(500).json({
            message: error.message,
        })
    }
}

exports.getAllUsers = async (req, res, next ) => {
    try {
        const users = await userModel.find().select('-password');
      return next({
        message: 'All users fetched successfully',
        data: users,
        statusCode: 200
      })
    } catch (error) {
        next(error);
    }
}
exports.getOneUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(id).select('-password');
       return next({
        message: 'Fetched successully',
        user,
        statusCode: 200
       })
    } catch (error) {
        next(error);
    }
}

exports.updateUser = async (req, res) => {
    try {
        const {id} = req.params
        const {name, email, phoneNumber} = req.body
        if(!id){
            return next({
                message: 'User not found or invalid credentials',
                statusCode: 400
            })
        }

         const updatedUser = await userModel.updateMany({
            name,
            email,
            phoneNumber
        })
       return next({
        message: 'User updated successfully',
        statusCode: 200
       })
        
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}