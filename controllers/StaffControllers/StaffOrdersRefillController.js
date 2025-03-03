const StaffAuthModel = require("../../models/StaffModels/StaffAuthModel");
const jwt = require('jsonwebtoken');
const StaffCartRefillModel = require("../../models/StaffModels/StaffCartRefillModel");
const ProductModel = require("../../models/ProductModel");
const { BestSellingModel, TotalSaleModel } = require("../../models/SalesOverviewModel");
const ProductionReportModel = require("../../models/ProductionReportModel");
const { getInventoryReport, getSalesReport } = require("../AdminControllers/AdminReportController");
const StaffOrderRefillModel = require("../../models/StaffModels/StaffOrderRefillModel");
const RefillProductModel = require("../../models/RefillProductModel");

//create order via staff
const addOrderRefillStaff = async(req, res) => {
    try {
        const {cashReceived, changeTotal} = req.body;
        const token = req.cookies.token;

        if(!token){
            return res.status(400).json({ 
                message: 'Unauthorized - Missing token' 
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, {}, async(err, decodedToken) => {
            if(err){
                return res.status(400).json({ 
                    message: 'Unauthorized - Invalid token' 
                });
            }

            const staffId = decodedToken.id;
            const staffExists = await StaffAuthModel.findById(staffId);
            if(!staffExists){
                return res.json({ 
                    error: 'Staff does not exist' 
                });
            }

            //get all cart items for this staff
            const cartItems = await StaffCartRefillModel.find({staffId}).populate('productId');

            if(cartItems.length === 0){
                return res.status(400).json({ 
                    message: 'No items in the cart' 
                });
            }

            //calculate total amount
            const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.volume, 0);

            //create the order
            const order = new StaffOrderRefillModel({
                staffId,
                items: cartItems.map((item) => ({
                    productId: item.productId._id,
                    productName: item.productName,
                    category: item.productId.category || '',
                    price: item.price,
                    finalPrice: item.price * item.volume,
                    volume: item.volume,
                    uploaderId: item.productId.uploaderId,
                    uploaderType: item.productId.uploaderType,
                    sizeUnit: item.sizeUnit,
                    productSize: item.productSize,
                    createdProductBy: item.productId.createdBy || '',
                    createdProductAt: item.productId.createdAt || new Date(),
                    updatedProductBy: item.productId.updatedBy || '',
                    updatedProductAt: item.productId.updatedAt || new Date(),
                })),
                totalAmount,
                cashReceived,
                changeTotal,
                whoProcessed: staffExists.fullName,
            });

            await order.save();

            //update stock for each ordered product
            await Promise.all(
                cartItems.map(async(item) => {
                    const product = await RefillProductModel.findById(item.productId._id);
                    if(product){
                        product.volume -= item.volume; //deduct the ordered quantity
                        await product.save();
                    }
                })
            );

            //clear the cart
            await StaffCartRefillModel.deleteMany({staffId});

            res.status(201).json({
                message: 'Order created successfully',
                success: true,
                orderId: order._id,
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};



const getOrderRefillStaff = async(req, res) => {
    try {
        const {orderId} = req.params;

        //If orderId is provided, fetch the specific order
        if(orderId){
            const order = await StaffOrderRefillModel.findById(orderId);
            if(!order){
                return res.status(404).json({
                    message: 'Order not found',
                });
            }

            return res.status(200).json({
                message: 'Order fetched successfully',
                order,
            });
        }

        //otherwise, fetch all orders
        const orders = await StaffOrderRefillModel.find().sort({createdAt: -1});

        res.status(200).json({
            message: 'Orders fetched successfully',
            orders,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error',
        });
    }
};

const getAllOrderRefillStaff = async(req, res) => {
    try {
        const staffProducts = await StaffOrderRefillModel.find();
        return res.json(staffProducts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
}

const updateOrderRefillStaff = async(req, res) => {
    try {
        const {orderId} = req.params;
        const {productCode, productName, category, quantity} = req.body;

        if(!productCode || !productName || !category || !quantity){
            return res.json({
                error: 'Please provide all required fields'
            });
        }

        const order = await StaffOrderRefillModel.findById(orderId);
        if(!order){
            return res.json({
                error: 'Product not found'
            });
        }

        //eemove ownership check
        order.productCode = productCode;
        order.productName = productName;
        order.category = category;
        order.quantity = quantity;

        const updatedOrderWaklin = await order.save();

        return res.json({
            message: 'Order updated successfully!',
            updatedOrderWaklin
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
}


const getUpdateOrderRefillStaff = async(req, res) => {
    const {orderId} = req.params;
    try {
        const order = await StaffOrderRefillModel.findById(orderId);
        if(!order){
            return res.status(404).json({ 
                message: 'Order not found'
            });
        }
        res.json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
}


module.exports = {
    addOrderRefillStaff,
    getOrderRefillStaff,
    getAllOrderRefillStaff,
    updateOrderRefillStaff,
    getUpdateOrderRefillStaff
}