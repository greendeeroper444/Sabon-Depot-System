const mongoose = require('mongoose');

const AdminNotificationOrderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order', 
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true
    },
    message: {
        type: String, 
        required: true
    },
    productName: {
        type: String, 
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date, 
        default: Date.now
    } 
});
const AdminNotificationOrderModel = mongoose.model('AdmiNotificationOrder', AdminNotificationOrderSchema);

module.exports = AdminNotificationOrderModel;
