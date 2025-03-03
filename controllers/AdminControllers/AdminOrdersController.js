const AdminAuthModel = require("../../models/AdminModels/AdminAuthModel");
const NotificationModel = require("../../models/NotificationModel");
const OrderModel = require("../../models/OrderModel");
const jwt = require('jsonwebtoken');


const getAllOrdersAdmin = async(req, res) => {
    try {
        const orders = await OrderModel.find().populate('customerId').populate('items.productId');
        res.json(orders);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
}


const getOrderDetailsAdmin = async(req, res) => {
    try {
        const {orderId} = req.params;
        const order = await OrderModel.findById(orderId)
        .populate('customerId')
        .populate('items.productId');

        if(!order){
            return res.status(404).json({ 
                message: 'Order not found' 
            });
        }

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Server error' 
        });
    }
}

const approveOrderAdmin = async(req, res) => {
    try {
        const {orderId} = req.params;
        const order = await OrderModel.findByIdAndUpdate(orderId, { 
            isConfirmed: true,
            orderStatus: 'Confirmed' 
        }, {new: true});

        if(!order){
            return res.status(404).json({ 
                message: 'Order not found' 
            });
        }

        await NotificationModel.create({
            customerId: order.customerId,
            orderId: order._id,
            message: `Your order ${order.orderNumber} has been confirmed.`,
        });

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Server error' 
        });
    }
};

const updateOrderStatusAdmin = async(req, res) => {
    try {
        const {orderId} = req.params;
        const {status, cashReceived} = req.body;
        const token = req.cookies.token;

        if(!token){
            return res.status(400).json({
            message: 'Unauthorized - Missing token',
            });
        }
          
        jwt.verify(token, process.env.JWT_SECRET, {}, async(err, decodedToken) => {
            if(err){
                return res.status(400).json({
                    message: 'Unauthorized - Invalid token',
                });
            }

            const adminId = decodedToken.id;
            const adminExists = await AdminAuthModel.findById(adminId);
            if(!adminExists){
                return res.json({ 
                    error: 'Admin does not exist' 
                });
            }


            //validate status
            if(!['isReady', 'isPickedUp', 'isShipped', 'isOutForDelivery', 'isDelivered'].includes(status)){
                return res.status(400).json({
                message: 'Invalid status',
                });
            }
        
            const updateFields = {
                isReady: status === 'isReady',
                isPickedUp: status === 'isPickedUp',
                isShipped: status === 'isShipped',
                isOutForDelivery: status === 'isOutForDelivery',
                isDelivered: status === 'isDelivered'
            };
        
            //fetch the order from the database before proceeding
            const order = await OrderModel.findById(orderId);
            if(!order){
                return res.status(404).json({
                message: 'Order not found',
                });
            }
        
            //calculate changeTotal if status is `isPickedUp`
            let changeTotal = 0;
            if(status === 'isPickedUp'){
                if(cashReceived === undefined || cashReceived < order.totalAmount){
                    return res.status(400).json({
                        message: 'Given total must be provided and should be at least the total amount.',
                    });
                }
                changeTotal = cashReceived - order.totalAmount;
        
                updateFields.whoApproved = adminExists.fullName;
                updateFields.cashReceived = cashReceived;
                updateFields.changeTotal = changeTotal;
                updateFields.pickedUpDate = Date.now();
                updateFields.orderStatus = 'Picked Up';
                updateFields.overallPaid = order.totalAmount;
                updateFields.paymentStatus = 'Paid';
                updateFields.isFullPaidAmount = true;
                updateFields.isPending = true;
        
                await NotificationModel.create({
                    customerId: order.customerId,
                    orderId: order._id,
                    message: `Your order ${order.orderNumber} has been picked up.`,
                });
            }
        
            //handle other statuses
            if(status === 'isReady'){
                updateFields.readyDate = Date.now();
                updateFields.orderStatus = 'Ready';
                await NotificationModel.create({
                customerId: order.customerId,
                orderId: order._id,
                message: `Your order ${order.orderNumber} is ready to pick up.`,
                });
            }else if(status === 'isShipped'){
                updateFields.shippedDate = Date.now();
                updateFields.orderStatus = 'Shipped';
                await NotificationModel.create({
                customerId: order.customerId,
                orderId: order._id,
                message: `Your order ${order.orderNumber} has been shipped.`,
                });
            } else if(status === 'isOutForDelivery'){
                updateFields.outForDeliveryDate = Date.now();
                updateFields.orderStatus = 'Out For Delivery';
                await NotificationModel.create({
                customerId: order.customerId,
                orderId: order._id,
                message: `Your order ${order.orderNumber} is out for delivery.`,
                });
            } else if(status === 'isDelivered'){
                updateFields.deliveredDate = Date.now();
                updateFields.orderStatus = 'Delivered';
                updateFields.overallPaid = order.totalAmount;
                updateFields.paymentStatus = 'Paid';
                updateFields.isFullPaidAmount = true;
                updateFields.isPending = true;
        
                await NotificationModel.create({
                customerId: order.customerId,
                orderId: order._id,
                message: `Your order ${order.orderNumber} has been delivered.`,
                });
            }

        //update the order with the new status
        const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, updateFields, {new: true});
    
        res.json(updatedOrder);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error',
        });
    }
};

const getCompleteOrderTransactionAdmin = async(req, res) => {
    try {
        const orders = await OrderModel.find({
            // isFullPaidAmount: true,
            isConfirmed: true,
            isDelivered: true
        }).sort({createdAt: -1})

        if(orders.length === 0){
            return res.status(404).json({ 
                message: 'No complete transactions found' 
            });
        }


        res.status(200).json(orders);
    } catch (error) {
        console.log(first);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
}


const declineOrderAdmin = async(req, res) => {
    try {
        const {orderId} = req.params;

        //find the order to get the totalAmount for resetting outstandingAmount
        const order = await OrderModel.findById(orderId);

        if(!order){
            return res.status(404).json({ 
                message: 'Order not found' 
            });
        }

        //update the fields for declining the order
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            orderId,
            {
                gcashPaid: 0,
                partialPayment: 0,
                referenceNumber: null,
                paymentProof: '',
                outstandingAmount: order.totalAmount,
                overallPaid: 0,
            },
            {new: true}
        );

        await NotificationModel.create({
            customerId: order.customerId,
            orderId: order._id,
            message: `Your order ${order.orderNumber} has been declined.`,
        });

        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Server error' 
        });
    }
};


const updateOrderReceiptAdmin = async(req, res) => {
    try {
        const {orderId} = req.params;
        const {receipt} = req.body;

        if(!receipt){
            return res.status(400).json({ 
                message: 'No receipt provided' 
            });
        }

        if(!orderId || orderId.length !== 24) {
            return res.status(400).json({ 
                message: 'Invalid orderId format' 
            });
        }

        const order = await OrderModel.findById(orderId);
        if(!order){
            return res.status(404).json({ 
                message: 'Order not found' 
            });
        }


        const updatedOrder = await OrderModel.findByIdAndUpdate(
            orderId,
            {receipt, orderStatus: order.orderStatus},
            {new: true}
        );

        // order.receipt = receipt;
        // await order.save();

        return res.json({ 
            message: 'Order receipt added/updated successfully',
            updatedOrder
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};




module.exports = {
    getAllOrdersAdmin,
    getOrderDetailsAdmin,
    approveOrderAdmin,
    updateOrderStatusAdmin,
    getCompleteOrderTransactionAdmin,
    declineOrderAdmin,
    updateOrderReceiptAdmin
}
