const Product = require('../models/product');
const fs = require('fs')
const cloudinary = require('../middleware/cloudinary')
const categoryModel = require('../models/category')

exports.createProduct = async (req, res) => {

    try {

        const { productName,productPrice,productDescription, productCategory,productQuantity } = req.body;

         const imagesPaths = req.files.map((img) => img.path);
        console.log('imagePath: ', imagesPaths);

            const productImage = [];
            const imagePublicIds = [];

        // Upload each image to cloudinary and store the secure URL and public ID

        for (const path of imagesPaths) {
            const result = await cloudinary.uploader.upload(path)
            console.log('results: ',result);
            
            productImage.push(result.secure_url);
            imagePublicIds.push(result.public_id);
            fs.unlinkSync(path)
        }
         const category =
            await categoryModel.findById(
                productCategory
            );
        if (!category) {
            return res.status(404).json({
                message:
                'Category not found'
            });
        }
        
        const product = await Product.create({
            productName,
            productPrice,
            productDescription,
            productCategory,
            productQuantity,
            productImage: productImage,
            publicImagesId: imagePublicIds,
            productCategory
        });
        

        res.status(201).json({
            message: 'Product created successfully',
            data: product
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};



exports.getAllProducts = async (req, res) => {

    try {

        const allProducts = await Product.find();

        res.status(200).json({
            message: 'All products',
            data: allProducts
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};




exports.getOneProduct = async (req, res) => {

    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json({
            message: 'Product found',
            data: product
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};




exports.updateProduct = async (req, res) => {

    try {

        const { id } = req.params;
        const product = await Product.findByIdAndUpdate( id );
        const { productName,productPrice,productDescription, productCategory,productQuantity } = req.body;

        const updatedProduct ={
            productName: productName,
            productPrice: productPrice,
            productDescription: productDescription,
            productCategory: productCategory,
            productQuantity: productQuantity,
            productImage: req.file.path
        }; 
         if (req.files) {
            // Check if the Old Files exists
            product.updatedProduct.forEach(element => {
                const oldImagePath = fs.existsSync(element);
                if (oldImagePath) {
                    fs.unlinkSync(element)
                }
            });

            updatedProduct.images = req.files.map((img) => img.path)
        }
        await product.save();

        res.status(200).json({
            message: 'Product updated',
            data: updatedProduct
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};



exports.deleteProduct = async (req, res) => {

    try {

        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        if(!id) {
            return res.status(404).json({
                message: 'Product not found'
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
            message: 'Product deleted'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};
