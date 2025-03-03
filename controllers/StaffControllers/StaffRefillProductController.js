const StaffAuthModel = require("../../models/StaffModels/StaffAuthModel");
const RefillProductModel = require("../../models/RefillProductModel");
const jwt = require('jsonwebtoken')

const addRefillProductStaff = async(req, res) => {
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

            const staffId = decodedToken.id;
            const staffExists = await StaffAuthModel.findById(staffId);
            if(!staffExists){
                return res.json({ 
                    error: 'Staff does not exist' 
                });
            }

            //create new product with the determined batch
            const newRefillProduct = await RefillProductModel.create({
                productName,
                category,
                price,
                volume,
                color,
                uploaderId: staffId,
                uploaderType: 'Staff',
                createdBy: staffExists.fullName,
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

const getRefillProductStaff = async(req, res) => {
    try {
        const staffProducts = await RefillProductModel.find();
        return res.json(staffProducts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
}

const editRefillProductStaff = async(req, res) => {
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

            const staffId = decodedToken.id;
            const staffExists = await StaffAuthModel.findById(staffId);
            if(!staffExists){
                return res.json({
                    error: 'Staff does not exist',
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
const getEditRefillProductStaff = async(req, res) => {
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

const deleteRefillProductStaff = async(req, res) => {
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


const getRefillProductsStaff = async(req, res) => {
    try {
        const staffProducts = await RefillProductModel.find();
        return res.json(staffProducts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};

const getUniqueCategoriesRefillProductStaff = async(req, res) => {
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
    addRefillProductStaff,
    getRefillProductStaff,
    editRefillProductStaff,
    getEditRefillProductStaff,
    deleteRefillProductStaff,
    getRefillProductsStaff,
    getUniqueCategoriesRefillProductStaff
}