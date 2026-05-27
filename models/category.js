const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({

    categoryName: {
        type: String,
        enum: ['audio', 'chargers', 'smartwatch', 'powerbank', 'cables', 'jumpstarters'],
        lowercase: true,
        trim: true,
        required: true,
    },

    categoryImage: {
        type: String
    }

}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
