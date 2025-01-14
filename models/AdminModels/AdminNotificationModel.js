const mongoose = require('mongoose');

const AdminNotificationSchema = new mongoose.Schema({
    message: {
        type: String, 
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true
    },
    expirationDate: {
        type: Date, 
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
const AdminNotificationModel = mongoose.model('AdmiNotification', AdminNotificationSchema);

module.exports = AdminNotificationModel;
