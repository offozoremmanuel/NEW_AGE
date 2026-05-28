const Product = require('../models/product');
const fs = require('fs');
const cloudinary = require('../middleware/cloudinary');

const productCategories = Product.schema.path('productCategory').enumValues;

const isValidCategory = (category) => {
    return productCategories.includes(category?.toLowerCase());
};

const uploadProductImages = async (files = []) => {
    const productImage = [];
    const imagePublicIds = [];

    for (const file of files) {
        const result = await cloudinary.uploader.upload(file.path);
        productImage.push(result.secure_url);
        imagePublicIds.push(result.public_id);

        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
    }

    return { productImage, imagePublicIds };
};

exports.createProduct = async (req, res) => {
    try {
        const {
            productName,
            productPrice,
            discountPrice,
            productDescription,
            productCategory,
            productBrand,
            productQuantity,
            productRating,
            isFeatured
        } = req.body;
        const category = productCategory?.toLowerCase();

        if (!isValidCategory(category)) {
            return res.status(400).json({
                message: 'Invalid product category',
                allowedCategories: productCategories
            });
        }

        const imageFiles = req.files?.image || [];

        if (imageFiles.length === 0) {
            return res.status(400).json({
                message: 'At least one product image is required'
            });
        }

        const { productImage, imagePublicIds } = await uploadProductImages(imageFiles);

        const product = await Product.create({
            productName,
            productPrice,
            discountPrice,
            productDescription,
            productCategory: category,
            productBrand,
            productQuantity,
            productImage:imageFiles.length > 0 ? productImage : undefined,
            publicImagesId: imagePublicIds,
            productRating,
            isFeatured
        });

        res.status(201).json({
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.log(error );
        res.status(500).json({
            error: error.message
        });
    }
};

exports.createProductByCategory = async (req, res) => {
    req.body.productCategory = req.params.category;
    return exports.createProduct(req, res);
};

exports.getAllProducts = async (req, res) => {
    try {
        const { category, featured } = req.query;
        const filter = {};

        if (category) {
            const productCategory = category.toLowerCase();

            if (!isValidCategory(productCategory)) {
                return res.status(400).json({
                    message: 'Invalid product category',
                    allowedCategories: productCategories
                });
            }

            filter.productCategory = productCategory;
        }

        if (featured !== undefined) {
            filter.isFeatured = featured === 'true';
        }

        const allProducts = await Product.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            message: 'All products',
            data: allProducts
        });
    } catch (error) {
        console.log(error.message || error);
        res.status(500).json({
            message: 'something went wrong'
        });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const productCategory = category.toLowerCase();

        if (!isValidCategory(productCategory)) {
            return res.status(400).json({
                message: 'Invalid product category',
                allowedCategories: productCategories
            });
        }

        const products = await Product.find({ productCategory }).sort({ createdAt: -1 });

        res.status(200).json({
            message: `${productCategory} products`,
            data: products
        });
    } catch (error) {
        console.log(error.message || error);
        res.status(500).json({
            message: 'something went wrong'
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
        console.log(error.message || error);
        res.status(500).json({
            message: 'something went wrong'
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        const allowedFields = [
            'productName',
            'productPrice',
            'discountPrice',
            'productDescription',
            'productCategory',
            'productBrand',
            'productQuantity',
            'productRating',
            'isFeatured'
        ];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                product[field] = req.body[field];
            }
        }

        const imageFiles = req.files?.image || [];

        if (imageFiles.length > 0) {
            for (const publicId of product.publicImagesId) {
                await cloudinary.uploader.destroy(publicId);
            }

            const { productImage, imagePublicIds } = await uploadProductImages(imageFiles);
            product.productImage = productImage;
            product.publicImagesId = imagePublicIds;
        }

        await product.save();

        res.status(200).json({
            message: 'Product updated',
            data: product
        });
    } catch (error) {
        console.log(error.message || error);
        res.status(500).json({
            message: 'something went wrong'
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        for (const publicId of product.publicImagesId) {
            await cloudinary.uploader.destroy(publicId);
        }

        await Product.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Product deleted'
        });
    } catch (error) {
        console.log(error.message || error);
        res.status(500).json({
            message: 'something went wrong'
        });
    }
};
