const ProductModel = require("../../models/ProductModel");
const StaffAuthModel = require("../../models/StaffModels/StaffAuthModel");
const StaffCartRefillModel = require("../../models/StaffModels/StaffCartRefillModel");
const jwt = require('jsonwebtoken');
const WorkinProgressProductModel = require("../../models/WorkinProgressProductModel");

const addProductToCartRefillStaff = async(req, res) => {
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

        const staffId = decodedToken.id;

        const staffExists = await StaffAuthModel.findById(staffId);
        if(!staffExists){
            return res.json({
                error: 'Staff does not exist',
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

            // const refillPrice = product.discountedPrice || product.refillPrice;
            const refillPrice = product.refillPrice;

            let existingCartItem = await StaffCartRefillModel.findOne({
                staffId,
                productId,
                productModel,
            });

            if(existingCartItem){
                //if item exists, update the quantity and refillPrice
                existingCartItem.quantity += quantity;
                existingCartItem.refillPrice = refillPrice;
                existingCartItem.updatedAt = Date.now();
                await existingCartItem.save();
            } else{
                await new StaffCartRefillModel({
                    staffId,
                    productId,
                    productModel,
                    quantity,
                    refillPrice,
                    productName: product.productName,
                    sizeUnit: product.sizeUnit,
                    productSize: product.productSize,
                }).save();
            }

            const updatedCart = await StaffCartRefillModel.find({staffId}).populate('productId');

            res.json(updatedCart);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Server error',
            });
        }
    });
};



// const getProductCartRefillStaff = async(req, res) => {
//     const staffId = req.params.staffId;
//     const token = req.cookies.token;

//     if(!token){
//         return res.json({ 
//             error: 'Unauthorized - Missing token' 
//         });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, {}, async(err, decodedToken) => {
//         if(err){
//             return res.json({ 
//                 error: 'Unauthorized - Invalid token' 
//             });
//         }

//         if(decodedToken.id !== staffId){
//             return res.json({ 
//                 error: 'Unauthorized - Invalid customer ID'
//             });
//         }

//         try {
//             //fetch cart items for the customer
//             const cartItems = await StaffCartRefillModel.find({staffId}).populate('productId');
//             res.json(cartItems);
//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({ 
//                 message: 'Server error' 
//             });
//         }
//     });
// };
const getProductCartRefillStaff = async(req, res) => {
    const staffId = req.params.staffId;
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

        if(decodedToken.id !== staffId){
            return res.json({ 
                error: 'Unauthorized - Invalid customer ID' 
            });
        }

        try {
            //fetch cart items with populated product details, including sizeUnit and productSize
            const cartItems = await StaffCartRefillModel.find({staffId})
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

const removeProductFromCartRefillStaff= async(req, res) => {
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
            await StaffCartRefillModel.findByIdAndDelete(cartItemId);
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




const updateProductQuantityRefillStaff = async(req, res) => {
    const {cartItemId, quantity} = req.body;

    try {
        //find the cart item and update the quantity
        const updatedItem = await StaffCartRefillModel.findByIdAndUpdate(
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


// const updateProductSizeUnitAndProductSizeStaff 

module.exports = {
    addProductToCartRefillStaff,
    getProductCartRefillStaff,
    removeProductFromCartRefillStaff,
    updateProductQuantityRefillStaff
}