const AdminAuthModel = require("../../models/AdminModels/AdminAuthModel");
const ProductModel = require("../../models/ProductModel");
const StaffCartModel = require("../../models/StaffModels/StaffCartModel");
const WorkinProgressProductModel = require("../../models/WorkinProgressProductModel");
const jwt = require('jsonwebtoken');

const addProductToCartAdmin= async(req, res) => {
    const {productId, quantity} = req.body;
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

        try {
            let product = await ProductModel.findById(productId);
            let productModel = 'Product';

            if(!product){
                product = await WorkinProgressProductModel.findById(productId);
                productModel = 'WorkinProgressProduct';
            }

            if(!product){
                return res.json({
                    error: 'Product does not exist in both ProductModel and WorkinProgressProductModel',
                });
            }

            const finalPrice = product.price || product.price;

            let existingCartItem = await StaffCartModel.findOne({
                adminId,
                productId,
                productModel,
            });

            if(existingCartItem){
                //if item exists, update the quantity and finalPrice
                existingCartItem.quantity += quantity;
                existingCartItem.finalPrice = finalPrice;
                existingCartItem.updatedAt = Date.now();
                await existingCartItem.save();
            } else{
                await new StaffCartModel({
                    adminId,
                    productId,
                    productModel,
                    quantity,
                    finalPrice,
                    productName: product.productName,
                    sizeUnit: product.sizeUnit,
                    productSize: product.productSize,
                }).save();
            }

            const updatedCart = await StaffCartModel.find({adminId}).populate('productId');

            res.json(updatedCart);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Server error',
            });
        }
    });
};

const getProductCartAdmin = async(req, res) => {
    const adminId = req.params.adminId;
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

        if(decodedToken.id !== adminId){
            return res.json({ 
                error: 'Unauthorized - Invalid customer ID' 
            });
        }

        try {
            //fetch cart items with populated product details, including sizeUnit and productSize
            const cartItems = await StaffCartModel.find({adminId})
                .populate({
                    path: 'productId',
                    select: 'productName price imageUrl sizeUnit productSize'
                });
            res.json(cartItems);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ 
                message: 'Server error' 
            });
        }
    });
};

const removeProductFromCartAdmin= async(req, res) => {
    const {cartItemId} = req.params;
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

        try {
            await StaffCartModel.findByIdAndDelete(cartItemId);
            res.json({ 
                success: true,
                message: 'Product removed from cart' 
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ 
                message: 'Server error' 
            });
        }
    });
};




const updateProductQuantityAdmin = async(req, res) => {
    const {cartItemId, quantity} = req.body;

    try {
        //find the cart item and update the quantity
        const updatedItem = await StaffCartModel.findByIdAndUpdate(
            cartItemId,
            {quantity},
            {new: true}
        );

        if(!updatedItem){
            return res.status(404).json({ 
                success: false,
                message: 'Cart item not found'
            });
        }

        res.json({ 
            success: true, 
            message: 'Quantity updated successfully', 
            item: updatedItem 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};

module.exports = {
    addProductToCartAdmin,
    getProductCartAdmin,
    removeProductFromCartAdmin,
    updateProductQuantityAdmin
}