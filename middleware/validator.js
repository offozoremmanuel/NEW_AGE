const  joi = require('joi');

exports.signUpValidator = (req,res, next) =>{
    const schema = joi.object({
        firstName: joi.string().required().messages({
            'any.required':"first name is required",
            'string.empty':"first name cannot be empty"
        }),
         lastName: joi.string().required().messages({
            'any.required':"last name is required",
            'string.empty':"last name cannot be empty"
        }),
        email: joi.string().email().required().messages({
            'any.required':"email is required",
            'string.empty':"email cannot be empty",
            'string.email': "email must be a valid email"
        }),
         phoneNumber: joi.string().pattern(/^\d{11}$/).required().messages({
            'any.required':"Phone number is required",
            'string.empty':"Phone number cannot be empty",
            'string.pattern.base': "Phone Number must only contain digits and be 11 digits"
        }),
         password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required().messages({
            'any.required':"password is required",
            'string.empty':"password cannot be empty",
            'string.pattern.base': "password must be at least 8 characters and must include 1 uppercase and 1 lowercase"
        }),
    })
    const {error} = schema.validate(req.body);

    if (error){
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
}
exports.resetPasswordValidator = (req,res, next) =>{
    const schema = joi.object({
        email: joi.string().email().required().messages({
            'any.required':"email is required",
            'string.empty':"email cannot be empty",
            'string.email': "email must be a valid email"
        }),
         otp: joi.string().pattern(/^\d{6}$/).required().messages({
            'any.required':"OTP is required",
            'string.empty':"OTP cannot be empty",
            'string.pattern.base': "OTP must only contain digits and be 6 digits"
        }),
         password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required().messages({
            'any.required':"password is required",
            'string.empty':"password cannot be empty",
            'string.pattern.base': "password must be at least 8 characters and must include 1 uppercase and 1 lowercase"
        }),
        confirmPassword: joi.string().valid(joi.ref('password')).required().messages({
            'any.required':"confirm password is required",
            'any.only': "confirm password must match password"
        }),
    })
    const {error} = schema.validate(req.body);

    if (error){
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
}