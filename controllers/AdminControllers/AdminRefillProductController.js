const AdminAuthModel = require("../../models/AdminModels/AdminAuthModel");
const RefillProductModel = require("../../models/RefillProductModel");
const jwt = require('jsonwebtoken')

const addRefillProductAdmin = async(req, res) => {
    try {
        const {productName, category, price, volume, color} = req.body;

        if(!productName || !category || !price || !volume || !color){
            return res.json({
                error: 'Please provide all required fields'
            });
        }

        const token = req.cookies.token;
        if(!token){
            return res.json({ 
                error: 'Unauthorized - Missing token' 
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, {}, async(err, decodedToken) => {
            if(err){
                return res.json({ 
                    error: 'Unauthorized - Invalid token' 
                });
            }

            const adminId = decodedToken.id;
            const adminExists = await AdminAuthModel.findById(adminId);
            if(!adminExists){
                return res.json({ 
                    error: 'Admin does not exist' 
                });
            }

            //create new product with the determined batch
            const newRefillProduct = await RefillProductModel.create({
                productName,
                category,
                price,
                volume,
                color,
                uploaderId: adminId,
                uploaderType: 'Admin',
                createdBy: adminExists.fullName,
            });
            

            return res.json({
                message: 'Refill product added successfully!',
                newRefillProduct,
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};

const getRefillProductAdmin = async(req, res) => {
    try {
        const adminProducts = await RefillProductModel.find();
        return res.json(adminProducts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
}

const editRefillProductAdmin = async(req, res) => {
    try {
        const {productId} = req.params;
        const {productName, category, price, volume, color} = req.body;

        if(!productName || !category || !price || !volume || !color){
            return res.json({
                error: 'Please provide all required fields',
            });
        }

        const token = req.cookies.token;
        if(!token){
            return res.json({
                error: 'Unauthorized - Missing token',
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, {}, async(err, decodedToken) => {
            if(err){
                return res.json({
                    error: 'Unauthorized - Invalid token',
                });
            }

            const adminId = decodedToken.id;
            const adminExists = await AdminAuthModel.findById(adminId);
            if(!adminExists){
                return res.json({
                    error: 'Admin does not exist',
                });
            }

            const updatedProduct = await RefillProductModel.findByIdAndUpdate(
                productId,
                {productName, category, price, volume, color},
                {new: true}
            );

            if(!updatedProduct){
                return res.json({
                    error: 'Product not found',
                });
            }

            return res.json({
                message: 'Product updated successfully',
                updatedProduct,
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error',
        });
    }
};


//get a specific refill product by id
const getEditRefillProductAdmin = async(req, res) => {
    try {
        const {productId} = req.params;
        const product = await RefillProductModel.findById(productId);

        if(!product){
            return res.json({
                error: 'Product not found',
            });
        }

        return res.json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error',
        });
    }
};

const deleteRefillProductAdmin = async(req, res) => {
    try {
        const product = await RefillProductModel.findById(req.params.productId);
        if(!product){
            return res.status(404).json({ 
                message: 'Product not found' 
            });
        }

        await RefillProductModel.findByIdAndDelete(req.params.productId);

        return res.status(200).json({ 
            message: 'Product deleted successfully' 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};


const getRefillProductsAdmin = async(req, res) => {
    try {
        const adminProducts = await RefillProductModel.find();
        return res.json(adminProducts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};

const getUniqueCategoriesRefillProductAdmin = async(req, res) => {
    try {
        const categories = await RefillProductModel.distinct('category');
        return res.json(categories);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};

module.exports = {
    addRefillProductAdmin,
    getRefillProductAdmin,
    editRefillProductAdmin,
    getEditRefillProductAdmin,
    deleteRefillProductAdmin,
    getRefillProductsAdmin,
    getUniqueCategoriesRefillProductAdmin
}