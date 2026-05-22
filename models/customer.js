const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    nickName: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        trim: true
    },
    email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: function () {
      return !this.googleId;
    }
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  profilePicture: {
    secureUrl: {
        type: String,
        trim: true
        },
        publicId: {
       type: String,
        trim: true
        }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
   otp: {
      type: String,
      trim: true,
    },
  otpExpire:{
        type: Date,
         default: ()=>{
         return Date.now() + (1000*60*7)
    }
  },
  role:{
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  }

}, { timestamps: true });

const customerModel = mongoose.model('customer', customerSchema);

module.exports = customerModel;
