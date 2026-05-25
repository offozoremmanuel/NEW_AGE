const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    productName: {
        type: String,
        required: true
    },

    productPrice: {
        type: Number,
        required: true
    },

    productDescription: {
        type: String,
        required: true
    },

    productCategory: {
        type: String,
        required: true
    },

    productQuantity: {
        type: Number,
        required: true
    },

    productImage: [{
        type: String,
        required: true,
    }],
        publicImagesId: [{
            type: String,
            required: true,
    }],
    
     productCategory: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

}, { timestamps: true });

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;