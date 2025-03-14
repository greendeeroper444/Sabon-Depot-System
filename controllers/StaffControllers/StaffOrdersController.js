const OrderModel = require("../../models/OrderModel");
const NotificationModel = require("../../models/NotificationModel");
const jwt = require('jsonwebtoken');
const StaffAuthModel = require("../../models/StaffModels/StaffAuthModel");


const getAllOrdersStaff = async(req, res) => {
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

const getOrderDetailsStaff = async(req, res) => {
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

const approveOrderStaff = async(req, res) => {
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

// const updateOrderStatusStaff = async(req, res) => {
//     try {
//         const {orderId} = req.params;
//         const {status} = req.body; //status will be one of 'isShipped', 'isOutForDelivery', 'isDelivered'

//         //validate status
//         if(!['isReady', 'isPickedUp', 'isShipped', 'isOutForDelivery', 'isDelivered'].includes(status)){
//             return res.status(400).json({
//                 message: 'Invalid status'
//             });
//         }

//         const updateFields = {
//             isReady: status === 'isReady' ? true : false,
//             isPickedUp: status === 'isPickedUp' ? true : false,
//             isShipped: status === 'isShipped' ? true : false,
//             isOutForDelivery: status === 'isOutForDelivery' ? true : false,
//             isDelivered: status === 'isDelivered' ? true : false,
//         };

//         //fetch the order from the database before proceeding
//         const order = await OrderModel.findById(orderId);
//         if(!order){
//             return res.status(404).json({
//                 message: 'Order not found'
//             });
//         }

//         //set the date fields based on the status
//         if(status === 'isReady'){
//             updateFields.readyDate = Date.now();
//             updateFields.orderStatus = 'Ready';
//             await NotificationModel.create({
//                 customerId: order.customerId,
//                 orderId: order._id,
//                 message: `Your order ${order.orderNumber} has been ready.`,
//             });
//         }if(status === 'isPickedUp'){
//             updateFields.cashReceived = cashReceived;
//             updateFields.changeTotal = changeTotal;
//             updateFields.pickedUpDate = Date.now();
//             updateFields.orderStatus = 'Picked Up';

//             updateFields.overallPaid = order.totalAmount;
//             updateFields.paymentStatus = 'Paid';
//             updateFields.isFullPaidAmount = true;

//             await NotificationModel.create({
//                 customerId: order.customerId,
//                 orderId: order._id,
//                 message: `Your order ${order.orderNumber} has been picked up.`,
//             });
//         }if(status === 'isShipped'){
//             updateFields.shippedDate = Date.now();
//             updateFields.orderStatus = 'Shipped';
//             await NotificationModel.create({
//                 customerId: order.customerId,
//                 orderId: order._id,
//                 message: `Your order ${order.orderNumber} has been shipped.`,
//             });
//         } else if(status === 'isOutForDelivery'){
//             updateFields.outForDeliveryDate = Date.now();
//             updateFields.orderStatus = 'Out For Delivery';
//             await NotificationModel.create({
//                 customerId: order.customerId,
//                 orderId: order._id,
//                 message: `Your order ${order.orderNumber} is out for delivery.`,
//             });
//         } 
//         // else if(status === 'isDelivered'){
//         //     updateFields.deliveredDate = Date.now();
//         //     updateFields.orderStatus = 'Delivered';
//         //     await NotificationModel.create({
//         //         customerId: order.customerId,
//         //         orderId: order._id,
//         //         message: `Your order ${order.orderNumber} has been delivered.`,
//         //     });
//         // }
//         else if(status === 'isDelivered'){
//             updateFields.deliveredDate = Date.now();
//             updateFields.orderStatus = 'Delivered';

//             //mark the order as fully paid
//             updateFields.overallPaid = order.totalAmount;
//             updateFields.paymentStatus = 'Paid';
//             updateFields.isFullPaidAmount = true;

//             await NotificationModel.create({
//                 customerId: order.customerId,
//                 orderId: order._id,
//                 message: `Your order ${order.orderNumber} has been delivered.`,
//             });
//         }

//         //update the order with the new status
//         const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, updateFields, {new: true});

//         res.json(updatedOrder);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: 'Server error'
//         });
//     }
// };

const updateOrderStatusStaff = async(req, res) => {
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

            const staffId = decodedToken.id;
            const staffExists = await StaffAuthModel.findById(staffId);
            if(!staffExists){
                return res.json({ 
                    error: 'Staff does not exist' 
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
        
                updateFields.whoApproved = staffExists.fullName;
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

const getCompleteOrderTransactionStaff = async(req, res) => {
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


const declineOrderStaff = async(req, res) => {
    try {
        const {orderId} = req.params;

        // const order = await OrderModel.findByIdAndUpdate(orderId, {
        //     gcashPaid: 0,
        //     partialPayment: 0,
        //     referenceNumber: null,
        //     paymentProof: '',
        // }, {new: true});

        // if(!order){
        //     return res.status(404).json({ 
        //         message: 'Order not found' 
        //     });
        // }

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

const updateOrderReceiptStaff = async(req, res) => {
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

        // if(order.orderStatus === 'Picked Up'){
        //     order.orderStatus = 'Picked Up';
        // }

        order.receipt = receipt;
        await order.save();

        return res.json({ 
            message: 'Order receipt added/updated successfully' 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};

module.exports = {
    getAllOrdersStaff,
    getOrderDetailsStaff,
    approveOrderStaff,
    updateOrderStatusStaff,
    getCompleteOrderTransactionStaff,
    declineOrderStaff,
    updateOrderReceiptStaff
}
