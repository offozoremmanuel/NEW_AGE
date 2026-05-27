const Category = require('../models/category');
const fs = require('fs')
exports.createCategory = async (req, res) => {

    try {

        const categoryName = req.body.categoryName?.toLowerCase();

        const existingCategory =
            await Category.findOne({
                categoryName
            });

        if (existingCategory) {

            return res.status(400).json({

                message:
                'Category already exists'
            });
        }

        const category = await Category.create({

            categoryName,

            categoryImage: req.file ?  req.file.path : null });

        res.status(201).json({

            message:
            'Category created successfully',

            data: category
        });

    } catch (error) {

        res.status(500).json({

            message: error.message
        });
    }
};






exports.getAllCategories = async (req, res) => {

    try {

        const categories =await Category.find();
        res.status(200).json({
            message: 'All categories',
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getOneCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category =
            await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                message:
                'Category not found'
            });
        }
        res.status(200).json({
            message:
            'Category found',
            data: category
        });
    } catch (error) {
    res.status(500).json({
            message: error.message
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCategory =
            await Category.findByIdAndUpdate( id,{

                    categoryName:
                    req.body.categoryName?.toLowerCase(),

                    categoryImage: req.file ? req.file.path :undefined }, {
                        new: true,
                        runValidators: true
                    });
        if (!updatedCategory) {
            return res.status(404).json({
                message:
                'Category not found'
            });
        }
        res.status(200).json({
            message:
            'Category updated',
            data: updatedCategory
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory =
            await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({
                message:
                'Category not found'
            });
        }
         if (req.file) {
                    //  Check if the old file exists
                    const oldImageExists = fs.existsSync(product.image);
                    if (oldImageExists) {
                        // Delete the old file and update the new file into the product object
                        product.productImage = req.file.path;
                        fs.unlinkSync(product.productImage)
                    }
                }
        res.status(200).json({
            message:
            'Category deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
